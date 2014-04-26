var GroundEntity = function(game, x, y) {
	this.game = game;
	this.renderObject = new createjs.Bitmap('img/ground1.png');

	this.position = {x: 0, y: 0};
	this.setPosition(x, y);
};

GroundEntity.prototype.renderObject = null;

GroundEntity.prototype.tick = function(event) {};

GroundEntity.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;

	var pixelPos = Game.localToPixelPos(x, y);
	this.renderObject.x = pixelPos.x;
	this.renderObject.y = pixelPos.y;
};

GroundEntity.prototype.type = 'GROUND';
