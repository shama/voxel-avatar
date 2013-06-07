# voxel-avatar

Overlay an image or video on a
[minecraft-skin](https://npmjs.org/package/minecraft-skin)
in [voxel.js](http://voxeljs.com).

The demo also includes an example WebRTC video chat room. It only requires a
server to notify peers of each other as well as things like NAT traversal. The
audio/video is all peer to peer in the web browser.

Here is an example with my son and I video chatting in voxel.js pretending to
be Max Ogden:

[webrtc](http://i.imgur.com/RnFbfzD.png)

# example

[View this example](http://shama.github.io/voxel-avatar)

```js
// Create a game
var game = require('voxel-engine')();

// Create a skin
var dude = require('minecraft-skin')(game.THREE, 'textures/dude.png');

// Use avatar to load your webcam onto the skin
var avatar = require('voxel-avatar')(game.THREE);
avatar.onSkin(dude);

// Or use your own stream
navigator.getUserMedia({video: true, audio: true}, function(stream) {
  avatar.onSkin(dude, window.URL.createObjectURL(stream));
});
```

# webrtc example
To just get something up and running quickly do:

```shell
git clone git://github.com/shama/voxel-avatar.git && cd voxel-avatar
npm install
npm start
```

This will start a server on port `9000` and a game at `http://localhost:9966`.

Then you can open multiple tabs and see yourself a bunch of times. If you want
other players to chat then edit `demo.js` and change the `serverip` to the ip
of your machine, e.g.: `var serverip = 'ws://192.168.1.128:9000';`. Then have
the other players goto `http://192.168.1.128:9966`. Each will use your server to
discover each other but will all connect directly via p2p.

# install

With [npm](https://npmjs.org) do:

```
npm install voxel-avatar
```

Use [browserify](http://browserify.org) to `require('voxel-avatar')`.

## release history
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young<br/>
Licensed under the MIT license.
