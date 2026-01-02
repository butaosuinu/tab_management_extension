import { test, expect } from "./fixtures/extension";

test.describe("Tab Operations", () => {
  test.describe("同一ドメインのタブを閉じる", () => {
    test("同じドメインのタブが閉じられる", async ({ context, extensionId }) => {
      const page1 = await context.newPage();
      await page1.goto("https://example.com/page1");

      const page2 = await context.newPage();
      await page2.goto("https://example.com/page2");

      const page3 = await context.newPage();
      await page3.goto("https://example.org");

      await page1.bringToFront();

      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

      await popupPage.locator("#close-domain").click();

      await popupPage.locator("#status").waitFor({ state: "visible" });
      await expect(popupPage.locator("#status")).toContainText("個のタブを閉じました");

      await popupPage.waitForTimeout(500);

      const allPages = context.pages();
      const remainingPages = allPages.filter((p) => !p.url().startsWith("chrome-extension://"));
      const hasExampleOrgPage = remainingPages.some((p) => p.url().includes("example.org"));
      expect(hasExampleOrgPage).toBe(true);
    });
  });

  test.describe("同一サブディレクトリのタブを閉じる", () => {
    test("同じサブディレクトリのタブが閉じられる", async ({ context, extensionId }) => {
      const page1 = await context.newPage();
      await page1.goto("https://example.com/docs/page1");

      const page2 = await context.newPage();
      await page2.goto("https://example.com/docs/page2");

      const page3 = await context.newPage();
      await page3.goto("https://example.com/api/page1");

      await page1.bringToFront();

      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

      await popupPage.locator("#close-subdirectory").click();

      await popupPage.locator("#status").waitFor({ state: "visible" });
      await expect(popupPage.locator("#status")).toContainText("個のタブを閉じました");
    });
  });

  test.describe("同一ドメインでグループ化", () => {
    test("グループ化ボタンをクリックするとステータスが表示される", async ({
      context,
      extensionId,
    }) => {
      const page1 = await context.newPage();
      await page1.goto("https://example.com/page1");

      const page2 = await context.newPage();
      await page2.goto("https://example.com/page2");

      await page1.bringToFront();

      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

      await popupPage.locator("#group-domain").click();

      await popupPage.locator("#status").waitFor({ state: "visible" });
      await expect(popupPage.locator("#status")).toBeVisible();
    });
  });

  test.describe("エラーハンドリング", () => {
    test("エラー時にステータスが表示される", async ({ context, extensionId }) => {
      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

      await popupPage.locator("#close-domain").click();

      await popupPage.locator("#status").waitFor({ state: "visible" });
      await expect(popupPage.locator("#status")).toBeVisible();
    });
  });
});
