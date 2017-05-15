# Free Mobile for JS
![Runtime](https://img.shields.io/badge/node-%3E%3D7.10-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/free-mobile.svg) ![License](https://img.shields.io/npm/l/@cedx/free-mobile.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/free-mobile.svg) ![Dependencies](https://david-dm.org/cedx/free-mobile.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/free-mobile.js/badge.svg) ![Build](https://travis-ci.org/cedx/free-mobile.js.svg)

Send SMS messages to your [Free Mobile](http://mobile.free.fr) account, in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

To use this library, you must have enabled SMS Notifications in the Options of your [Subscriber Area](https://mobile.free.fr/moncompte).

## Requirements
The latest [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) versions.
If you plan to play with the sources, you will also need the latest [Gulp.js](http://gulpjs.com) version.

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install --save @cedx/free-mobile
```

## Usage
It provides a single class, `Client`, which allow to send messages to your mobile phone by using the `sendMessage()` method:

```javascript
const {Client} = require('@cedx/free-mobile');

try {
  let client = new Client('your user name', 'your identification key');
  await client.sendMessage('Hello World!');
  console.log('The message was sent successfully.');
}

catch (error) {
  console.log(`An error occurred: ${error}`);
}
```

The text of the messages will be automatically truncated to 160 characters: you can't send multipart messages using this library.

## Events
The `Client` class is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
During its life cycle, it emits these events:

- `request` : emitted every time a request is made to the remote service.
- `response` : emitted every time a response is received from the remote service.

You can subscribe to them using the `on()` method:

```javascript
client.on('request', request => console.log(`Client request: ${request.url}`));
client.on('response', response => console.log(`Server response: ${response.statusCode}`));
```

## Unit tests
In order to run the tests, you must set two environment variables:

```shell
$ export FREEMOBILE_USERNAME="<your Free Mobile user name>"
$ export FREEMOBILE_PASSWORD="<your Free Mobile identification key>"
```

Then, you can run the `test` script from the command prompt:

```shell
$ npm test
```

## See also
- [API reference](https://cedx.github.io/free-mobile.js)
- [Code coverage](https://coveralls.io/github/cedx/free-mobile.js)
- [Continuous integration](https://travis-ci.org/cedx/free-mobile.js)

## License
[Free Mobile for JS](https://github.com/cedx/free-mobile.js) is distributed under the Apache License, version 2.0.
