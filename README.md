# parse-dds

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Parses DDS texture headers in Node and the browser. 

This was adapted from [@toji](https://twitter.com/Tojiro)'s wonderful [webgl-texture-utils](https://github.com/toji/webgl-texture-utils/blob/master/texture-util/dds.js). 

Currently this only supports a limited range of common DDS formats: 

- DXT1 (RGB)
- DXT3 (RGBA)
- DXT5 (RGBA)
- Cubemaps (RGBA32f) - like those from [cmft](https://github.com/dariomanesku/cmft) and [Modified AMD Cubemapgen](https://seblagarde.wordpress.com/2012/06/10/amd-cubemapgen-for-physically-based-rendering/)

See [test/index.js](test/index.js) for an example in Node, or [demo/index.js](demo/index.js) for a WebGL compressed texture example.

Pull requests welcome.

## Example

```js
var parse = require('parse-dds')

var buffer = new Uint8Array(... DDS file ...)
var dds = parse(buffer)

console.log(dds.format)  // 'dxt1'
console.log(dds.shape)   // [ width, height ]
console.log(dds.images)  // [ ... mipmap level data ... ]

// get the compressed texture data for gl.compressedTexImage2D
var image = dds.images[0]
var texture = new Uint8Array(buffer, image.offset, image.length)
```

## Install

```sh
npm install parse-dds --save-dev
```

## Usage

[![NPM](https://nodei.co/npm/parse-dds.png)](https://www.npmjs.com/package/parse-dds)

#### `dds = parse(arrayBuffer)`

Parses an ArrayBuffer and returns the DDS headers for that file.

The returned values:

- `shape` an array representing the `[ width, height ]` of the texture
- `flags` the DDS bit flags stored in the file
- `format` a string, either `'dxt1'`, `'dxt3'`, `'dxt5'` or `'rgba32f'`
- `images` a list of information to extract sub-arrays for each mipmap level
- `cubemap` a boolean indicating whether the file contains a cubemap image

Each image has the form:

```js
{
  shape: [ width, height ], // size of this mipmap level
  offset: x,                // byte offset into the input buffer
  length: len,              // length of this mipmap level image data
}
```

## See Also

- [preview-dds](https://github.com/Jam3/preview-dds) for loading and previewing DDS files

## License

MIT, see [LICENSE.md](http://github.com/Jam3/parse-dds/blob/master/LICENSE.md) for details.
