// src/popup/popup.ts
// Handles popup UI logic for Messenger Focus

interface ToggleConfig {
  id: string;
  getType: string;
  setType: string;
  changeType: string;
}

const TOGGLES: ToggleConfig[] = [
  { id: 'toggle-focus', getType: 'GET_FOCUS_STATE', setType: 'SET_FOCUS_STATE', changeType: 'FOCUS_STATE_CHANGED' },
  { id: 'toggle-banner', getType: 'GET_BANNER_STATE', setType: 'SET_BANNER_STATE', changeType: 'BANNER_STATE_CHANGED' },
  { id: 'toggle-instagram-focus', getType: 'GET_INSTAGRAM_FOCUS_STATE', setType: 'SET_INSTAGRAM_FOCUS_STATE', changeType: 'INSTAGRAM_FOCUS_STATE_CHANGED' },
  { id: 'toggle-instagram-sidebar', getType: 'GET_INSTAGRAM_SIDEBAR_STATE', setType: 'SET_INSTAGRAM_SIDEBAR_STATE', changeType: 'INSTAGRAM_SIDEBAR_STATE_CHANGED' },
];

const toggleElements = new Map<string, HTMLInputElement>();
let toggleAllCheckbox: HTMLInputElement | null = null;
let isUpdatingAll = false;

function sendMessage<T = any>(msg: any): Promise<T> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(msg, (resp) => {
        if (chrome.runtime.lastError) {
          console.warn('Message error:', chrome.runtime.lastError.message);
          resolve({} as T);
        } else {
          resolve(resp);
        }
      });
    } catch (error) {
      console.warn('Send message error:', error);
      resolve({} as T);
    }
  });
}

function sendToActiveTab(msg: any) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, msg).catch(() => {});
      }
    });
  } catch (error) {
    console.warn('Send to active tab error:', error);
  }
}

async function updateAllCheckbox() {
  const allToggled = TOGGLES.every((config) => {
    const elem = toggleElements.get(config.id);
    return elem?.checked === true;
  });
  
  const noneToggled = TOGGLES.every((config) => {
    const elem = toggleElements.get(config.id);
    return elem?.checked === false;
  });

  if (toggleAllCheckbox) {
    toggleAllCheckbox.checked = allToggled;
    toggleAllCheckbox.indeterminate = !allToggled && !noneToggled;
  }
}

async function syncUI() {
  for (const config of TOGGLES) {
    try {
      const resp = await sendMessage<{ enabled: boolean }>({ type: config.getType });
      const elem = toggleElements.get(config.id);
      if (elem) {
        elem.checked = typeof resp?.enabled === 'boolean' ? resp.enabled : true;
      }
    } catch (error) {
      console.warn(`Error syncing ${config.id}:`, error);
    }
  }
  
  await updateAllCheckbox();
}

function initialize() {
  // Setup "All Features" toggle
  toggleAllCheckbox = document.getElementById('toggle-all') as HTMLInputElement | null;
  if (toggleAllCheckbox) {
    toggleAllCheckbox.addEventListener('change', async () => {
      isUpdatingAll = true;
      const shouldEnable = toggleAllCheckbox!.checked;

      for (const config of TOGGLES) {
        const elem = toggleElements.get(config.id);
        if (elem) {
          elem.checked = shouldEnable;
          await sendMessage({ type: config.setType, enabled: shouldEnable });
          sendToActiveTab({ type: config.changeType, enabled: shouldEnable });
        }
      }

      isUpdatingAll = false;
      await updateAllCheckbox();
    });
  }

  // Query DOM elements
  TOGGLES.forEach((config) => {
    const elem = document.getElementById(config.id) as HTMLInputElement | null;
    if (elem) {
      toggleElements.set(config.id, elem);
      elem.addEventListener('change', async () => {
        if (!isUpdatingAll) {
          await sendMessage({ type: config.setType, enabled: elem.checked });
          sendToActiveTab({ type: config.changeType, enabled: elem.checked });
          await updateAllCheckbox();
        }
      });
    }
  });

  // Listen for state changes from other sources
  chrome.runtime.onMessage.addListener((msg: { type?: string; enabled?: boolean }) => {
    const config = TOGGLES.find((c) => c.changeType === msg.type);
    if (config && typeof msg.enabled === 'boolean') {
      const elem = toggleElements.get(config.id);
      if (elem) {
        elem.checked = msg.enabled;
        updateAllCheckbox();
      }
    }
  });

  syncUI();
}

document.addEventListener('DOMContentLoaded', initialize);
