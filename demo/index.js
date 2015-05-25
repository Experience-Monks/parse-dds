var triangle = require('a-big-triangle')
var createShader = require('gl-shader')
var loop = require('raf-loop')
var glslify = require('glslify')
var parseDDS = require('../')
var xhr = require('xhr')
var gl = require('webgl-context')({
  width: 512,
  height: 512
})

document.body.appendChild(gl.canvas)

var shader = createShader(gl, glslify('./vert.glsl'), glslify('./frag.glsl'))
shader.bind()
shader.uniforms.uTex = 0

loadTexture(function (err) {
  if (err)
    throw err

  start()
})

function loadTexture(cb) {
  var handle = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, handle)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  xhr({
    uri: '../test/fixtures/test-dxt1.dds',
    responseType: 'arraybuffer'
  }, function (err, resp, data) {
    if (err)
      return cb(err)

    var dds = parseDDS(data)
    var ext = gl.getExtension('WEBGL_compressed_texture_s3tc')
    
    var internalFormat = getFormat(ext, dds.format)

    dds.images.forEach(function (image, i) {
      var array = new Uint8Array(data, image.offset, image.length)
      var width = image.shape[0]
      var height = image.shape[1]
      gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, array);
    })

    cb(null)
  })
}

function getFormat (ext, ddsFormat) {
  switch (ddsFormat) {
    case 'dxt1':
      return ext.COMPRESSED_RGB_S3TC_DXT1_EXT
    case 'dxt3':
      return ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
    case 'dxt5':
      return ext.COMPRESSED_RGBA_S3TC_DXT5_EXT
    default:
      throw new Error('unsupported format ' + ddsFormat)
  }
}

function start() {
  loop(render).start()

  function render() {
    var width = gl.drawingBufferWidth
    var height = gl.drawingBufferHeight
    gl.viewport(0, 0, width, height)

    // texture.bind()
    shader.bind()
    triangle(gl)
  }
}
