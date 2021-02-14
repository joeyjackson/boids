export const enum theme_t {
  DEFAULT,
  FISH,
}

export const changeThemeButton = document.getElementById("changeThemeButton");

const fishVertices = () => {
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

const triangleVertices = () => {
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
      case theme_t.DEFAULT:
        rgb = [128, 128, 128];
        break;
    }
    return rgb;
  }

  static getBoidVertices() {
    switch (ThemeManager.currentTheme) {
      case theme_t.FISH:
        return fishVertices()
      case theme_t.DEFAULT:
        return triangleVertices();
    }
  }
}
