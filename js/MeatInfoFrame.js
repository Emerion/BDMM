function MeatInfoFrame(game) {
	this.game = game;

	var self = this;

	this.scoreIcon = new createjs.Bitmap('img/meaticon.png');
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

MeatInfoFrame.prototype = new createjs.Container();
MeatInfoFrame.prototype.game = null;

MeatInfoFrame.prototype.tick = function() {
	this.pointsText.text = this.pointsTextBack.text = this.game.player.meat;
};


MeatInfoFrame.prototype.type = 'MEAT_INFO_FRAME';