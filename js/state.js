const state = {
    auth: {
        idInstance: "",
        apiToken: "",
    },

    ui: {
        busy: false,
    },

    app: {
        lastResponse: null,
        lastError: null,
    },
};

// ===== AUTH =====
export function setAuth(idInstance, apiToken) {
    state.auth.idInstance = idInstance;
    state.auth.apiToken = apiToken;
}

export function getAuth() {
    return { ...state.auth };
}

// ===== UI =====
export function setBusy(value) {
    state.ui.busy = value;
}

export function isBusy() {
    return state.ui.busy;
}

// ===== APP DATA =====
export function setResponse(data) {
    state.app.lastResponse = data;
}

export function getResponse() {
    return state.app.lastResponse;
}

export function setError(error) {
    state.app.lastError = error;
}

export function getError() {
    return state.app.lastError;
}

// ===== OPTIONAL DEBUG =====
export function getStateSnapshot() {
    return structuredClone(state);
}