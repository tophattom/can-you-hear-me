(function() {
	"use strict";

	var width = window.innerWidth,
		height = window.innerHeight;

	var canvas = document.getElementById("gameCanvas"),
		ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var audioCtx = new AudioContext(),
		mainVolume = audioCtx.createGain();
	
	mainVolume.connect(audioCtx.destination);


	var camera = new Camera(0, 0, width, height);

	
	var footsteps = new SoundSource(0, 0, 0, "sound/footsteps.wav", audioCtx, mainVolume);
	footsteps.setLoop(true);
	footsteps.sound.volume.gain.value = 0.2;

	var player = {};
	var map = new Map(function() {
		var playerPos = map.getPlayerStartPosition();
		player = {
			x: playerPos.x,
			y: playerPos.y,

			lastX: playerPos.x,
			lastY: playerPos.y,

			moving: false
		};
	});


	var soundManager = new SoundManager(audioCtx, mainVolume, map);
	
	var kb = {
		up: false,
		down: false,
		left: false,
		right: false
	};

	

	var keyDownListener = function(e) {

		if (e.keyCode == 37) {
			kb.left = true;
		} else if (e.keyCode == 38) {
			kb.up = true;
		} else if (e.keyCode == 39) {
			kb.right = true;
		} else if (e.keyCode == 40) {
			kb.down = true;
		}
	};
	
	

	var keyUpListener = function(e) {
		if (e.keyCode == 37) {
			kb.left = false;
		} else if (e.keyCode == 38) {
			kb.up = false;
		} else if (e.keyCode == 39) {
			kb.right = false;
		} else if (e.keyCode == 40) {
			kb.down = false;
		}
	};

	window.addEventListener("keydown", keyDownListener);
	window.addEventListener("keyup", keyUpListener);

	var gameOver = false,
		requestId;
	function run() {
		if (!gameOver) {
			window.requestAnimationFrame(run);
		}

		player.lastX = player.x;
		player.lastY = player.y;

		player.lastTileX = player.tileX;
		player.lastTileY = player.tileY;

		if (kb.up) {
			player.y -= 1;
		} else if (kb.down) {
			player.y += 1;
		}

		var collisionY = map.collision(player.x, player.y);
		if (collisionY) {
			player.y = player.lastY;
		}

		if (kb.left) {
			player.x -= 1;
		} else if (kb.right) {
			player.x += 1;
		}

		var collisionX = map.collision(player.x, player.y);
		if (collisionX) {
			player.x = player.lastX;
		}

		player.tileX = Math.floor(player.x / map.tileSize);
		player.tileY = Math.floor(player.y / map.tileSize);


		player.moving = (kb.up || kb.down || kb.left || kb.right);

		if (collisionX && collisionY) {
			player.moving = false;
		} else if (collisionX && !(kb.up || kb.down)) {
			player.moving = false;
		} else if (collisionY && !(kb.left || kb.right)) {
			player.moving = false;
		}

		
		if (player.moving && !footsteps.playing) {
			footsteps.start();
		}

		if (!player.moving && footsteps.playing) {
			footsteps.stop();
		}


		camera.setPosition(player.x, player.y);
		footsteps.setPosition(player.x, player.y, 0);
		audioCtx.listener.setPosition(player.x, player.y, 0);

		if (player.tileX !== player.lastTileX || player.tileY !== player.lastTileY) {
			soundManager.triggerSounds(map.getData(player.x, player.y));
		}	


		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, width, height);

		// map.draw(ctx, camera);		

		// ctx.fillStyle = "#FF0000";
		// ctx.fillRect(camera.getScreenX(player.x), camera.getScreenY(player.y), 5, 5);
	}

	requestId = window.requestAnimationFrame(run);


	window.addEventListener("gameover", function() {
		console.log("Game over");

		
		gameOver = true;

		window.removeEventListener("keydown", keyDownListener);

		soundManager.stopAll();
	});
})();