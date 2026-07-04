export const PRELOAD_COMPLETE_EVENT = "nomada:preload-complete";

export function dispatchPreloadComplete() {
  window.dispatchEvent(new CustomEvent(PRELOAD_COMPLETE_EVENT));
}

export function onPreloadComplete(cb: () => void) {
  window.addEventListener(PRELOAD_COMPLETE_EVENT, cb);
  return () => window.removeEventListener(PRELOAD_COMPLETE_EVENT, cb);
}
