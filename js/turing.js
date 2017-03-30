var TAPE_WIDTH = 20;

class Turing {
  constructor(page, accept, transitions) {
    this.page = page;

    this.accept_states = accept;

    /* Construct the objects */
    this.steps = new _Var("Steps", false, false, 0);
    this.head = new _Var("Tape Head", false, false, 0);
    this.state = new _Var("State", false, true, "start");
    this.accept = new _Var("Accept", false, true, accept.length > 0 ? accept.join(", ") : "none");
    this.status = new _Var("Status", false, true, "okay");
    this.tape = new _Array("Tape", true, false, TAPE_WIDTH + 1);
    this.transition = new _Table("Transition", true, false, ['old', 'oldsym', 'new', 'newsym', 'dir'], transitions);

    this.tape.head = -TAPE_WIDTH / 2;

    /* Add all the objects to the pages */
    page.add_object(this.steps);
    page.add_object(this.state);
    page.add_object(this.head);
    page.add_object(this.accept);
    page.add_object(this.status);
    page.add_object(this.tape);
    page.add_object(this.transition);
  }

  *execute() {
    var prev_index = 0;
    while (true) {
      this.transition.uncolor(prev_index);
      let lookup = this.transition.lookup({old: this.state.value, oldsym: this.tape.objects[this.head.value].value});

      if (lookup) {
        this.transition.color(lookup.index, SUCCESS);
        prev_index = lookup.index;

        if (this.accept_states.includes(lookup.record.new)) {
          this.status.value = "accept";
          break;
        }

        this.state.value = lookup.record.new;
        this.tape.set_object(new _Var("", false, false, lookup.record.newsym), this.head.value);
        this.tape.head += lookup.record.dir;
        this.head.value += lookup.record.dir;
        this.steps.value += 1;
      } else {
        this.status.value = "error";
        break;
      }

      yield;
    }
  }
}
