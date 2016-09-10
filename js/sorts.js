var MIN = "#80f080";
var TEST = "#f08080";

class Sort {
    constructor(page) {
        this.page = page;

        this.list = new VList("Numbers", true, false);

        for (var i = 0; i < 20; i++) this.list.add_object(new VVar("", false, false, Math.round(Math.random() * 500)));

        this.cmps = new VVar("Comparisons", true, true, 0);
        this.xchgs = new VVar("Exchanges", true, true, 0);

        page.add_object(this.list);
        page.add_object(this.cmps);
        page.add_object(this.xchgs);
    }

    less(i, j) {
        this.cmps.value++;
        return this.list.get_object(i).value <= this.list.get_object(j).value;
    }

    xchg(i, j) {
        this.xchgs.value++;

        var tmp = this.list.get_object(i).value;
        this.list.get_object(i).value = this.list.get_object(j).value;
        this.list.get_object(j).value = tmp;
    }
}

class SelectionSort extends Sort {
    *execute() {
        var i = 0;

        while (i < this.list.length()) {
            var mindex = i;

            for (var j = i; j < this.list.length(); j++) {
                if (j>0) this.list.uncolor(j-1);
                this.list.color(j, TEST);

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
