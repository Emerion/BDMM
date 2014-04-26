var PlatformEntity = function(game, x, y) {
	this.game = game;
	this.renderObject = new createjs.Bitmap('img/platform1.png');

	this.setPosition(x, y);
};

PlatformEntity.prototype.position = {x: 0, y: 0};
PlatformEntity.prototype.renderObject = null;

PlatformEntity.prototype.tick = function(event) {};

PlatformEntity.prototype.setPosition = function(x, y) {
	this.position.x = x;
	this.position.y = y;

	var pixelPos = Game.localToPixelPos(x, y);
	this.renderObject.x = pixelPos.x;
	this.renderObject.y = pixelPos.y;
};

PlatformEntity.prototype.type = 'GROUND';
