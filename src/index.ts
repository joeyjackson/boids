import P5 from "p5";
import Boid from "./Boid";
import Flock from "./Flock";
import "./styles/style.scss";

const sketch = (p5: P5) => {
  const flock: Flock = new Flock(p5);
  const NUM_BOIDS = 120;
  const WIDTH = 800;
  const HEIGHT = 500;

	p5.setup = () => {
		const canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.parent("canvas");

		for (let i = 0; i < NUM_BOIDS; i++) {
      const boid = new Boid(p5, flock, p5.createVector(p5.random(0, WIDTH), p5.random(0, HEIGHT)));
			flock.addBoid(boid);
    }
	};

	p5.draw = () => {
    p5.background(18, 185, 227);
		flock.update();
		flock.show();
  };
  
  p5.mousePressed = () => {
    flock.setTarget(p5.createVector(p5.mouseX, p5.mouseY));
  }

  p5.keyPressed = () => {
    if (p5.keyCode == p5.ESCAPE) {
      flock.setTarget(undefined);
    }
  }
};

new P5(sketch);
