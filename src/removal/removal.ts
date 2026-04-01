// src/removal/removal.ts
// Handles UI cleanup and banner removal for Messenger Focus

const FACEBOOK_BANNER_STYLE_ID = 'messenger-focus-hide-banner-style';
const INSTAGRAM_SIDEBAR_STYLE_ID = 'messenger-focus-hide-instagram-sidebar-style';
const INSTAGRAM_SIDEBAR_CLASS = 'messenger-focus-hide-instagram-sidebar';

const stateMap = new Map<string, boolean>([
  ['facebook-banner', true],
  ['instagram-sidebar', true],
]);

function isFacebookHost(): boolean {
  return location.hostname.endsWith('facebook.com') || location.hostname.endsWith('fb.com');
}

function isInstagramHost(): boolean {
  return location.hostname === 'instagram.com' || location.hostname.endsWith('.instagram.com');
}

function ensureStyle(styleId: string, css: string) {
  const existing = document.getElementById(styleId) as HTMLStyleElement | null;
  if (existing) {
    existing.textContent = css;
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = css;
  (document.head || document.documentElement).appendChild(styleEl);
}

function removeStyle(styleId: string) {
  document.getElementById(styleId)?.remove();
}

function applyFacebookBannerState() {
  if (!isFacebookHost()) {
    removeStyle(FACEBOOK_BANNER_STYLE_ID);
    return;
  }

  if (stateMap.get('facebook-banner')) {
    ensureStyle(FACEBOOK_BANNER_STYLE_ID, 'div[role="banner"] { display: none !important; }');
  } else {
    removeStyle(FACEBOOK_BANNER_STYLE_ID);
  }
}

function applyInstagramSidebarState() {
  if (!isInstagramHost()) {
    document.documentElement.classList.remove(INSTAGRAM_SIDEBAR_CLASS);
    removeStyle(INSTAGRAM_SIDEBAR_STYLE_ID);
    return;
  }

  if (stateMap.get('instagram-sidebar')) {
    document.documentElement.classList.add(INSTAGRAM_SIDEBAR_CLASS);
    ensureStyle(
      INSTAGRAM_SIDEBAR_STYLE_ID,
      [
        `html.${INSTAGRAM_SIDEBAR_CLASS} nav[aria-label="Primary"] { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} nav[aria-label="Primary navigation"] { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} nav:has(a[href="/explore/"]) { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} nav:has(a[href="/reels/"]) { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} nav:has(a[href="/accounts/activity/"]) { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} div[role="navigation"]:has(a[href="/explore/"]) { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} div[role="navigation"]:has(a[href="/reels/"]) { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} div[role="navigation"]:has(a[href="/accounts/activity/"]) { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} .x78zum5.x1q0g3np.x1gvbg2u.x1o0tod.x1qughib.x10l6tqk.x13vifvy.x1vjfegm.xleuxlb.xxfw5ft.x1mh60rb.x1f91t4q { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} .xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x9f619.xjbqb8w.x78zum5.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.xixxii4.x1ey2m1c.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.xg7h5cd.xh8yej3.xhtitgo.x6w1myc.x1jeouym { display: none !important; }`,
        `html.${INSTAGRAM_SIDEBAR_CLASS} main[role="main"] { margin-left: 0 !important; max-width: 100% !important; }`
      ].join('\n')
    );
  } else {
    document.documentElement.classList.remove(INSTAGRAM_SIDEBAR_CLASS);
    removeStyle(INSTAGRAM_SIDEBAR_STYLE_ID);
  }
}

function applyAllStates() {
  applyFacebookBannerState();
  applyInstagramSidebarState();
}

// Apply defaults quickly, then sync from persisted values
applyAllStates();

// Read persisted state from background and sync UI
chrome.runtime.sendMessage({ type: 'GET_BANNER_STATE' }, (resp: { enabled?: boolean } | undefined) => {
  if (typeof resp?.enabled === 'boolean') {
    stateMap.set('facebook-banner', resp.enabled);
    applyFacebookBannerState();
  }
});

chrome.runtime.sendMessage({ type: 'GET_INSTAGRAM_SIDEBAR_STATE' }, (resp: { enabled?: boolean } | undefined) => {
  if (typeof resp?.enabled === 'boolean') {
    stateMap.set('instagram-sidebar', resp.enabled);
    applyInstagramSidebarState();
  }
});

// Listen for state changes
chrome.runtime.onMessage.addListener((msg: any) => {
  if (typeof msg?.enabled !== 'boolean') return;

  if (msg.type === 'BANNER_STATE_CHANGED') {
    stateMap.set('facebook-banner', msg.enabled);
    applyFacebookBannerState();
  } else if (msg.type === 'INSTAGRAM_SIDEBAR_STATE_CHANGED') {
    stateMap.set('instagram-sidebar', msg.enabled);
    applyInstagramSidebarState();
  }
});
