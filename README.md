# vite-react-esm1

(2025-04)

React v19 から UMD ビルドが廃止になって、
ESM ベースの CDN が推奨になりました。
(参照: [UMD ビルドの削除](https://ja.react.dev/blog/2024/04/25/react-19-upgrade-guide#umd-builds-removed))

[importmap](https://developer.mozilla.org/ja/docs/Web/HTML/Element/script/type/importmap)
を使って、お手軽に ESM 対応にしてみましょう。

## 手順

ここでは [pnpm](https://pnpm.io/ja/) を使いますが、npm や bun でも手順はおおむね一緒です。

まず vite create でプロジェクトを作成します。

2025 年 4 月現在、create vite は React 19 を最初から使うようになっています。
package.json を開いて確認し、React 19 でなければ修正してください。

```sh
pnpm create vite vite-react-esm1 --template react-ts
cd vite-react-esm1
pnpm i
pnpm run build && pnpm run preview
```

で <http://localhost:4173/> を開いて、動作確認してください。
よくある Vite のサンプルが見えるはずです。

次は
ESM 対応にしてみます。

まず、`./index.html` を編集して、\</head\> の直前に
インポートマップを追加しましょう。

```html
<head>
  /*...*/
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@19",
        "react-dom/client": "https://esm.sh/react-dom@19/client"
      }
    }
  </script>
</head>
```

つぎに `./vite.config.ts` を編集して
defineConfig に rollup のオプションを追加してください。

```typescript
export default defineConfig({
  //...
  build: {
    rollupOptions: {
      external: ["react", "react-dom/client"],
    },
  },
});
```

ビルド時の
バンドルから除外するのは `src/main.tsx`などで import しているモジュールをそのまま書きます。
'react-dom/client' のかわりに 'react-dom'　や 'react-dom/\*' とは書けないようです。

あとは `pnpm build && pnpm preview` で、
バンドルサイズが減ったことと、
<http://localhost:4173/> を開いて、動作確認してください。

## いまのところの欠点

- `pnpm dev` で開発時にも importmap を呼んでしまう。
- モジュールのリストのメンテが手動。プラグインで自動で処理できればいいんですが。

## `?dev`

中身を見れば一目瞭然ですが、esm.sh では `?dev` をつけると開発版を取得します。

<https://esm.sh/react@19/?dev>

```text
/* esm.sh - react@19.1.0 */
export * from "/react@19.1.0/es2022/react.development.mjs";
export { default } from "/react@19.1.0/es2022/react.development.mjs";
```

<https://esm.sh/react@19>

```
/* esm.sh - react@19.1.0 */
export * from "/react@19.1.0/es2022/react.mjs";
export { default } from "/react@19.1.0/es2022/react.mjs";
```

参照: [ESM>CDN](https://esm.sh/#docs)の "Development Build" の節

## esm.sh 以外の importmap 対応 CDN

- [JSPM - jspm.io](https://jspm.org/cdn/jspm-io)
- [Skypack: search millions of open source JavaScript packages](https://www.skypack.dev/)

ただ両方とも 2025 年 4 月現在、React 19 はありませんでした。
