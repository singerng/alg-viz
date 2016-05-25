PADDING_Y = 5;
PADDING_X = 5;

/** Any visualized object. */
function VizObj(name, width, height) {
	this.name = name;
	this.width = width;
	this.height = height;
	
	this.render = function (ctx, x, y) {
		ctx.fillText(this.name, x, y);
		
		ctx.rect(x, y + PADDING_Y + ctx.measureText(this.name).height, this.width, this.height + PADDING_Y * 2);
	}
	
	this.fullWidth() = function (ctx) {
		return this.width + PADDING_X * 2;
	}
	
	this.fullHeight() = function (ctx) {
		return this.height + PADDING_Y * 3 + ctx.measureText(this.name).height;
	}
}

/** A visualized list. */
function VizList(name) {
	//this.prototype = VizObj(name);
}