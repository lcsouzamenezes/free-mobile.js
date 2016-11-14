import {Observable} from 'rxjs';
import superagent from 'superagent';

/**
 * Sends messages by SMS to a [Free Mobile](http://mobile.free.fr) account.
 */
export class Client {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {

    /**
     * The identification key associated to the account.
     * @type {string}
     */
    this.password = typeof options.password == 'string' ? options.password : '';

    /**
     * The user name associated to the account.
     * @type {string}
     */
    this.username = typeof options.username == 'string' ? options.username : '';
  }

  /**
   * The URL of the API end point.
   * @type {string}
   */
  static get END_POINT() {
    return 'https://smsapi.free-mobile.fr/sendmsg';
  }

  /**
   * Sends a SMS message to the underlying account.
   * @param {string} text The text of the message to send.
   * @return {Observable<string>} The response as string.
   */
  sendMessage(text) {
    if (!this.username.length || !this.password.length)
      return Observable.throw(new Error('The account credentials are invalid.'));

    let message = text.trim();
    if (!message.length) return Observable.throw(new Error('The specified message is empty.'));

    return new Observable(observer => superagent.get(Client.END_POINT)
      .query({
        msg: message.substr(0, 160),
        pass: this.password,
        user: this.username
      })
      .end((err, res) => {
        if (err || !res.ok) observer.error(new Error(err ? err.status : res.status));
        else {
          observer.next(res.text);
          observer.complete();
        }
      })
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      password: this.password,
      username: this.username
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    let json = JSON.stringify(this.toJSON(), null, 2);
    return `${this.constructor.name} ${json}`;
  }
}
