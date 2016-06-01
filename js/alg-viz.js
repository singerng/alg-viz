/** A visualized list. */
function VizList() {
	this.offset = 0;
	this.data = new Array();
	
	this.get = function (idx) {
		return this.data[idx+this.offset];
	}
	
	this.set = function (idx, data) {
		this.data[idx+this.offset] = data;
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
		for (i = 0; i < this.size; i++) {
			this.container.append("<tr><td>heyy</td><td></td></tr>");
		}
	}
	
	this.update = function() {
		for (i = 0; i < this.size; i++) {
			elem = this.container.children()[0];
			elem.html("HEY");
		}
	}
}