import { GreenAPI } from "./api.js";

// ===== API =====
const api = new GreenAPI();

// ===== STATE =====
const state = {
    busy: false,
};

// ===== DOM =====
const dom = {
    idInstance: document.getElementById("idInstance"),
    apiToken: document.getElementById("apiToken"),

    getSettingsBtn: document.getElementById("getSettingsBtn"),
    getStateBtn: document.getElementById("getStateBtn"),

    chatId: document.getElementById("chatId"),
    message: document.getElementById("message"),
    sendMessageBtn: document.getElementById("sendMessageBtn"),

    fileUrl: document.getElementById("fileUrl"),
    sendFileBtn: document.getElementById("sendFileBtn"),

    output: document.getElementById("response"), // ВАЖНО: textarea
};

// ===== VALIDATION =====
function assertDom() {
    const missing = [];

    for (const [key, el] of Object.entries(dom)) {
        if (!el) missing.push(key);
    }

    if (missing.length) {
        throw new Error("Missing DOM elements: " + missing.join(", "));
    }
}

// ===== CORE =====
function setBusy(value) {
    state.busy = value;

    Object.values(dom).forEach(el => {
        if (el.tagName === "BUTTON") {
            el.disabled = value;
        }
    });
}

function readAuth() {
    const idInstance = dom.idInstance.value.trim();
    const apiToken = dom.apiToken.value.trim();

    if (!idInstance || !apiToken) {
        throw new Error("Не заполнены idInstance или apiToken");
    }

    return { idInstance, apiToken };
}

function render(data) {
    dom.output.value = JSON.stringify(data, null, 2);
}

function renderError(error) {
    render({
        status: "error",
        message: error?.message || String(error),
    });
}

// ===== SAFE WRAPPER =====
async function withUiLock(fn) {
    if (state.busy) return;

    setBusy(true);

    try {
        const result = await fn();
        render(result);
    } catch (err) {
        renderError(err);
    } finally {
        setBusy(false);
    }
}

// ===== ACTIONS =====
async function handleGetSettings() {
    const { idInstance, apiToken } = readAuth();
    return await api.getSettings(idInstance, apiToken);
}

async function handleGetState() {
    const { idInstance, apiToken } = readAuth();
    return await api.getStateInstance(idInstance, apiToken);
}

async function handleSendMessage() {
    const { idInstance, apiToken } = readAuth();

    const chatId = dom.chatId.value.trim();
    const message = dom.message.value.trim();

    if (!chatId || !message) {
        throw new Error("Не заполнены chatId или message");
    }

    return await api.sendMessage(idInstance, apiToken, chatId, message);
}

async function handleSendFile() {
    const { idInstance, apiToken } = readAuth();

    const chatId = dom.chatId.value.trim();
    const fileUrl = dom.fileUrl.value.trim();

    if (!chatId || !fileUrl) {
        throw new Error("Не заполнены chatId или fileUrl");
    }

    return await api.sendFileByUrl(idInstance, apiToken, chatId, fileUrl);
}

// ===== EVENTS =====
function bindEvents() {
    dom.getSettingsBtn.addEventListener("click", () => {
        withUiLock(handleGetSettings);
    });

    dom.getStateBtn.addEventListener("click", () => {
        withUiLock(handleGetState);
    });

    dom.sendMessageBtn.addEventListener("click", () => {
        withUiLock(handleSendMessage);
    });

    dom.sendFileBtn.addEventListener("click", () => {
        withUiLock(handleSendFile);
    });
}

// ===== INIT =====
function init() {
    assertDom();
    bindEvents();
    render({ status: "ready" });
}

init();