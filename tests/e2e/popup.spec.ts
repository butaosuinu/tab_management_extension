import { test, expect } from "./fixtures/extension";

test.describe("Popup UI", () => {
  test("ポップアップが正しく表示される", async ({ context, extensionId }) => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(popupPage.locator("h1")).toHaveText("Tab Manager");
    await expect(popupPage.locator("#close-domain")).toBeVisible();
    await expect(popupPage.locator("#close-subdomain")).toBeVisible();
    await expect(popupPage.locator("#close-subdirectory")).toBeVisible();
    await expect(popupPage.locator("#group-domain")).toBeVisible();
  });

  test("各ボタンが正しいテキストを表示している", async ({ context, extensionId }) => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(popupPage.locator("#close-domain")).toContainText("同一ドメインを閉じる");
    await expect(popupPage.locator("#close-subdomain")).toContainText("同一サブドメインを閉じる");
    await expect(popupPage.locator("#close-subdirectory")).toContainText(
      "同一サブディレクトリを閉じる",
    );
    await expect(popupPage.locator("#group-domain")).toContainText("同一ドメインをグループ化");
  });

  test("ステータスエリアが初期状態で非表示である", async ({ context, extensionId }) => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    const statusEl = popupPage.locator("#status");
    await expect(statusEl).toBeHidden();
  });

  test("ボタンクリック後にステータスが表示される", async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto("https://example.com");
    await page.bringToFront();

    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    await popupPage.locator("#close-domain").click();

    await expect(popupPage.locator("#status")).toBeVisible();
  });
});
