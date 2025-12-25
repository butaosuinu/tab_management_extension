import { describe, it, expect } from 'vitest'
import { mockBrowser } from '../setup'
import {
  closeSameDomainTabs,
  closeSameSubdomainTabs,
  closeSameSubdirectoryTabs,
} from '@/lib/tab-utils'

describe('closeSameDomainTabs', () => {
  it('should close current tab when it matches the domain', async () => {
    const currentTab = { id: 1, url: 'https://example.com/page1' }
    const tabs = [
      { id: 1, url: 'https://example.com/page1' },
      { id: 2, url: 'https://example.com/page2' },
      { id: 3, url: 'https://other.com' },
    ]
    mockBrowser.tabs.query.mockResolvedValue(tabs)
    mockBrowser.tabs.remove.mockResolvedValue(undefined)

    const count = await closeSameDomainTabs(currentTab)

    expect(count).toBe(2)
    expect(mockBrowser.tabs.remove).toHaveBeenCalledWith([1, 2])
  })
})

describe('closeSameSubdomainTabs', () => {
  it('should close current tab when it matches the subdomain', async () => {
    const currentTab = { id: 1, url: 'https://docs.example.com/page1' }
    const tabs = [
      { id: 1, url: 'https://docs.example.com/page1' },
      { id: 2, url: 'https://docs.example.com/page2' },
      { id: 3, url: 'https://api.example.com/page1' },
    ]
    mockBrowser.tabs.query.mockResolvedValue(tabs)
    mockBrowser.tabs.remove.mockResolvedValue(undefined)

    const count = await closeSameSubdomainTabs(currentTab)

    expect(count).toBe(2)
    expect(mockBrowser.tabs.remove).toHaveBeenCalledWith([1, 2])
  })
})

describe('closeSameSubdirectoryTabs', () => {
  it('should close current tab when it matches the subdirectory', async () => {
    const currentTab = { id: 1, url: 'https://example.com/docs/page1' }
    const tabs = [
      { id: 1, url: 'https://example.com/docs/page1' },
      { id: 2, url: 'https://example.com/docs/page2' },
      { id: 3, url: 'https://example.com/api/page1' },
    ]
    mockBrowser.tabs.query.mockResolvedValue(tabs)
    mockBrowser.tabs.remove.mockResolvedValue(undefined)

    const count = await closeSameSubdirectoryTabs(currentTab)

    expect(count).toBe(2)
    expect(mockBrowser.tabs.remove).toHaveBeenCalledWith([1, 2])
  })
})
