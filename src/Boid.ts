import P5 from "p5";
import Flock from "./Flock";

export default class Boid {
  _p5: P5;
  _flock: Flock;
  _color: string;
  _size: number;

  position: P5.Vector;
  velocity: P5.Vector;
  acceleration: P5.Vector;
  
  static MAX_SPEED = 5;
  static MAX_FORCE = 0.1;

  constructor(
    p5: P5, 
    flock: Flock, 
    pos?: P5.Vector, 
    vel?: P5.Vector, 
    color?: string,
    size?: number
  ) {
    this._p5 = p5;
    this._flock = flock;
    this.position = pos || p5.createVector(0, 0);
    this.velocity = vel || p5.createVector(0, 0);
    this.acceleration = p5.createVector(0, 0);
    this._color = color || "black";
    this._size = size || 4;
  }

  show() {
    const p5 = this._p5;
    p5.push();
    p5.translate(this.position);
    p5.rotate(Math.atan2(this.velocity.y, this.velocity.x) - p5.PI/2);
    p5.noStroke();
    p5.fill(this._color);
    p5.triangle(-this._size, -this._size, this._size, -this._size, 0, this._size)

    p5.pop();
  }

  applyForce(force: P5.Vector) {
    // A = F / M
    this.acceleration.add(force);
  }

  update() {    
    if (this._flock.target) {
      const targetVect = P5.Vector.sub(this._flock.target, this.position);
      this.applyForce(targetVect);
    }
    
    this.acceleration.limit(Boid.MAX_FORCE);
    this.velocity.add(this.acceleration);
    this.velocity.limit(Boid.MAX_SPEED);
    this.position.add(this.velocity);

    this.acceleration.mult(0);
  }
}