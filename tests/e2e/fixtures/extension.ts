import {
  test as base,
  chromium,
  type BrowserContext,
} from "@playwright/test";
import path from "node:path";

const EXTENSION_PATH = path.join(process.cwd(), ".output/chrome-mv3");

interface ExtensionFixtures {
  context: BrowserContext;
  extensionId: string;
}

export const test = base.extend<ExtensionFixtures>({
  context: async ({ }, use) => {
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        "--headless=new",
      ],
    });
    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    const [existingWorker] = context.serviceWorkers();
    const background =
      existingWorker ?? (await context.waitForEvent("serviceworker"));

    const [, , extensionId] = background.url().split("/");
    if (extensionId === undefined) {
      throw new Error("Could not extract extension ID from service worker URL");
    }
    await use(extensionId);
  },
});

export { expect } from "@playwright/test";
