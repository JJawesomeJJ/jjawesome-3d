import * as THREE from "three";
var PNGEncoder = require('png-stream/encoder')
var glPixelStream = require('gl-pixel-stream')
var assign = require('object-assign')
export default class exportTextureUtil{
  threePixelStream (renderer, target, ) {
    let self=this
    let opt={}
    opt.chunkSize=1024,
      opt.onProgress= (ev) => {
        const info = ev
        // loader.innerText = `Writing chunk ${current} of ${total}`
        // console.log(loader.innerText)
        if (info.current === info.total) {
          setTimeout(function () {
            let base64 = self.arrayBufferToBase64(self.imageStream.read())
            var outputImg = document.createElement('img');
            outputImg.src = 'data:image/png;base64,' + base64;
            // // append it to your page
            // document.body.appendChild(outputImg);
            self.download(outputImg.src)
            outputImg.width = 500;
            outputImg.height = 500;
          }, 1)
        }
      }
    if (typeof THREE === 'undefined') throw new Error('THREE is not defined in global scope')
    if (!renderer || typeof renderer.getContext !== 'function') {
      throw new TypeError('Must specify a ThreeJS WebGLRenderer.')
    }

    var gl = renderer.getContext()
    if (!target) {
      throw new TypeError('Must specify WebGLRenderTarget,\npopulated with the contents for export.')
    }

    opt = opt || {}
    var format = opt.format
    if (!format && target.texture && target.texture.format) {
      format = target.texture.format
    } else if (!format) {
      format = target.format
    }

    var glFormat = this.getGLFormat(gl, format)
    var shape = [ target.width, target.height ]
    var framebuffer = target.__webglFramebuffer
    if (!framebuffer) {
      if (!renderer.properties) {
        throw new Error(versionError)
      }
      var props = renderer.properties.get(target)
      if (!props) throw new Error(versionError)
      framebuffer = props.__webglFramebuffer
    }

    opt = assign({
      flipY: true
    }, opt, {
      format: glFormat
    })

    var encoder = new PNGEncoder(shape[0], shape[1], {
      colorSpace: this.getColorSpace(gl, glFormat)
    })

    var stream = glPixelStream(gl, framebuffer, shape, opt)
    stream.pipe(encoder)
    stream.on('error', function (err) {
      encoder.emit('error', err)
    })
    this.imageStream=encoder;
    return encoder
  }

  getGLFormat (gl, format) {
    switch (format) {
      case THREE.RGBFormat: return gl.RGB
      case THREE.RGBAFormat: return gl.RGBA
      case THREE.LuminanceFormat: return gl.LUMINANCE
      case THREE.LuminanceAlphaFormat: return gl.LUMINANCE_ALPHA
      case THREE.AlphaFormat: return gl.ALPHA
      default: throw new TypeError('unsupported format ' + format)
    }
  }

  getColorSpace (gl, format) {
    switch (format) {
      case gl.RGBA: return 'rgba'
      case gl.RGB: return 'rgb'
      case gl.LUMINANCE_ALPHA: return 'graya'
      case gl.LUMINANCE:
      case gl.ALPHA:
        return 'gray'
      default:
        throw new TypeError('unsupported format option ' + format)
    }
  }
  download(base64) {
    this.downloadFile('exportImage.png', base64);
  }
  downloadFile(fileName, content) {
    let aLink = document.createElement('a');
    let blob = this.base64ToBlob(content); //new Blob([content]);

    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);

    aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));//兼容火狐
  }
  //base64转blob
  base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
  }
  arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      if(bytes[i]!=0){
        // console.log(bytes[i])
      }
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
}
