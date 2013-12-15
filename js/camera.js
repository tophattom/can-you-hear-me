(function() {
	var Camera = function(x, y, width, height) {
		this.x = x;
		this.y = y;

		this.w = width;
		this.h = height;
	};

	Camera.prototype.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Camera.prototype.getScreenX = function(worldX) {
		return Math.round(worldX - this.x + this.w / 2);
	};

	Camera.prototype.getScreenY = function(worldY) {
		return Math.round(worldY - this.y + this.h / 2);
	};

	window.Camera = Camera;
})();