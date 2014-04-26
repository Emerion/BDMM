var SKILL_COOLDOWN = 1; // skill cooldown in secs

var Player = function(game, x, y) {
    this.game = game;
	var self = this;

	// Define a spritesheet. Note that this data was exported by Zoë.
	var ss = new createjs.SpriteSheet({
		"animations":
		{
			"walk_left": {
				frames: [0, 1, 2],
				next:"walk_left",
				speed: 0.2
			},
			"walk_right": {
				frames: [5, 6, 7],
				next:"walk_right",
				speed: 0.2
			},
			"wait_left": {
				frames: [3, 4],
				next:"wait_left",
				speed: 0.2
			},
			"wait_right": {
				frames: [8, 9],
				next:"wait_right",
				speed: 0.2
			}
		},
		"images": ["img/player.png"],
		"frames":
		{
			"height": 128,
			"width":128,
			"regX": 0,
			"regY": 0,
			"count": 10
		}
	});

	this.renderObject = new createjs.Sprite(ss, "wait_left");

	this.cooldown = false;

	this.meat = 10;
	this.game.eventDispatcher.addEventListener('gainMeat', function(event) {
		self.meat += event.target;
	});

	this.shot = false;
	this.movementState = Movement.WAIT_LEFT;

	this.health = 3;
	this.invincible = false;


	this.setPosition(x, y);
};

Player.prototype.position = {x: 0, y: 0};
Player.prototype.jump_phase = 0;
Player.prototype.jumpCounter = 0;
Player.prototype.moveSpeed = 500;
Player.prototype.DEFAULT_MOVE_SPEED = 500;

Player.prototype.tick = function(event) {
	var self = this;

	var newX = this.position.x,
		newY = this.position.y;

	this.collisions = this.game.getCollisions(this);

	if (!this.jump_phase && (this.game.inputHandler.keyStates[InputHandler.KEY_UP] || this.game.inputHandler.keyStates[InputHandler.KEY_W])) {
		this.jump_phase = 1;
    }

    if (this.game.inputHandler.keyStates[InputHandler.KEY_LEFT] || this.game.inputHandler.keyStates[InputHandler.KEY_A]) {
		if((this.position.x - (event.delta / 1000 * this.moveSpeed)) > 0){
			newX -= (event.delta / 1000 * this.moveSpeed);
		}

		if (this.movementState != Movement.MOVE_LEFT) {
			this.movementState = Movement.MOVE_LEFT;
			this.renderObject.gotoAndPlay(this.movementState);
		}
    }

    if (this.game.inputHandler.keyStates[InputHandler.KEY_RIGHT] || this.game.inputHandler.keyStates[InputHandler.KEY_D]) {
        if((this.position.x + (event.delta / 1000 * this.moveSpeed)) < GAME_WIDTH-64){
			newX += (event.delta / 1000 * this.moveSpeed);
		}
		if (this.movementState != Movement.MOVE_RIGHT) {
			this.movementState = Movement.MOVE_RIGHT;
			this.renderObject.gotoAndPlay(this.movementState);
		}
    }

	if (!this.game.inputHandler.keyStates[InputHandler.KEY_LEFT] && !this.game.inputHandler.keyStates[InputHandler.KEY_A]
		&& !this.game.inputHandler.keyStates[InputHandler.KEY_RIGHT] && !this.game.inputHandler.keyStates[InputHandler.KEY_D]) {

		if (this.movementState == Movement.MOVE_LEFT) {
			this.movementState = Movement.WAIT_LEFT;
			this.renderObject.gotoAndPlay(this.movementState);
		} else if (this.movementState == Movement.MOVE_RIGHT) {
			this.movementState = Movement.WAIT_RIGHT;
			this.renderObject.gotoAndPlay(this.movementState);
		}
	}


	if (this.jump_phase != 1 && !this.getCollidingEntity('GROUND')) { // GRAVITY!!!!
		newY -= (event.delta / 1000 * 1400);
	} else if(this.jump_phase == 1) {
		if(this.jumpCounter <= 15) {
			newY += (event.delta / 1000 * 1100);
			this.jumpCounter += (event.delta / 1000 * 40);
		} else {
			this.jumpCounter = 0;
			this.jump_phase = 2;
		}
	}

	if (this.game.inputHandler.keyStates[InputHandler.KEY_SPACE] && !this.shot) {
		if (this.meat >= 1) {
			this.meat--;
			this.shot = true;
			this.game.addEntity(new MeatBulletEntity(this.game, this.position.x + this.renderObject.getBounds().width / 4, this.position.y));
		}
	} else if(!this.game.inputHandler.keyStates[InputHandler.KEY_SPACE] && !this.game.inputHandler.keyStates[InputHandler.KEY_X] && this.shot) {
		this.shot = false;
	}
	if (this.game.inputHandler.keyStates[InputHandler.KEY_X] && !this.shot && !this.cooldown) {
		this.shot = true;
		this.game.addEntity(new SkillBulletEntity(
			this.game,
			this.position.x + this.renderObject.getBounds().width / 4,
			this.position.y - this.renderObject.getBounds().height / 2 + 64,
			((this.movementState == Movement.MOVE_LEFT ||this.movementState == Movement.WAIT_LEFT) ? -1 : 1)
		));
		self.cooldown = true;
		window.setTimeout(function() {
			self.cooldown = false;
		}, SKILL_COOLDOWN * 1000);
		this.game.eventDispatcher.dispatchEvent('skillCooldown', SKILL_COOLDOWN);
	}

	if (this.jump_phase == 2 && this.getCollidingEntity('GROUND')) {
		this.jump_phase = 0;
	}

	var collidingEntity = this.getCollidingEntity('GROUND');
	if (collidingEntity && this.jump_phase == 0) {
		newY = collidingEntity.position.y + this.renderObject.getBounds().height;
	}

	collidingEntity = this.getCollidingEntity('ENEMY');
	if (collidingEntity && collidingEntity.hungry && !this.invincible) {
		this.setHealth(this.health - 1);
	}

	this.setPosition(newX, newY);
};

Player.prototype.setPosition = function(x, y) {
	this.position.x = x;
    this.position.y = y;

	var pixelPos = Game.localToPixelPos(x, y);
	if (this.renderObject) {
		this.renderObject.x = pixelPos.x;
		this.renderObject.y = pixelPos.y;
	}
};

Player.prototype.getCollidingEntity = function(type) {
	for(var i = 0; i < this.collisions.length; i++) {
		var collidingEntity = this.collisions[i];
		if (collidingEntity.type == type) {
			return collidingEntity;
		}
	}

	return false;
};

Player.prototype.setHealth = function(amount) {
	var self = this;

	this.health = amount;
	if (this.health > 0) {
		this.invincible = true;
		this.game.eventDispatcher.dispatchEvent('setHealth', this.health);

		window.setTimeout(function() {
			self.invincible = false;
		}, 2000);
	} else {
		this.game.remove();

		var gameOverBackground = new createjs.Bitmap('img/background_gameover.png');
		this.game.stage.addChild(gameOverBackground);

		var ptsText = new createjs.Text('YOUR POINTS: ' + this.game.scoreInfoFrame.points, '50px Arial', '#999');
		ptsText.x = 160;
		ptsText.y = GAME_HEIGHT - 90;
		var ptsTextBack = new createjs.Text('YOUR POINTS: ' + this.game.scoreInfoFrame.points, '50px Arial', '#333');
		ptsTextBack.x = 162;
		ptsTextBack.y = GAME_HEIGHT - 88;

		this.game.stage.addChild(ptsTextBack);
		this.game.stage.addChild(ptsText);
	}
};

Player.prototype.type = 'PLAYER';

// currentPos = timePos / JUMP_TIME * -8
// yOffset = -2 * Math.pow(currentPos, 2) + 8