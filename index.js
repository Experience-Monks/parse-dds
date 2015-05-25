// All values and structures referenced from:
// http://msdn.microsoft.com/en-us/library/bb943991.aspx/

var DDS_MAGIC = 0x20534444
var DDSD_MIPMAPCOUNT = 0x20000
var DDPF_FOURCC = 0x4

var FOURCC_DXT1 = fourCCToInt32('DXT1')
var FOURCC_DXT3 = fourCCToInt32('DXT3')
var FOURCC_DXT5 = fourCCToInt32('DXT5')

// The header length in 32 bit ints
var headerLengthInt = 31

// Offsets into the header array
var off_magic = 0
var off_size = 1
var off_flags = 2
var off_height = 3
var off_width = 4
var off_mipmapCount = 7
var off_pfFlags = 20
var off_pfFourCC = 21

module.exports = parseHeaders

function parseHeaders (arrayBuffer) {
  var header = new Int32Array(arrayBuffer, 0, headerLengthInt)

  if (header[off_magic] !== DDS_MAGIC) {
    throw new Error('Invalid magic number in DDS header')
  }

  if (!header[off_pfFlags] & DDPF_FOURCC) {
    throw new Error('Unsupported format, must contain a FourCC code')
  }

  var blockBytes
  var format
  var fourCC = header[off_pfFourCC]
  switch (fourCC) {
    case FOURCC_DXT1:
      blockBytes = 8
      format = 'dxt1'
      break
    case FOURCC_DXT3:
      blockBytes = 16
      format = 'dxt3'
      break
    case FOURCC_DXT5:
      blockBytes = 16
      format = 'dxt5'
      break
    default:
      throw new Error('Unsupported FourCC code: ' + int32ToFourCC(fourCC))
  }

  var flags = header[off_flags]
  var mipmapCount = 1
  if (flags & DDSD_MIPMAPCOUNT) {
    mipmapCount = Math.max(1, header[off_mipmapCount])
  }

  var width = header[off_width]
  var height = header[off_height]
  var dataOffset = header[off_size] + 4
  var texWidth = width
  var texHeight = height
  var images = []
  var dataLength

  for (var i = 0; i < mipmapCount; i++) {
    dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes
    images.push({
      offset: dataOffset,
      length: dataLength,
      shape: [ width, height ]
    })
    dataOffset += dataLength
    width = Math.floor(width / 2)
    height = Math.floor(height / 2)
  }

  return {
    shape: [ texWidth, texHeight ],
    images: images,
    format: format,
    flags: flags
  }
}

function fourCCToInt32 (value) {
  return value.charCodeAt(0) +
    (value.charCodeAt(1) << 8) +
    (value.charCodeAt(2) << 16) +
    (value.charCodeAt(3) << 24)
}

function int32ToFourCC (value) {
  return String.fromCharCode(
    value & 0xff,
    (value >> 8) & 0xff,
    (value >> 16) & 0xff,
    (value >> 24) & 0xff
  )
}
