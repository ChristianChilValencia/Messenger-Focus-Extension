// src/background/background.ts
// Handles redirect logic, state, and messaging for Messenger Focus

const FOCUS_KEY = 'messenger_focus_enabled';
const BANNER_KEY = 'messenger_banner_enabled';
const INSTAGRAM_FOCUS_KEY = 'instagram_focus_enabled';
const INSTAGRAM_SIDEBAR_KEY = 'instagram_sidebar_enabled';
const FACEBOOK_REDIRECT_TARGET = 'https://www.facebook.com/messages';
const INSTAGRAM_REDIRECT_TARGET = 'https://www.instagram.com/direct/';

// Initialize default state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get([FOCUS_KEY, BANNER_KEY, INSTAGRAM_FOCUS_KEY, INSTAGRAM_SIDEBAR_KEY], (result) => {
    if (typeof result[FOCUS_KEY] !== 'boolean') {
      chrome.storage.local.set({ [FOCUS_KEY]: true });
    }
    if (typeof result[BANNER_KEY] !== 'boolean') {
      chrome.storage.local.set({ [BANNER_KEY]: true });
    }
    if (typeof result[INSTAGRAM_FOCUS_KEY] !== 'boolean') {
      chrome.storage.local.set({ [INSTAGRAM_FOCUS_KEY]: true });
    }
    if (typeof result[INSTAGRAM_SIDEBAR_KEY] !== 'boolean') {
      chrome.storage.local.set({ [INSTAGRAM_SIDEBAR_KEY]: true });
    }
  });
});

function getState(key: string, defaultValue: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      if (typeof result[key] === 'boolean') {
        resolve(result[key]);
      } else {
        resolve(defaultValue);
      }
    });
  });
}

function setState(key: string, value: boolean): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => resolve());
  });
}

function broadcast(type: string, enabled: boolean) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { type, enabled }).catch(() => {});
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

function parseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

async function performRedirect(tabId: number, url: string) {
  const parsed = parseUrl(url);
  if (!parsed) {
    return;
  }

  if (shouldRedirectFacebook(parsed)) {
    const focusEnabled = await getState(FOCUS_KEY, true);
    if (focusEnabled) {
      chrome.tabs.update(tabId, { url: FACEBOOK_REDIRECT_TARGET }).catch(() => {});
    }
    return;
  }

  if (shouldRedirectInstagram(parsed)) {
    const instagramFocusEnabled = await getState(INSTAGRAM_FOCUS_KEY, true);
    if (instagramFocusEnabled) {
      chrome.tabs.update(tabId, { url: INSTAGRAM_REDIRECT_TARGET }).catch(() => {});
    }
  }
}

function redirectEligibleTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id && tab.url) {
        performRedirect(tab.id, tab.url).catch(() => {});
      }
    });
  });
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    performRedirect(details.tabId, details.url).catch(() => {});
  }
}, { url: [{ hostSuffix: 'facebook.com' }, { hostSuffix: 'fb.com' }, { hostSuffix: 'instagram.com' }] });

// Facebook and Instagram are SPAs; route changes often happen via History API.
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId === 0) {
    performRedirect(details.tabId, details.url).catch(() => {});
  }
}, { url: [{ hostSuffix: 'facebook.com' }, { hostSuffix: 'fb.com' }, { hostSuffix: 'instagram.com' }] });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    performRedirect(tabId, tab.url).catch(() => {});
  }
});

// Message handling
chrome.runtime.onMessage.addListener((msg: any, _sender, sendResponse) => {
  if (msg.type === 'GET_FOCUS_STATE') {
    getState(FOCUS_KEY, true).then((enabled) => sendResponse({ enabled }));
    return true;
  }

  if (msg.type === 'TOGGLE_FOCUS') {
    getState(FOCUS_KEY, true).then((current) => {
      const next = !current;
      setState(FOCUS_KEY, next).then(() => {
        broadcast('FOCUS_STATE_CHANGED', next);
        if (next) {
          redirectEligibleTabs();
        }
        sendResponse({ enabled: next });
      });
    });
    return true;
  }

  if (msg.type === 'SET_FOCUS_STATE') {
    setState(FOCUS_KEY, msg.enabled).then(() => {
      broadcast('FOCUS_STATE_CHANGED', msg.enabled);
      if (msg.enabled) {
        redirectEligibleTabs();
      }
      sendResponse({ enabled: msg.enabled });
    });
    return true;
  }

  if (msg.type === 'GET_BANNER_STATE') {
    getState(BANNER_KEY, true).then((enabled) => sendResponse({ enabled }));
    return true;
  }

  if (msg.type === 'TOGGLE_BANNER') {
    getState(BANNER_KEY, true).then((current) => {
      const next = !current;
      setState(BANNER_KEY, next).then(() => {
        broadcast('BANNER_STATE_CHANGED', next);
        sendResponse({ enabled: next });
      });
    });
    return true;
  }

  if (msg.type === 'SET_BANNER_STATE') {
    setState(BANNER_KEY, msg.enabled).then(() => {
      broadcast('BANNER_STATE_CHANGED', msg.enabled);
      sendResponse({ enabled: msg.enabled });
    });
    return true;
  }

  if (msg.type === 'GET_INSTAGRAM_FOCUS_STATE') {
    getState(INSTAGRAM_FOCUS_KEY, true).then((enabled) => sendResponse({ enabled }));
    return true;
  }

  if (msg.type === 'SET_INSTAGRAM_FOCUS_STATE') {
    setState(INSTAGRAM_FOCUS_KEY, msg.enabled).then(() => {
      broadcast('INSTAGRAM_FOCUS_STATE_CHANGED', msg.enabled);
      if (msg.enabled) {
        redirectEligibleTabs();
      }
      sendResponse({ enabled: msg.enabled });
    });
    return true;
  }

  if (msg.type === 'GET_INSTAGRAM_SIDEBAR_STATE') {
    getState(INSTAGRAM_SIDEBAR_KEY, true).then((enabled) => sendResponse({ enabled }));
    return true;
  }

  if (msg.type === 'SET_INSTAGRAM_SIDEBAR_STATE') {
    setState(INSTAGRAM_SIDEBAR_KEY, msg.enabled).then(() => {
      broadcast('INSTAGRAM_SIDEBAR_STATE_CHANGED', msg.enabled);
      sendResponse({ enabled: msg.enabled });
    });
    return true;
  }
});
