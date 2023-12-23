import P5 from "p5";
import Flock from "./Flock";
import { BORDER_BUFFER } from "./index";
import { ThemeManager } from "./Theme";

export default class Boid {
  static DEFAULT_MAX_SPEED = 2;
  static DEFAULT_MAX_FORCE = 0.5;
  static DEFAULT_COLOR = "black";
  static DEFAULT_SIZE = 4;
  static DEFAULT_JITTER_SCALE = 0.1;
  static DEFAULT_FULL_AVOIDANCE_RADIUS = 15;
  static DEFAULT_RAMP_AVOIDANCE_RADIUS = 25;

  _p5: P5;
  _flock: Flock | undefined;
  _config: BoidConfig;

  position: P5.Vector;
  velocity: P5.Vector;
  acceleration: P5.Vector;
  theta: number = 0;
  
  constructor(
    p5: P5, 
    config: BoidConfig = new BoidConfig(),
    flock?: Flock, 
    pos?: P5.Vector, 
    vel?: P5.Vector,
  ) {
    this._p5 = p5;
    this._config = config;
    this._flock = flock;
    this.position = pos || p5.createVector(0, 0);
    this.velocity = vel || p5.createVector(0, 0);
    this.acceleration = p5.createVector(0, 0);
  }

  show(redStroke: boolean = false) {
    const p5 = this._p5;
    p5.push();
    p5.translate(this.position);
    p5.scale(this._config.size);
    p5.rotate(this.theta);
    if (redStroke) {
      p5.stroke(255, 0, 0);
      p5.strokeWeight(0.1);
    } else {
      p5.noStroke();
    }
    p5.fill(this._config.color);
    p5.beginShape();

    const vertices = ThemeManager.getBoidVertices();
    vertices.forEach(([x, y]) => {
      p5.vertex(x, y);
    });
    
    p5.endShape(p5.CLOSE);
    p5.pop();
  }

  applyForce(force: P5.Vector) {
    // A = F / M
    this.acceleration.add(force);
  }

  jitter() {
    const jitterVector = P5.Vector.random2D().mult(this._config.jitterScale);
    return jitterVector;
  }

  seek(target: P5.Vector, acceptDistance?: number) {
    const _acceptDistance = acceptDistance ?? this._config.size;
    const desiredVelocity = P5.Vector.sub(target, this.position);
    if (P5.Vector.dist(this.position, target) < _acceptDistance) {
      desiredVelocity.mult(0);
    }
    const steer = P5.Vector.sub(desiredVelocity, this.velocity);
    return steer;
  }

  avoid(target: P5.Vector, fullAvoidanceRadius?: number, rampAvoidanceRadius?: number) {
    fullAvoidanceRadius = fullAvoidanceRadius ?? this._config.fullAvoidanceRadius;
    rampAvoidanceRadius = rampAvoidanceRadius ?? this._config.rampAvoidanceRadius;
    const distToTarget = P5.Vector.dist(this.position, target);
    const awayFromTarget = P5.Vector.sub(this.position, target).normalize();

    let steer: P5.Vector = new P5.Vector();
    if (distToTarget < fullAvoidanceRadius) {
      let desiredVelocity = new P5.Vector();
      P5.Vector.mult(awayFromTarget, this._config.maxSpeed, desiredVelocity);
      steer = P5.Vector.sub(desiredVelocity, this.velocity);
    } else if (distToTarget < (fullAvoidanceRadius + rampAvoidanceRadius)) {
      const rampDist = distToTarget - fullAvoidanceRadius;
      const rampPower = this._p5.map(rampDist, 0, rampAvoidanceRadius, 0, this._config.maxSpeed);
      P5.Vector.mult(awayFromTarget, rampPower, steer); 
    } else {
      steer = this._p5.createVector(0, 0);
    }
    return steer;
  }

  avoidBorders(xMin: number = 0, yMin: number = 0, xMax: number = this._p5.width, yMax: number = this._p5.height) {
    if (this.position.x < xMin || this.position.x > xMax || this.position.y < yMin || this.position.y > yMax) {
      // If outside borders, seek middle of valid area
      return this.seek(this._p5.createVector((xMax - xMin) / 2, (yMax - yMin) / 2));
    }
    // Else avoid nearest border;
    const x = this.position.x;
    const y = this.position.y;
    const left = this._p5.createVector(xMin, y);
    const right = this._p5.createVector(xMax, y);
    const bottom = this._p5.createVector(x, yMin);
    const top = this._p5.createVector(x, yMax);
    const [nearestBorder,] = [top, bottom, left].reduce((curr, border) => {
      const [, dist] = curr;
      const borderDist = P5.Vector.dist(this.position, border);
      return borderDist < dist ? [border, borderDist] : curr;
    }, [right, P5.Vector.dist(this.position, right)]);
    let steer = this._p5.createVector(0, 0);
    if (P5.Vector.dist(this.position, nearestBorder) <= BORDER_BUFFER) {
      // If component of velocity in direction of border is not positive then apply no force
      if (P5.Vector.dot(this.velocity, P5.Vector.sub(this.position, nearestBorder)) <= this._config.maxSpeed) {
        steer = this.avoid(nearestBorder, BORDER_BUFFER, 0);
      }
    }
    return steer;
  }

  separation(separationRadius?: number) {
    let steer = this._p5.createVector(0, 0);
    if (this._flock) {
      const _separationRadius = separationRadius ?? this._flock._config.separationRadius;
      let count = 0;
      this._flock.boids.forEach(boid => {
        if (boid !== this) {
          const d = P5.Vector.dist(this.position, boid.position);
          if (d < _separationRadius) {
            count++;
            const away = P5.Vector.sub(this.position, boid.position);
            away.normalize();
            away.mult(this._config.maxSpeed);
            away.div(d);
            steer.add(away);
          }
        }
      });
      if (count > 0) {
        steer.div(count);
      }
    }
    return steer;
  }

  alignment(alignmentRadius?: number) {
    let steer = this._p5.createVector(0, 0);
    if (this._flock) {
      const _alignmentRadius = alignmentRadius ?? this._flock._config.alignmentRadius;
      let count = 0;
      this._flock.boids.forEach(boid => {
        if (boid !== this) {
          const d = P5.Vector.dist(this.position, boid.position);
          if (d < _alignmentRadius) {
            count++;
            const direction = boid.velocity.copy();
            direction.normalize();
            direction.mult(this._config.maxSpeed);
            direction.div(d);
            steer.add(direction);
          }
        }
      });
      if (count > 0) {
        steer.div(count);
      }
    }
    return steer;
  }

  cohesion(cohesionRadius?: number) {
    let steer = this._p5.createVector(0, 0);
    if (this._flock) {
      const _cohesionRadius = cohesionRadius ?? this._flock._config.cohesionRadius;
      let count = 0;
      this._flock.boids.forEach(boid => {
        if (boid !== this) {
          const d = P5.Vector.dist(this.position, boid.position);
          if (d < _cohesionRadius) {
            count++;
            steer.add(boid.position);
          }
        }
      });
      if (count > 0) {
        steer.div(count);
        steer.sub(this.position);
        steer.normalize();
        steer.mult(this._config.maxSpeed);
      }
    }
    return steer;
  }

  update() {    
    if (this._flock?.target) {
      const steer = this.avoid(this._flock.target);
      this.applyForce(steer.normalize().mult(2));
    }

    this._flock?.predators.forEach(predator => {
      const steer = this.avoid(predator.position);
      this.applyForce(steer.normalize().mult(2));
    });
    
    this.applyForce(this.jitter().normalize().mult(0.1));
    this.applyForce(this.avoidBorders().normalize().mult(2));
    this.applyForce(this.separation().normalize().mult(1.5));
    this.applyForce(this.alignment().normalize().mult(1.0));
    this.applyForce(this.cohesion().normalize().mult(1.0));

    this.acceleration.limit(this._config.maxForce);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this._config.maxSpeed);
    this.position.add(this.velocity);
    if (this.velocity.mag() > 0) {
      this.theta = Math.atan2(this.velocity.y, this.velocity.x) - this._p5.PI/2;
    }

    this.acceleration.mult(0);
  }
}

export class BoidConfig {
  color: string = Boid.DEFAULT_COLOR;
  size: number = Boid.DEFAULT_SIZE;
  maxSpeed: number = Boid.DEFAULT_MAX_SPEED;
  maxForce: number = Boid.DEFAULT_MAX_FORCE;
  jitterScale: number = Boid.DEFAULT_JITTER_SCALE;
  fullAvoidanceRadius: number = Boid.DEFAULT_FULL_AVOIDANCE_RADIUS;
  rampAvoidanceRadius: number = Boid.DEFAULT_RAMP_AVOIDANCE_RADIUS;

  setColor(value: string) {
    this.color = value;
    return this;
  }

  setSize(value: number) {
    this.size = value;
    return this;
  }

  setMaxSpeed(value: number) {
    this.maxSpeed = value;
    return this;
  }

  setMaxForce(value: number) {
    this.maxForce = value;
    return this;
  }

  setJitterScale(value: number) {
    this.jitterScale = value;
    return this;
  }

  setFullAvoidanceRadius(value: number) {
    this.fullAvoidanceRadius = value;
    return this;
  }

  setRampAvoidanceRadius(value: number) {
    this.rampAvoidanceRadius = value;
    return this;
  }
}