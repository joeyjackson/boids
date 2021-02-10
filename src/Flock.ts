import p5 from "p5";
import P5 from "p5";
import Boid from "./Boid";


export default class Flock {
  _p5: P5;

  boids: Boid[];
  target: P5.Vector | undefined = undefined;

  constructor(p5: P5) {
    this._p5 = p5;
    this.boids = [];
  }

  setTarget(target: P5.Vector) {
    this.target = target;
  }

  addBoid(boid: Boid) {
    this.boids.push(boid);
  }

  update() {
    this.boids.forEach(boid => boid.update());
  }

  show() {
    const p5 = this._p5;

    p5.fill("red");
    p5.noStroke();
    if (this.target) {
      p5.ellipse(this.target.x, this.target.y, 3);
    }
    this.boids.forEach(boid => boid.show());
  }
}