import P5 from "p5";
import Boid, { BoidConfig } from "./Boid";
import Flock from "./Flock";

export class Predator extends Boid {
  static DEFAULT_BOOST_STRENGHT = 2;
  static DEFAULT_BOOST_RADIUS = 100;
  static DEFAULT_BOOST_DURATION_MS = 1000;
  static DEFAULT_BOOST_COOLDOWN_MS = 5000;

  prey: Flock[];
  _config: PredatorConfig;
  private _isBoosting: boolean | null = false;

  constructor(
    p5: P5, 
    config: PredatorConfig = new PredatorConfig(),
    flock: Flock,
    pos?: P5.Vector, 
    vel?: P5.Vector,
    prey: Flock[] = [], 
  ) {
    super(p5, config, flock, pos, vel);
    this.prey = prey;
    this._config = config;
  }

  nearestPrey(): Boid | undefined {
    let nearest: Boid | undefined = undefined;
    let nearestDistance: number | undefined = undefined;
    this.prey.forEach(flock => {
      flock.boids.forEach(boid => {
        const d = P5.Vector.dist(this.position, boid.position);
        if (nearest === undefined || nearestDistance === undefined || d < nearestDistance) {
          nearest = boid;
          nearestDistance = d;
        }
      });
    });
    return nearest;
  }

  doBoost() {
    this._isBoosting = true;
    this._config.maxSpeed *= this._config.boostStrength;
    this._config.maxForce /= this._config.boostStrength;
    setTimeout(this.undoBoost.bind(this), this._config.boostDurationMs);
  }

  undoBoost() {
    this._isBoosting = null;
    this._config.maxSpeed /= this._config.boostStrength;
    this._config.maxForce *= this._config.boostStrength;
    setTimeout(() => { this._isBoosting = false }, this._config.boostCooldownMs);
  }

  boost() {
    if (this._isBoosting === false) {
      this.doBoost();
    }
  }

  update() {    
    if (this._flock?.target) {
      const steer = this.avoid(this._flock.target);
      this.applyForce(steer.normalize().mult(2));
    }
    
    this.applyForce(this.avoidBorders().normalize().mult(2));
    this.applyForce(this.separation().normalize().mult(1));
    const preyToSeek = this.nearestPrey();
    if (preyToSeek) {
      this.applyForce(this.seek(preyToSeek.position).normalize().mult(2));
      if (P5.Vector.dist(this.position, preyToSeek.position) < this._config.boostRadius) {
        this.boost();
      }
    }

    this.acceleration.limit(this._config.maxForce);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this._config.maxSpeed);
    this.position.add(this.velocity);
    if (this.velocity.mag() > 0) {
      this.theta = Math.atan2(this.velocity.y, this.velocity.x) - this._p5.PI/2;
    }

    this.acceleration.mult(0);
  }

  show() {
    if (this._isBoosting === true) {
      super.show(true);      
    } else {
      super.show(false);
    }
  }
}

export class PredatorConfig extends BoidConfig {
  boostStrength = Predator.DEFAULT_BOOST_STRENGHT;
  boostRadius = Predator.DEFAULT_BOOST_RADIUS;
  boostDurationMs = Predator.DEFAULT_BOOST_DURATION_MS;
  boostCooldownMs = Predator.DEFAULT_BOOST_COOLDOWN_MS;

  setBoostStrength(value: number) {
    this.boostStrength = value;
    return this;
  }

  setBoostRadius(value: number) {
    this.boostRadius = value;
    return this;
  }

  setBoostDurationMs(value: number) {
    this.boostDurationMs = value;
    return this;
  }

  setBoostCooldownMs(value: number) {
    this.boostCooldownMs = value;
    return this;
  }
}