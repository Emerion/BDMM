var ChefsHat = function(game, x, y) {
	this.game = game;
	this.renderObject = new createjs.Bitmap('img/Bambus.png');

	this.position = {x: 0, y: 0};
	this.setPosition(x, y);
};

ChefsHat.prototype.renderObject = null;

ChefsHat.prototype.tick = function(event) {
	this.collisions = this.game.getCollisions(this);

	var collidingEntity = this.getCollidingEntity('PLAYER');
	if (collidingEntity) {
		collidingEntity.moveSpeed = 1000;
		this.game.removeEntity(this);
	}

	var newY = this.position.y;
	collidingEntity = this.getCollidingEntity('GROUND');
	if (!collidingEntity) {
		newY -= (event.delta / 1000 * 800);
	} else {
		newY = collidingEntity.position.y + this.renderObject.getBounds().height;
	}

	this.setPosition(this.position.x, newY);

	window.setTimeout(function() {
		collidingEntity.moveSpeed = collidingEntity.DEFAULT_MOVE_SPEED;
	}, 15000);
};

ChefsHat.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;

	var pixelPos = Game.localToPixelPos(x, y);
	this.renderObject.x = pixelPos.x;
	this.renderObject.y = pixelPos.y;
};

ChefsHat.prototype.getCollidingEntity = function(type) {
	for(var i = 0; i < this.collisions.length; i++) {
		var collidingEntity = this.collisions[i];
		if (collidingEntity.type == type) {
			return collidingEntity;
		}
	}

	return false;
};

ChefsHat.prototype.type = 'CHEFS_HAT';