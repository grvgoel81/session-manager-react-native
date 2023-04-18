import type { SessionRequestBody, StoreApiResponse } from "./model";

export abstract class SessionManagerApi {
    static baseUrl = "https://broadcast-server.tor.us";

    static async createSession(sessionRequestBody: SessionRequestBody): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/store/set`, {
            method: 'POST',
            body: JSON.stringify({
                sessionRequestBody
            })
        });

        return await response.json();
    }

    static async authorizeSession(key: String): Promise<StoreApiResponse> {
        const response = await fetch(`${this.baseUrl}/store/get?key=` + key, {
            method: 'GET'
        });

        return await response.json();
    }

    static async invalidateSession(sessionRequestBody: SessionRequestBody): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/store/set`, {
            method: 'POST',
            body: JSON.stringify({
                sessionRequestBody
            })
        });

        return await response.json();
    }
}