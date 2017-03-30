var COLOR1 = "#6060ff";
var COLOR2 = "#ff6060";
var SUCCESS = "#60ff60";

class Sort {
  constructor(page) {
    this.page = page;

    /* Construct the objects */
    this.list = new _List("Numbers", true, false, 30);
    this.status = new _Container("Status", true, false);
    this.cmps = new _Var("Comparisons", true, true, 0);
    this.xchgs = new _Var("Exchanges", true, true, 0);

    /* Add all the objects to the pages */
    page.add_object(this.list);
    page.add_object(this.status);
    page.add_object(this.cmps);
    page.add_object(this.xchgs);

    /* Normalize the widths of all the elements in the list */
    this.list.normalize_width();
  }

  /* Generates the list to sort */
  generate(n, max) {
    /* Randomly chooses all the numbers and puts them in the list */
    for (var i = 0; i < n; i++) this.list.add_object(new _Var("", false, false, Math.round(Math.random() * max)));

    /* Normalize the widths of all the elements in the list */
    this.list.normalize_width();
  }

  /* Updates the status of this sorting algorith */
  update(status) {
    $(this.status.cont).empty();
    $(this.status.cont).html(status);
  }

  /* Compare two elements in two different lists */
  *lessl(l1, i, l2, j) {
    this.cmps.value++;

    /* Mark the list elements for coloring */
    l1.color(i, COLOR1);
    l2.color(j, COLOR2);

    /* STEP: Compare the two elements */
    this.update("Comparing elements " + l1.box(i) + " and " + l2.box(j) + ".");
    yield;

    /* STEP: Report the result */
    var result = l1.get_object(i).value <= l2.get_object(j).value;
    this.update("Result: " + l1.box(i) + (result ? "<=" : ">") + l2.box(j));
    yield;

    /* Uncolor the list elements */
    l1.uncolor(i);
    l2.uncolor(j);

    return result;
  }

  /* Compare two elements in the same list */
  *less(i, j) {
    return yield* this.lessl(this.list, i, this.list, j);
  }

  /* Exchange two elements in two different lists */
  *xchgl(l1, i, l2, j) {
    this.xchgs.value++;

    /* Mark the list elements for exchange */
    l1.color(i, COLOR1);
    l2.color(j, COLOR2);

    /* STEP: Exchange the two elements */
    this.update("Exchanging elements " + l1.box(i) + " and " + l2.box(j) + ".");
    yield;

    var tmp = l1.get_object(i).value;
    l1.get_object(i).value = l2.get_object(j).value;
    l2.get_object(j).value = tmp;
    this.update("Exchanged elements " + l1.box(i) + " and " + l2.box(j) + ".");
    yield;

    /* Uncolor the list elements */
    l1.uncolor(i);
    l2.uncolor(j);
  }

  /* Exchange two elements in the same list */
  *xchg(i, j) {
    yield* this.xchgl(this.list, i, this.list, j);
  }
}

class SelectionSort extends Sort {
  /* Run the selection sort */
  *execute() {
    var i = 0;

    while (i < this.list.length()) {
      var mindex = i;

      for (var j = i; j < this.list.length(); j++) {
        this.list.color(j, COLOR1);

        if (j > 0) this.list.uncolor(j-1);

        var cmp = yield* this.less(j, mindex);

        if (cmp) {
          this.list.uncolor(mindex);
          mindex = j;
        }

        this.list.color(mindex, COLOR2);
      }

      yield* this.xchg(i, mindex);

      this.list.gap(i);
      if (i > 0) this.list.ungap(i-1);
      this.list.uncolor(mindex);
      this.list.uncolor(j-1);
      i++;
    }

    this.update("Done.");
  }
}

class InsertionSort extends Sort {
  *execute() {
    var i = 1;
    var j;

    while (i < this.list.length()) {
      if (i > 0) this.list.ungap(i-1);
      this.list.gap(i);
      yield;

      j = i;

      while (j > 0) {
        if (!(yield* this.less(j-1, j))) {
          yield* this.xchg(j-1, j);
          j--;
        } else break;
      }

      this.list.color(j, SUCCESS);
      this.update("Successfully inserted item " + this.list.box(j) + ".");
      yield;
      this.list.uncolor(j);

      i++;
    }

    this.update("Done.");
  }
}

/* Implementation based off of Algorithms by Robert Sedgewick */
class MergeSort extends Sort {
  generate(n,u) {
    super.generate(n,u);

    this.aux = new _List("Auxiliary", true, false);
    for (var i = 0; i < this.list.length(); i++) this.aux.add_object(new _Var("", false, false, "_"));

    this.page.add_object(this.aux);
    this.aux.set_width(this.list.get_width());
  }

  *merge(lo, mid, hi) {
    for (var i = lo; i <= hi; i++) {
      yield* this.xchgl(this.list, i, this.aux, i);
    }

    var r = lo, s = mid+1;
    for (var i = lo; i <= hi; i++) {
      if (r > mid) yield* this.xchgl(this.list, i, this.aux, s++);
      else if (s > hi) yield* this.xchgl(this.list, i, this.aux, r++);
      else if (yield* this.lessl(this.aux, r, this.aux, s)) yield* this.xchgl(this.list, i, this.aux, r++);
      else yield* this.xchgl(this.list, i, this.aux, s++);
    }
  }

  *sort(lo, hi) {
    for (var i = 0; i < this.list.length(); i++) {
      if (lo <= i && i <= hi) this.list.enable(i);
      else this.list.disable(i);
    }

    if (hi <= lo) return;
    var mid = Math.trunc(lo + (hi-lo) / 2);

    this.update("Sorting first half.");
    yield;
    yield* this.sort(lo, mid);
    this.update("Sorted first half.");
    yield;

    this.update("Sorting second half.");
    yield;
    yield* this.sort(mid+1, hi);
    this.update("Sorted second half.");
    yield;

    for (var i = 0; i < this.list.length(); i++) {
      if (lo <= i && i <= hi) this.list.enable(i);
      else this.list.disable(i);
    }

    this.update("Merging.");
    yield;
    yield* this.merge(lo, mid, hi);
    this.update("Merged.");
    yield;
  }

  *execute() {
    yield* this.sort(0, this.list.length() - 1);

    this.update("Done.");
  }
}
