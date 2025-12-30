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
      void handleMessage(message).then(sendResponse);
      return true; // Indicates async response
    },
  );
});

async function executeAction(action: ActionType, tab: Browser.tabs.Tab): Promise<ActionResponse> {
  try {
    switch (action) {
      case "CLOSE_SAME_DOMAIN": {
        const closedCount = await closeSameDomainTabs(tab);
        return { success: true, closedCount };
      }
      case "CLOSE_SAME_SUBDOMAIN": {
        const closedCount = await closeSameSubdomainTabs(tab);
        return { success: true, closedCount };
      }
      case "CLOSE_SAME_SUBDIRECTORY": {
        const closedCount = await closeSameSubdirectoryTabs(tab);
        return { success: true, closedCount };
      }
      case "GROUP_BY_DOMAIN": {
        const groupId = await groupSameDomainTabs(tab);
        return { success: true, groupId };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function handleMessage(message: Message): Promise<ActionResponse> {
  const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });

  if (currentTab?.id === undefined || currentTab.url === undefined) {
    return { success: false, error: "No active tab found" };
  }

  return executeAction(message.action, currentTab);
}
