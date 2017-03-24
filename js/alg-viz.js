class VPage {
	constructor(ctx) {
		this.objects = [];
	}

	add_object(o) {
		this.objects.push(o);
  	document.getElementById("algorithm").appendChild(o.elem);
	}
}

class _Object {
	constructor(name, block, compressed) {
    this.elem = document.createElement("div");
    this.elem.className = "box " + (block ? "block" : "float") + (compressed ? " compressed" : "");

    if (name) {
      var name_node = document.createElement("span");
      name_node.appendChild(document.createTextNode(name));
      this.elem.appendChild(name_node);
    }
	}
}

class _Container extends _Object {
	constructor(name, block, compressed) {
		super(name, block, compressed);

		this.cont = document.createElement("div");
		this.elem.appendChild(this.cont);
	}
}

class _Var extends _Object {
  constructor(name, block, compressed, value) {
    super(name, block, compressed);
    this.value = value;

		this.text.nodeValue = value;
    this.elem.appendChild(this.text);
  }

	set value(value) {
		if (this.text) this.text.nodeValue = value;
		else this.text = document.createTextNode(value);

		this._value = value;
	}

	get value() {
		return this._value;
	}
}

class _List extends _Object {
  constructor(name, block, compressed) {
    super(name, block, compressed);
    this.objects = [];
    this.carets = [];
    this.gaps = [];

		this.contents = document.createElement("div");
		this.elem.appendChild(this.contents);
  }

  add_object(o) {
    this.objects.push(o);
    this.contents.appendChild(o.elem);
  }

	length() {
		return this.objects.length;
	}

	get_object(i) {
		return this.objects[i];
	}

	gap(i) {
		$(this.objects[i].elem).addClass("gap");
	}

	ungap(i) {
		$(this.objects[i].elem).removeClass("gap");
	}

	color(i,c) {
		$(this.objects[i].elem).css("background-color", c);
	}

	uncolor(i) {
		$(this.objects[i].elem).css("background-color", "white");
	}

	disable(i) {
		this.color(i, "black");
	}

	enable(i) {
		this.uncolor(i);
	}

	set_width(w) {
		for (var i = 0; i < this.length(); i++) $(this.objects[i].elem).width(w);
	}

	get_width() {
		var w = 0;
		for (var i = 0; i < this.length(); i++) w = Math.max(w, $(this.objects[i].elem).width());
		return w;
	}

	normalize_width() {
		this.set_width(this.get_width());
	}

	box(i) {
		return this.objects[i].elem.outerHTML;
	}
}
