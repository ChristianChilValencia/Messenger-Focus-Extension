// src/redirect/redirect.ts
// Handles redirect logic, state, and messaging for Messenger Focus

const FOCUS_KEY = 'messenger_focus_enabled';
const BANNER_KEY = 'messenger_banner_enabled';
const INSTAGRAM_FOCUS_KEY = 'instagram_focus_enabled';
const INSTAGRAM_SIDEBAR_KEY = 'instagram_sidebar_enabled';
const FACEBOOK_REDIRECT_TARGET = 'https://www.facebook.com/messages';
const INSTAGRAM_REDIRECT_TARGET = 'https://www.instagram.com/direct/';
const STORAGE_KEYS = [FOCUS_KEY, BANNER_KEY, INSTAGRAM_FOCUS_KEY, INSTAGRAM_SIDEBAR_KEY];

// Initialize default state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(STORAGE_KEYS, (result) => {
    STORAGE_KEYS.forEach((key) => {
      if (typeof result[key] !== 'boolean') {
        chrome.storage.local.set({ [key]: true });
      }
    });
  });
});

function getState(key: string, defaultValue: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(typeof result[key] === 'boolean' ? result[key] : defaultValue);
    });
  });
}

function setState(key: string, value: boolean): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => resolve());
  });
}

function suppress(promise: Promise<any>) {
  return promise.catch(() => {});
}

function broadcast(type: string, enabled: boolean) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        suppress(chrome.tabs.sendMessage(tab.id, { type, enabled }));
      }
    });
  });
}

// Redirect logic
function shouldRedirectFacebook(url: URL): boolean {
  const isFacebook = url.hostname.endsWith('facebook.com') || url.hostname.endsWith('fb.com');
  const isMessenger = url.pathname.startsWith('/messages') || url.pathname.startsWith('/messenger_media');
  const isGroupCall = url.pathname.startsWith('/groupcall');
  return isFacebook && !isMessenger && !isGroupCall;
}

function shouldRedirectInstagram(url: URL): boolean {
  const isInstagram = url.hostname === 'instagram.com' || url.hostname === 'www.instagram.com';
  const path = url.pathname.toLowerCase();
  const isDirect = path.startsWith('/direct');
  const isCall = path === '/call' || path.startsWith('/call/');
  const isPost = path.startsWith('/p/');
  return isInstagram && !isDirect && !isCall && !isPost;
}

async function performRedirect(tabId: number, url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }

  if (shouldRedirectFacebook(parsed)) {
    const focusEnabled = await getState(FOCUS_KEY, true);
    if (focusEnabled) {
      suppress(chrome.tabs.update(tabId, { url: FACEBOOK_REDIRECT_TARGET }));
    }
    return;
  }

  if (shouldRedirectInstagram(parsed)) {
    const instagramFocusEnabled = await getState(INSTAGRAM_FOCUS_KEY, true);
    if (instagramFocusEnabled) {
      suppress(chrome.tabs.update(tabId, { url: INSTAGRAM_REDIRECT_TARGET }));
    }
  }
}

function redirectEligibleTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id && tab.url) {
        suppress(performRedirect(tab.id, tab.url));
      }
    });
  });
}

const navigationFilters = { url: [{ hostSuffix: 'facebook.com' }, { hostSuffix: 'fb.com' }, { hostSuffix: 'instagram.com' }] };

const handleNavigation = (details: any) => {
  if (details.frameId === 0) {
    suppress(performRedirect(details.tabId, details.url));
  }
};

// Facebook and Instagram are SPAs; route changes often happen via History API.
chrome.webNavigation.onBeforeNavigate.addListener(handleNavigation, navigationFilters);
chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigation, navigationFilters);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    suppress(performRedirect(tabId, tab.url));
  }
});

// Message handling
const messageHandlers: Record<string, (msg: any, sendResponse: Function) => void> = {
  GET_FOCUS_STATE: (msg, sendResponse) => getState(FOCUS_KEY, true).then((enabled) => sendResponse({ enabled })),
  SET_FOCUS_STATE: (msg, sendResponse) => setState(FOCUS_KEY, msg.enabled).then(() => {
    broadcast('FOCUS_STATE_CHANGED', msg.enabled);
    if (msg.enabled) redirectEligibleTabs();
    sendResponse({ enabled: msg.enabled });
  }),
  GET_BANNER_STATE: (msg, sendResponse) => getState(BANNER_KEY, true).then((enabled) => sendResponse({ enabled })),
  SET_BANNER_STATE: (msg, sendResponse) => setState(BANNER_KEY, msg.enabled).then(() => {
    broadcast('BANNER_STATE_CHANGED', msg.enabled);
    sendResponse({ enabled: msg.enabled });
  }),
  GET_INSTAGRAM_FOCUS_STATE: (msg, sendResponse) => getState(INSTAGRAM_FOCUS_KEY, true).then((enabled) => sendResponse({ enabled })),
  SET_INSTAGRAM_FOCUS_STATE: (msg, sendResponse) => setState(INSTAGRAM_FOCUS_KEY, msg.enabled).then(() => {
    broadcast('INSTAGRAM_FOCUS_STATE_CHANGED', msg.enabled);
    if (msg.enabled) redirectEligibleTabs();
    sendResponse({ enabled: msg.enabled });
  }),
  GET_INSTAGRAM_SIDEBAR_STATE: (msg, sendResponse) => getState(INSTAGRAM_SIDEBAR_KEY, true).then((enabled) => sendResponse({ enabled })),
  SET_INSTAGRAM_SIDEBAR_STATE: (msg, sendResponse) => setState(INSTAGRAM_SIDEBAR_KEY, msg.enabled).then(() => {
    broadcast('INSTAGRAM_SIDEBAR_STATE_CHANGED', msg.enabled);
    sendResponse({ enabled: msg.enabled });
  }),
};

chrome.runtime.onMessage.addListener((msg: any, _sender, sendResponse) => {
  const handler = messageHandlers[msg.type];
  if (handler) {
    handler(msg, sendResponse);
    return true;
  }
});
