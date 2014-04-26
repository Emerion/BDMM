function ScoreInfoFrame(game) {
	this.game = game;

	var sci = this;

	this.game.eventDispatcher.addEventListener('addPoints', function(event) {sci.addPoints(event);});

	this.points = 0;

	this.scoreIcon = new createjs.Bitmap('img/Score.png');
	this.scoreIcon.x = this.scoreIcon.y = 5;
	this.scoreIcon.scaleX = this.scoreIcon.scaleY = 0.70;
	this.addChild(this.scoreIcon);

	this.pointsTextBack = new createjs.Text('0', '80px Arial', '#000');
	this.pointsTextBack.x = 120;
	this.pointsTextBack.y = 10;
	this.addChild(this.pointsTextBack);
	this.pointsText = new createjs.Text('0', '80px Arial', '#FFF');
	this.pointsText.x = 115;
	this.pointsText.y = 5;
	this.addChild(this.pointsText);
}

ScoreInfoFrame.prototype = new createjs.Container();
ScoreInfoFrame.prototype.game = null;

ScoreInfoFrame.prototype.tick = function() {
	this.pointsText.text = this.pointsTextBack.text = this.points;
};

ScoreInfoFrame.prototype.addPoints = function(event) {
	this.points += event.target;

};

ScoreInfoFrame.prototype.type = 'SCORE_INFO_FRAME';
