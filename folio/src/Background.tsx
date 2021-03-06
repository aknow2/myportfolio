import React from 'react';
import { mat4 } from './glmatrix';

function renderParticle(c: HTMLCanvasElement){
	let run = true;           // アニメーション継続フラグ

	c.width = Math.max(window.innerWidth, 500);
  c.height = Math.max(window.innerHeight, 500);
	// WebGLコンテキストの初期化
  const gl = c.getContext('webgl') as WebGLRenderingContext;
  if (!gl) {
    return;
  }
	// 頂点テクスチャフェッチが利用可能かどうかチェック
	const num = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
	if(num > 0){
		console.log('max_vertex_texture_imaeg_unit: ' + num);
	}else{
		return;
	}
	// 浮動小数点数テクスチャが利用可能かどうかチェック
	const ext = gl.getExtension('OES_texture_float') || gl.getExtension('OES_texture_half_float');
	if(ext == null){
		return;
	}
	let v_shader = create_shader('point_vs') as WebGLShader;
	let f_shader = create_shader('point_fs') as WebGLShader;
	const pointPrg = create_program(v_shader, f_shader) as WebGLProgram;
	const pAttLocation: number[] = [];
	pAttLocation[0] = gl.getAttribLocation(pointPrg, 'index');
	const pAttStride: number[] = [];
	pAttStride[0] = 1;
	const pUniLocation = {
		resolution: gl.getUniformLocation(pointPrg, 'resolution') as WebGLUniformLocation,
		texture: gl.getUniformLocation(pointPrg, 'texture') as WebGLUniformLocation,
		pointSize: gl.getUniformLocation(pointPrg, 'pointScale') as WebGLUniformLocation,
		model: gl.getUniformLocation(pointPrg, 'uModelViewMatrix') as WebGLUniformLocation,
		projection: gl.getUniformLocation(pointPrg, 'uProjectionMatrix') as WebGLUniformLocation,
	};
	v_shader = create_shader('velocity_vs') as WebGLShader;
	f_shader = create_shader('velocity_fs') as WebGLShader;
	const velocityPrg = create_program(v_shader, f_shader) as WebGLProgram;
	const vAttLocation: number[] = [];
	vAttLocation[0] = gl.getAttribLocation(velocityPrg, 'position');
	const vAttStride: number[] = [];
	vAttStride[0] = 3;
	const vUniLocation = {
		resolution: gl.getUniformLocation(velocityPrg, 'resolution') as WebGLUniformLocation,
		texture: gl.getUniformLocation(velocityPrg, 'texture') as WebGLUniformLocation,
		seed: gl.getUniformLocation(velocityPrg, 'seed') as WebGLUniformLocation,
	};

	v_shader = create_shader('default_vs') as WebGLShader;
	f_shader = create_shader('default_fs') as WebGLShader;
	const dPrg = create_program(v_shader, f_shader) as WebGLShader;
	const dAttLocation: number[] = [];
	dAttLocation[0] = gl.getAttribLocation(dPrg, 'position');
	const dAttStride: number[] = [];
	dAttStride[0] = 3;
	const dUniLocation: WebGLUniformLocation[] = [];
	dUniLocation[0] = gl.getUniformLocation(dPrg, 'resolution') as WebGLUniformLocation;

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
	const vIndex = create_vbo(vertices) as WebGLBuffer;
	const vVBOList = [vIndex];
	const position = [
		-1.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		 1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0
	];
	const vPlane = create_vbo(position) as WebGLBuffer;
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

	const render = () => {
		mat4.translate(projectionMat, projectionMat, [0,0, Math.cos(pos)* 0.001])
		const randomPosX = pos;
		pos += 0.001;
		mat4.rotate(modelMat, modelMat, 0.0005 ,[1, 0, 1]);
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

	function create_shader(id: string){
		let shader: WebGLShader;
		const scriptElement = document.getElementById(id) as (HTMLScriptElement | null);
		if(!scriptElement){return;}
		switch(scriptElement.type){
			case 'x-shader/x-vertex':
				shader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
				break;
			case 'x-shader/x-fragment':
				shader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
				break;
			default :
				return;
		}
		gl.shaderSource(shader, scriptElement.text);
		gl.compileShader(shader);
		if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			return shader;
		}else{
			console.error(gl.getShaderInfoLog(shader));
		}
	}
	function create_program(vs: WebGLShader, fs: WebGLShader): WebGLProgram |undefined {
		const program = gl.createProgram() as WebGLProgram;
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
	function create_vbo(data: number[]){
		const vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return vbo;
	}
	function set_attribute(vbo: WebGLBuffer[], attL: number[], attS: number[]){
		for(const i in vbo){
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
			gl.enableVertexAttribArray(attL[i]);
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
		}
	}
	function create_framebuffer(width: number, height: number, format?: number){
		let textureFormat: number;
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

}

const loader = (ref: HTMLCanvasElement | null) => {
  if (ref) {
    renderParticle(ref);
  }
};


export default function() {
  return (<canvas className="bg_canvas" ref={loader}/>);
}
