import Boid from "./Boid";

export class Fish extends Boid {
  vertices() {
    const _vertices = [
      [4, 2],
      [5, 4], 
      [7, 8], 
      [8, 12], 
      [8, 16], 
      [9, 20], 
      [14, 24], 
      [16, 28],
      [9, 27],
      [8, 30],
      [8, 32],
      [7, 36],
      [2, 60],
      [4, 74], 
    ];
    const vertices = [];
    vertices.push([0, 0]);
    for (let i = 0; i < _vertices.length; i++) {
      const [x, y] = _vertices[i];
      vertices.push([x / 36, -y / 36]);
    }
    vertices.push([0, -73 / 36]);
    for (let i = _vertices.length - 1; i >= 0; i--) {
      const [x, y] = _vertices[i];
      vertices.push([-x / 36, -y / 36]);
    }
    return vertices;
  }
}