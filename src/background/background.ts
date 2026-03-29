// src/background/background.ts
// Handles redirect logic, state, and messaging for Messenger Focus

const FOCUS_KEY = 'messenger_focus_enabled';
const BANNER_KEY = 'messenger_banner_enabled';
const REDIRECT_TARGET = 'https://www.facebook.com/messages';

// Initialize default state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get([FOCUS_KEY, BANNER_KEY], (result) => {
    if (typeof result[FOCUS_KEY] !== 'boolean') {
      chrome.storage.local.set({ [FOCUS_KEY]: true });
    }
    if (typeof result[BANNER_KEY] !== 'boolean') {
      chrome.storage.local.set({ [BANNER_KEY]: true });
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
function shouldRedirect(url: string): boolean {
  try {
    const parsed = new URL(url);
    const isFacebook = parsed.hostname.endsWith('facebook.com') || parsed.hostname.endsWith('fb.com');
    const isMessenger = parsed.pathname.startsWith('/messages') || parsed.pathname.startsWith('/messenger_media');
    const isGroupCall = parsed.pathname.startsWith('/groupcall');
    return isFacebook && !isMessenger && !isGroupCall;
  } catch {
    return false;
  }
}

async function performRedirect(tabId: number, url: string) {
  const focusEnabled = await getState(FOCUS_KEY, true);
  if (focusEnabled && shouldRedirect(url)) {
    chrome.tabs.update(tabId, { url: REDIRECT_TARGET }).catch(() => {});
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
}, { url: [{ hostSuffix: 'facebook.com' }, { hostSuffix: 'fb.com' }] });

// Facebook is an SPA; route changes often happen via History API.
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId === 0) {
    performRedirect(details.tabId, details.url).catch(() => {});
  }
}, { url: [{ hostSuffix: 'facebook.com' }, { hostSuffix: 'fb.com' }] });

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
});
