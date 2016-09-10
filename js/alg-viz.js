class VPage {
	constructor(ctx) {
		this.objects = [];
	}

	add_object(o) {
		this.objects.push(o);
        document.body.appendChild(o.elem);
	}
}

class VObj {
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

class VVar extends VObj {
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
class VList extends VObj {
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
}
