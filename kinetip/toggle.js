class Toggle {
    constructor(t, x, y, w, h, ts, f, s, tf, o, p5) {
        // coords    x,y
        // dim       w,h
        // text size ts
        // text      t
        // fill      f
        // stroke    s
        // text fill tf
        // orientation (left, right)
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.ts = ts;
        this.t = t;
        this.f = f;
        this.s = s;
        this.tf = tf;
        this.o = o;
        this.p5 = p5;
        this.hidden = true;
    }
    show() {
        this.p5.push();
        this.p5.fill(this.f);
        this.p5.textFont(handlee);
        this.p5.translate(this.x, this.y);
        this.p5.stroke(this.s);
        this.p5.textSize(this.ts);
        this.p5.rect(-this.w, 0, this.w * 2, this.h, this.w / 2);

        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);

        this.p5.fill(this.tf);
        // if (this.o == "l") {
        //     this.p5.text(this.t, this.w / 2 - this.w / 4, this.h / 2 + this.h / 9);
        // } else if (this.o == "r") {
        //     this.p5.text(this.t, this.w / 2 - this.w / 4, this.h / 2 + this.h / 9);
        // }
        this.p5.text(this.t, this.w / 2, this.h / 2);
        this.hidden = false;

        this.p5.pop();
    }
    contains(x, y) {
        if (this.hidden == false) {
            return ((x > this.x) && (x < this.x + this.w) && (y > this.y) && (y < this.y + this.h));
        } else {
            return false;
        }
    }

    expand() {
        // MAKE THE BUTTON BIGGER WHEN SELECTED
    }

    hide() {
        this.p5.push();
        this.p5.fill(255);
        this.p5.stroke(255);

        this.p5.translate(this.x, this.y);

        this.p5.textSize(this.ts);
        this.p5.rect(0, 0, this.w, this.h, this.w / 5);
        this.hidden = true;
        this.p5.pop();
    }
}
