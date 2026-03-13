export const enum theme_t {
  DEFAULT,
  FISH,
  BIRDS,
}

export const changeThemeButton = document.getElementById("changeThemeButton");

const fishVertices: () => Array<[number, number]> = () => {
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
  const vertices: Array<[number, number]> = [];
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

const birdsVertices: () => Array<[number, number]> = () => {
  const _vertices = [
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 6],
    [2, 10],
    [5, 12],
    [7, 12],
    [8, 11],
    [9, 10],
    [12, 9],
    [16, 8],
    [19, 7],
    [20, 6],
    [24, 3],
    [27, 2],
    [28, 3],
    [28, 4],
    [26, 12],
    [25, 14],
    [22, 18],
    [19, 22],
    [16, 25],
    [12, 26],
    [11, 26],
    [9, 25],
    [7, 24],
    [6, 26],
    [4, 29],
    [3, 30],
    [3, 31],
    [4, 34],
    [5, 38],
    [4, 40],
    [2, 41],
  ];
  const vertices: Array<[number, number]> = [];
  vertices.push([0, 0]);
  for (let i = 0; i < _vertices.length; i++) {
    const [x, y] = _vertices[i];
    vertices.push([x / 24, -y / 36]);
  }
  vertices.push([0, -41 / 36]);
  for (let i = _vertices.length - 1; i >= 0; i--) {
    const [x, y] = _vertices[i];
    vertices.push([-x / 24, -y / 36]);
  }
  return vertices;
}

const triangleVertices: () => Array<[number, number]> = () => {
  return [
    [-1, -1],
    [1, -1],
    [0, 1]
  ];
}

export class ThemeManager {
  static currentTheme: theme_t = theme_t.FISH;

  static changeTheme() {
    switch (ThemeManager.currentTheme) {
      case theme_t.FISH:
        ThemeManager.currentTheme = theme_t.BIRDS;
        break;
      case theme_t.BIRDS:
        ThemeManager.currentTheme = theme_t.DEFAULT;
        break;
      case theme_t.DEFAULT:
        ThemeManager.currentTheme = theme_t.FISH;
        break;
    }
  }

  static getBackgroundColor(): [number, number, number] {
    let rgb: [number, number, number];
    switch (ThemeManager.currentTheme) {
      case theme_t.FISH:
        rgb = [18, 185, 227];
        break;
      case theme_t.BIRDS:
        rgb = [135, 206, 235];
        break;
      case theme_t.DEFAULT:
        rgb = [128, 128, 128];
        break;
    }
    return rgb;
  }

  static getBoidVertices(): Array<[number, number]> {
    switch (ThemeManager.currentTheme) {
      case theme_t.FISH:
        return fishVertices();
      case theme_t.BIRDS:
        return birdsVertices();
      case theme_t.DEFAULT:
        return triangleVertices();
    }
  }
}
