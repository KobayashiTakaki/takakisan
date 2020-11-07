---
title: "【Laravel】MySQL 8でmigration時にエラーが出たときの対処方法"
date: "2018-08-30"
tags: ["DB", "PHP"]
---

Laravelを始めてみよう！と環境構築をし、いざmigrationを実行したところ、このようなエラーが発生してしまいました。

```
Illuminate\Database\QueryException  : SQLSTATE[HY000] [2054] The server requested authentication method unknown to the client
```

このエラーについて、意味と解消方法を調べました！

この事象は、MySQL 8以上のバージョンを使用した場合に発生するものです。

```
使用した環境
macOS HighSierra
MySQL 8.0.12
PHP 7.1.16
Laravel 5.6.29
```

## このエラーは何を言っているの？

LaravelがMySQLに接続しようとしたら、MySQL上のユーザ認証に指定された方式がLaravel側では知らない（対応してない）という状況です。
「the server」 = MySQL、「the client」 = Laravelですね。

MySQL 8では、ユーザー作成時に設定される認証方式がデフォルトで`caching_sha2_password`というものになっています。
<br/>
この認証方式はMySQL 8から追加された、比較的新しいもので、Laravel5.6のDB接続機能ではこの方式に対応していません。
<br/>
インストールしたし、とりあえずrootで接続しよう、とかすると、このエラーが発生します。

## 解消方法

### 作成済みユーザーの認証方式を変更&パスワード設定する

MySQLのユーザーには、それぞれ認証方式が設定されています。
DBに接続して以下のsqlを実行すると確認できます。

```
select user, plugin from mysql.user;
```

`plugin`列に、ユーザーの認証方式が記載されています。

以下のsqlを実行すると認証方式を`mysql_native_password`（従来のパスワードによる認証）に変更できます。
<br/>
この方式であればLaravelから接続できます。

```
alter user 'username' identified with mysql_native_password by 'password';
```

`'username'`の部分は変更したいユーザ名、`'password'`の部分は設定したいパスワードを入力します。

### ユーザー作成時のデフォルト認証方式を変更する

こちらはやらなくてもOKな作業ですが、DBのユーザーを新しく作成する際のため、やっておくと良いと思います。
<br/>
my.cnfに以下の内容を記載します。

```
[mysqld]
default_authentication_plugin=mysql_native_password
```

my.cnfの場所を調べる方法は以下の記事が参考になりました。
<br/>
<a href="https://qiita.com/is0me/items/12629e3602ebb27c26a4" target="_blank" rel="noopener noreferrer">my.cnfの場所を調べる – Qiita</a>

設定後、MySQLを再起動すると、それ以降作成されるユーザーは認証方式に`mysql_native_password`が設定されるようになります。

以上です！
