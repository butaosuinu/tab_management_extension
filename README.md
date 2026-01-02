# Tab Management Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![WXT](https://img.shields.io/badge/WXT-0.20-green.svg)](https://wxt.dev/)

ブラウザタブを効率的に管理するためのChrome拡張機能です。

## 機能

- **同一ドメインのタブを閉じる** - 現在のタブと同じドメインを持つすべてのタブを閉じます
- **同一サブドメインのタブを閉じる** - 現在のタブと同じサブドメインを持つすべてのタブを閉じます
- **同一サブディレクトリのタブを閉じる** - 現在のタブと同じホスト名+最初のパスを持つすべてのタブを閉じます
- **同一ドメインのタブをグループ化** - 現在のタブと同じドメインを持つすべてのタブをタブグループにまとめます

## インストール

### リリース版のインストール

1. [GitHubリリースページ](../../releases)から最新のzipファイル（`manado-chrome.zip`）をダウンロード

2. zipファイルを解凍

3. Chromeに拡張機能をロード
   - `chrome://extensions/` を開く
   - 「デベロッパーモード」を有効にする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - 解凍したディレクトリを選択

### 開発版のインストール

1. このリポジトリをクローン

   ```bash
   git clone https://github.com/your-username/tab-management-extension.git
   cd tab-management-extension
   ```

2. 依存関係をインストール

   ```bash
   pnpm install
   ```

3. ビルド

   ```bash
   pnpm build
   ```

4. Chromeに拡張機能をロード
   - `chrome://extensions/` を開く
   - 「デベロッパーモード」を有効にする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `.output/chrome-mv3` ディレクトリを選択

## 使い方

### ポップアップから操作

1. ツールバーの拡張機能アイコンをクリック
2. 実行したいアクションのボタンをクリック

### 右クリックメニューから操作

1. ページ上で右クリック
2. 「Tab Management」メニューから実行したいアクションを選択

## 開発

### 必要環境

- Node.js 18以上
- pnpm 10以上

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動（HMR対応）
pnpm dev
```

### コマンド一覧

| コマンド               | 説明                          |
| ---------------------- | ----------------------------- |
| `pnpm dev`             | 開発サーバーを起動（HMR対応） |
| `pnpm build`           | 本番用にビルド                |
| `pnpm zip`             | 配布用ZIPを作成               |
| `pnpm test`            | ユニットテストを実行          |
| `pnpm test:coverage`   | カバレッジ付きでテストを実行  |
| `pnpm test:e2e`        | E2Eテストを実行               |
| `pnpm test:e2e:headed` | E2Eテストをブラウザ表示で実行 |
| `pnpm lint`            | リンターを実行                |
| `pnpm lint:fix`        | リンターで自動修正            |
| `pnpm format`          | コードをフォーマット          |
| `pnpm typecheck`       | 型チェックを実行              |

## 技術スタック

- **フレームワーク**: [WXT](https://wxt.dev/) - Viteベースのブラウザ拡張機能フレームワーク
- **言語**: TypeScript
- **テスト**: Vitest（ユニットテスト）、Playwright（E2Eテスト）
- **リンター**: oxlint + ESLint (eslint-config-love)
- **フォーマッター**: oxfmt

## プロジェクト構成

```
tab_management_extension/
├── entrypoints/           # WXTエントリーポイント
│   ├── background.ts      # Service Worker
│   └── popup/             # ポップアップUI
│       ├── index.html
│       ├── main.ts
│       └── style.css
├── lib/                   # 共有ユーティリティ
│   ├── url-parser.ts      # URL解析ロジック
│   └── tab-utils.ts       # タブ操作関数
├── types/                 # TypeScript型定義
├── tests/                 # テストファイル
│   ├── unit/              # ユニットテスト
│   └── e2e/               # E2Eテスト（Playwright）
└── public/icon/           # 拡張機能アイコン
```

## ライセンス

[MIT License](LICENSE)
