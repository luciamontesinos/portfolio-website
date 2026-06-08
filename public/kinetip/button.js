class Button {
  constructor(t, x, y, r, ts, f, s, tf, o, p5) {
    // coords    x,y
    // radio     r
    // text size ts
    // text      t
    // fill      f
    // stroke    s
    // text fill tf
    // orientation (top left, top right, top center, bottom left, bottom right bottom center)
    this.x = x;
    this.y = y;
    this.r = r;
    this.ts = r / 5;
    this.t = t;
    this.f = f;
    this.s = s;
    this.tf = tf;
    this.o = o;
    this.p5 = p5;
    this.hidden = true;
    this.hasExpanded = false;
  }
  show() {
    this.p5.push();
    this.p5.textFont(handlee);
    this.p5.fill(this.f);
    this.p5.stroke(this.f);
    this.p5.translate(this.x, this.y);
    this.p5.strokeWeight(this.s);
    this.p5.textSize(this.ts);
    this.p5.circle(0, 0, this.r);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);

    this.p5.fill(this.tf);
    this.p5.text(this.t, 0, 0);

    // if (this.o == "bl") {
    //   this.p5.text(this.t, -this.r / 6, -this.r / 8);
    // } else if (this.o == "br") {
    //   this.p5.text(this.t, -this.r / 3, -this.r / 8);
    // } else if (this.o == "bc") {
    //   this.p5.text(this.t, -this.r / 8, -this.r / 8);
    // }
    // else if (this.o == "tl") {
    //   this.p5.text(this.t, -this.r / 4, +this.r / 4);
    // }
    // else if (this.o == "tr") {
    //   this.p5.text(this.t, -this.r / 4, +this.r / 4);
    // }
    // else if (this.o == "tc") {
    //   this.p5.text(this.t, -this.r / 6, +this.r / 3);
    // }
    this.hidden = false;

    this.p5.pop();
  }
  contains(x, y) {
    if (this.hidden == false) {
      return (((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) < (this.r / 2 * this.r / 2));
    }
    else {
      return false;
    }

  }

  expand() {
    if (this.hasExpanded == false) {
      this.hasExpanded = true;
      this.hide();
      this.ts = this.ts * 1.5;
      this.r = this.r * 1.5;
      this.show();
    }

    // MAKE THE BUTTON BIGGER WHEN SELECTED
  }

  hide() {

    this.p5.push();
    this.p5.fill(255);
    this.p5.stroke(255);
    this.p5.translate(this.x, this.y);
    this.p5.strokeWeight(this.s);
    this.p5.textSize(this.ts);
    this.p5.circle(0, 0, this.r);
    this.hidden = true;
    this.p5.pop();
  }
}
