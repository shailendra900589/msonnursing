import { PREVIEW_MESSAGE, PREVIEW_STORAGE_KEY } from "./previewConstants.js";

const CHANNEL_NAME = "mson-cms-live";

export function syncPreviewContent(content) {
  if (!content) return;
  try {
    sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(content));
  } catch {
    /* quota */
  }
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: PREVIEW_MESSAGE, content });
    channel.close();
  } catch {
    /* unsupported */
  }
}

export function listenPreviewContent(onContent) {
  const handler = (event) => {
    if (event.data?.type !== PREVIEW_MESSAGE || !event.data.content) return;
    onContent(event.data.content);
  };
  let channel;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = handler;
  } catch {
    channel = null;
  }
  const onWindowMessage = (event) => {
    if (event.origin !== window.location.origin) return;
    handler(event);
  };
  window.addEventListener("message", onWindowMessage);
  return () => {
    channel?.close();
    window.removeEventListener("message", onWindowMessage);
  };
}

export function openFullPreview(path = "/") {
  const url = `${window.location.origin}/preview${path === "/" ? "" : path}`;
  const win = window.open(url, "mson_cms_preview");
  return win;
}
