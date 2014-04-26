var HungryEnemyEntity = function(game, x, y) {
	this.game = game;
	this.type = 'ENEMY';

	var ss = new createjs.SpriteSheet({
		"animations":
		{
			"walk_left_angry": {
				frames: [0, 1, 2, 1],
				next:"walk_left_angry",
				speed: 0.2
			},
			"walk_left_angry": {
				frames: [0, 1, 2, 1],
				next:"walk_left_angry",
				speed: 0.2
			},
			"walk_right_angry": {
				frames: [3, 4, 5, 4],
				next:"walk_right_angry",
				speed: 0.2
			},
			"walk_left_friendly": {
				frames: [6, 7, 8, 7],
				next:"walk_left_friendly",
				speed: 0.2
			},
			"walk_right_friendly": {
				frames: [9, 10, 11, 10],
				next:"walk_right_friendly",
				speed: 0.2
			}
		},
		"images": ["img/AllEnemySprite.png"],
		"frames":
		{
			"height": 64,
			"width":96,
			"regX": 0,
			"regY": 0,
			"count": 10
		}
	});

	this.renderObject = new createjs.Sprite(ss, "walk_left_angry");

	this.position = {x: 0, y: 0};

	this.hungry = true;

	this.dir = null;
	this.speed = 150 + Math.floor(Math.random() * 200);
	this.setPosition(x, y);
};

HungryEnemyEntity.prototype.tick = function(event) {
	var newX = this.position.x,
		newY = this.position.y;

	this.collisions = this.game.getCollisions(this);

	var collidingEntity = this.getCollidingEntity('MEAT');
	if (collidingEntity && this.hungry) {
		this.game.removeEntity(collidingEntity);


		this.renderObject.gotoAndPlay('walk_left_friendly');

		this.game.eventDispatcher.dispatchEvent('addPoints', 10);
		this.hungry = false;
	} else {

		if (!this.getCollidingEntity('GROUND')) {
			newY -= (event.delta / 1000 * 400);
		} else {
			// HUNGRY AI
			if (this.hungry) {
				if (Math.abs(this.game.player.position.y - this.position.y) > 90 && this.game.player.jump_phase == 0) {
					if (!this.dir) {
						this.dir = this.game.player.position.x > newX ? 1 : -1;
					}

					var dir = this.dir;
				} else {
					var dir = this.game.player.position.x > newX ? 1 : -1;
				}

				if (newX + (event.delta / 1000 * this.speed) * dir < 0 || newX + (event.delta / 1000 * this.speed) * dir + this.renderObject.getBounds().width >= GAME_WIDTH) {
					this.dir = dir *= -1;
				}

				newX += (event.delta / 1000 * this.speed) * dir;
			} else {
				// NOT HUNGRY ANYMORE - run off screen
				if (!this.dir) {
					this.dir = this.game.player.position.x > newX ? 1 : -1;
				}
				newX += (event.delta / 1000 * this.speed) * this.dir;
			}

			collidingEntity = this.getCollidingEntity('GROUND');
			if (collidingEntity) {
				newY = collidingEntity.position.y + this.renderObject.getBounds().height;
			}
		}

		this.setPosition(newX, newY);
	}
};

HungryEnemyEntity.prototype.getCollidingEntity = function(type) {
	for(var i = 0; i < this.collisions.length; i++) {
		var collidingEntity = this.collisions[i];
		if (collidingEntity.type == type) {
			return collidingEntity;
		}
	}

	return false;
};

HungryEnemyEntity.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;

	var pixelPos = Game.localToPixelPos(x, y);
	this.renderObject.x = pixelPos.x;
	this.renderObject.y = pixelPos.y;
};
