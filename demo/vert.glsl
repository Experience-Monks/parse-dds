attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = (position + 1.0) * 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(position, 1.0, 1.0);
}