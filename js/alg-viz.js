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

/** Visualized list viewer */
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