import React from 'react';
import { mat4 } from './glmatrix';

function createShader(id: string, gl: WebGLRenderingContext){
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
function createProgram(vs: WebGLShader, fs: WebGLShader, gl: WebGLRenderingContext): WebGLProgram |undefined {
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
function createVbo(data: number[], gl: WebGLRenderingContext){
	const vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return vbo;
}
function setAttribute(vbo: WebGLBuffer, attL: number, attS: number, gl: WebGLRenderingContext ){
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.enableVertexAttribArray(attL);
	gl.vertexAttribPointer(attL, attS, gl.FLOAT, false, 0, 0);
}

function createIbo(data: number[], gl: WebGLRenderingContext){
	var ibo = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	return ibo;
}

const rotate = (x: number, y: number, deg: number): [number, number] => {
	const rad = deg * Math.PI/180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	const nx = cos * x - sin * y;
	const ny = sin * x + cos * y;
	return [nx, ny];
}

function renderParticle(c: HTMLCanvasElement){
	c.width = 500;
  c.height = 500;
  const gl = c.getContext('webgl') as WebGLRenderingContext;
  if (!gl) {
    return;
  }
	const num = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
	if(num > 0){
		console.log('max_vertex_texture_imaeg_unit: ' + num);
	}else{
		return;
	}
	const ext = gl.getExtension('OES_texture_float') || gl.getExtension('OES_texture_half_float');
	if(ext == null){
		return;
	}
	let v_shader = createShader('vs', gl) as WebGLShader;
	let f_shader = createShader('fs', gl) as WebGLShader;
	const prg = createProgram(v_shader, f_shader, gl) as WebGLProgram;
	const attLocations = {
		position: gl.getAttribLocation(prg, 'position'),
		color: gl.getAttribLocation(prg, 'color'),
	};
	const pAttStride: number[] = [];
	pAttStride[0] = 1;
	const uniLocations = {
		model: gl.getUniformLocation(prg, 'uModelViewMatrix') as WebGLUniformLocation,
		projection: gl.getUniformLocation(prg, 'uProjectionMatrix') as WebGLUniformLocation,
	};

	// camera
	const fieldOfView = 120 * Math.PI / 180;
	const zNear = 0;
	const zFar = 200.0;
	const projectionMat = mat4.create();
	mat4.perspective(projectionMat, fieldOfView, gl.canvas.width/ gl.canvas.height, zNear, zFar);
	mat4.translate(projectionMat, projectionMat, [0,0, -1])
	const modelMat = mat4.create();

	const position = [
		0.0,  0.0,  0.0,
	];
	const color = [
		1.0, 0.0, 0.0, 1.0,
	];
	const index = [];
	const rad = 30 * Math.PI/180;
	const y = Math.cos(rad);
	const x = Math.sin(rad);

	position.push(x,y,0);
	color.push(1.0, 0.0, 1.0, 1.0)
	for(let i=0; i<6; i++) {
		const [px, py ] = position.slice(-3);
		const [nx, ny] = rotate(px, py, 60);
		position.push(nx, ny, 0);
		color.push(0.0, 0.0, 1.0, 1.0)
		index.push(0, i+1, i+2);
	}

	const pos = createVbo(position, gl) as WebGLBuffer;
	const col = createVbo(color, gl) as WebGLBuffer;
	const ibo = createIbo(index, gl);

	gl.disable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE);
  gl.useProgram(prg);
	setAttribute(pos, attLocations.position, 3, gl);
	setAttribute(col, attLocations.color, 4, gl);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  gl.uniformMatrix4fv(uniLocations.model, false, modelMat);
	gl.uniformMatrix4fv(uniLocations.projection, false, projectionMat);
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
	gl.flush();

}

const loader = (ref: HTMLCanvasElement | null) => {
  if (ref) {
    renderParticle(ref);
  }
};


export default function() {
  return (<canvas className="bg_canvas" ref={loader}/>);
}
