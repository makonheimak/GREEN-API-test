import { GreenAPI } from "./api.js";

const api = new GreenAPI();

// ===== DOM =====
const idInput = document.getElementById("idInstance");
const tokenInput = document.getElementById("apiToken");

const getSettingsBtn = document.getElementById("getSettingsBtn");
const getStateBtn = document.getElementById("getStateBtn");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const sendFileBtn = document.getElementById("sendFileBtn");

const output = document.getElementById("response");

const chatIdInput = document.getElementById("chatId");
const messageInput = document.getElementById("message");
const fileUrlInput = document.getElementById("fileUrl");

// ===== helpers =====

function setCredentials() {
    const id = idInput.value.trim();
    const token = tokenInput.value.trim();

    if (!id || !token) {
        throw new Error("Введите idInstance и ApiTokenInstance");
    }

    api.setCredentials(id, token);
}

function setLoading(isLoading) {
    const buttons = [
        getSettingsBtn,
        getStateBtn,
        sendMessageBtn,
        sendFileBtn,
    ];

    buttons.forEach(btn => btn.disabled = isLoading);
}

function printResult(data) {
    output.value = JSON.stringify(data, null, 2);
}

function printError(err) {
    if (err?.response) {
        output.value = JSON.stringify(err.response, null, 2);
    } else {
        output.value = `ERROR:\n${err.message}`;
    }
}

// универсальный wrapper
async function handleRequest(fn) {
    try {
        setLoading(true);
        const result = await fn();
        printResult(result);
    } catch (err) {
        printError(err);
    } finally {
        setLoading(false);
    }
}

// ===== handlers =====

getSettingsBtn.addEventListener("click", () => {
    handleRequest(async () => {
        setCredentials();
        return await api.getSettings();
    });
});

getStateBtn.addEventListener("click", () => {
    handleRequest(async () => {
        setCredentials();
        return await api.getStateInstance();
    });
});

sendMessageBtn.addEventListener("click", () => {
    handleRequest(async () => {
        setCredentials();

        const chatId = chatIdInput.value.trim();
        const message = messageInput.value.trim();

        return await api.sendMessage(chatId, message);
    });
});

sendFileBtn.addEventListener("click", () => {
    handleRequest(async () => {
        setCredentials();

        const chatId = chatIdInput.value.trim();
        const fileUrl = fileUrlInput.value.trim();

        return await api.sendFileByUrl(chatId, fileUrl);
    });
});