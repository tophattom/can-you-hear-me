(function() {
	var SoundSource = function(x, y, z, filename, audioCtx, mainVolume) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.sound = {};
		this.sound.volume = audioCtx.createGain();
		this.sound.panner = audioCtx.createPanner();

		this.sound.volume.connect(this.sound.panner);
		this.sound.panner.connect(mainVolume);

		this.sound.panner.setPosition(x, y, z);
		this.sound.panner.refDistance = 10;
		this.sound.panner.rolloffFactor = 0.5;
		this.sound.panner.maxDistance = 1000;

		this.sound.loop = false;

		this.ctx = audioCtx;

		this.loadSound(filename);

		this.loaded = false;
		this.playing = false;

		this.onended = undefined;
	};

	SoundSource.prototype.setLoop = function(loop) {
		this.sound.loop = loop;
	};

	SoundSource.prototype.loadSound = function(filename) {
		var req = new XMLHttpRequest();
		req.open("GET", filename, true);
		req.responseType = "arraybuffer";

		var that = this;
		req.onload = function(e) {
			that.sound.buffer = that.ctx.createBuffer(this.response, false);

			that.loaded = true;
		};

		req.send();
	};

	SoundSource.prototype.setPosition = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.sound.panner.setPosition(x, y, z);
	};

	SoundSource.prototype.start = function() {
		this.sound.source = this.ctx.createBufferSource();
		this.sound.source.buffer = this.sound.buffer;

		this.sound.source.connect(this.sound.volume);

		this.sound.source.loop = this.sound.loop;

		this.sound.source.start(0);

		var that = this;
		this.sound.source.onended = function(e) {
			that.playing = false;
			if (typeof that.onended !== "undefined") {
				that.onended();
			}
		};

		this.playing = true;
	};

	SoundSource.prototype.stop = function() {
		this.sound.source.stop(0);
		this.playing = false;
	};

	window.SoundSource = SoundSource;
})();