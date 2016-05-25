/** Direction constants. */
var L = -1;
var R = 1;

/** The main turing machine object. */
function TuringMachine(start, accept, dictionary, tape, head) {
    
    /** The input symbols. */
    this.start = start;
    this.accept = accept;
    this.dictionary = dictionary;
    
    /** Cached last direction. */
    var direction = 0;
    
    /** Convert the tape to an object. */
    if (tape.constructor === Array) {
        var t = this.tape = {};
        tape.map((s, i) => { t[i] = s; }); 
    } else this.tape = tape;
    
    /** Internal tracking. */
    this.state = start;
    this.head = head || 0;
    
    /** Step forward. */
    this.step = function() {
        
        /* Get the current instructions. */
        var next = this.dictionary[[this.state, this.tape[this.head] || null]];
        console.log(this.state, this.tape[this.head], next);
        this.state = next[0];
        this.tape[this.head] = next[1];
        this.head += (direction = next[2]) || direction;
        
    }
    
}
