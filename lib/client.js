import { EventEmitter } from "events";
import fetch from "node-fetch";
/** An exception caused by an error in a [[Client]] request. */
export class ClientError extends Error {
    /**
     * Creates a new client error.
     * @param message A message describing the error.
     * @param uri The URL of the HTTP request or response that failed.
     */
    constructor(message = "", uri) {
        super(message);
        this.uri = uri;
        this.name = "ClientError";
    }
}
/** Sends messages by SMS to a [FreeMobile](https://mobile.free.fr) account. */
let Client = /** @class */ (() => {
    class Client extends EventEmitter {
        /**
         * Creates a new client.
         * @param username The user name associated to the account.
         * @param password The identification key associated to the account.
         * @param endPoint The URL of the API end point.
         * @throws `TypeError` The account credentials are invalid.
         */
        constructor(username, password, endPoint = new URL("https://smsapi.free-mobile.fr/")) {
            super();
            this.username = username;
            this.password = password;
            this.endPoint = endPoint;
            if (!this.password.length || !this.username.length)
                throw new TypeError("The account credentials are invalid.");
        }
        /**
         * Sends a SMS message to the underlying account.
         * @param text The text of the message to send.
         * @return Completes when the operation is done.
         * @throws [[ClientError]] An error occurred while fetching the server response.
         * @throws `TypeError` The specified message is empty.
         */
        async sendMessage(text) {
            const message = text.trim();
            if (!message.length)
                throw new TypeError("The specified message is empty.");
            const url = new URL("sendmsg", this.endPoint);
            url.searchParams.set("msg", message.slice(0, 160));
            url.searchParams.set("pass", this.password);
            url.searchParams.set("user", this.username);
            // @ts-expect-error: `fetch` has wrong typings.
            const request = new fetch.Request(url.href);
            this.emit(Client.eventRequest, request);
            let response;
            try {
                response = await fetch(request);
            }
            catch (err) {
                throw new ClientError(err.message, url);
            }
            this.emit(Client.eventResponse, response, request);
            if (!response.ok)
                throw new ClientError("An error occurred while querying the end point.", url);
        }
    }
    /**
     * An event that is triggered when a request is made to the remote service.
     * @event request
     */
    Client.eventRequest = "request";
    /**
     * An event that is triggered when a response is received from the remote service.
     * @event response
     */
    Client.eventResponse = "response";
    return Client;
})();
export { Client };
