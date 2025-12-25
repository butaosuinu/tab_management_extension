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
