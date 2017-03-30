SUCCESS = "#00ff30";

class _Page {
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

function blank() {
	return new _Var("", false, false, "--");
}

class _Array extends _Object {
  constructor(name, block, compressed, width) {
    super(name, block, compressed);
    this.objects = [];
    this.gaps = [];

		this.contents = document.createElement("div");
		this.elem.appendChild(this.contents);

		this.width = width;
		this.head = 0;
  }

	get head() {
		return this._head;
	}

	set head(x) {
		this._head = x;

		for (var i = 0; i < this.width; i++) {
			if (this.objects[this.head + i] === undefined) this.objects[this.head + i] = blank();
		}

		$(this.contents).empty();

		for (var i = 0; i < this.width; i++) {
			this.contents.appendChild(this.objects[this.head + i].elem);
		}
	}

  set_object(o, i) {
		this.objects[i] = o;

		if (this.head <= i && i < this.head + this.width) {
			$($(this.contents).find(':nth-child(' + (i - this.head + 1) + ')')[0]).replaceWith(o.elem);
		}

		this.normalize_width();
  }

	length() {
		return this.objects.length;
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
		for (let i = 0; i < this.width; i++) $(this.objects[this.head + i].elem).width(w);
	}

	get_width() {
		var w = 0;
		for (let i = 0; i < this.width; i++) w = Math.max(w, $(this.objects[this.head + i].elem).width());
		return w;
	}

	normalize_width() {
		this.set_width(this.get_width());
	}

	box(i) {
		return this.objects[i].elem.outerHTML;
	}
}

class _Table extends _Object {
	constructor(name, block, compressed, labels, data) {
    super(name, block, compressed);
		this.labels = labels;
		this.data = data;

		this.contents = document.createElement("table");
		this.elem.appendChild(this.contents);

		let header = document.createElement("tr");
		for (let i = 0; i < this.labels.length; i++) $(header).append("<th>" + labels[i] + "</th>");

		this.contents.append(header);

		for (let record of data) {
			let row = document.createElement("tr");

			for (let label of labels) {
				$(row).append("<td>" + record[label] + "</td>");
			}

			this.contents.append(row);
		}
  }

	color(i, c) {
		$($(this.contents).children(':nth-child(' + (i+2) + ')')[0]).css("background-color", c);
	}

	uncolor(i) {
		$($(this.contents).children(':nth-child(' + (i+2) + ')')[0]).css("background-color", "white");
	}

	lookup(partial) {
		var index = 0;

		for (let record of this.data) {
			let good = true;

			for (let key in partial) {
				if (partial[key] != record[key]) good = false;
			}

			if (good) return {record: record, index: index};

			index += 1;
		}
	}
}
