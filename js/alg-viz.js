/** A visualized list. */
function VizList() {
	this.offset = 0;
	this.data = new Array();
	
	this.get = function (i) {
		return this.data[i];
	}
	
	this.set = function (i, data) {
		this.data[i] = data;
	}
}

/** Visualized list viewer. */
function VizListView(list, size, head, id) {
	this.container = $('#'+id);
	this.head = head;
	this.size = size;
	this.list = list;
	
	this.reset = function() {
		this.container.empty();
		this.container.append("<tr><th>Index</th><th>Value</th></tr>");
		
		for (i = 0; i < this.size; i++) {
			this.container.append("<tr><td></td><td></td></tr>");
		}
	}
	
	this.highlight = function (i) {
		$($(this.container.children()[0]).children()[i+1]).css("background-color", "green");
	}
	
	this.update = function () {
		for (i = 0; i < this.size; i++) {
			elem = $($(this.container.children()[0]).children()[i+1]);
			$(elem.children()[0]).html(this.head+i);
			$(elem.children()[1]).html(this.list.get(this.head+i));
		}
	}
}

/** A visualized dictionary. */
function VizDict() {
	this.data = {};
	
	this.get = function (i) {
		return this.data[i];
	}
	
	this.set = function (i, j) {
		this.data[i] = j;
	}
	
	this.keys = function() {
		return Object.keys(this.data);
	}
}

/** Visualized table viewer. */
function VizTableView(dict, x, y, id) {
	this.x = x;
	this.y = y;
	this.dict = dict;
	this.container = $('#'+id);
	
	this.reset = function () {
		this.container.empty();
		
		str = "<tr>";
		
		for (xlab of x) {
			str += "<th>"+xlab+"</th>";
		}
		
		for (ylab of y) {
			str += "<th>"+ylab+"</th>";
		}
		
		str += "</tr>";
		this.container.append(str);
		
		str = "<tr>";
		for (i = 0; i < x.length + y.length; i++) {
			str += ("<td></td>");
		}
		str += "</tr";
		
		for (i = 0; i < this.dict.keys().length; i++) {
			this.container.append(str);
		}
	}
	
	this.update = function () {
		idx = 1;
		for (key in this.dict.data) {
			console.log(key);
			elem = $($(this.container.children()[0]).children()[idx]);
			
			for (i = 0; i < this.x.length; i++) {
				$(elem.children()[i]).html(key[i]);
			}
			
			for (i = 0; i < this.y.length; i++) {
				$(elem.children()[i+this.x.length]).html(this.dict.get(key)[i]);
			}
			
			idx += 1;
				
			console.log(key);
			console.log(this.dict.get(key));
		}
	}
}