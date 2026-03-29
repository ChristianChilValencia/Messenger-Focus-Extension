// src/popup/popup.ts
// Handles popup UI logic for Messenger Focus

let focusToggle: HTMLInputElement | null;
let bannerToggle: HTMLInputElement | null;
let statusEl: HTMLDivElement | null;

function sendMessage<T = any>(msg: any): Promise<T> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (resp) => resolve(resp));
  });
}

function updateStatus(focus: boolean, banner: boolean) {
  if (statusEl) {
    statusEl.textContent = `Redirect: ${focus ? 'ON' : 'OFF'} | Banner: ${banner ? 'ON' : 'OFF'}`;
  }
}

async function syncUI() {
  const focusResp = await sendMessage<{ enabled: boolean }>({ type: 'GET_FOCUS_STATE' });
  const bannerResp = await sendMessage<{ enabled: boolean }>({ type: 'GET_BANNER_STATE' });
  const focusEnabled = typeof focusResp?.enabled === 'boolean' ? focusResp.enabled : true;
  const bannerEnabled = typeof bannerResp?.enabled === 'boolean' ? bannerResp.enabled : true;
  if (focusToggle) focusToggle.checked = focusEnabled;
  if (bannerToggle) bannerToggle.checked = bannerEnabled;
  updateStatus(focusEnabled, bannerEnabled);
}

function initialize() {
  // Query DOM elements after DOM is ready
  focusToggle = document.getElementById('toggle-focus') as HTMLInputElement | null;
  bannerToggle = document.getElementById('toggle-banner') as HTMLInputElement | null;
  statusEl = document.getElementById('focus-status') as HTMLDivElement | null;

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

  chrome.runtime.onMessage.addListener((msg: { type?: string; enabled?: boolean }) => {
    if (!focusToggle || !bannerToggle) {
      return;
    }

    if (msg.type === 'FOCUS_STATE_CHANGED' && typeof msg.enabled === 'boolean') {
      focusToggle.checked = msg.enabled;
      updateStatus(focusToggle.checked, bannerToggle.checked);
    }

    if (msg.type === 'BANNER_STATE_CHANGED' && typeof msg.enabled === 'boolean') {
      bannerToggle.checked = msg.enabled;
      updateStatus(focusToggle.checked, bannerToggle.checked);
    }
  });

  syncUI();
}

document.addEventListener('DOMContentLoaded', initialize);
