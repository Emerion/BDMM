var MeatBulletEntity = function(game, x, y) {
	this.game = game;
	this.renderObject = new createjs.Bitmap('img/meat.png');

	this.position = {x: 0, y: 0};
	this.setPosition(x, y);
};

MeatBulletEntity.prototype.renderObject = null;

MeatBulletEntity.prototype.tick = function(event) {
	this.collisions = this.game.getCollisions(this);
	if (this.getCollidingEntity('GROUND')) {
		this.game.removeEntity(this);
	} else {
		this.setPosition(this.position.x, this.position.y + (event.delta / 1000 * 600));
	}
};

MeatBulletEntity.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;

	var pixelPos = Game.localToPixelPos(x, y);
	this.renderObject.x = pixelPos.x;
	this.renderObject.y = pixelPos.y;
};

MeatBulletEntity.prototype.getCollidingEntity = function(type) {
	for(var i = 0; i < this.collisions.length; i++) {
		var collidingEntity = this.collisions[i];
		if (collidingEntity.type == type) {
			return true;
		}
	}

	return false;
};

MeatBulletEntity.prototype.type = 'MEAT';
