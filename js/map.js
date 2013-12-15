(function() {
	/*
	1 = wall
	2 = player start
	*/
	var Map = function(onload) {
		this.data = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
					 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					 [1, 0, 0, 0, 2, 0, 0, 0, 0, 1],
					 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

		var req = new XMLHttpRequest();
		req.open("GET", "data/map.json", true);

		var that = this;
		req.onload = function(e) {
			that.data = JSON.parse(this.response);
			onload();
		};

		req.send();

		this.tileSize = 32;

		this.getPlayerStartPosition = function() {
			for (var y = 0; y < this.data.length; y++) {
				var row = this.data[y];
				for (var x = 0; x < row.length; x++) {
					if (row[x] == 2) {
						return {x: (x * this.tileSize), y: (y * this.tileSize)};
					}
				}
			}
		};


		this.draw = function(ctx, camera) {
			for (var y = 0; y < this.data.length; y++) {
				var row = this.data[y];
				for (var x = 0; x < row.length; x++) {
					var screenX = camera.getScreenX(x * this.tileSize),
						screenY = camera.getScreenY(y * this.tileSize);

					if (row[x] == 1) {
						ctx.fillStyle = "#AAAAAA";
						ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
					}
				}
			}
		};

		this.collision = function(x, y) {
			var tileX = Math.floor(x / this.tileSize),
				tileY = Math.floor(y / this.tileSize);

			var row = this.data[tileY];

			if (row[tileX] == 1) {
				return true;
			}

			return false;
		};

		this.getData = function(x, y) {
			var tileX = Math.floor(x / this.tileSize),
				tileY = Math.floor(y / this.tileSize);

			var row = this.data[tileY];

			return row[tileX];
		};
	};


	function boxOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        if ((x1 + w1) < x2) {
            return false;
        } else if (x1 > (x2 + w2)) {
            return false;
        } else if ((y1 + h1) < y2) {
            return false;
        } else if (y1 > (y2 + h2)) {
            return false;
        }

        return true;
    }

	window.Map = Map;
})();