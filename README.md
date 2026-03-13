# boids
A boids flocking simulation built using p5.js

https://en.wikipedia.org/wiki/Boids

## Adding a theme
Edit src/Theme.ts
* Add a new enum to the `theme_t` enum for the new theme
* Update the `ThemeManager` methods:
    * For `changeTheme`, add the new theme into the rotation
    * For `getBackgroundColor`, choose an RGB value to be the background color for the theme
    * For `getBoidVertices`, return a path of vertices to draw the boid models for the theme

## Upgrading packages
NOTE: Keep p5.js on latest version of major 1.X.X release (version 2 is incompatible)
```
npx npm-check-updates -u
npm install
```