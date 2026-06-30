"use strict";
// src/popup/popup.ts
// Handles popup UI logic for Messenger Focus
const TOGGLES = [
    { id: 'toggle-focus', getType: 'GET_FOCUS_STATE', setType: 'SET_FOCUS_STATE', changeType: 'FOCUS_STATE_CHANGED' },
    { id: 'toggle-banner', getType: 'GET_BANNER_STATE', setType: 'SET_BANNER_STATE', changeType: 'BANNER_STATE_CHANGED' },
    { id: 'toggle-instagram-focus', getType: 'GET_INSTAGRAM_FOCUS_STATE', setType: 'SET_INSTAGRAM_FOCUS_STATE', changeType: 'INSTAGRAM_FOCUS_STATE_CHANGED' },
    { id: 'toggle-instagram-sidebar', getType: 'GET_INSTAGRAM_SIDEBAR_STATE', setType: 'SET_INSTAGRAM_SIDEBAR_STATE', changeType: 'INSTAGRAM_SIDEBAR_STATE_CHANGED' },
];
const toggleElements = new Map();
function sendMessage(msg) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(msg, (resp) => resolve(resp));
    });
}
function sendToActiveTab(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, msg);
        }
    });
}
async function syncUI() {
    for (const config of TOGGLES) {
        const resp = await sendMessage({ type: config.getType });
        const elem = toggleElements.get(config.id);
        if (elem) {
            elem.checked = typeof resp?.enabled === 'boolean' ? resp.enabled : true;
        }
    }
}
function initialize() {
    // Query DOM elements
    TOGGLES.forEach((config) => {
        const elem = document.getElementById(config.id);
        if (elem) {
            toggleElements.set(config.id, elem);
            elem.addEventListener('change', async () => {
                await sendMessage({ type: config.setType, enabled: elem.checked });
                sendToActiveTab({ type: config.changeType, enabled: elem.checked });
                syncUI();
            });
        }
    });
    // Listen for state changes from other sources
    chrome.runtime.onMessage.addListener((msg) => {
        const config = TOGGLES.find((c) => c.changeType === msg.type);
        if (config && typeof msg.enabled === 'boolean') {
            const elem = toggleElements.get(config.id);
            if (elem) {
                elem.checked = msg.enabled;
            }
        }
    });
    syncUI();
}
document.addEventListener('DOMContentLoaded', initialize);
//# sourceMappingURL=popup.js.map