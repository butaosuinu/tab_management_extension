import { describe, it, expect } from "vitest";
import type { Browser } from "wxt/browser";
import { mockBrowser } from "../setup";
import {
  closeSameDomainTabs,
  closeSameSubdomainTabs,
  closeSameSubdirectoryTabs,
  groupSameDomainTabs,
} from "@/lib/tab-utils";

type Tab = Browser.tabs.Tab;

describe("closeSameDomainTabs", () => {
  it("should close all tabs with the same domain", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/page1" } as Tab;
    const tabs = [
      { id: 1, url: "https://example.com/page1" },
      { id: 2, url: "https://example.com/page2" },
      { id: 3, url: "https://other.com" },
    ];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.remove.mockResolvedValue(undefined);

    const result = await closeSameDomainTabs(currentTab);

    expect(result).toEqual({ success: true, closedCount: 2 });
    expect(mockBrowser.tabs.remove).toHaveBeenCalledWith([1, 2]);
  });

  it("should return error when currentTab has no URL", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: undefined } as Tab;

    const result = await closeSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Current tab has no URL or ID" });
    expect(mockBrowser.tabs.remove).not.toHaveBeenCalled();
  });

  it("should return error when currentTab has no ID", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: undefined, url: "https://example.com" } as Tab;

    const result = await closeSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Current tab has no URL or ID" });
    expect(mockBrowser.tabs.remove).not.toHaveBeenCalled();
  });

  it("should return error when browser.tabs.remove fails", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/page1" } as Tab;
    const tabs = [{ id: 1, url: "https://example.com/page1" }];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.remove.mockRejectedValue(new Error("Permission denied"));

    const result = await closeSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Permission denied" });
  });

  it("should return success with closedCount 0 when no matching tabs", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/page1" } as Tab;
    const tabs = [{ id: 2, url: "https://other.com" }];
    mockBrowser.tabs.query.mockResolvedValue(tabs);

    const result = await closeSameDomainTabs(currentTab);

    expect(result).toEqual({ success: true, closedCount: 0 });
    expect(mockBrowser.tabs.remove).not.toHaveBeenCalled();
  });
});

describe("closeSameSubdomainTabs", () => {
  it("should close all tabs with the same subdomain", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://docs.example.com/page1" } as Tab;
    const tabs = [
      { id: 1, url: "https://docs.example.com/page1" },
      { id: 2, url: "https://docs.example.com/page2" },
      { id: 3, url: "https://api.example.com/page1" },
    ];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.remove.mockResolvedValue(undefined);

    const result = await closeSameSubdomainTabs(currentTab);

    expect(result).toEqual({ success: true, closedCount: 2 });
    expect(mockBrowser.tabs.remove).toHaveBeenCalledWith([1, 2]);
  });

  it("should return error when currentTab has no URL", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: undefined } as Tab;

    const result = await closeSameSubdomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Current tab has no URL or ID" });
    expect(mockBrowser.tabs.remove).not.toHaveBeenCalled();
  });

  it("should return error when browser.tabs.remove fails", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://docs.example.com/page1" } as Tab;
    const tabs = [{ id: 1, url: "https://docs.example.com/page1" }];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.remove.mockRejectedValue(new Error("Permission denied"));

    const result = await closeSameSubdomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Permission denied" });
  });
});

describe("closeSameSubdirectoryTabs", () => {
  it("should close all tabs with the same subdirectory", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/docs/page1" } as Tab;
    const tabs = [
      { id: 1, url: "https://example.com/docs/page1" },
      { id: 2, url: "https://example.com/docs/page2" },
      { id: 3, url: "https://example.com/api/page1" },
    ];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.remove.mockResolvedValue(undefined);

    const result = await closeSameSubdirectoryTabs(currentTab);

    expect(result).toEqual({ success: true, closedCount: 2 });
    expect(mockBrowser.tabs.remove).toHaveBeenCalledWith([1, 2]);
  });

  it("should return error when currentTab has no URL", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: undefined } as Tab;

    const result = await closeSameSubdirectoryTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Current tab has no URL or ID" });
    expect(mockBrowser.tabs.remove).not.toHaveBeenCalled();
  });

  it("should return error when browser.tabs.remove fails", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/docs/page1" } as Tab;
    const tabs = [{ id: 1, url: "https://example.com/docs/page1" }];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.remove.mockRejectedValue(new Error("Permission denied"));

    const result = await closeSameSubdirectoryTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Permission denied" });
  });
});

describe("groupSameDomainTabs", () => {
  it("should group all tabs with the same domain", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/page1" } as Tab;
    const tabs = [
      { id: 1, url: "https://example.com/page1" },
      { id: 2, url: "https://example.com/page2" },
      { id: 3, url: "https://other.com" },
    ];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.group.mockResolvedValue(100);
    mockBrowser.tabGroups.update.mockResolvedValue({});

    const result = await groupSameDomainTabs(currentTab);

    expect(result).toEqual({ success: true, groupId: 100 });
    expect(mockBrowser.tabs.group).toHaveBeenCalledWith({ tabIds: [1, 2] });
    expect(mockBrowser.tabGroups.update).toHaveBeenCalledWith(100, {
      title: "example.com",
      collapsed: false,
    });
  });

  it("should return error when currentTab has no URL", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: undefined } as Tab;

    const result = await groupSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Current tab has no URL or ID" });
    expect(mockBrowser.tabs.group).not.toHaveBeenCalled();
  });

  it("should return error when URL cannot be parsed", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "not-a-valid-url" } as Tab;

    const result = await groupSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Could not parse current tab URL" });
    expect(mockBrowser.tabs.group).not.toHaveBeenCalled();
  });

  it("should return error when no tabs to group", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/page1" } as Tab;
    const tabs = [{ id: undefined, url: "https://example.com/page1" }];
    mockBrowser.tabs.query.mockResolvedValue(tabs);

    const result = await groupSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "No tabs to group" });
    expect(mockBrowser.tabs.group).not.toHaveBeenCalled();
  });

  it("should return error when browser.tabs.group fails", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/page1" } as Tab;
    const tabs = [{ id: 1, url: "https://example.com/page1" }];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.group.mockRejectedValue(new Error("Cannot create group"));

    const result = await groupSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Cannot create group" });
  });

  it("should return error when browser.tabGroups.update fails", async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- Test mock requires partial Tab object
    const currentTab = { id: 1, url: "https://example.com/page1" } as Tab;
    const tabs = [{ id: 1, url: "https://example.com/page1" }];
    mockBrowser.tabs.query.mockResolvedValue(tabs);
    mockBrowser.tabs.group.mockResolvedValue(100);
    mockBrowser.tabGroups.update.mockRejectedValue(new Error("Cannot update group"));

    const result = await groupSameDomainTabs(currentTab);

    expect(result).toEqual({ success: false, error: "Cannot update group" });
  });
});
