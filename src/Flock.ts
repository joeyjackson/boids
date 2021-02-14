import P5 from "p5";
import { THEME, Theme } from "./index";
import Boid, { BoidConfig } from "./Boid";
import { Fish } from "./Fish";

export default class Flock {
  static DEFAULT_SEPARATION_RADIUS = 15.0;
  static DEFAULT_ALIGNMENT_RADIUS = 25.0;
  static DEFAULT_COHESION_RADIUS = 25.0;

  _p5: P5;
  _config: FlockConfig;

  boids: Boid[];
  target: P5.Vector | undefined = undefined;

  constructor(p5: P5, config: FlockConfig = new FlockConfig()) {
    this._p5 = p5;
    this.boids = [];
    this._config = config;
    for (let i = 0; i < config.initialFlockSize; i++) {
      const randomPos = p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
      const randomVel = P5.Vector.random2D().mult(config.boidMaxSpeed * p5.random(0, 1));
      let boid: Boid;
      switch (THEME) {
        case Theme.FISH:
          boid = new Fish(p5, config.toBoidConfig(), this, randomPos, randomVel);
          break;
        case Theme.NONE:
          boid = new Boid(p5, config.toBoidConfig(), this, randomPos, randomVel);
          break;
      } 
      this.addBoid(boid);
    }
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
    if (this.target) {
      p5.fill("red");
      p5.noStroke();
      p5.ellipse(this.target.x, this.target.y, 3);
      // p5.noFill();
      // p5.stroke("black");
      // p5.ellipse(this.target.x, this.target.y, this._config.boidFullAvoidanceRadius * 2);
      // p5.stroke("gray");
      // p5.ellipse(this.target.x, this.target.y, (this._config.boidFullAvoidanceRadius + this._config.boidRampAvoidanceRadius) * 2);
    }
    this.boids.forEach(boid => boid.show());
  }
}

export class FlockConfig {
  initialFlockSize: number = 0;
  separationRadius: number = Flock.DEFAULT_SEPARATION_RADIUS;
  alignmentRadius: number = Flock.DEFAULT_ALIGNMENT_RADIUS;
  cohesionRadius: number = Flock.DEFAULT_COHESION_RADIUS;

  boidColor: string = Boid.DEFAULT_COLOR;
  boidSize: number = Boid.DEFAULT_SIZE;
  boidMaxSpeed: number = Boid.DEFAULT_MAX_SPEED;
  boidMaxForce: number = Boid.DEFAULT_MAX_FORCE;
  boidJitterScale: number = Boid.DEFAULT_JITTER_SCALE;
  boidFullAvoidanceRadius: number = Boid.DEFAULT_FULL_AVOIDANCE_RADIUS;
  boidRampAvoidanceRadius: number = Boid.DEFAULT_RAMP_AVOIDANCE_RADIUS;

  toBoidConfig(): BoidConfig {
    return new BoidConfig()
      .setColor(this.boidColor)
      .setSize(this.boidSize)
      .setMaxSpeed(this.boidMaxSpeed)
      .setMaxForce(this.boidMaxForce)
      .setJitterScale(this.boidJitterScale)
      .setFullAvoidanceRadius(this.boidFullAvoidanceRadius)
      .setRampAvoidanceRadius(this.boidRampAvoidanceRadius);
  }

  setInitialFlockSize(value: number) {
    this.initialFlockSize = value;
    return this;
  }

  setSeparationRadius(value: number) {
    this.separationRadius = value;
    return this;
  }

  setAlignmentRadius(value: number) {
    this.alignmentRadius = value;
    return this;
  }

  setCohesionRadius(value: number) {
    this.cohesionRadius = value;
    return this;
  }

  setBoidColor(value: string) {
    this.boidColor = value;
    return this;
  }

  setBoidSize(value: number) {
    this.boidSize = value;
    return this;
  }

  setBoidMaxSpeed(value: number) {
    this.boidMaxSpeed = value;
    return this;
  }

  setBoidMaxForce(value: number) {
    this.boidMaxForce = value;
    return this;
  }

  setBoidJitterScale(value: number) {
    this.boidJitterScale = value;
    return this;
  }

  setBoidFullAvoidanceRadius(value: number) {
    this.boidFullAvoidanceRadius = value;
    return this;
  }

  setBoidRampAvoidanceRadius(value: number) {
    this.boidRampAvoidanceRadius = value;
    return this;
  }
}