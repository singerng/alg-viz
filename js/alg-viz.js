var OUTPAD = 20;
var INPAD = 12;
var FONT_SIZE = 14;
var RADIUS = 10;

function round_rect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x+radius, y);
    ctx.lineTo(x+width-radius, y);
    ctx.arcTo(x+width, y, x+width, y+radius, radius);
    ctx.lineTo(x+width, y+height-radius);
    ctx.arcTo(x+width, y+height, x+width-height, y+height, radius);
    ctx.lineTo(x+radius, y+height);
    ctx.arcTo(x, y+height, x, y+height-radius, radius);
    ctx.lineTo(x, y+radius);
    ctx.arcTo(x, y, x+radius, y, radius);
    ctx.stroke();
}

class VPage {
	constructor(ctx) {
		this.ctx = ctx;
		this.objects = [];

		ctx.canvas.width = document.body.clientWidth;
		ctx.font = FONT_SIZE + "px Open Sans";
		ctx.textBaseline = "hanging";
	}

	add_object(o) {
		this.objects.push(o);
	}

	render() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		var y = OUTPAD;

		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].full_render(this.ctx, OUTPAD, y, this.ctx.canvas.width - 2*OUTPAD);
			y += OUTPAD + this.objects[i].full_height();
		}
	}
}

class VObj {
	constructor(name, span_width) {
		this.nomme = name;
        this.span_width = span_width;
	}
	
	full_render(ctx, x, y) {
		if (this.nomme) {
			var old_font = ctx.font;
			ctx.font = "bold " + old_font;
			ctx.fillText(this.nomme, x + INPAD, y + INPAD);
			ctx.font = old_font;
		}

		ctx.lineWidth = .5;
		ctx.strokeStyle = "gray";
        
        var width;
            
        round_rect(ctx, x, y, this.full_width(ctx), this.full_height(), RADIUS);

		this.render(ctx, x + INPAD, y + INPAD + (this.nomme ? (INPAD + FONT_SIZE) : 0));
	}

	full_height() {
		return this.height() + INPAD*2 + (this.nomme ? (INPAD + FONT_SIZE) : 0);
	}

	full_width(ctx) {
		if (this.span_width) return document.body.clientWidth - 2*OUTPAD;
        else return Math.max(this.width(ctx), ctx.measureText(this.nomme).width) + INPAD*2;
	}
}

class VVar extends VObj {
    constructor(name, value) {
        super(name, false);
        this.value = value;
    }
    
    render(ctx, x, y) {
        ctx.fillText(this.value, x, y);
    }
    
    height() {
        return FONT_SIZE;
    }
    
    width(ctx) {
        return ctx.measureText(this.value).width;
    }
}

class VList extends VObj {
    constructor(name) {
        super(name, true);
        this.objects = [];
        this.carets = [];
    }
    
    add_caret(i, color) {
        this.carets[i] = color;
    }
    
    clear_caret(i) {
        delete this.carets[i];
    }
    
    add_object(o) {
        this.objects.push(o);
    }
    
    get_object(i) {
        return this.objects[i];
    }
    
    set_object(i, o) {
        this.objects[i] = o;
    }
    
    remove_object(i) {
        this.objects.splice(x,1);
    }
    
    length() {
        return this.objects.length;
    }
    
	render(ctx, x, y) {
        x += this.full_width(ctx) / 2 - this.width(ctx) / 2;
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].full_render(ctx, x, y);
            
            if (this.carets[i]) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = this.carets[i];
                ctx.lineWidth = 2;
                ctx.moveTo(x + 2*this.objects[i].full_width(ctx)/5, y + this.objects[i].full_height() + 2*INPAD/3);
                ctx.lineTo(x + this.objects[i].full_width(ctx)/2, y + this.objects[i].full_height() + INPAD/3);
                ctx.lineTo(x + 3*this.objects[i].full_width(ctx)/5, y + this.objects[i].full_height() + 2*INPAD/3);
                ctx.stroke();
                ctx.restore();
            }
            
            x += this.objects[i].full_width(ctx) + INPAD;
        }
    }
    
    height() {
        var height = 0;
        
        for (var i = 0; i < this.objects.length; i++) {
            height = Math.max(height, this.objects[i].full_height());
        }
        
        return height;
    }
    
    width(ctx) {
        var width = 0;
        
        for (var i = 0; i < this.objects.length; i++) {
            width += this.objects[i].full_width(ctx) + INPAD;
        }
        
        return width;
    }
}