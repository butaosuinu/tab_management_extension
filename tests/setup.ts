import { vi, beforeEach } from 'vitest'

// Mock browser API for tests
const mockBrowser = {
  runtime: {
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    sendMessage: vi.fn(),
  },
  tabs: {
    query: vi.fn(),
    remove: vi.fn(),
    group: vi.fn(),
    get: vi.fn(),
  },
  tabGroups: {
    update: vi.fn(),
  },
}

// Mock wxt/browser module
vi.mock('wxt/browser', () => ({
  browser: mockBrowser,
  Browser: {},
}))

// Set browser mock in global scope (for backward compatibility)
Object.assign(globalThis, { browser: mockBrowser })

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})

export { mockBrowser }
