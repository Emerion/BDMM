function SkillInfoFrame(game) {
	this.game = game;

	var sci = this;

	this.game.eventDispatcher.addEventListener('skillCooldown', function(event) {sci.setCooldown(event);});

	this.points = 0;

	var ss = new createjs.SpriteSheet({
		"animations":
		{
			'timer3': {
				frames: [6],
				next: 'timer3',
				speed: 0.001
			},
			'timer2': {
				frames: [7],
				next: 'timer2',
				speed: 0.001
			},
			'timer1': {
				frames: [8],
				next: 'timer1',
				speed: 0.001
			},
			'timer0': {
				frames: [9],
				next: 'timer0',
				speed: 0.01
			}
		},
		"images": ["img/skilliconsprite.png"],
		"frames":
		{
			"height": 128,
			"width":128,
			"regX": 0,
			"regY": 0,
			"count": 10
		}
	});

	this.timer = 0;

	this.sprite = new createjs.Sprite(ss, "timer0");
	this.addChild(this.sprite);
}

SkillInfoFrame.prototype = new createjs.Container();
SkillInfoFrame.prototype.game = null;

SkillInfoFrame.prototype.setCooldown = function(event) {
	this.timer = event.target;
	var self = this;

	self.sprite.gotoAndPlay('timer' + this.timer);

	if (self.timer > 0) {
		window.setTimeout(function() {
			self.setCooldown({target:--self.timer});
		}, 1000);
	}

};