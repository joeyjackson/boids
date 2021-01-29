import P5 from "p5";
import Circle from "./Circle";
import "./styles/style.scss";

const sketch = (p5: P5) => {
  const circles: Circle[] = [];
  const maxCircles = 12;
  let currCircle: number = 0;
  let interval;

	p5.setup = () => {
		const canvas = p5.createCanvas(400, 400);
		canvas.parent("canvas");
		p5.background("white");

		for (let i = 0; i < maxCircles; i++) {
			const centerX = p5.width / 2;
      const centerY = p5.height / 2;
      
      const radius = p5.height / 3;

			const circlePos = p5.createVector(
        centerX + radius * Math.cos(i / maxCircles * 2 * Math.PI), 
        centerY + radius * Math.sin(i / maxCircles * 2 * Math.PI)
      );
			const size = 30;
      
      circles.push(new Circle(p5, circlePos, size));
    }
    
    interval = setInterval(() => {
      circles[currCircle].toggle();
      currCircle = (currCircle + 1) % maxCircles;
    }, 100);
	};

	p5.draw = () => {
    p5.background(255);
		circles.forEach(circle => circle.draw());
	};
};

new P5(sketch);
