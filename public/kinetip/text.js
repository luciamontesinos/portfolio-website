class Text {
  constructor(t, x, y, ts, f, o, p5) {
    // coords    x,y
    // text size ts
    // text      t
    // fill      f
    // stroke    s
    // orientation (top left, top right, top center, bottom left, bottom right bottom center)
    this.x = x;
    this.y = y;

    this.ts = ts;
    this.t = t;
    this.f = f;

    this.o = o;
    this.p5 = p5;
    this.hidden = true;
  }
  show(text) {
    this.t = text;
    this.p5.push();
    this.p5.fill(this.f);
    this.p5.noStroke();
    //this.p5.stroke(this.f);
    this.p5.textFont(inter);
    this.p5.translate(this.x, this.y);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(this.ts);

    if (this.o == "bl") {
      this.p5.text(this.t, 10, -80);
    } else if (this.o == "br") {
      this.p5.text(this.t, -100, -80);
    } else if (this.o == "bc") {
      this.p5.text(this.t, -10, -10);
    }
    else if (this.o == "tl") {
      this.p5.text(this.t, 10, +80);
    }
    else if (this.o == "tr") {
      this.p5.text(this.t, -100, +80);
    }
    else if (this.o == "tc") {
      this.p5.text(this.t, -10, +10);
    }
    else {
      this.p5.text(this.t, 0, 0);
    }

    this.hidden = false;
    this.p5.pop();
  }
  contains(x, y) {
    if (this.hidden == false) {
      return (((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) < (this.r / 2 * this.r / 2));
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
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    //this.strokeColor(255);
    this.p5.translate(this.x, this.y);
    this.p5.strokeWeight(this.s + 10);
    this.p5.textSize(this.ts);
    if (this.o == "bl") {
      this.p5.text(this.t, 10, -80);
    } else if (this.o == "br") {
      this.p5.text(this.t, -100, -80);
    } else if (this.o == "bc") {
      this.p5.text(this.t, -10, -10);
    }
    else if (this.o == "tl") {
      this.p5.text(this.t, 10, +80);
    }
    else if (this.o == "tr") {
      this.p5.text(this.t, -100, +80);
    }
    else if (this.o == "tc") {
      this.p5.text(this.t, -10, +10);
    }
    else {
      this.p5.text(this.t, 0, 0);
    }

    this.hidden = true;
    this.p5.pop();
  }
}
