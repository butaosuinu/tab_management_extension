import { browser, type Browser } from 'wxt/browser'
import { matchesDomain, matchesSubdomain, matchesSubdirectory, parseURL } from './url-parser'

type Tab = Browser.tabs.Tab

/**
 * Close all tabs with the same domain as the current tab
 * Returns the number of closed tabs
 */
export async function closeSameDomainTabs(currentTab: Tab): Promise<number> {
  const { url: currentUrl, id: currentId } = currentTab

  if (currentUrl === undefined || currentId === undefined) {
    return 0
  }

  const allTabs = await browser.tabs.query({ currentWindow: true })
  const tabsToClose = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false
    }
    return matchesDomain(currentUrl, tab.url)
  })

  if (tabsToClose.length > 0) {
    const tabIds = tabsToClose.map((tab) => tab.id).filter((id): id is number => id !== undefined)
    await browser.tabs.remove(tabIds)
  }

  return tabsToClose.length
}

/**
 * Close all tabs with the same hostname (subdomain) as the current tab
 * Returns the number of closed tabs
 */
export async function closeSameSubdomainTabs(currentTab: Tab): Promise<number> {
  const { url: currentUrl, id: currentId } = currentTab

  if (currentUrl === undefined || currentId === undefined) {
    return 0
  }

  const allTabs = await browser.tabs.query({ currentWindow: true })
  const tabsToClose = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false
    }
    return matchesSubdomain(currentUrl, tab.url)
  })

  if (tabsToClose.length > 0) {
    const tabIds = tabsToClose.map((tab) => tab.id).filter((id): id is number => id !== undefined)
    await browser.tabs.remove(tabIds)
  }

  return tabsToClose.length
}

/**
 * Close all tabs with the same hostname and first path segment as the current tab
 * Returns the number of closed tabs
 */
export async function closeSameSubdirectoryTabs(currentTab: Tab): Promise<number> {
  const { url: currentUrl, id: currentId } = currentTab

  if (currentUrl === undefined || currentId === undefined) {
    return 0
  }

  const allTabs = await browser.tabs.query({ currentWindow: true })
  const tabsToClose = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false
    }
    return matchesSubdirectory(currentUrl, tab.url)
  })

  if (tabsToClose.length > 0) {
    const tabIds = tabsToClose.map((tab) => tab.id).filter((id): id is number => id !== undefined)
    await browser.tabs.remove(tabIds)
  }

  return tabsToClose.length
}

/**
 * Group all tabs with the same domain as the current tab into a tab group
 * Returns the group ID
 */
export async function groupSameDomainTabs(currentTab: Tab): Promise<number> {
  const { url: currentUrl, id: currentId } = currentTab

  if (currentUrl === undefined || currentId === undefined) {
    throw new Error('Current tab has no URL or ID')
  }

  const parsed = parseURL(currentUrl)
  if (parsed === null) {
    throw new Error('Could not parse current tab URL')
  }

  const allTabs = await browser.tabs.query({ currentWindow: true })
  const matchingTabs = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false
    }
    return matchesDomain(currentUrl, tab.url)
  })

  const tabIds = matchingTabs.map((tab) => tab.id).filter((id): id is number => id !== undefined)
  const [firstTabId, ...restTabIds] = tabIds

  if (firstTabId === undefined) {
    throw new Error('No tabs to group')
  }

  const groupId = await browser.tabs.group({ tabIds: [firstTabId, ...restTabIds] })

  await browser.tabGroups.update(groupId, {
    title: parsed.domain,
    collapsed: false,
  })

  return groupId
}
