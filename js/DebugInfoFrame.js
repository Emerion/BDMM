function DebugInfoFrame(game) {
	this.game = game;

	this.fpsText = new createjs.Text('0 FPS', '24px Arial', '#000');
	this.fpsText.x = 5;
	this.fpsText.y = 5;
	this.objText = new createjs.Text('0 FPS', '24px Arial', '#000');
	this.objText.x = 5;
	this.objText.y = 35;

	this.addChild(this.fpsText);
	this.addChild(this.objText);
}

DebugInfoFrame.prototype = new createjs.Container();
DebugInfoFrame.prototype.constructor = DebugInfoFrame;
DebugInfoFrame.prototype.game = null;

DebugInfoFrame.prototype.tick = function() {
	this.fpsText.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " FPS";
	this.objText.text = this.game.stage.getNumChildren() + " Entities";
};

DebugInfoFrame.prototype.type = 'DEBUG_INFO_FRAME';