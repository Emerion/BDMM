var GAME_WIDTH = null;
var GAME_HEIGHT = null;

var Game = function(canvas) {
	var game = this;

	this.eventDispatcher = new  createjs.EventDispatcher();

	GAME_WIDTH = canvas.width * 2;
	GAME_HEIGHT = canvas.height * 2;

	this.canvas = canvas;
	this.stage = new createjs.Stage(this.canvas);
	this.stage.scaleX = this.stage.scaleY = 0.5;
	createjs.Ticker.setFPS(61);

	this.inputHandler = new InputHandler(this);

	this.entities = [];
	this.debugInfoFrame = new DebugInfoFrame(this);
	this.debugInfoFrame.y = 200;

	this.initGame();

	this.stage.addChild(this.debugInfoFrame);
};

Game.prototype.initGame = function() {
	var self = this;

	var background = new createjs.Bitmap('img/background1.png');
	this.stage.addChild(background);

	var ground = new GroundEntity(this, 0, 154);
	this.addEntity(ground);

	var platform1 = new PlatformEntity(this, 458, 484);
	this.addEntity(platform1);

	this.player = new Player(this, 850, 800);
	this.addEntity(this.player);


	var testMeat = new MeatBulletEntity(this, 850, 150);
	this.addEntity(testMeat);

	this.scoreInfoFrame = new ScoreInfoFrame(this);
	this.stage.addChild(this.scoreInfoFrame);

	this.meatInfoFrame = new MeatInfoFrame(this);
	this.meatInfoFrame.x = 0;
	this.meatInfoFrame.y = 100;
	this.stage.addChild(this.meatInfoFrame);

	this.skillInfoFrame = new SkillInfoFrame(this);
	this.skillInfoFrame.x = GAME_WIDTH - 208;
	this.skillInfoFrame.y = GAME_HEIGHT - 80;
	this.skillInfoFrame.scaleX = this.skillInfoFrame.scaleY = 0.5;
	this.stage.addChild(this.skillInfoFrame);

	this.healthInfoFrame = new HealthInfoFrame(this);
	this.healthInfoFrame.x = GAME_WIDTH - 500;
	this.healthInfoFrame.y = GAME_HEIGHT - 80;
	this.stage.addChild(this.healthInfoFrame);

	this.waveCounter = 0;

	this.spawnMobs();

	// spawn some mobs.. :D
	this.mobSpawner = window.setInterval(function() {
		self.waveCounter++;
		self.spawnMobs();
	}, 20000);

	this.tickListener = createjs.Ticker.addEventListener('tick', function(ev) { self.tick(ev) });
};

Game.prototype.addEntity = function(entity) {
	this.entities.push(entity);
	this.stage.addChild(entity.renderObject);
};

Game.prototype.tick = function(ev) {
	this.debugInfoFrame.tick(ev);
	this.scoreInfoFrame.tick(ev);
	this.meatInfoFrame.tick(ev);

	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		entity.tick(ev);

		if (this.isOffscreen(entity.renderObject)) {
			this.removeEntity(entity);
		}
	}

	this.stage.update(ev);
};

Game.prototype.spawnMobs = function() {
	var self = this;
	for (var i = 0; i < 5 + this.waveCounter; i++) {
		window.setTimeout(function() {
			self.addEntity(new HungryEnemyEntity(self, Math.floor(Math.random() * (GAME_WIDTH - 100)), GAME_HEIGHT + 200 - Math.floor(Math.random() * 50)));
		}, 800 + Math.floor(Math.random() * 2000));
	}

	if (Math.floor(Math.random() * Date.now()) % 100 < 50) {
		var testPowerUp = new ChefsHat(self, Math.floor(Math.random() * (GAME_WIDTH - 100)), GAME_HEIGHT + 200 - Math.floor(Math.random() * 50));
		this.addEntity(testPowerUp);
	}

	this.player.setHealth(3);
};

Game.localToPixelPos = function (x, y) {
	return {
		x: x,
		y: GAME_HEIGHT - y
	}
};

Game.prototype.getCollisions = function(entity) {
	var collisions = [];

	var renderObject = entity.renderObject;
	var ownBounds = renderObject.getBounds();

	for (var i = 0; i < this.entities.length; i++) {
		var otherEntity2 = this.entities[i];
		var otherEntityBounds = otherEntity2.renderObject.getBounds();

		var thisEntity = {
			tl: {
				x: renderObject.x,
				y: renderObject.y
			},
			tr: {
				x: renderObject.x + ownBounds.width,
				y: renderObject.y
			},
			bl: {
				x: renderObject.x,
				y: renderObject.y + ownBounds.height
			},
			br: {
				x: renderObject.x + ownBounds.width,
				y: renderObject.y + ownBounds.height
			}
		};
		var otherEntity = {
			tl: {
				x: otherEntity2.renderObject.x,
				y: otherEntity2.renderObject.y
			},
			tr: {
				x: otherEntity2.renderObject.x + otherEntityBounds.width,
				y: otherEntity2.renderObject.y
			},
			bl: {
				x: otherEntity2.renderObject.x,
				y: otherEntity2.renderObject.y + otherEntityBounds.height
			},
			br: {
				x: otherEntity2.renderObject.x + otherEntityBounds.width,
				y: otherEntity2.renderObject.y + otherEntityBounds.height
			}
		};

		if (
				entity.type == 'SKILL' &&
				otherEntity2.type == 'ENEMY' &&
				(
					(thisEntity.tl.x >= otherEntity.tl.x && thisEntity.tr.x <= otherEntity.tr.x) // COLLISION LEFT
						|| (thisEntity.tr.x <= otherEntity.tr.x && thisEntity.tr.x >= otherEntity.tl.x) // COLLISION RIGHT
					) && (
				(thisEntity.tl.y >= otherEntity.tl.y && thisEntity.tl.y <= otherEntity.bl.y) // COLLISION TOP
					|| (thisEntity.bl.y >= otherEntity.tl.y && thisEntity.bl.y <= otherEntity.bl.y) // COLLISION BOTTOM
					|| (thisEntity.tl.y <= otherEntity.tl.y && thisEntity.bl.y >= otherEntity.bl.y) // COLLISION INNER
				)
			) {
			collisions.push(otherEntity2);
		}

		if (otherEntity2.type && (otherEntity2.type == 'GROUND' || otherEntity2.type == 'MEAT' || otherEntity2.type == 'ENEMY') && renderObject.y + ownBounds.height >= otherEntity2.renderObject.y && renderObject.y + ownBounds.height <= otherEntity2.renderObject.y + otherEntityBounds.height && renderObject.x + ownBounds.width / 2 >= otherEntity2.renderObject.x && renderObject.x + ownBounds.width / 2 <= otherEntity2.renderObject.x + otherEntityBounds.width) {
			collisions.push(otherEntity2);
		}

		else if (otherEntity2.type && (entity.type != 'PLAYER' && otherEntity2.type == 'PLAYER') && renderObject.y + ownBounds.height >= otherEntity2.renderObject.y && renderObject.y + ownBounds.height <= otherEntity2.renderObject.y + otherEntityBounds.height && renderObject.x + ownBounds.width / 2 >= otherEntity2.renderObject.x && renderObject.x + ownBounds.width / 2 <= otherEntity2.renderObject.x + otherEntityBounds.width) {
			collisions.push(otherEntity2);
		}
	}

	return collisions;
};

Game.prototype.removeEntity = function(entity) {
	this.removeRenderObject(entity.renderObject);
	var idx = this.entities.indexOf(entity);
	this.entities.splice(idx, 1);
};

Game.prototype.removeRenderObject = function(renderObject) {
	var idxToRemove = this.stage.getChildIndex(renderObject);
	this.stage.removeChildAt(idxToRemove);
};

Game.prototype.isOffscreen = function(renderObject) {
	var bounds = renderObject.getBounds();
	return (bounds.width + renderObject.x < 0 || renderObject.x > GAME_WIDTH * 2 || renderObject.y + bounds.height < -200 || renderObject.y > GAME_HEIGHT * 2)
};

Game.prototype.remove = function() {
	this.entities = [];
	this.stage.removeAllChildren();
};

Game.prototype.constructor = Game;


