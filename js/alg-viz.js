OUTPAD = 20;
INPAD = 12;
FONT_SIZE = 12;

function VPage(ctx) {
	this.ctx = ctx;
	this.views = [];

	ctx.canvas.width = document.body.clientWidth;
	ctx.font = FONT_SIZE + "px monospace";
	ctx.textBaseline = "hanging";

	this.add_view = function (v) {
		this.views.push(v);
		v.obj.add_listener(this);
	}

	this.notify = function (o) {
		console.log("notified!");
	}

	this.render = function () {
		var y = OUTPAD;

		for (var i = 0; i < this.views.length; i++) {
			this.views[i].render(this.ctx, OUTPAD, y, this.ctx.canvas.width - 2*OUTPAD);
			y += OUTPAD + this.views[i].full_height();
		}
	}
}

function VObj(name) {
	this.nomme = name;
	this.listeners = [];

	this.add_listener = function (l) {
		this.listeners.push(l);
	}

	this.update = function () {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].notify(this);
		}
	}
}

function VView(obj, height) {
	this.obj = obj;
	this.height = height;
	
	this.render = function (ctx, x, y, width) {
		ctx.strokeStyle = "black";
		var old_font = ctx.font;
		//ctx.font = "bold " + old_font;
		ctx.fillText(this.obj.nomme, x + INPAD, y + INPAD);
		ctx.font = old_font;
		ctx.stroke();

		ctx.strokeStyle = "#FF0000";
		ctx.rect(x, y, width, this.height + INPAD*3 + FONT_SIZE);
		ctx.stroke();
	}

	this.full_height = function () {
		return this.height + FONT_SIZE + INPAD*3;
	}
}

