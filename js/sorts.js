var MIN = "#80f080";
var TEST = "#f08080";

class Sort {
    constructor(page) {
        this.page = page;

        this.list = new VList("Numbers", true, false);

        for (var i = 0; i < 8; i++) this.list.add_object(new VVar("", false, false, Math.round(Math.random() * 500)));

        this.cmps = new VVar("Comparisons", true, true, 0);
        this.xchgs = new VVar("Exchanges", true, true, 0);

        page.add_object(this.list);
        page.add_object(this.cmps);
        page.add_object(this.xchgs);

        this.list.normalize_width();
    }

    lessl(l1, i, l2, j) {
        this.cmps.value++;

        return l1.get_object(i).value <= l2.get_object(j).value;
    }

    less(i, j) {
        return this.lessl(this.list, i, this.list, j);
    }

    xchgl(l1, i, l2, j) {
        this.xchgs.value++;

        var dx = $(l2.get_object(j).elem).position().left-$(l1.get_object(i).elem).position().left;
        var dy = $(l2.get_object(j).elem).position().top-$(l1.get_object(i).elem).position().top;

        /*$(l1.get_object(i).elem).animate({
            top: "+="+dy,
            left: "+="+dx
        }, 100);

        $(l2.get_object(j).elem).animate({
            top: "+="+(-dy),
            left: "+="+(-dx)
        }, 100);*/

        var tmp = l1.get_object(i).value;
        l1.get_object(i).value = l2.get_object(j).value;
        l2.get_object(j).value = tmp;
    }

    xchg(i, j) {
        this.xchgl(this.list, i, this.list, j);
    }
}

class SelectionSort extends Sort {
    *execute() {
        var i = 0;

        while (i < this.list.length()) {
            var mindex = i;

            for (var j = i; j < this.list.length(); j++) {
                this.list.color(j, TEST);
                if (j > 0) this.list.uncolor(j-1);

                if (this.less(j, mindex)) {
                    this.list.uncolor(mindex);
                    mindex = j;
                }

                this.list.color(mindex, MIN);

                yield;
            }

            this.xchg(i, mindex);

            this.list.gap(i);
            if (i > 0) this.list.ungap(i-1);
            this.list.uncolor(mindex);
            this.list.uncolor(j-1);
            i++;

            yield;

        }
    }
}

class InsertionSort extends Sort {
    *execute() {
        var i = 0;
        var j;

        while (i < this.list.length()) {
            if (i > 0) this.list.ungap(i-1);
            this.list.gap(i);
            this.list.color(i, TEST);
            yield;

            j = i;

            while (j != 0 && !this.less(j-1, j)) {
                this.xchg(j-1, j);
                this.list.uncolor(j);
                this.list.color(j-1, TEST);
                j--;

                yield;
            }

            this.list.color(j, MIN);
            yield;
            this.list.uncolor(j);

            i++;
        }
    }
}

/* Implementation based off of Algorithms by Robert Sedgewick */
class MergeSort extends Sort {
    constructor(page) {
        super(page);

        this.aux = new VList("Auxiliary", true, false);
        for (var i = 0; i < this.list.length(); i++) this.aux.add_object(new VVar("", false, false, "_"));

        page.add_object(this.aux);
        this.aux.set_width(this.list.get_width());
    }

    *merge(lo, mid, hi) {
        for (var i = lo; i <= hi; i++) {
            this.xchgl(this.list, i, this.aux, i);
            yield;
        }

        var r = lo, s = mid+1;
        for (var i = lo; i <= hi; i++) {
            if (r > mid) yield this.xchgl(this.list, i, this.aux, s++);
            else if (s > hi) yield this.xchgl(this.list, i, this.aux, r++);
            else if (this.lessl(this.aux, r, this.aux, s)) yield this.xchgl(this.list, i, this.aux, r++);
            else yield this.xchgl(this.list, i, this.aux, s++);
        }
    }

    show_recursion(lo, hi) {
        for (var i = 0; i < this.list.length(); i++) {
            if (lo <= i && i <= hi) {
                this.list.enable(i);
                this.aux.enable(i);
            } else {
                this.list.disable(i);
                this.aux.enable(i);
            }
        }
    }

    *sort(lo, hi) {
        console.log("SORTING", lo, hi);
        for (var i = 0; i < this.list.length(); i++) {
            if (lo <= i && i <= hi) this.list.enable(i);
            else this.list.disable(i);
        }

        yield;
        if (hi <= lo) return;
        var mid = Math.trunc(lo + (hi-lo) / 2);

        yield;
        yield* this.sort(lo, mid);

        yield;
        yield* this.sort(mid+1, hi);

        for (var i = 0; i < this.list.length(); i++) {
            if (lo <= i && i <= hi) this.list.enable(i);
            else this.list.disable(i);
        }

        yield;
        yield* this.merge(lo, mid, hi);
    }

    *execute() {
        yield* this.sort(0, this.list.length() - 1);
    }
}
