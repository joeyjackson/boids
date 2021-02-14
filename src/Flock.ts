import P5 from "p5";
import Boid from "./Boid";


export default class Flock {
  _p5: P5;

  _color: string;
  boids: Boid[];
  target: P5.Vector | undefined = undefined;

  static DEFAULT_SEPARATION = 15.0;
  static DEFAULT_ALIGNMENT_RADIUS = 25.0;
  static DEFAULT_COHESION_RADIUS = 25.0;

  constructor(p5: P5, color: string = "black") {
    this._p5 = p5;
    this.boids = [];
    this._color = color;
  }

  setTarget(target: P5.Vector | undefined) {
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
      p5.noFill();
      p5.stroke("black");
      p5.ellipse(this.target.x, this.target.y, Boid.DEFAULT_FULL_AVOIDANCE_RADIUS * 2);
      p5.stroke("gray");
      p5.ellipse(this.target.x, this.target.y, (Boid.DEFAULT_FULL_AVOIDANCE_RADIUS + Boid.DEFAULT_RAMP_AVOIDANCE_RADIUS) * 2);
    }
    this.boids.forEach(boid => boid.show());
  }
}