import { browser, type Browser } from "wxt/browser";
import { matchesDomain, matchesSubdomain, matchesSubdirectory, parseURL } from "./url-parser";
import type { CloseTabsResult, GroupTabsResult } from "@/types";

type Tab = Browser.tabs.Tab;

/**
 * Close all tabs with the same domain as the current tab
 * Returns the result with the number of closed tabs
 */
export async function closeSameDomainTabs(currentTab: Tab): Promise<CloseTabsResult> {
  const { url: currentUrl, id: currentId } = currentTab;

  if (currentUrl === undefined || currentId === undefined) {
    return { success: false, error: "Current tab has no URL or ID" };
  }

  const allTabs = await browser.tabs.query({ currentWindow: true });
  const tabsToClose = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false;
    }
    return matchesDomain(currentUrl, tab.url);
  });

  if (tabsToClose.length > 0) {
    const tabIds = tabsToClose.map((tab) => tab.id).filter((id): id is number => id !== undefined);
    const removeError = await browser.tabs
      .remove(tabIds)
      .catch((error: unknown) =>
        error instanceof Error ? error.message : "Failed to remove tabs",
      );
    if (typeof removeError === "string") {
      return { success: false, error: removeError };
    }
  }

  return { success: true, closedCount: tabsToClose.length };
}

/**
 * Close all tabs with the same hostname (subdomain) as the current tab
 * Returns the result with the number of closed tabs
 */
export async function closeSameSubdomainTabs(currentTab: Tab): Promise<CloseTabsResult> {
  const { url: currentUrl, id: currentId } = currentTab;

  if (currentUrl === undefined || currentId === undefined) {
    return { success: false, error: "Current tab has no URL or ID" };
  }

  const allTabs = await browser.tabs.query({ currentWindow: true });
  const tabsToClose = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false;
    }
    return matchesSubdomain(currentUrl, tab.url);
  });

  if (tabsToClose.length > 0) {
    const tabIds = tabsToClose.map((tab) => tab.id).filter((id): id is number => id !== undefined);
    const removeError = await browser.tabs
      .remove(tabIds)
      .catch((error: unknown) =>
        error instanceof Error ? error.message : "Failed to remove tabs",
      );
    if (typeof removeError === "string") {
      return { success: false, error: removeError };
    }
  }

  return { success: true, closedCount: tabsToClose.length };
}

/**
 * Close all tabs with the same hostname and first path segment as the current tab
 * Returns the result with the number of closed tabs
 */
export async function closeSameSubdirectoryTabs(currentTab: Tab): Promise<CloseTabsResult> {
  const { url: currentUrl, id: currentId } = currentTab;

  if (currentUrl === undefined || currentId === undefined) {
    return { success: false, error: "Current tab has no URL or ID" };
  }

  const allTabs = await browser.tabs.query({ currentWindow: true });
  const tabsToClose = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false;
    }
    return matchesSubdirectory(currentUrl, tab.url);
  });

  if (tabsToClose.length > 0) {
    const tabIds = tabsToClose.map((tab) => tab.id).filter((id): id is number => id !== undefined);
    const removeError = await browser.tabs
      .remove(tabIds)
      .catch((error: unknown) =>
        error instanceof Error ? error.message : "Failed to remove tabs",
      );
    if (typeof removeError === "string") {
      return { success: false, error: removeError };
    }
  }

  return { success: true, closedCount: tabsToClose.length };
}

/**
 * Group all tabs with the same domain as the current tab into a tab group
 * Returns the group ID
 */
export async function groupSameDomainTabs(currentTab: Tab): Promise<GroupTabsResult> {
  const { url: currentUrl, id: currentId } = currentTab;

  if (currentUrl === undefined || currentId === undefined) {
    return { success: false, error: "Current tab has no URL or ID" };
  }

  const parsed = parseURL(currentUrl);
  if (parsed === undefined) {
    return { success: false, error: "Could not parse current tab URL" };
  }

  const allTabs = await browser.tabs.query({ currentWindow: true });
  const matchingTabs = allTabs.filter((tab) => {
    if (tab.url === undefined) {
      return false;
    }
    return matchesDomain(currentUrl, tab.url);
  });

  const tabIds = matchingTabs.map((tab) => tab.id).filter((id): id is number => id !== undefined);
  const [firstTabId, ...restTabIds] = tabIds;

  if (firstTabId === undefined) {
    return { success: false, error: "No tabs to group" };
  }

  const groupResult = await browser.tabs
    .group({ tabIds: [firstTabId, ...restTabIds] })
    .catch((error: unknown) =>
      error instanceof Error ? error.message : "Failed to create tab group",
    );
  if (typeof groupResult === "string") {
    return { success: false, error: groupResult };
  }
  const groupId = groupResult;

  const updateError = await browser.tabGroups
    .update(groupId, {
      title: parsed.domain,
      collapsed: false,
    })
    .catch((error: unknown) =>
      error instanceof Error ? error.message : "Failed to update tab group",
    );
  if (typeof updateError === "string") {
    return { success: false, error: updateError };
  }

  return { success: true, groupId };
}
