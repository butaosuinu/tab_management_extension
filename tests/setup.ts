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

// Set browser mock in global scope
Object.assign(globalThis, { browser: mockBrowser })

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})

export { mockBrowser }
