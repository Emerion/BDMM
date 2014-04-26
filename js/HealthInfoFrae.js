function HealthInfoFrame(game) {
	this.game = game;

	var self = this;

	this.game.eventDispatcher.addEventListener('setHealth', function(event) {self.setHealth(event);});

	this.health = 3;

	this.hearts = [];
	for (var i = 1; i <= 3; i++) {
		this.hearts[i] = {
			norm: new createjs.Bitmap('img/heart.png'),
			grey: new createjs.Bitmap('img/noHeart.png')
		};

		this.hearts[i].norm.x = this.hearts[i].grey.x = 60 * i;
		this.hearts[i].grey.alpha = 0;

		this.addChild(this.hearts[i].norm);
		this.addChild(this.hearts[i].grey);
	}
}

HealthInfoFrame.prototype = new createjs.Container();
HealthInfoFrame.prototype.game = null;

HealthInfoFrame.prototype.tick = function() {
	this.pointsText.text = this.pointsTextBack.text = this.points;
};

HealthInfoFrame.prototype.setHealth = function(event) {
	this.health = event.target;
	for (var i = 1; i <= 3; i++) {
		if (i <= this.health) {
			this.hearts[i].grey.alpha = 0;
		} else {
			this.hearts[i].grey.alpha = 1;
		}
	}
};

HealthInfoFrame.prototype.type = 'SCORE_INFO_FRAME';
