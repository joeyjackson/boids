import P5 from "p5";
import Flock, { FlockConfig } from "./Flock";
import "./styles/style.scss";

export const enum Theme {
  NONE,
  FISH,
}

export const BORDER_BUFFER = 50;

export let THEME: Theme = Theme.FISH;

const changeTheme = (restartCallback: () => void) => {
  return () => {
    switch(THEME) {
      case Theme.FISH:
        THEME = Theme.NONE;
        break;
      case Theme.NONE:
        THEME = Theme.FISH;
        break;
    }
    restartCallback();
  }
}

const changeThemeButton = document.getElementById("changeThemeButton");

const sketch = (p5: P5) => {
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
  ]
  let flocks: Flock[];
  const WIDTH = 800;
  const HEIGHT = 500;

  const resetFlocks = () => {
    flocks = flockConfigs.map(config => new Flock(p5, config));
  }

	p5.setup = () => {
		const canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.parent("canvas");
    if (changeThemeButton !== null) {
      changeThemeButton.onclick = changeTheme(resetFlocks);
    }

    resetFlocks();
	};

	p5.draw = () => {
    switch (THEME) {
      case Theme.FISH:
        p5.background(18, 185, 227);
        break;
      case Theme.NONE:
        p5.background(128);
        break;
    }
    flocks.forEach(flock => {
      flock.update();
      flock.show();
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
    flocks.forEach(flock => {
      flock.setTarget(p5.createVector(p5.mouseX, p5.mouseY));
    });
  }

  const clearTargets = () => {
    flocks.forEach(flock => {
      flock.setTarget(undefined);
    });
  }
};

new P5(sketch);
