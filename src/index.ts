import P5 from "p5";
import "./styles/style.scss";
import Flock, { FlockConfig } from "./Flock";
import { ThemeManager, changeThemeButton } from "./Theme";
import { Predator, PredatorConfig } from "./Predator";

export const BORDER_BUFFER = 50;
const PREDATOR_SEPARATION = 30;

const sketch = (p5: P5) => {
  const WIDTH = window.innerWidth < 800 ? window.innerWidth : 800;
  const HEIGHT = 500;
  let flocks: Flock[];
  let predators: Predator[];
  let predatorFlock: Flock;

  const predatorConfigs: PredatorConfig[] = [
    new PredatorConfig()
      .setColor("black")
      .setSize(16)
      .setMaxSpeed(1.2)
      .setMaxForce(0.4)
      .setJitterScale(0),
    new PredatorConfig()
      .setColor("black")
      .setSize(16)
      .setMaxSpeed(1.2)
      .setMaxForce(0.4)
      .setJitterScale(0)
  ]

  const flockConfigs: FlockConfig[] = [
    new FlockConfig()
      .setInitialFlockSize(10)
      .setBoidColor("purple")
      .setBoidSize(8)
      .setBoidMaxSpeed(1.5)
      .setBoidJitterScale(0)
      .setSeparationRadius(25)
      .setAlignmentRadius(45)
      .setCohesionRadius(45),
    new FlockConfig()
      .setInitialFlockSize(20)
      .setBoidColor("salmon")
      .setBoidSize(6),
    new FlockConfig()
      .setInitialFlockSize(50)
      .setBoidColor("red")
      .setBoidSize(4),
    new FlockConfig()
      .setInitialFlockSize(80)
      .setBoidColor("yellow")
      .setBoidSize(3)
      .setBoidMaxSpeed(2.5)
      .setBoidMaxForce(1)
      .setSeparationRadius(8),
  ];

  const reset = () => {
    predatorFlock = new Flock(p5, new FlockConfig().setSeparationRadius(PREDATOR_SEPARATION));
    flocks = flockConfigs.map(config => new Flock(p5, config));
    predators = predatorConfigs.map(config => {
      const randomPos = p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
      const randomVel = P5.Vector.random2D().mult(config.maxSpeed);
      const predator = new Predator(p5, config, predatorFlock, randomPos, randomVel, flocks);
      predatorFlock.addBoid(predator);
      return predator;
    });
    flocks.forEach(flock => flock.predators = predators);
  }

	p5.setup = () => {
		const canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.parent("canvas");
    if (changeThemeButton !== null) {
      changeThemeButton.onclick = ThemeManager.changeTheme;
    }

    reset();
	};

	p5.draw = () => {
    p5.background(ThemeManager.getBackgroundColor());
    flocks.forEach(flock => {
      flock.update();
      flock.show();
    });
    predators.forEach(predator => {
      predator.update();
      predator.show();
    });
  };
  
  p5.mousePressed = () => {
    setTargets();
  }

  p5.mouseDragged = () => {
    setTargets();
  }

  p5.mouseReleased = () => {
    clearTargets();
  }

  p5.keyPressed = () => {
    if (p5.keyCode == p5.ESCAPE) {
      clearTargets();
    }
  }
  
  const setTargets = () => {
    const v = p5.createVector(p5.mouseX, p5.mouseY)
    flocks.forEach(flock => {
      flock.setTarget(v);
    });
    predatorFlock.setTarget(v)
  }

  const clearTargets = () => {
    flocks.forEach(flock => {
      flock.setTarget(undefined);
    });
    predatorFlock.setTarget(undefined);
  }

  p5.windowResized = () => {
    const newWidth = window.innerWidth < 800 ? window.innerWidth : 800;
    p5.resizeCanvas(newWidth, HEIGHT);
  }
};

new P5(sketch);
