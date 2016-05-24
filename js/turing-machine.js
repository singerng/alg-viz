"use strict";

var DIR = {
	LEFT : -1,
	RIGHT : 1
};

class TuringMachine {
	constructor(alphabet, states, start, accept, trans, input) {
		this.alphabet = alphabet;
		this.states = states;
		this.start = start;
		this.accept = accept;
		this.trans = trans;
		
		if (states.indexOf(start) == -1) throw "Start state not in states";
		accept.forEach(function (state) {
			if (states.indexOf(state) == -1) throw "Accept state not in states: " + accept;
		});
		input.forEach(function (sym) {
			if (alphabet.indexOf(sym) == -1) throw "Input symbol not in state:s " + sym;
		});
		
		this.head = 0;
	}
	
	step() {
		var res = this.trans[this.state][this.input[this.head]];
		
		this.state = res[0];
		this.input[this.head] = res[1];
		this.head += res[2];
		
		if (this.head == this.input.length) this.input.push(null);
		if (this.head == -1) {
			this.head++;
			this.input.unshift(null);
		}
	}
}

function main() {
    //window.setInterval(renderTime, 1000);//rerenders at set intervals

    //renderTime();
    
    var alp = [0,1];
    var states = [0,1,2,3];
    var start = 0;
    var accept = [2,3];
    var tm = new TuringMachine(alp, states, start, accept, null, [0]);
}

main();