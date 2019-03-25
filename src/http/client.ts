import {EventEmitter} from 'eventemitter3';
import {FetchClient} from './fetch';

/**
 * Sends messages by SMS to a [Free Mobile](http://mobile.free.fr) account.
 */
export abstract class BaseClient extends EventEmitter<string> {

  /**
   * An event that is triggered when a request is made to the remote service.
   * @event request
   */
  static readonly eventRequest: string = 'request';

  /**
   * An event that is triggered when a response is received from the remote service.
   * @event response
   */
  static readonly eventResponse: string = 'response';

  /**
   * The URL of the API end point.
   */
  endPoint: URL = new URL('https://smsapi.free-mobile.fr');

  /**
   * Creates a new client.
   * @param username The user name associated to the account.
   * @param password The identification key associated to the account.
   * @param _http The `fetch` client used to query the remote service.
   * @throws {TypeError} The account credentials are invalid.
   */
  protected constructor(public username: string, public password: string, private _http: FetchClient) {
    super();
    if (!this.password.length || !this.username.length) throw new TypeError('The account credentials are invalid.');
  }

  /**
   * Sends a SMS message to the underlying account.
   * @param text The text of the message to send.
   * @return Completes when the operation is done.
   */
  async sendMessage(text: string): Promise<void> {
    const message = text.trim();
    if (!message.length) throw new TypeError('The specified message is empty.');

    const url = new URL('sendmsg', this.endPoint);
    url.searchParams.set('msg', message.substring(0, 160));
    url.searchParams.set('pass', this.password);
    url.searchParams.set('user', this.username);

    const req = this._http.newRequest(url);
    this.emit(BaseClient.eventRequest, req);

    let res: Response;
    try { res = await this._http.fetch(req); }
    catch (err) { throw new ClientError(err.message, url); }

    this.emit(BaseClient.eventResponse, req, res);
    if (!res.ok) throw new ClientError('An error occurred while querying the end point.', url);
  }
}

/**
 * An exception caused by an error in a `Client` request.
 */
export class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param message A message describing the error.
   * @param uri The URL of the HTTP request or response that failed.
   */
  constructor(message: string = '', readonly uri: URL | null = null) {
    super(message);
    this.name = 'ClientError';
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  toString(): string {
    let values = `"${this.message}"`;
    if (this.uri) values = `${values}, uri: "${this.uri.href}"`;
    return `${this.name}(${values})`;
  }
}