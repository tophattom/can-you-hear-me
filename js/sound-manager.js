(function() {
	var SoundManager = function(audioCtx, mainVolume, map) {
		this.soundTriggers = [];

		var req = new XMLHttpRequest();
		req.open("GET", "data/sounds.json", true);

		var that = this;
		req.onload = function(e) {
			var soundInfo = JSON.parse(this.response);

			for (var i = 0; i < soundInfo.length; i++) {
				var info = soundInfo[i],
					soundX = map.tileSize * info.tileX,
					soundY = map.tileSize * info.tileY;

				var sound = new SoundSource(soundX, soundY, 0, info.file, audioCtx, mainVolume);
				sound.setLoop(info.loop);
				sound.sound.volume.gain.value = info.gain;

				if (info.file === "sound/ending.wav") {
					console.log("asd");
					sound.onended = function() {
						var event = new CustomEvent("gameover", {
							detail: {},
							bubbles: true,
							cancelable: false
						});

						window.dispatchEvent(event);
					};
				}

				if (typeof that.soundTriggers[info.trigger] === "undefined") {
					that.soundTriggers[info.trigger] = [];
				}
				that.soundTriggers[info.trigger].push(sound);


			}
		};

		req.send();
	};

	SoundManager.prototype.triggerSounds = function(triggerId) {
		var sounds = this.soundTriggers[triggerId];

		if (typeof sounds === "undefined") {
			return;
		}

		for (var i = 0; i < sounds.length; i++) {
			sounds[i].start();
		}
	};

	SoundManager.prototype.stopAll = function() {
		for (var i = 0; i < this.soundTriggers.length; i++) {
			var sounds = this.soundTriggers[i];

			if (typeof sounds === "undefined") {
				continue;
			}

			for (var k = 0; k < sounds.length; k++) {
				var sound = sounds[k];
				
				if (typeof sound !== "undefined") {
					sound.stop();
				}
			}
		}
	};

	window.SoundManager = SoundManager;
})();