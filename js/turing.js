function error() {}
function move() {}
function value() {}
function state() {}

/** The main turing machine object. */
function TuringMachine(start, accept, trans, tape, head) {
    
    /** The input symbols. */
    this.start = start;
    this.accept = accept;
    this.trans = trans;
    
    /** Convert the tape to an object. */
    if (tape.constructor === Array) {
        var t = this.tape = {};
        tape.map(function(s, i) { t[i] = s; }); 
    } else this.tape = tape;
    
    /** Internal tracking. */
    this.state = start;
    this.head = head || 0;
    
    /** Step forward. */
    this.step = function() {
        
        /* Cancel if finished. */
        if (this.state == this.accept) return;
        
        /* Get the next instructions. */
        var next = this.trans[[this.state, this.tape[this.head]]];
        if (!next) { error(); return; }
        
        this.state = next[0];
        state(next[0]);
        
        this.tape[this.head] = next[1];
        value(this.head, next[1]);        
        
        this.head += next[2] || 0;
        move(this.head);
        
    }
    
}
