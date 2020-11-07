---
title: "【Oracle】セッションを強制的に切断する方法"
date: "2018-10-12"
tags: ["DB"]
---

こんにちは。

お仕事でOracleを使っていますが、たまに「今繋がってるセッション、全部切りたい・・・」ってこと、ありますよね。

今回はOracleでセッションを削除する方法を紹介します。

※systemユーザを利用できる前提で書きます

## セッションを削除するには「alter system kill session」を使う

セッションを削除できる、「alter system kill session」というコマンドがあります。

### 使い方

```sql
alter system kill session 'sid, serial#';
```

sidとserial#というのは、Oracleが内部で持っている、セッションを識別するため番号です。

では、どうやってsidとserial#調べるのかというと、「v$session」というビューを見ます。

## v$sessionについて

v$sessionというのは、Oracleのセッションに関する情報がいろいろ入って来るビューです。

このビューで、どのセッションがどのユーザに接続している、といった情報が確認できます。

どんな情報が入っているのかについて、詳しくはリファレンス等をご確認ください。

<a href="https://docs.oracle.com/cd/E16338_01/server.112/b56311/dynviews_3016.htm" target="_blank" rel="noopener noreferrer">V$SESSION – Oracle® Databaseリファレンス</a>
<br/>
<a href="https://www.shift-the-oracle.com/view/dynamic-performance-view/session.html" target="_blank" rel="noopener noreferrer">V$SESSION ビュー – SHIFT the Oracle</a>

こんな感じでselectしてみましょう。

```sql
select sid, serial# from v$session where username = 'USERNAME';
```

`'USERNAME'`のところは、セッションを削除したいOracleのユーザ名を入れてください。

これで、USERNAMEに接続しているセッションのsidとserial#が取れました。

これらをalter system kill session の引数に入れてやればセッションが削除されます。

```sql
alter system kill session '123, 234';
```

内部で処理が走るので、消えるまで少し時間がかかる場合があります。

## たくさんセッションがあって手動でやるのキツイんだけど・・・

そんな場合は、一度SQLをファイルに書き出してから実行すると良いんじゃないでしょうか。

sqlplusを使用して、systemユーザで接続した後、以下のように実行してください。

```sql
set trimspool on
set pagesize 0
feedback off

spool kill_session_for_USERNAME.sql
select fix.pre||se.sid||fix.sep||se.serial#||fix.suf
from
(select 'alter system kill session ''' pre, ',' sep, ''';' suf from dual) fix
cross join
(select sid, serial# from v$session where username = 'USERNAME') se;
spool off
```

`'USERNAME'`のところは、セッションを削除したいOracleのユーザ名を入れてください。

何をやっているかというと、SQLを部分ごとにselectして、`||`（文字列結合）でSQLを作成しています。

`v$session`から取ってきた`sid`と`serial#`（ここでは`se`と別名を振ってます）に対して、
<br/>
「`alter system …`」といった固定値の部分（ここでは`fix`と別名を振ってます）をcross joinで全行に結合します。

その上で順番にselectして結合すればSQLが作れます。

spoolを使い、SQLをファイルに書き出します。

#### sqlplusオプションの説明

##### set trimspool on

右側のスペースを削除して出力する

##### set pagesize 0

ページ（ヘッダーと区切りを入れる）をオフにする

##### feedback off

「○行が選択されました」という出力をオフにする

##### spool ファイル名

ファイルに出力内容を書き出すようにする

##### spool off

ファイルに書き出すのを終了する

```sql
@kill_session_for_USERNAME.sql
```

書き出したSQLを実行します。

これでUSERNAMEに接続している全てのセッションを一気に削除することができます。

以上です。お疲れ様でした。
