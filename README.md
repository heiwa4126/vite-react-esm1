# vite-react-esm1

(2025-04)

React v19 から UMD ビルドが廃止になって、
ESM ベースの CDN が推奨になりました。
(参照: [UMD ビルドの削除](https://ja.react.dev/blog/2024/04/25/react-19-upgrade-guide#umd-builds-removed))

[importmap](https://developer.mozilla.org/ja/docs/Web/HTML/Element/script/type/importmap)
を使って、お手軽に ESM CDN 対応にしてみましょう。
importmap を使うと、
既存の js,ts,jsx,tsx 文中の import 文を修正することなく、モジュールの読込先を変更できます。

参考: [8\.1\.5\.2 Import maps - HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps)

## 実習

ここでは [pnpm](https://pnpm.io/ja/) を使いますが、npm や bun でも手順はおおむね一緒です。

まず vite create でプロジェクトを作成します。

2025 年 4 月現在、create vite は React 19 を最初から使うようになっています。
package.json を確認し、React 19 でなければ修正してください。

```sh
pnpm create vite vite-react-esm1 --template react-ts
cd vite-react-esm1
pnpm install
pnpm run build && pnpm run preview
```

で <http://localhost:4173/> を開いて、動作確認してください。
よくある Vite のサンプルが見えるはずです。

次はこれを
ESM 対応にしてみます。

まず、`./index.html` を編集して、\</head\> の直前に
インポートマップを追加しましょう。

```html
<head>
  /*...略...*/
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@19",
        "react-dom/": "https://esm.sh/react-dom@19/"
      }
    }
  </script>
</head>
```

最後の`/` があったりなかったりする件は
[Using Import Maps](https://esm.sh/#using-import-maps)
を参照。

つぎに `./vite.config.ts` を編集して
defineConfig に [Rollup](https://rollupjs.org/) のオプションを追加してください。

```typescript
export default defineConfig({
  //...略...
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

あとは `pnpm run build && pnpm run preview` で、

- バンドルサイズが減ったこと
- <http://localhost:4173/> を開いて、同じ動作になること

を確認してください。

これでバンドルと ESM CDN の両方の利点を生かしたフロントエンドが出来上がりました。

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

参照: ESM>CDN の "[Development Build](https://esm.sh/#development-build)" の節

## esm.sh 以外の importmap 対応 CDN

- [JSPM - jspm.io](https://jspm.org/cdn/jspm-io)
- [Skypack: search millions of open source JavaScript packages](https://www.skypack.dev/)

ただ両方とも 2025 年 4 月現在、React 19 はありませんでした。

## esm.sh/tsx を使えば JSX が \<script\> に書ける

その他、esm.sh で面白いのは `esm.sh/tsx`。
[Using esm\.sh/tsx](https://esm.sh/#tsx)
にコピペで実行できる HTML が載ってるので、試してみてください。

サンプルは [esm-dev/tsx: A TSX transpiler for esm.sh services.](https://github.com/esm-dev/tsx#readme) の方がちょっと新しいです。
