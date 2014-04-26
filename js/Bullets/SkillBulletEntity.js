var SkillBulletEntity = function(game, x, y, dir) {
	this.game = game;

	var asset_name = 'skill_' + (dir > 0 ? 'right' : 'left') + '.png';

	this.renderObject = new createjs.Bitmap('img/' + asset_name);

	this.position = {x: 0, y: 0};
	this.dir = dir;

	this.setPosition(x, y);
};

SkillBulletEntity.prototype.renderObject = null;

SkillBulletEntity.prototype.tick = function(event) {
	this.setPosition(this.position.x + (event.delta / 1000 * 800) * this.dir, this.position.y);

	this.collisions = this.game.getCollisions(this);
	var collisionEntity = this.getCollidingEntity('ENEMY', true);
	if (collisionEntity) {
		this.game.addEntity(new MeatEntity(this.game, collisionEntity.position.x, collisionEntity.position.y));
		this.game.removeEntity(collisionEntity);
		this.game.removeEntity(this);
	}
};

SkillBulletEntity.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;

	var pixelPos = Game.localToPixelPos(x, y);
	this.renderObject.x = pixelPos.x;
	this.renderObject.y = pixelPos.y;
};

SkillBulletEntity.prototype.getCollidingEntity = function(type, hungry) {
	for(var i = 0; i < this.collisions.length; i++) {
		var collidingEntity = this.collisions[i];
		if (collidingEntity.type == type && collidingEntity.hungry == hungry) {
			return collidingEntity;
		}
	}

	return false;
};

SkillBulletEntity.prototype.type = 'SKILL';
