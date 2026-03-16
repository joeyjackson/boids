export const enum theme_t {
  DEFAULT,
  BIRDS,
  FISH,
  BUGS,
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

const bugsVertices: () => Array<[number, number]> = () => {
  const _vertices = [
    [1, 8],
    [3, 10],
    [4, 12],
    [4, 14],
    [3, 15],
    [3, 17],
    [11, 11],
    [12, 4],
    [16, 1],
    [13, 5],
    [12, 12],
    [6, 18],
    [23, 21],
    [25, 22],
    [27, 23],
    [26, 25],
    [24, 28],
    [21, 29],
    [19, 29],
    [16, 28],
    [10, 26],
    [5, 12],
    [4, 13],
    [13, 30],
    [15, 38],
    [21, 40],
    [14, 39],
    [12, 31],
    [4, 24],
    [3, 25],
    [10, 34],
    [11, 43],
    [20, 49],
    [10, 44],
    [9, 35],
    [4, 29],
    [5, 32],
    [4, 35],
    [2, 38],
  ];
  const vertices: Array<[number, number]> = [];
  vertices.push([0, 0]);
  for (let i = 0; i < _vertices.length; i++) {
    const [x, y] = _vertices[i];
    vertices.push([x / 36, -y / 24]);
  }
  vertices.push([0, -40 / 24]);
  for (let i = _vertices.length - 1; i >= 0; i--) {
    const [x, y] = _vertices[i];
    vertices.push([-x / 36, -y / 24]);
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
        ThemeManager.currentTheme = theme_t.BUGS;
        break;
      case theme_t.BUGS:
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
      case theme_t.BUGS:
        rgb = [72, 111, 56];
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
      case theme_t.BUGS:
        return bugsVertices();
      case theme_t.DEFAULT:
        return triangleVertices();
    }
  }
}
