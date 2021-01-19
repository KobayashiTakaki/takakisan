---
title: "このブログで使っているGatsbyプラグインの紹介"
date: "2021-01-20"
tags: ["Gatsby"]
---

最近このブログをGatsbyで構築しました。
<br/>
ブログ作るにあたっていい感じだったGatsbyプラグインを紹介します。

## gatsby-remark-vscode
<a href="https://www.gatsbyjs.com/plugins/gatsby-remark-vscode/" target="_blank" rel="noopener noreferrer">https://www.gatsbyjs.com/plugins/gatsby-remark-vscode/</a>

本文中のコードハイライトをいい感じにやってくれるプラグインです。

<a href="https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/" target="_blank" rel="noopener noreferrer">gatsby-transformer-remark</a>
と一緒に設定すると、コードブロック(バッククオート3つで囲んだ部分)がコードハイライトされるようになります。

こんな感じです。
```js
const foo = 'foo';
const bar = {
  b: 'b',
  a: 'a',
  r: 'r'
};
const baz = () => {
  return 'hi';
}
```

色のテーマはVisual Studio Codeで使えるものと対応していて、`gatsby-config.js`のオプションで指定します。
<br/>
指定するテーマ名はVisual Studio Codeのテーマ設定の中から選べば良いです。

フォントや文字間隔はお好みでCSSで調整しましょう。

## gatsby-remark-images
<a href="https://www.gatsbyjs.com/plugins/gatsby-remark-images/" target="_blank" rel="noopener noreferrer">https://www.gatsbyjs.com/plugins/gatsby-remark-images/</a>

Markdownで記述した記事内に簡単に画像を挿入できるプラグインです。

<a href="https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/" target="_blank" rel="noopener noreferrer">gatsby-transformer-remark</a>
と一緒に使用します。

使い方としては、Markdownファイルと同じ階層に画像ファイルを配置した状態で、

```markdown
![altを記載](image.jpg)
```

というように書くと、いい感じにimgタグが生成されます。

## gatsby-remark-related-posts
<a href="https://www.gatsbyjs.com/plugins/gatsby-remark-related-posts/" target="_blank" rel="noopener noreferrer">https://www.gatsbyjs.com/plugins/gatsby-remark-related-posts/</a>

Markdownで記述した記事同士の関連度から、関連する記事を選んでくれるプラグインです。

`MarkdownRemark`の`fields`に`relatedFileAbsolutePaths`というプロパティができて、その中に関連記事のMarkdownファイルの絶対パスが配列として入ります。
<br/>
個別記事ページ生成時のcontextとしてその値を渡してやれば、記事内で関連記事を取得することができます。

だいたいこんな感じです。

```js
// gatsby-node.js

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const articleTemplate = path.resolve("src/templates/article.js");

  // 個別記事ページの作成
  articles.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: articleTemplate,
      context: {
        slug: node.fields.slug,
        relatedFilePaths: node.fields.relatedFileAbsolutePaths.slice(0, 4)
      }
    })
  });
};

```

```js
// src/templates/article.js

export const query = graphql`
  query($relatedFilePaths: [String]) {
    relatedArticles: allMarkdownRemark(
      filter: { fileAbsolutePath: { in: $relatedFilePaths } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`
```

関連度の計算に
<a href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf" target="_blank" rel="noopener noreferrer">tf-idf</a>
と
<a href="https://en.wikipedia.org/wiki/Cosine_similarity" target="_blank" rel="noopener noreferrer">Cosine similarity</a>
を利用している、とのことで、何だかよくわかりませんがいい感じにやってくれそうです。

自前で関連度の計算をやろうとしたら多分結構難しそうなので、プラグインでサクッとできると助かりますね。

## gatsby-plugin-sitemap
<a href="https://www.gatsbyjs.com/plugins/gatsby-plugin-sitemap/" target="_blank" rel="noopener noreferrer">https://www.gatsbyjs.com/plugins/gatsby-plugin-sitemap/</a>

サイトマップを生成してくれるプラグインです。
<br/>
ビルドするとサイトの直下に`sitemap.xml`が生成されるようになります。

必要に応じてディレクトリの除外などもできるようです。

## gatsby-plugin-google-analytics
<a href="https://www.gatsbyjs.com/plugins/gatsby-plugin-google-analytics/" target="_blank" rel="noopener noreferrer">https://www.gatsbyjs.com/plugins/gatsby-plugin-google-analytics/</a>

Google Analyticsの計測タグをサイトに入れてくれるプラグインです。
<br/>
オプションで`trackingId`を入れてやればとりあえず動きます。

---

このサイトのソースコードは
<a href="https://github.com/KobayashiTakaki/takakisan" target="_blank" rel="noopener noreferrer">こちら</a>です。
<br/>
プラグインの使い方などの参考にしてみてください。

以上です。
