class Slot {
  constructor(x, y, size, row, col, p5) {
    // letter l (default "")
    // mode m (default = empty, current, correct, semi, error)




    this.x = x;
    this.y = y;
    this.w = size;
    this.h = size;
    this.size = size;
    this.f = 'white';
    this.l = '';
    this.lf = 'black';
    this.sw = 128;
    this.m = "empty";
    this.a = 0;
    this.ta = 3.14 * (6 - row);
    this.p5 = p5;
    this.hidden = true;
    this.s = 127;
  }
  show(letter, mode) {
    this.l = letter;
    this.m = mode;

    if (this.m == "current") {
      this.sw = 8;
      this.f = [230, 242, 248];
      this.lf = [0, 101, 152];
      this.s = [0, 101, 152];
    }
    else if (this.m == "correct") {
      this.sw = 3;
      this.f = [76, 136, 37];
      this.lf = 'white';
      this.s = 127;
    }

    else if (this.m == "semi") {
      this.sw = 3;
      this.f = [223, 174, 0];
      this.lf = 'white';
      this.s = 127;
    }

    else if (this.m == "error") {
      this.sw = 3;
      this.f = 'gray';
      this.lf = 'white';
      this.s = 127;
    }

    // DEFAULT EMPTY
    else {
      this.sw = 3;
      this.f = 'white';
      this.lf = 'black';
      this.s = 127;
    }

    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.fill(this.f);
    this.p5.stroke(this.s);
    this.p5.strokeWeight(this.sw);
    this.p5.rect(0, 0, this.size, this.size, this.size / 5);
    this.p5.fill(this.lf);
    this.p5.noStroke();
    this.p5.textSize(this.p5.abs(this.h / 1.5));
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.text(letter, this.w / 2, this.h / 2);
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
  morph() {
    this.a = lerp(this.a, this.ta, 0.1);
    this.h = this.w * abs(cos(this.a));
  }

  hide() {
    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.fill(255);
    this.p5.stroke(255);
    this.p5.strokeWeight(12);
    this.p5.rect(0, 0, this.size, this.size, this.size / 5);
    this.p5.fill(0);
    this.p5.noStroke();
    this.p5.textSize(this.p5.abs(this.h / 1.5));
    this.hidden = true;
    //this.p5.text(this.l.toUpperCase(), 0, this.size / 24);
    this.p5.pop();
  }



}
