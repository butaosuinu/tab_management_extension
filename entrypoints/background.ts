import { browser, type Browser } from "wxt/browser";
import {
  closeSameDomainTabs,
  closeSameSubdomainTabs,
  closeSameSubdirectoryTabs,
  groupSameDomainTabs,
} from "@/lib/tab-utils";
import type { Message, ActionResponse, ActionType } from "@/types";

const VALID_ACTIONS = [
  "CLOSE_SAME_DOMAIN",
  "CLOSE_SAME_SUBDOMAIN",
  "CLOSE_SAME_SUBDIRECTORY",
  "GROUP_BY_DOMAIN",
] as const;

function isValidAction(id: unknown): id is ActionType {
  return typeof id === "string" && (VALID_ACTIONS as readonly string[]).includes(id);
}

export default defineBackground(() => {
  // Register context menus on install
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "CLOSE_SAME_DOMAIN",
      title: "同じドメインのタブを閉じる",
      contexts: ["page"],
    });
    browser.contextMenus.create({
      id: "CLOSE_SAME_SUBDOMAIN",
      title: "同じサブドメインのタブを閉じる",
      contexts: ["page"],
    });
    browser.contextMenus.create({
      id: "CLOSE_SAME_SUBDIRECTORY",
      title: "同じサブディレクトリのタブを閉じる",
      contexts: ["page"],
    });
    browser.contextMenus.create({
      id: "GROUP_BY_DOMAIN",
      title: "同じドメインのタブをグループ化",
      contexts: ["page"],
    });
  });

  // Handle context menu clicks
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (tab?.id === undefined || tab.url === undefined) return;
    if (!isValidAction(info.menuItemId)) return;
    void executeAction(info.menuItemId, tab);
  });

  // Handle messages from popup
  browser.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse: (response: ActionResponse) => void) => {
      void (async () => {
        const response = await handleMessage(message);
        sendResponse(response);
      })();
      return true; // Indicates async response
    },
  );
});

async function executeAction(action: ActionType, tab: Browser.tabs.Tab): Promise<ActionResponse> {
  switch (action) {
    case "CLOSE_SAME_DOMAIN": {
      const result = await closeSameDomainTabs(tab);
      if (result.success) {
        return { success: true, closedCount: result.closedCount };
      }
      return { success: false, error: result.error };
    }
    case "CLOSE_SAME_SUBDOMAIN": {
      const result = await closeSameSubdomainTabs(tab);
      if (result.success) {
        return { success: true, closedCount: result.closedCount };
      }
      return { success: false, error: result.error };
    }
    case "CLOSE_SAME_SUBDIRECTORY": {
      const result = await closeSameSubdirectoryTabs(tab);
      if (result.success) {
        return { success: true, closedCount: result.closedCount };
      }
      return { success: false, error: result.error };
    }
    case "GROUP_BY_DOMAIN": {
      const result = await groupSameDomainTabs(tab);
      if (result.success) {
        return { success: true, groupId: result.groupId };
      }
      return { success: false, error: result.error };
    }
  }
}

async function handleMessage(message: Message): Promise<ActionResponse> {
  const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });

  if (currentTab?.id === undefined || currentTab.url === undefined) {
    return { success: false, error: "No active tab found" };
  }

  return executeAction(message.action, currentTab);
}
