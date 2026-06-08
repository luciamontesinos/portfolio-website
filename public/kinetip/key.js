class Key {
  constructor(x, y, l, w, h, p5) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.w = w;
    this.h = h;
    this.f = 40;
    this.p5 = p5;
    this.hidden = true;
    this.m = "empty";
    this.ts = 0;
    this.sw = 0;
    this.s = 180;
  }
  show(mode) {
    this.m = mode;

    if (this.m == "correct") {
      this.f = [76, 136, 37];
      this.lf = "white";
      this.ts = this.h / 1.5;
      this.sw = keySize / 20;
    } else if (this.m == "semi") {
      this.f = [223, 174, 0];
      this.lf = "white";
      this.ts = this.h / 1.5;
      this.sw = keySize / 20;
    } else if (this.m == "error") {
      this.f = 127;
      this.lf = "white";
      this.ts = this.h / 1.5;
      this.sw = keySize / 20;
    } else if (this.m == "menuButton") {
      this.f = [102, 177, 214];
      this.lf = "white";
      this.ts = this.h / 6;
      this.sw = 5;
      this.s = [102, 177, 214];
    }

    // DEFAULT EMPTY
    else {
      this.f = 223;
      this.lf = "black";
      this.ts = this.h / 1.5;
    }

    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.fill(this.f);
    this.p5.stroke(this.s);
    this.p5.strokeWeight(this.sw);
    this.p5.rect(0, 0, this.w, this.h, this.h / 5);
    this.p5.fill(this.lf);
    this.p5.noStroke();
    this.p5.textSize(this.ts);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.text(this.l.toUpperCase(), this.w / 2, this.h / 2);
    this.hidden = false;
    this.p5.pop();
  }
  contains(x, y) {
    if (this.hidden == false) {
      return (
        x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
      );
    } else {
      return false;
    }
  }
  hide() {
    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.fill(255);
    this.p5.stroke(255);
    this.p5.strokeWeight(keySize / 20);
    this.p5.rect(0, 0, this.w, this.h, this.h / 5);
    this.p5.fill(255);
    this.p5.noStroke();
    this.p5.textSize(this.h / 1.5);
    this.hidden = true;
    //this.p5.text(this.l.toUpperCase(), this.h / 3.8, this.h / 1.3);
    this.p5.pop();
  }
}
