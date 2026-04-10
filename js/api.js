export class GreenAPI {
    constructor() {
        this.idInstance = "";
        this.apiToken = "";
        this.baseUrl = "https://api.green-api.com";
    }

    setCredentials(idInstance, apiToken) {
        this.idInstance = idInstance;
        this.apiToken = apiToken;
    }

    buildUrl(method) {
        if (!this.idInstance || !this.apiToken) {
            throw new Error("idInstance and apiToken are required");
        }

        return `${this.baseUrl}/waInstance${this.idInstance}/${method}/${this.apiToken}`;
    }

    async request(method, endpoint, body = null) {
        const url = this.buildUrl(endpoint);

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        let response;

        try {
            response = await fetch(url, options);
        } catch (e) {
            throw new Error("Network error: " + e.message);
        }

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Invalid JSON response");
        }

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error ${response.status}`);
        }

        return data;
    }

    // ===== API METHODS =====

    getSettings() {
        return this.request("GET", "getSettings");
    }

    getStateInstance() {
        return this.request("GET", "getStateInstance");
    }

    sendMessage(chatId, message) {
        if (!chatId || !message) {
            throw new Error("chatId and message are required");
        }

        return this.request("POST", "sendMessage", {
            chatId,
            message,
        });
    }

    sendFileByUrl(chatId, urlFile) {
        if (!chatId || !urlFile) {
            throw new Error("chatId and urlFile are required");
        }

        return this.request("POST", "sendFileByUrl", {
            chatId,
            urlFile,
            fileName: "file",
        });
    }
}