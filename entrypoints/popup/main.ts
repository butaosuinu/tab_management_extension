import type { ActionType, ActionResponse } from "@/types";

const STATUS_DISPLAY_DURATION_MS = 3000;

function showStatus(message: string, isError = false): void {
  const statusEl = document.getElementById("status");
  if (statusEl === null) return;

  statusEl.textContent = message;
  statusEl.className = `status ${isError ? "error" : "success"}`;

  setTimeout(() => {
    statusEl.className = "status";
  }, STATUS_DISPLAY_DURATION_MS);
}

function setButtonsDisabled(disabled: boolean): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".btn");
  for (const button of buttons) {
    button.disabled = disabled;
  }
}

async function sendAction(action: ActionType): Promise<void> {
  setButtonsDisabled(true);

  const response = await browser.runtime
    .sendMessage<{ action: ActionType }, ActionResponse>({
      action,
    })
    .catch((error: unknown) => ({
      success: false as const,
      error: error instanceof Error ? error.message : "エラーが発生しました",
    }));

  if (response.success) {
    switch (action) {
      case "CLOSE_SAME_DOMAIN":
      case "CLOSE_SAME_SUBDOMAIN":
      case "CLOSE_SAME_SUBDIRECTORY":
        showStatus(`${String(response.closedCount ?? 0)}個のタブを閉じました`);
        break;
      case "GROUP_BY_DOMAIN":
        showStatus("タブをグループ化しました");
        break;
    }
  } else {
    showStatus(response.error ?? "エラーが発生しました", true);
  }

  setButtonsDisabled(false);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-domain")?.addEventListener("click", () => {
    void sendAction("CLOSE_SAME_DOMAIN");
  });

  document.getElementById("close-subdomain")?.addEventListener("click", () => {
    void sendAction("CLOSE_SAME_SUBDOMAIN");
  });

  document.getElementById("close-subdirectory")?.addEventListener("click", () => {
    void sendAction("CLOSE_SAME_SUBDIRECTORY");
  });

  document.getElementById("group-domain")?.addEventListener("click", () => {
    void sendAction("GROUP_BY_DOMAIN");
  });
});
