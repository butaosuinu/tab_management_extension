# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tab Management Extension - A Chrome browser extension for managing browser tabs.

### Features
- Close all tabs with the same domain as the current tab
- Close all tabs with the same subdomain as the current tab
- Close all tabs with the same subdirectory as the current tab
- Group all tabs with the same domain into a tab group

## Tech Stack

- **Framework**: WXT (Web Extension Toolkit) - Vite-based browser extension framework
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Bundler**: Vite (via WXT)
- **Test**: Vitest
- **Linter**: oxlint + ESLint (eslint-config-love)
- **Formatter**: oxfmt

## Project Structure

```
entrypoints/         # WXT entrypoints (auto-registered)
  ├── background.ts  # Service Worker
  └── popup/         # Popup UI
lib/                 # Shared utilities
  ├── url-parser.ts  # URL parsing logic
  └── tab-utils.ts   # Tab manipulation functions
types/               # TypeScript type definitions
tests/               # Test files
public/icon/         # Extension icons
```

## Common Commands

```bash
pnpm dev          # Start development server with HMR
pnpm build        # Build for production
pnpm zip          # Create distributable ZIP
pnpm test         # Run tests
pnpm lint         # Run oxlint and ESLint
pnpm format       # Format code with oxfmt
```

## Development

1. Run `pnpm dev` to start the development server
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

## Architecture

- **Popup** sends messages to **Background** (Service Worker)
- **Background** uses `browser.tabs` and `browser.tabGroups` APIs
- URL parsing logic is in `lib/url-parser.ts` (domain extraction, matching)

## TypeScript & WXT

### Browser API の型定義

WXTでは`browser` APIを使用する際、明示的にインポートが必要:

```typescript
import { browser, type Browser } from 'wxt/browser'

type Tab = Browser.tabs.Tab
```

**注意**: グローバルな`browser`変数はランタイムで自動注入されるが、`tsc --noEmit`での型チェック時にはインポートが必要。

### tabs.group() の型

`browser.tabs.group()`の`tabIds`引数は`number | [number, ...number[]]`型（非空タプル）を期待する。`number[]`をそのまま渡すと型エラーになるため、分割代入で変換:

```typescript
const [firstTabId, ...restTabIds] = tabIds
if (firstTabId === undefined) {
  throw new Error('No tabs to group')
}
await browser.tabs.group({ tabIds: [firstTabId, ...restTabIds] })
```

### 型チェックコマンド

TypeScriptはdevDependenciesに含まれていないため、pnpm経由で実行:

```bash
pnpm wxt prepare                                    # WXT型定義を生成
./node_modules/.pnpm/node_modules/.bin/tsc --noEmit # 型チェック
```

## Testing

### wxt/browser モジュールのモック

テストでは`wxt/browser`モジュールをモックする必要がある（`tests/setup.ts`）:

```typescript
vi.mock('wxt/browser', () => ({
  browser: mockBrowser,
  Browser: {},
}))
```

### 部分的なTabオブジェクトのモック

テストで部分的なTabオブジェクトを使用する場合、eslint-disableコメントを追加:

```typescript
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
const currentTab = { id: 1, url: 'https://example.com' } as Tab
```
