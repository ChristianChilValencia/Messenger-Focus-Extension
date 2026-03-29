// src/content/content.ts
// Handles UI cleanup and banner removal for Messenger Focus

let bannerEnabled = true;
const BANNER_STYLE_ID = 'messenger-focus-hide-banner-style';

function ensureBannerStyle() {
  if (document.getElementById(BANNER_STYLE_ID)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = BANNER_STYLE_ID;
  styleEl.textContent = 'div[role="banner"] { display: none !important; }';
  (document.head || document.documentElement).appendChild(styleEl);
}

function removeBannerStyle() {
  document.getElementById(BANNER_STYLE_ID)?.remove();
}

function applyBannerState() {
  if (bannerEnabled) {
    ensureBannerStyle();
  } else {
    removeBannerStyle();
  }
}

// Apply default quickly, then sync from persisted value.
applyBannerState();

// Read persisted banner state so content behavior matches the popup toggle.
chrome.runtime.sendMessage({ type: 'GET_BANNER_STATE' }, (resp: { enabled?: boolean } | undefined) => {
  if (typeof resp?.enabled === 'boolean') {
    bannerEnabled = resp.enabled;
    applyBannerState();
  }
});

// Listen for banner toggle messages
chrome.runtime.onMessage.addListener((msg: any) => {
  if (msg.type === 'BANNER_STATE_CHANGED') {
    if (typeof msg.enabled === 'boolean') {
      bannerEnabled = msg.enabled;
      applyBannerState();
    }
  }
});
