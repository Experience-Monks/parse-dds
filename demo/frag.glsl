precision mediump float;

varying vec2 vUv;
uniform sampler2D tex0;

void main() {
  gl_FragColor = texture2D(tex0, vUv);
}