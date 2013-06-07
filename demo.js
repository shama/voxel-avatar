var serverip = 'ws://localhost:9000';

var createGame = require('voxel-engine');
var skin = require('minecraft-skin');

var game = createGame({
  chunkDistance: 2,
  generate: function(x, y, z) {
    return (Math.sqrt(x*x + y*y + z*z) > 60 || y*y > 10) ? 0 : (Math.random() * 3) + 1;
  },
  materials: ['brick', ['grass', 'dirt', 'grass_dirt'], 'dirt'],
  texturePath: 'textures/'
});
var container = document.body;
game.appendTo(container);

// create a player
var createPlayer = require('voxel-player')(game);
var player = createPlayer('textures/shama.png');
player.yaw.position.set(0, 10, 0);
player.possess();

// avatar lib
var avatar = require('./')(game.THREE);

// our connected dudes
var dudes = Object.create(null);
var skins = ['max', 'substack', 'shama'];

// Make a dude
function createDude(stream, id) {
  var rand = Math.floor(Math.random() * skins.length);
  var obj = new game.THREE.Object3D();
  var dude = skin(game.THREE, 'textures/' + skins[rand] + '.png');
  dude.mesh.rotation.y = Math.PI;
  obj.add(dude.mesh);
  dude.mesh = obj;
  game.scene.add(dude.mesh);
  avatar.onSkin(dude, window.URL.createObjectURL(stream));
  dudes[id] = dude;
}

// Arrange dudes in a circle
function circle() {
  var total = Object.keys(dudes).length;
  var rad = total * 8;
  var seg = 360 / total;
  var i = 0;
  Object.keys(dudes).forEach(function(k) {
    var dude = dudes[k];
    var at = Math.PI / 180 * (i * seg);
    dude.mesh.position.x = Math.sin(at) * rad;
    dude.mesh.position.z = Math.cos(at) * rad;
    i++;
  });
}

// Always look at the player
game.setInterval(function() {
  Object.keys(dudes).forEach(function(k) {
    dudes[k].mesh.lookAt(player.yaw.position.clone());
  });
}, 100);

// webrtc
var rtc = require('webrtc.io-client/lib/webrtc.io.js');
rtc.connect(serverip, 'avatar');

// Our local client
rtc.createStream({'video': true, 'audio': true}, function(stream) {
  createDude(stream, 'local');
});

// when a remote client connects
rtc.on('add remote stream', function(stream, socketId) {
  createDude(stream, socketId);
  circle();
});

// When a remote disconnects
rtc.on('disconnect stream', function(socketId) {
  if (dudes[socketId]) {
    game.scene.remove(dudes[socketId].mesh);
  }
  circle();
});
