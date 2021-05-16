---
title: "Rails(ActiveRecord)で自在にSQLを書く手段いろいろ"
date: "2021-05-16"
tags: ["Ruby", "SQL"]
---

こんにちはー。

Railsである程度の規模の開発をしていると、ちょっと込み入った形のSQLでデータを取得したい状況が発生してきます。

今回は、そんなときに役立つActiveRecordクエリのテクニックをご紹介します。

ちなみに`execute()`、arelは使いません。

（環境: Ruby 2.5.3, Rails 6.1.3）

## `select`をゴリゴリ書く

ActiveRecordの`select`というメソッドがあります。

基本的な使い方としては、こんな感じで、必要なカラムだけ取得するためのものです。

```ruby
users = User.all.select(:id, :name)
users.first.attributes
# => {"id"=>1, "name"=>"Alice"}
```

なんですが、SELECT句を文字列で好きに書くこともできます。別名を付けておくことで、その名前で値を取得できます。

```ruby
users = User.all.select(:id, :name, '1 one')
# users.first.attributes
# => {"id"=>1, "name"=>"Alice", "one"=>1}
```

何が嬉しいかというと、case式とかサブクエリも書けるんですね。

```ruby
select_sql = '(select count(1) from purchases where purchases.user_id = users.id) purchase_total'
users = User.all.select(:id, :name, select_sql)
# users.first.attributes
# => {"id"=>1, "name"=>"Alice", "purchase_total"=>14}
```

こんな感じで、別テーブルを参照してselectしたいときに、1回のSQL実行で値を取得できて、いい感じですね。

## `to_sql`でサブクエリを書く

先程の`select`の例で、サブクエリのSQLを文字列で書いていましたが、`to_sql`というメソッドがあるので、そいつを使うとよりRailsっぽく書けて読みやすいです。

`to_sql`は、ActiveRecordのクエリを、実行するSQLの文字列として出力するメソッドです。

```ruby
'(select count(1) from purchases where purchases.user_id = users.id) purchase_total'
```

これは、

```ruby
select_sql = Purchase.select('count(1)').where('purchases.user_id = users.id').to_sql
# puts "(#{select_sql}) purchase_total"
# (SELECT count(1) FROM "purchases" WHERE (purchases.user_id = users.id)) purchase_total
```

こう書けます。

なんかこの例だとあんまり利点が感じられなさそうですが、もう少し複雑なSQLだと結構便利です。
<br/>
例えば`exists`を使いたいときとかですね。

`purchases`テーブルに`shop_id = 5`のレコードがある`users`のレコードを取得したいとしましょう。
<br/>
（`shop_id = 5`のお店で購入したことがあるユーザーというイメージ）

こんな感じに書けます。

```ruby
exists_sql =
  Purchase.select(1)
          .where('users.id = purchases.user_id')
          .where(shop_id: 5)
          .to_sql
# puts exists_sql
# SELECT 1 FROM "purchases" WHERE (users.id = purchases.user_id) AND "purchases"."shop_id" = 5
users = User.where("exists (#{exists_sql})")
```

`to_sql`を使わないで書くとすると、こんな感じでSQLを全部書く必要があって、ちょっと見づらいですね。

```ruby
exists_sql =
  'select 1 from purchases where '\
  '(users.id = purchases.user_id and purchases.shop_id = 5)'
```

あと`shop_id`を引数で受け取って入れるとなると、式展開で入れなきゃいけなくて、ちゃんとするならサニタイズしなきゃいけません。

```ruby
shop_id = 5
exists_sql =
  'select 1 from purchases where '\
  '(users.id = purchases.user_id and '\
  "#{ActiveRecord::Base.sanitize_sql_array(['purchases.shop_id = ?', shop_id])})"
```

ちょっとダルいですね。

対して`to_sql`を使う場合は、サニタイズとかはActiveRecordがやってくれるのでスッキリ書けます。

```ruby
shop_id = 5
exists_sql =
  Purchase.select(1)
          .where('users.id = purchases.user_id')
          .where(shop_id: shop_id)
          .to_sql
```

## `joins`をゴリゴリ書く

ActiveRecordの`joins`というメソッドがありまして、
<br/>
よくある使い方としては、モデルでアソシエーションを設定している別のモデルを指定して、結合して取得するものです。

```ruby
# user.rb

class User < ApplicationRecord
  has_many :purchases
end
```

```ruby
users = User.joins(:purchases)
# puts users.to_sql
# SELECT "users".* FROM "users" INNER JOIN "purchases" ON "purchases"."user_id" = "users"."id"
```

なんですが、`joins`の引数としてSQLのJOIN句を書いて入れることもできます。

```ruby
join_sql = 'inner join purchases on users.id = purchases.user_id'
users = User.joins(join_sql)
# puts users.to_sql
# SELECT "users".* FROM "users" inner join purchases on users.id = purchases.user_id
```

これを使うと、サブクエリで取得した結果を結合することもできます。

例えば、`purchases`テーブルで、`user_id`ごとに最新のレコードを取得するクエリを書きまして、

```ruby
latest_purchases =
  Purchase.where(
    'not exists ('\
    'select 1 from purchases sub '\
    'where sub.user_id = purchases.user_id '\
    'and sub.created_at > purchases.created_at'\
    ')'
  )
# puts latest_purchases.to_sql
# SELECT "purchases".* FROM "purchases" WHERE (not exists (select 1 from purchases sub where sub.user_id = purchases.user_id and sub.created_at > purchases.created_at))
```

これを`users`テーブルにJOINして取得するということができます。
<br/>
`users`のレコードごとに最新の`purchases`のレコードが取得できることになります。

```ruby
users =
  User.select(:id, :name, 'latest_purchases.shop_id latest_purchase_shop_id')
      .joins("inner join (#{latest_purchases.to_sql}) latest_purchases "\
             'on users.id = latest_purchases.user_id')
# users.first.attributes
# => {"id"=>2, "name"=>"Bob", "latest_purchase_shop_id"=>4}
```

JOINするサブクエリに別名を付けておいて、`select`で指定すれば値を参照することができます。
<br/>
上記の例だと、`select`内で`'latest_purchases.shop_id latest_purchase_shop_id'`と指定しているので、
<br/>
`user.latest_purchase_shop_id`みたいな感じで値を利用できます。

同じようなことを実現する方法としては、JOINせずに`users`のレコードごとに別にSQL実行する、ということもできますが、
<br/>
やはりSQL実行1回にまとめたほうが大抵パフォーマンスが良いので、使えるところでは使っていきましょう。

## `from`でFROM句を変えちゃう

ActiveRecordに`from`というメソッドがあります。

これは、実行されるSQLのFROM句を上書きできるメソッドで、
<br/>
別名をつけたり、本来のモデルのテーブルとは違うテーブルをFROM句に指定することができます。

引数はFROM句に入れるSQLを文字列で渡すか、第1引数にActiveRecordのクエリと第2引数にサブクエリの別名を渡します。

```ruby
puts User.select('hoge.*').from('users hoge').to_sql
# SELECT hoge.* FROM users hoge
```

```ruby
sub_query = User.where('name like ?', '%foo%')
puts User.select('hoge.*').from(sub_query, :hoge).to_sql
# SELECT hoge.* FROM (SELECT "users".* FROM "users" WHERE (name like '%foo%')) hoge
```

どういうときに使えるかと言うと、サブクエリをFROMに入れてSELECTしたいときとかですね。

例えば`row_number`などのwindow関数の結果をWHEREで使うには、1回サブクエリでSELECTした結果じゃないと使えません。

`purchases`テーブルから、ユーザーごとに最新の3件を取得したいときに、こんなSQLで取得したいとします。

```sql
select
  *
from
  (
    select
      *,
      row_number() over (
        partition by user_id order by created_at desc
      ) rownum
    from
      purchases
  ) with_rownum
where
  with_rownum.rownum <= 3
;
```

ActiveRecordではこう書けます。

```ruby
with_rownum =
  Purchase.select('*',
                  'row_number() '\
                  'over (partition by user_id order by created_at desc) rownum')
purchases =
  Purchase.select('*')
          .from(with_rownum, :with_rownum)
          .where('with_rownum.rownum <= ?', 3)
# puts purchases.to_sql
# SELECT * FROM (SELECT *, row_number() over (partition by user_id order by created_at desc) rownum FROM "purchases") with_rownum WHERE (with_rownum.rownum <= 3)
```

`with_rownum`という変数に`row_number()`をSELECTしたクエリを入れて、`from`の第1引数に入れます。
<br/>
第2引数にサブクエリの別名(ここでは`with_rownum`としました)を入れます。

`select('*')`としているのは、これをつけないと `SELECT "purchases".*`（モデルでSELECTされるデフォルト）のSQLが実行されて、
<br/>
「FROM句にそんなテーブル無いよ」とSQL実行時にエラーになってしまうためです。
<br/>
デフォルトで入るSQLにはちょっと注意が必要です。

取得した結果は、実行されるSQL的におかしくなければ、通常のモデルと同じように使用できます。

```ruby
purchases.each do |purchase|
  puts purchase.attributes.slice('user_id', 'shop_id', 'product_id')
end
# {"user_id"=>2, "shop_id"=>4, "product_id"=>28}
# {"user_id"=>2, "shop_id"=>5, "product_id"=>179}
# {"user_id"=>2, "shop_id"=>4, "product_id"=>76}
# {"user_id"=>3, "shop_id"=>2, "product_id"=>767}
# {"user_id"=>3, "shop_id"=>6, "product_id"=>660}
```

これを使えばサブクエリを使ったSQLだろうと、ActiveRecordで柔軟に対応できます。

---

以上です。

皆様のRails実装の手助けになれば幸いです。
