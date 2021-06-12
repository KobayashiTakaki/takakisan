---
title: "【ネタバレあり】『A Tour of Go』感想"
date: "2021-06-12"
tags: ["Go"]
---

Rubyしかまともに使ったこと無い私ですが、ちょっくらGoでも入門してみるかと思い、『A Tour of Go』を一通り読んでみたので、感想をつらつら書いていきます。

## Packages, variables, and functions.

### Functions

型を後ろに書くんだなあ

### Multiple results

戻り値複数個もできる

`:=` PL/SQLっぽい

### Basic types

数字の種類そんなにあんの？

### Type conversions

`parseInt`みたいなメソッドではないのね

### Constants

`const` JavaScriptっぽい

## Flow control statements: for, if, else, switch and defer

### For

Javaとか、昔ながらのJavaScriptっぽい

括弧はつけない

### For is Go's "while"

なるほどね

### If

括弧はつけない。了解

### If with a short statement

へー。そういうことしたいことあるのか。

### Exercise: Loops and Functions

こんな感じでしょうか。

```go
package main

import (
	"fmt"
)

func Sqrt(x float64) float64 {
	z := 1.0
	// z := x
	var d float64
	for i := 0; i < 10; i++ {
		d = (z*z - x) / (2 * z)
		// 値が変化しなくなった の判定の仕方がわからん
		// if d めっちゃ小さい {
		// 	return z
		// }
		z -= d
		fmt.Println(i, z)
	}
	return z
}

func main() {
	fmt.Println(Sqrt(5000))
}

```

> 値が変化しなくなった (もしくはごくわずかな変化しかしなくなった) 場合にループを停止させます

これのやり方が分からない。

> x や x/2 のように他の初期推測の値を z に与えてみてください。

`x`入れるのと`1.0`入れるの違いなさそう。

### Switch

インデントにモヤッとする。

### Defer

使い所がわからん

## More types: structs, slices, and maps.

### Pointers

値渡し、参照渡しみたいな話？

複数箇所から触るような場面はポインタにしとくといいのかな。

### Slices

配列使いたいときは基本Sliceを使えばいいのかな

### Range

JavaScriptの`forEach`的な感じ。

見た目ちょっと独特だがよく使いそう。

### Exercise: Slices

こんな感じでしょうか。

```go
package main

import "golang.org/x/tour/pic"

func Pic(dx, dy int) [][]uint8 {
	sy := make([][]uint8, dy)
	for i, _ := range sy {
		sx := make([]uint8, dx)
		for j, _ := range sx {
			// sx[j] = uint8((j + i) / 2)
			// sx[j] = uint8(j * i)
			sx[j] = uint8((j / 3) ^ ((i ^ 2) ^ j) + j*2 ^ (2 * i))
		}
		sy[i] = sx
	}
	return sy
}

func main() {
	pic.Show(Pic)
}

```

言ってる意味を理解するのに苦労した。なんか画像が出たので良しとする。

いじってると複雑な模様が色々出て楽しい。

ところでFormatボタンで整形したがこれでいいのか。`*`の左右のスペースがまちまちじゃないか？

### Mutating Maps

キーに対応する値の存在確認は2つ目の戻り値で判断する。

`nil`が返ってくる、とかじゃないのね。

### Exercise: Maps

こんな感じでしょうか。

```go
package main

import (
	"golang.org/x/tour/wc"
	"strings"
)

func WordCount(s string) map[string]int {
	m := make(map[string]int)
	words := strings.Fields(s)
	for _, v := range words {
		c, ok := m[v]
		if ok {
			m[v] = c + 1
		} else {
			m[v] = 1
		}
	}
	return m
}

func main() {
	wc.Test(WordCount)
}

```

### Function values

JavaScriptっぽいノリだ。

### Exercise: Fibonacci closure

こんな感じでしょうか。

```go
package main

import "fmt"

// fibonacci is a function that returns
// a function that returns an int.
func fibonacci() func() int {
	nums := make([]int, 0)
	return func() int {
		switch {
		case len(nums) == 0:
			nums = append(nums, 0)
			return 0
		case len(nums) == 1:
			nums = append(nums, 1)
			return 1
		default:
			nums = append(nums, nums[(len(nums)-2)]+nums[(len(nums)-1)])
			return nums[(len(nums) - 1)]
		}
	}
}

func main() {
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}

```

なんかもうちょっときれいにできそうな気もするがまあいいか。

Formatがこれでいいのか気になる。`+`, `-`の左右のスペースはあけるべきか否か。

## Methods and interfaces

### Methods

独特やね。

クラスの定義の中にメソッドを書くんではなくて、外で書く。

### Interface values

あんまり何を言っているのかわからん。

### Type assertions

なんか使いそう

### Exercise: Stringers

こんな感じでしょうか

```go
package main

import "fmt"

type IPAddr [4]byte

func (i IPAddr) String() string {
	return fmt.Sprintf("%v.%v.%v.%v", i[0], i[1], i[2], i[3])
}

func main() {
	hosts := map[string]IPAddr{
		"loopback":  {127, 0, 0, 1},
		"googleDNS": {8, 8, 8, 8},
	}
	for name, ip := range hosts {
		fmt.Printf("%v: %v\n", name, ip)
	}
}

```

### Exercise: Errors

こんな感じでしょうか

```go
package main

import (
	"fmt"
)

type ErrNegativeSqrt float64

func (e ErrNegativeSqrt) Error() string {
	return fmt.Sprintf("cannot Sqrt negative number: %v",
		float64(e))
}

func Sqrt(x float64) (float64, error) {
	if int(x) < 0 {
		return x, ErrNegativeSqrt(x)
	}
	z := 1.0
	for i := 0; i < 10; i++ {
		z -= (z*z - x) / (2 * z)
		fmt.Sprintln(z)
	}
	return z, nil
}

func main() {
	fmt.Println(Sqrt(2))
	fmt.Println(Sqrt(-2))
}

```

### Exercise: Readers

こんな感じ？

```go
package main

import "golang.org/x/tour/reader"

type MyReader struct{}

func (MyReader) Read(b []byte) (int, error) {
	for {
		for i := range b {
			b[i] = 'A'
		}
		return len(b), nil
	}
}

func main() {
	reader.Validate(MyReader{})
}

```

### Exercise: rot13Reader

これはマジでわからんかった。

ネットで他の人の解答見たが、ぱっと見何してるのかわからなかったので、自分なりの理解をコメントで書いておいた。

この問題出すにしては事前にruneに関しての解説が不足していないか？

```go
package main

import (
	"io"
	"os"
	"strings"
)

type rot13Reader struct {
	r io.Reader
}

func rot13(b byte) byte {
	switch {
	case 'a' <= b && b <= 'z':
		// bが'a'から「何文字目か」を計算し、そこから13文字後ろにずらす
		// 26文字目('z')を超える場合も考慮して、26の剰余を取る
		// 'a'に「何文字目か」の数を足すことで、求めたい文字コードを算出する
		return (b-'a'+13)%26 + 'a'
	case 'A' <= b && b <= 'Z':
		return (b-'A'+13)%26 + 'A'
	default:
		return b
	}
}

func (r rot13Reader) Read(b []byte) (n int, err error) {
	n, err = r.r.Read(b)
	for i, v := range b {
		b[i] = rot13(v)
	}
	return
}

func main() {
	s := strings.NewReader("Lbh penpxrq gur pbqr!")
	r := rot13Reader{s}
	io.Copy(os.Stdout, &r)
}

```

### Exercise: Images

型に合った戻り値を作ればいいのかな。

なんか青い四角が出たからOK。

```go
package main

import (
	"golang.org/x/tour/pic"
	"image"
	"image/color"
)

type Image struct {
	w int
	h int
	v uint8
}

func (Image) ColorModel() color.Model {
	return color.RGBAModel
}

func (i Image) Bounds() image.Rectangle {
	return image.Rect(0, 0, i.w, i.h)
}

func (i Image) At(x, y int) color.Color {
	return color.RGBA{i.v, i.v, 255, 255}
}

func main() {
	m := Image{w: 100, h: 100, v: 100}
	pic.ShowImage(m)
}

```

## Concurrency

### Goroutines

書き方めっちゃシンプル。

Pythonで並列処理やろうとすると結構めんどくさかった気がする。

### Channels

これも書き方シンプルでいいね。

### Buffered Channels

チャネルが一時的に値を保持していてくれる感じ？

### Select

待受させとく処理なんかで便利なのかもしらん。

### Exercise: Equivalent Binary Trees

これは難しかった。

教養が無いので、そもそもTreeをWalkするってどういうこと？と悩んでしまった。

全部のノードを見終わったらチャネルをcloseして終わりにするのかなと思ったが、「全部見終わった」の判定の仕方がわからず、「10回やったら終わり」の決め打ちにしてしまった。

Sliceの比較は`reflect.DeepEqual`が便利と見かけたのでそれでやってみた。

```go
package main

import (
	"fmt"
	"golang.org/x/tour/tree"
	"reflect"
)

// Walk walks the tree t sending all values
// from the tree to the channel ch.
func Walk(t *tree.Tree, ch chan int) {
	if t.Left != nil {
		Walk(t.Left, ch)
	}
	ch <- t.Value
	if t.Right != nil {
		Walk(t.Right, ch)
	}
}

func Same(t1, t2 *tree.Tree) bool {
	ch1 := make(chan int)
	ch2 := make(chan int)
	v1 := make([]int, 10)
	v2 := make([]int, 10)
	go Walk(t1, ch1)
	go Walk(t2, ch2)
	for i := 0; i < 10; i++ {
		v1[i] = <-ch1
		v2[i] = <-ch2
	}
	return reflect.DeepEqual(v1, v2)
}

func main() {
	ch := make(chan int)
	go Walk(tree.New(1), ch)
	for i := 0; i < 10; i++ {
		fmt.Println(<-ch)
	}
	fmt.Println(Same(tree.New(1), tree.New(1)))
	fmt.Println(Same(tree.New(1), tree.New(2)))
}

```

### Exercise: Web Crawler

これも結構難しかった。これで合ってるのかなー。

全部のURL見終わったら終了させたいんだが、その判定に悩んだ。

`time.Timer`を使って、一定時間以上チャネルに値が来なかったら終了する、という作りにしてみた。

これがいいやり方なのかはわからん。


```go
package main

import (
	"fmt"
	"sync"
	"time"
)

type Fetcher interface {
	// Fetch returns the body of URL and
	// a slice of URLs found on that page.
	Fetch(url string) (body string, urls []string, err error)
}

type CrawlCache struct {
	mu sync.Mutex
	v  map[string]string
}

// Crawl uses fetcher to recursively crawl
// pages starting with url, to a maximum of depth.
func Crawl(url string, depth int, fetcher Fetcher, c CrawlCache, ch chan string) {
	if depth <= 0 {
		return
	}
	c.mu.Lock()
	_, ok := c.v[url]
	if ok {
		c.mu.Unlock()
		return
	}
	body, urls, err := fetcher.Fetch(url)
	c.v[url] = body
	c.mu.Unlock()
	if err != nil {
		ch <- fmt.Sprint(err)
		return
	}
	res := fmt.Sprintf("found: %s %q", url, body)
	ch <- res
	for _, u := range urls {
		go Crawl(u, depth-1, fetcher, c, ch)
	}
	return
}

func main() {
	c := CrawlCache{v: make(map[string]string)}
	ch := make(chan string)
	go Crawl("https://golang.org/", 4, fetcher, c, ch)
	t := time.NewTimer(3000 * time.Millisecond)
	for {
		select {
		case v := <-ch:
			t.Stop()
			t.Reset(3000 * time.Millisecond)
			fmt.Println(v)
		case <-t.C:
			// タイムアウトしたら終了
			// fmt.Println("timeout")
			return
		default:
			time.Sleep(100 * time.Millisecond)
		}
	}
}

// fakeFetcher is Fetcher that returns canned results.
type fakeFetcher map[string]*fakeResult

type fakeResult struct {
	body string
	urls []string
}

func (f fakeFetcher) Fetch(url string) (string, []string, error) {
	// 動き見るために少し遅らせる
	time.Sleep(500 * time.Millisecond)
	if res, ok := f[url]; ok {
		return res.body, res.urls, nil
	}
	return "", nil, fmt.Errorf("not found: %s", url)
}

// fetcher is a populated fakeFetcher.
var fetcher = fakeFetcher{
	"https://golang.org/": &fakeResult{
		"The Go Programming Language",
		[]string{
			"https://golang.org/pkg/",
			"https://golang.org/cmd/",
			"https://golang.org/help/",
			"https://golang.org/project/",
		},
	},
	"https://golang.org/pkg/": &fakeResult{
		"Packages",
		[]string{
			"https://golang.org/",
			"https://golang.org/cmd/",
			"https://golang.org/pkg/fmt/",
			"https://golang.org/pkg/os/",
			"https://golang.org/doc/",
		},
	},
	"https://golang.org/pkg/fmt/": &fakeResult{
		"Package fmt",
		[]string{
			"https://golang.org/",
			"https://golang.org/pkg/",
		},
	},
	"https://golang.org/pkg/os/": &fakeResult{
		"Package os",
		[]string{
			"https://golang.org/",
			"https://golang.org/pkg/",
		},
	},
	"https://golang.org/doc/": &fakeResult{
		"Document",
		[]string{
			"https://golang.org/",
			"https://golang.org/pkg/",
			"https://golang.org/project/",
			"https://golang.org/help/",
		},
	},
	"https://golang.org/project/": &fakeResult{
		"Project",
		[]string{
			"https://golang.org/",
			"https://golang.org/pkg/",
			"https://golang.org/project/",
			"https://golang.org/help/",
		},
	},
}
```

---

以上です。お疲れさまでした。
