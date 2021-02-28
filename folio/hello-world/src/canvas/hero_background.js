import React from 'react';
import { mat4 } from "./glmatrix";

const point_vs = {
  type: 'x-shader/x-vertex',
  code: `
    attribute float index;
    uniform vec2 resolution;
    uniform sampler2D texture;
    uniform float pointScale;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying vec4 vColor;

    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    vec4 get_color(vec2 xy) {
      float r = rand(xy);
      if (r < 0.1) {
        return vec4(0.0, 1.0, 1.0 , 1.0);
      }
      if (r < 0.3) {
        return vec4(0.0, 1.0, 0.0 , 1.0);
      }
      if (r < 0.5) {
        return vec4(1.0, 1.0, 0.0 , 1.0);
      }
      if (r < 0.7) {
        return vec4(1.0, 0.0, 0.0 , 1.0);
      }
      if (r < 0.9) {
        return vec4(1.0, 0.0, 1.0 , 1.0);
      }
      return vec4(1.0, 1.0, 1.0 , 1.0);
    }
    void main(){
      vec2 p = vec2(
        mod(index, resolution.x) / resolution.x,
        floor(index / resolution.x) / resolution.y
      );
      vec4 t = texture2D(texture, p);
      vec4 pos = uProjectionMatrix * uModelViewMatrix * vec4(t.xyz, 1.0);
      gl_Position = pos;
      gl_PointSize = 0.1;
      vec4 color = get_color(p);
      vec4 camera = uProjectionMatrix * vec4(1.0);
      float light = dot(normalize(camera.xyz), normalize(pos.xyz));
      color.xyz = color.xyz/light; 
      vColor = color;
    }
  `
}

const point_fs = {
  type: 'x-shader/x-fragment',
  code: `
  precision mediump float;
  varying vec4 vColor;

  void main(){
    gl_FragColor = vColor;
  }
  `
}

const velocity_vs = {
  type: 'x-shader/x-vertex',
  code: `
  attribute vec3 position;
  void main(){
    gl_Position = vec4(position, 1.0);
  }
  `
}

const velocity_fs = {
  type: 'x-shader/x-fragment',
  code: `
  precision mediump float;
  uniform vec2 resolution;
  uniform sampler2D texture;
  uniform vec2 seed;
  uniform float velocity;
  void main(){
    float index = gl_FragCoord.x * gl_FragCoord.y;
    vec2 ps = gl_FragCoord.xy / resolution;
    float x = gl_FragCoord.x / resolution.x * 2.0 - 1.0 + cos(seed.x);
    float y = gl_FragCoord.y / resolution.y * 2.0 - 1.0 + sin(seed.x);
    vec4 t = texture2D(texture, ps);
    t.z = cos(15.0 * sqrt((x*x + y*y)));
    gl_FragColor = t;
  }
  `
}

const default_vs = {
  type: 'x-shader/x-vertex',
  code: `
  attribute vec3 position;
  void main(){
    gl_Position = vec4(position, 1.0);
  }
  `
}

const default_fs = {
  type: 'x-shader/x-fragment',
  code: `
  precision mediump float;
  uniform vec2 resolution;
  void main(){
    float y = (gl_FragCoord.y / resolution.y) * 15.0 - 7.5;
    float x = (gl_FragCoord.x / resolution.x) * 15.0 - 7.5;
    gl_FragColor = vec4(vec2(x, y), gl_FragCoord.x, 0);
  } 
  `
}



const createHeroHeader = () => {
  let run = true;// アニメーション継続フラグ
  const c = document.getElementById('hero_header_canvas');
	c.width = Math.max(window.innerWidth, 500);
  c.height = Math.max(window.innerHeight, 500);
	// WebGLコンテキストの初期化
  const gl = c.getContext('webgl');
  if (!gl) {
    return;
  }
	// 頂点テクスチャフェッチが利用可能かどうかチェック
	const num = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
	if(num > 0){
		console.log('max_vertex_texture_imaeg_unit: ' + num);
	}else{
    console.error('cannot load vertex texture')
		return;
	}
	// 浮動小数点数テクスチャが利用可能かどうかチェック
	const ext = gl.getExtension('OES_texture_float') || gl.getExtension('OES_texture_half_float');
	if(ext == null){
    console.error('cannot load texture float')
		return;
	}
	let v_shader = create_shader(point_vs);
	let f_shader = create_shader(point_fs);
	const pointPrg = create_program(v_shader, f_shader);
	const pAttLocation = [];
	pAttLocation[0] = gl.getAttribLocation(pointPrg, 'index');
	const pAttStride = [];
	pAttStride[0] = 1;
	const pUniLocation = {
		resolution: gl.getUniformLocation(pointPrg, 'resolution'),
		texture: gl.getUniformLocation(pointPrg, 'texture'),
		pointSize: gl.getUniformLocation(pointPrg, 'pointScale'),
		model: gl.getUniformLocation(pointPrg, 'uModelViewMatrix'),
		projection: gl.getUniformLocation(pointPrg, 'uProjectionMatrix'),
	};
	v_shader = create_shader(velocity_vs);
	f_shader = create_shader(velocity_fs);
	const velocityPrg = create_program(v_shader, f_shader);
	const vAttLocation = [];
	vAttLocation[0] = gl.getAttribLocation(velocityPrg, 'position');
	const vAttStride = [];
	vAttStride[0] = 3;
	const vUniLocation = {
		resolution: gl.getUniformLocation(velocityPrg, 'resolution'),
		texture: gl.getUniformLocation(velocityPrg, 'texture'),
		seed: gl.getUniformLocation(velocityPrg, 'seed'),
	};

	v_shader = create_shader(default_vs);
	f_shader = create_shader(default_fs);
	const dPrg = create_program(v_shader, f_shader);
	const dAttLocation = [];
	dAttLocation[0] = gl.getAttribLocation(dPrg, 'position');
	const dAttStride = [];
	dAttStride[0] = 3;
	const dUniLocation = [];
	dUniLocation[0] = gl.getUniformLocation(dPrg, 'resolution');

	const TEXTURE_WIDTH  = 600;
	const TEXTURE_HEIGHT = 600;
	const resolution = [TEXTURE_WIDTH, TEXTURE_HEIGHT];
	
	// camera
	const fieldOfView = 120 * Math.PI / 180;
	const zNear = 0.1;
	const zFar = 200.0;
	const projectionMat = mat4.create();
	mat4.perspective(projectionMat, fieldOfView, gl.canvas.width/ gl.canvas.height, zNear, zFar);
	mat4.translate(projectionMat, projectionMat, [0,0,-3.8])
	const modelMat = mat4.create();

	const vertices = new Array(TEXTURE_WIDTH * TEXTURE_HEIGHT);
	for(let i = 0, j = vertices.length; i < j; i++){
		vertices[i] = i;
	}
	const vIndex = create_vbo(vertices);
	const vVBOList = [vIndex];
	const position = [
		-1.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		 1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0
	];
	const vPlane = create_vbo(position);
	const planeVBOList = [vPlane];
	let backBuffer  = create_framebuffer(TEXTURE_WIDTH, TEXTURE_WIDTH, gl.FLOAT);
	let frontBuffer = create_framebuffer(TEXTURE_WIDTH, TEXTURE_WIDTH, gl.FLOAT);
	let flip = null;
	gl.disable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, backBuffer.frame);
  gl.viewport(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(dPrg);
  set_attribute(planeVBOList, dAttLocation, dAttStride);
  gl.uniform2fv(dUniLocation[0], resolution);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);
	let pos = 0;

	mat4.rotate(modelMat, modelMat, -Math.PI/4 ,[1, 0, 0]);
	const render = () => {
		mat4.translate(projectionMat, projectionMat, [0,0,0])
		const randomPosX = pos;
		pos += 0.001;
		const randomPosY = Math.cos(pos);
		gl.disable(gl.BLEND);
		gl.bindFramebuffer(gl.FRAMEBUFFER, frontBuffer.frame);
		gl.viewport(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(velocityPrg);
		gl.bindTexture(gl.TEXTURE_2D, backBuffer.texture);
		set_attribute(planeVBOList, vAttLocation, vAttStride);
		gl.uniform2fv(vUniLocation.resolution, resolution);
		gl.uniform1i(vUniLocation.texture, 0);
		gl.uniform2fv(vUniLocation.seed, [randomPosX, randomPosY]);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);

		gl.enable(gl.BLEND);
		gl.viewport(0, 0, c.width, c.height);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(pointPrg);
		gl.bindTexture(gl.TEXTURE_2D, frontBuffer.texture);
		set_attribute(vVBOList, pAttLocation, pAttStride);
		gl.uniform2fv(pUniLocation.resolution, resolution);
		gl.uniform1i(pUniLocation.texture, 0);
		gl.uniformMatrix4fv(pUniLocation.model, false, modelMat);
		gl.uniformMatrix4fv(pUniLocation.projection, false,  projectionMat);
		gl.drawArrays(gl.POINTS, 0, vertices.length);
		gl.flush();
		flip = backBuffer;
		backBuffer = frontBuffer;
		frontBuffer = flip;
		if(run){requestAnimationFrame(render);}
	}
	render();

	function create_shader(info){
		let shader;
		switch(info.type){
			case 'x-shader/x-vertex':
				shader = gl.createShader(gl.VERTEX_SHADER);
				break;
			case 'x-shader/x-fragment':
				shader = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default :
				return;
		}
		gl.shaderSource(shader, info.code);
		gl.compileShader(shader);
		if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			return shader;
		}else{
			console.error(gl.getShaderInfoLog(shader));
		}
	}
	function create_program(vs, fs) {
		const program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if(gl.getProgramParameter(program, gl.LINK_STATUS)){
			gl.useProgram(program);
			return program;
		}else{
      console.error(gl.getProgramInfoLog(program));
      return;
		}
	}
	function create_vbo(data){
		const vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return vbo;
	}
	function set_attribute(vbo, attL, attS){
		for(const i in vbo){
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
			gl.enableVertexAttribArray(attL[i]);
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
		}
	}
	function create_framebuffer(width, height, format){
		let textureFormat;
		if(!format){
			textureFormat = gl.UNSIGNED_BYTE;
		}else{
			textureFormat = format;
		}
		const frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
		const depthRenderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
		const fTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, fTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, textureFormat, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return {frame : frameBuffer, depth : depthRenderBuffer, texture : fTexture};
	}
};

const useHeroHeader = () => {
  React.useEffect(() =>{
    createHeroHeader();
  }, []);
}

export default useHeroHeader;
