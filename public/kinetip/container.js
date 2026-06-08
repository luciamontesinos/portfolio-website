class Container {
  constructor(x, y, w, h, f, s, p5) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.f = f;
    this.l = "";
    this.a = 0;
    this.ta = 3.14 * 3;
    this.visible = true;
    this.wCopy = w;
    this.hCopy = h;
    this.p5 = p5;
    this.hidden = true;
  }
  show() {
    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.fill(this.f);
    this.p5.stroke([0, 101, 152]);
    this.p5.strokeWeight(3);
    this.p5.rect(0, 0, this.w, this.h, this.h / 15);
    this.p5.fill(0);

    this.p5.textSize(this.p5.abs(this.h / 1.5));
    this.p5.text(this.l.toUpperCase(), 0, this.w / 24);
    this.p5.pop();
    this.hidden = false;
  }
  contains(x, y) {
    if (this.hidden == false) {
      return (
        x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
      );
    } else return false;
  }
  morph() {
    this.a = this.p5.lerp(this.a, this.ta, 0.1);
    this.h = this.w * this.p5.abs(this.p5.cos(this.a));
  }

  hide() {
    this.p5.push();
    this.p5.translate(this.x, this.y);

    this.p5.rect(0, 0, this.w, this.h, this.h / 15);
    this.p5.fill(0);
    this.p5.noStroke();

    this.hidden = true;
    //this.p5.text(this.l.toUpperCase(), this.h / 3.8, this.h / 1.3);
    this.p5.pop();
  }
  //clickListener(x, y){
  //  if (this.contains(x, y)){

  //     this.p5.print("hide");

  //     this.w = 0;
  //     this.h = 0;

  //     this.show();
  //     this.p5.background(0);

  //  }else{
  //     this.p5.print("make visible");

  //     this.w = this.wCopy;
  //     this.h = this.hCopy;
  //     this.p5.background(0);
  //     this.show();

  //  }
  //}
}
