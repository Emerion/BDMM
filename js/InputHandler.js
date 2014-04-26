var InputHandler = function (game) {
	this.game = game;
	var inputHandler = this;
	document.onkeydown = function (evt) {
		inputHandler.onKeyPress(evt)
	};
	document.onkeyup = function (evt) {
		inputHandler.onKeyRelease(evt)
	};
};

InputHandler.prototype.game = null;
InputHandler.KEY_RIGHT = 39;
InputHandler.KEY_LEFT = 37;
InputHandler.KEY_UP = 38;
InputHandler.KEY_DOWN = 40;
InputHandler.KEY_SPACE = 32;
InputHandler.KEY_W = 87;
InputHandler.KEY_A = 65;
InputHandler.KEY_S = 83;
InputHandler.KEY_D = 68;
InputHandler.KEY_X = 88;
InputHandler.prototype.keyStates = {};

InputHandler.prototype.onKeyPress = function (event) {
	event = event ? event : window.event;

	if (event.which) {
		var keyCode = event.which;
	} else if (event.keyCode) {
		var keyCode = event.keyCode;
	}

	if (!this.keyStates[keyCode]) {
		this.keyStates[keyCode] = true;
//		this.game.onKeyPress(keyCode); not needed?
	}
};

InputHandler.prototype.onKeyRelease = function (event) {
	event = event ? event : window.event;

	if (event.which) {
		var keyCode = event.which;
	} else if (event.keyCode) {
		var keyCode = event.keyCode;
	}

	if (this.keyStates[keyCode]) {
		this.keyStates[keyCode] = false;
//		this.game.onKeyRelease(keyCode); not needed?
	}
};