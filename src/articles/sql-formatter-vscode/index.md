---
title: "【VSCode】SQLフォーマットプラグイン3種比較"
date: "2020-11-23"
tags: ["Visual Studio Code", "SQL"]
---

こんにちはー。

開発をしていて、ログから拾ったSQLを見たいときに、改行などのフォーマットを整えないと見づらいですよね。
<br/>
Visual Studio Codeのプラグインには、SQLのフォーマットを整えてくれるものがありますが、フォーマットした結果が結構違うので、比べてみました。

## まとめ
### SQL Formatter
<a href="https://marketplace.visualstudio.com/items?itemName=adpyke.vscode-sql-formatter" target="_blank" rel="noopener noreferrer">Marketplace</a>

一番おすすめ。

### SQLTools
<a href="https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools" target="_blank" rel="noopener noreferrer">Marketplace</a>

まあ、悪くはないけど、微妙。

### SQL Beautify
<a href="https://marketplace.visualstudio.com/items?itemName=clarkyu.vscode-sql-beautify" target="_blank" rel="noopener noreferrer">Marketplace</a>

癖が強すぎる。

## フォーマットの結果を確認
動作確認用に、ちょっと込み入ったSQLを書いてみました。

```sql
select * from (select team_name, team_score_total, member_name, member_score_total, rank() over (partition by team_id order by member_score_total desc) member_rank from (select teams.id team_id, teams.name team_name, team_scores.score_total team_score_total, members.id member_id, members.name member_name, member_scores.score_total member_score_total from teams inner join members on teams.id = members.team_id inner join (select teams.id team_id, sum(scores.score) score_total from teams inner join members on teams.id = members.team_id inner join scores on members.id = scores.member_id and scores.created_at >= '2020-10-01' and scores.created_at < '2020-11-01' group by teams.id) team_scores on teams.id = team_scores.team_id inner join (select members.id member_id, sum(scores.score) score_total from members inner join scores on members.id = scores.member_id and scores.created_at >= '2020-10-01' and scores.created_at < '2020-11-01' group by members.id) member_scores on members.id = member_scores.member_id where teams.area_id = 5) with_rank) where member_rank <= 3 order by team_score_total desc;
```

チームごとのメンバーのスコア合計上位者を3人ずつ、チームのスコア合計が高い順に取得、、みたいな妄想で作ったSQLです。

プラグインをインストールして、エディタの言語モードをSQLにした状態で、
<br/>
`Option + Shift + F`でフォーマットできます。

それぞれのプラグインを使ってフォーマットした結果を見ていきましょう。

### SQL Formatter
<a href="https://marketplace.visualstudio.com/items?itemName=adpyke.vscode-sql-formatter" target="_blank" rel="noopener noreferrer">Marketplace</a>

フォーマットした結果がこちら。
```sql
select
  *
from
  (
    select
      team_name,
      team_score_total,
      member_name,
      member_score_total,
      rank() over (
        partition by team_id
        order by
          member_score_total desc
      ) member_rank
    from
      (
        select
          teams.id team_id,
          teams.name team_name,
          team_scores.score_total team_score_total,
          members.id member_id,
          members.name member_name,
          member_scores.score_total member_score_total
        from
          teams
          inner join members on teams.id = members.team_id
          inner join (
            select
              teams.id team_id,
              sum(scores.score) score_total
            from
              teams
              inner join members on teams.id = members.team_id
              inner join scores on members.id = scores.member_id
              and scores.created_at >= '2020-10-01'
              and scores.created_at < '2020-11-01'
            group by
              teams.id
          ) team_scores on teams.id = team_scores.team_id
          inner join (
            select
              members.id member_id,
              sum(scores.score) score_total
            from
              members
              inner join scores on members.id = scores.member_id
              and scores.created_at >= '2020-10-01'
              and scores.created_at < '2020-11-01'
            group by
              members.id
          ) member_scores on members.id = member_scores.member_id
        where
          teams.area_id = 5
      ) with_rank
  )
where
  member_rank <= 3
order by
  team_score_total desc;
```

かなりいいですね。

個人的には

```sql
            from
              teams
              inner join members on teams.id = members.team_id
              inner join scores on members.id = scores.member_id
              and scores.created_at >= '2020-10-01'
              and scores.created_at < '2020-11-01'
```
これは

```sql
            from
              teams
              inner join
              members
                on
                  teams.id = members.team_id
              inner join
              scores
                on
                  members.id = scores.member_id
                  and scores.created_at >= '2020-10-01'
                  and scores.created_at < '2020-11-01'
```
こう書きたかったりしますが、まあおおむねいい感じです。

### SQLTools
<a href="https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools" target="_blank" rel="noopener noreferrer">Marketplace</a>

フォーマットした結果がこちら。
```sql
select *
from (
		select team_name,
			team_score_total,
			member_name,
			member_score_total,
			rank() over (
				partition by team_id
				order by member_score_total desc
			) member_rank
		from (
				select teams.id team_id,
					teams.name team_name,
					team_scores.score_total team_score_total,
					members.id member_id,
					members.name member_name,
					member_scores.score_total member_score_total
				from teams
					inner join members on teams.id = members.team_id
					inner join (
						select teams.id team_id,
							sum(scores.score) score_total
						from teams
							inner join members on teams.id = members.team_id
							inner join scores on members.id = scores.member_id
							and scores.created_at >= '2020-10-01'
							and scores.created_at < '2020-11-01'
						group by teams.id
					) team_scores on teams.id = team_scores.team_id
					inner join (
						select members.id member_id,
							sum(scores.score) score_total
						from members
							inner join scores on members.id = scores.member_id
							and scores.created_at >= '2020-10-01'
							and scores.created_at < '2020-11-01'
						group by members.id
					) member_scores on members.id = member_scores.member_id
				where teams.area_id = 5
			) with_rank
	)
where member_rank <= 3
order by team_score_total desc;
```

人により好みが分かれるところではありますが、個人的に気になるのは

- select、from等の後で改行してほしい
- スペースでインデントしてほしい
- なんでfromの後のインデント2段なの？

とかですかねー。

### SQL Beautify
<a href="https://marketplace.visualstudio.com/items?itemName=clarkyu.vscode-sql-beautify" target="_blank" rel="noopener noreferrer">Marketplace</a>

フォーマットした結果がこちら。
```sql
SELECT  *
FROM
(
	SELECT  team_name
	       ,team_score_total
	       ,member_name
	       ,member_score_total
	       ,rank() over (partition by team_id ORDER BY member_score_total desc) member_rank
	FROM
	(
		SELECT  teams.id team_id
		       ,teams.name team_name
		       ,team_scores.score_total team_score_total
		       ,members.id member_id
		       ,members.name member_name
		       ,member_scores.score_total member_score_total
		FROM teams
		INNER JOIN members
		ON teams.id = members.team_id
		INNER JOIN
		(
			SELECT  teams.id team_id
			       ,SUM(scores.score) score_total
			FROM teams
			INNER JOIN members
			ON teams.id = members.team_id
			INNER JOIN scores
			ON members.id = scores.member_id AND scores.created_at >= '2020-10-01' AND scores.created_at < '2020-11-01'
			GROUP BY  teams.id
		) team_scores
		ON teams.id = team_scores.team_id
		INNER JOIN
		(
			SELECT  members.id member_id
			       ,SUM(scores.score) score_total
			FROM members
			INNER JOIN scores
			ON members.id = scores.member_id AND scores.created_at >= '2020-10-01' AND scores.created_at < '2020-11-01'
			GROUP BY  members.id
		) member_scores
		ON members.id = member_scores.member_id
		WHERE teams.area_id = 5
	) with_rank
)
WHERE member_rank <= 3
ORDER BY team_score_total desc;
```

うーん。独特ですね。

個人的には結構嫌です。嫌なポイントとしては

- 大文字にしないでほしい
- selectの後の2つスペースなの何で？
- selectの列挙をスペースで縦揃えしないでほしい
- タブとスペース混ぜないでほしい
- select、from等の後で改行してほしい
- 行末カンマにしてほしい
- from, inner join, onが同じ深さになるのが納得行かない
- onの条件は改行して書いてほしい

この辺ですね。。。

以上です。
