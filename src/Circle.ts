import P5 from "p5";

export default class Circle {
	_p5: P5;
	_pos: P5.Vector;
  _size: number;
  _color: string;
  _visible: boolean = true;

	constructor(p5: P5, atPosition: P5.Vector, size: number, color: string = "salmon") {
		this._p5 = p5;
		this._pos = atPosition;
    this._size = size;
    this._color = color;
  }
  
  toggle() {
    this._visible = !this._visible;
  }

	draw() {
    if (this._visible) {
      const p5 = this._p5;

      p5.push();
  
      p5.translate(this._pos);
      p5.noStroke();
      p5.fill(this._color);
      p5.ellipse(0, 0, this._size);
  
      p5.pop();
    }
	}
}
