// src/popup/popup.ts
// Handles popup UI logic for Messenger Focus

let focusToggle: HTMLInputElement | null;
let bannerToggle: HTMLInputElement | null;
let instagramFocusToggle: HTMLInputElement | null;
let instagramSidebarToggle: HTMLInputElement | null;

function sendMessage<T = any>(msg: any): Promise<T> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (resp) => resolve(resp));
  });
}

async function syncUI() {
  const focusResp = await sendMessage<{ enabled: boolean }>({ type: 'GET_FOCUS_STATE' });
  const bannerResp = await sendMessage<{ enabled: boolean }>({ type: 'GET_BANNER_STATE' });
  const instagramFocusResp = await sendMessage<{ enabled: boolean }>({ type: 'GET_INSTAGRAM_FOCUS_STATE' });
  const instagramSidebarResp = await sendMessage<{ enabled: boolean }>({ type: 'GET_INSTAGRAM_SIDEBAR_STATE' });

  const focusEnabled = typeof focusResp?.enabled === 'boolean' ? focusResp.enabled : true;
  const bannerEnabled = typeof bannerResp?.enabled === 'boolean' ? bannerResp.enabled : true;
  const instagramFocusEnabled = typeof instagramFocusResp?.enabled === 'boolean' ? instagramFocusResp.enabled : true;
  const instagramSidebarEnabled = typeof instagramSidebarResp?.enabled === 'boolean' ? instagramSidebarResp.enabled : true;

  if (focusToggle) focusToggle.checked = focusEnabled;
  if (bannerToggle) bannerToggle.checked = bannerEnabled;
  if (instagramFocusToggle) instagramFocusToggle.checked = instagramFocusEnabled;
  if (instagramSidebarToggle) instagramSidebarToggle.checked = instagramSidebarEnabled;
}

function initialize() {
  // Query DOM elements after DOM is ready
  focusToggle = document.getElementById('toggle-focus') as HTMLInputElement | null;
  bannerToggle = document.getElementById('toggle-banner') as HTMLInputElement | null;
  instagramFocusToggle = document.getElementById('toggle-instagram-focus') as HTMLInputElement | null;
  instagramSidebarToggle = document.getElementById('toggle-instagram-sidebar') as HTMLInputElement | null;

  if (focusToggle) {
    focusToggle.addEventListener('change', async () => {
      await sendMessage({ type: 'SET_FOCUS_STATE', enabled: focusToggle!.checked });
      syncUI();
    });
  }
  if (bannerToggle) {
    bannerToggle.addEventListener('change', async () => {
      await sendMessage({ type: 'SET_BANNER_STATE', enabled: bannerToggle!.checked });
      syncUI();
    });
  }

  if (instagramFocusToggle) {
    instagramFocusToggle.addEventListener('change', async () => {
      await sendMessage({ type: 'SET_INSTAGRAM_FOCUS_STATE', enabled: instagramFocusToggle!.checked });
      syncUI();
    });
  }

  if (instagramSidebarToggle) {
    instagramSidebarToggle.addEventListener('change', async () => {
      await sendMessage({ type: 'SET_INSTAGRAM_SIDEBAR_STATE', enabled: instagramSidebarToggle!.checked });
      syncUI();
    });
  }

  chrome.runtime.onMessage.addListener((msg: { type?: string; enabled?: boolean }) => {
    if (!focusToggle || !bannerToggle || !instagramFocusToggle || !instagramSidebarToggle) {
      return;
    }

    if (msg.type === 'FOCUS_STATE_CHANGED' && typeof msg.enabled === 'boolean') {
      focusToggle.checked = msg.enabled;
    }

    if (msg.type === 'BANNER_STATE_CHANGED' && typeof msg.enabled === 'boolean') {
      bannerToggle.checked = msg.enabled;
    }

    if (msg.type === 'INSTAGRAM_FOCUS_STATE_CHANGED' && typeof msg.enabled === 'boolean') {
      instagramFocusToggle.checked = msg.enabled;
    }

    if (msg.type === 'INSTAGRAM_SIDEBAR_STATE_CHANGED' && typeof msg.enabled === 'boolean') {
      instagramSidebarToggle.checked = msg.enabled;
    }
  });

  syncUI();
}

document.addEventListener('DOMContentLoaded', initialize);
