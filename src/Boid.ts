import P5 from "p5";
import Flock from "./Flock";

export default class Boid {
  _p5: P5;
  _flock: Flock | undefined;
  _color: string;
  _size: number;

  position: P5.Vector;
  velocity: P5.Vector;
  acceleration: P5.Vector;
  theta: number = 0;
  
  static DEFAULT_MAX_SPEED = 3;
  static DEFAULT_MAX_FORCE = 0.5;
  static JITTER_SCALE = 0.1;
  static DEFAULT_FULL_AVOIDANCE_RADIUS = Boid.DEFAULT_MAX_SPEED * 10;
  static DEFAULT_RAMP_AVOIDANCE_RADIUS = Boid.DEFAULT_MAX_SPEED * 6;
  static BORDER_BUFFER = Boid.DEFAULT_MAX_SPEED * 10;

  constructor(
    p5: P5, 
    flock?: Flock, 
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
    this._color = color || flock?._color || "black";
    this._size = size || 4;
  }

  show() {
    const p5 = this._p5;
    p5.push();
    p5.translate(this.position);
    p5.rotate(this.theta);
    p5.noStroke();
    p5.fill(this._color);
    p5.triangle(-this._size, -this._size, this._size, -this._size, 0, this._size);
    p5.pop();
  }

  applyForce(force: P5.Vector) {
    // A = F / M
    this.acceleration.add(force);
  }

  jitter() {
    const jitterVector = P5.Vector.random2D().mult(Boid.JITTER_SCALE);
    return jitterVector;
  }

  seek(target: P5.Vector, acceptDistance?: number) {
    const _acceptDistance = acceptDistance ?? this._size;
    const desiredVelocity = P5.Vector.sub(target, this.position);
    if (P5.Vector.dist(this.position, target) < _acceptDistance) {
      desiredVelocity.mult(0);
    }
    const steer = P5.Vector.sub(desiredVelocity, this.velocity);
    return steer;
  }

  avoid(
    target: P5.Vector, 
    fullAvoidanceRadius: number = Boid.DEFAULT_FULL_AVOIDANCE_RADIUS, 
    rampAvoidanceRadius: number = Boid.DEFAULT_RAMP_AVOIDANCE_RADIUS) {
    const distToTarget = P5.Vector.dist(this.position, target);
    const awayFromTarget = P5.Vector.sub(this.position, target).normalize();

    let steer: P5.Vector;
    if (distToTarget < fullAvoidanceRadius) {
      const desiredVelocity = P5.Vector.mult(awayFromTarget, Boid.DEFAULT_MAX_SPEED);
      steer = P5.Vector.sub(desiredVelocity, this.velocity);
    } else if (distToTarget < (fullAvoidanceRadius + rampAvoidanceRadius)) {
      const rampDist = distToTarget - fullAvoidanceRadius;
      const rampPower = this._p5.map(rampDist, 0, rampAvoidanceRadius, 0, Boid.DEFAULT_MAX_SPEED);
      steer = P5.Vector.mult(awayFromTarget, rampPower); 
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
    if (P5.Vector.dist(this.position, nearestBorder) < Boid.BORDER_BUFFER) {
      // If component of velocity in direction of border is not positive then apply no force
      if (P5.Vector.dot(this.velocity, P5.Vector.sub(this.position, nearestBorder)) <= 0) {
        steer = this.avoid(nearestBorder, Boid.BORDER_BUFFER, 0);
      }
    }
    return steer;
  }

  separation(desiredSeparation: number = Flock.DEFAULT_SEPARATION) {
    let steer = this._p5.createVector(0, 0);
    if (this._flock) {
      let count = 0;
      this._flock.boids.forEach(boid => {
        if (boid !== this) {
          const d = P5.Vector.dist(this.position, boid.position);
          if (d < desiredSeparation) {
            count++;
            const away = P5.Vector.sub(this.position, boid.position);
            away.normalize();
            away.mult(Boid.DEFAULT_MAX_SPEED);
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

  alignment(alignmentRadius: number = Flock.DEFAULT_ALIGNMENT_RADIUS) {
    let steer = this._p5.createVector(0, 0);
    if (this._flock) {
      let count = 0;
      this._flock.boids.forEach(boid => {
        if (boid !== this) {
          const d = P5.Vector.dist(this.position, boid.position);
          if (d < alignmentRadius) {
            count++;
            const direction = boid.velocity.copy();
            direction.normalize();
            direction.mult(Boid.DEFAULT_MAX_SPEED);
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

  cohesion(cohesionRadius: number = Flock.DEFAULT_COHESION_RADIUS) {
    let steer = this._p5.createVector(0, 0);
    if (this._flock) {
      let count = 0;
      this._flock.boids.forEach(boid => {
        if (boid !== this) {
          const d = P5.Vector.dist(this.position, boid.position);
          if (d < cohesionRadius) {
            count++;
            steer.add(boid.position);
          }
        }
      });
      if (count > 0) {
        steer.div(count);
        steer.sub(this.position);
        steer.normalize();
        steer.mult(Boid.DEFAULT_MAX_FORCE);
      }
    }
    return steer;
  }

  update() {    
    if (this._flock?.target) {
      const steer = this.avoid(this._flock.target);
      this.applyForce(steer);
    }
    
    this.applyForce(this.jitter().normalize().mult(0.1));
    this.applyForce(this.avoidBorders().normalize().mult(2));
    this.applyForce(this.separation().normalize().mult(1.5));
    this.applyForce(this.alignment().normalize().mult(1.0));
    this.applyForce(this.cohesion().normalize().mult(1.0));

    this.acceleration.limit(Boid.DEFAULT_MAX_FORCE);
    this.velocity.add(this.acceleration);
    this.velocity.limit(Boid.DEFAULT_MAX_SPEED);
    this.position.add(this.velocity);
    if (this.velocity.mag() > 0) {
      this.theta = Math.atan2(this.velocity.y, this.velocity.x) - this._p5.PI/2;
    }

    this.acceleration.mult(0);
  }
}