import React from 'react';
import { mat4 } from './glmatrix';

const bezier = (points: number[], t: number): number => {
	const p0 = points.pop();
	const p1 = points.pop();
	if (p0 !== undefined && p1 !== undefined) {
		const pn = (1-t)*p0 + t*p1;
		if(points[0]) {
			points.splice(0, 0, pn)
			return bezier(points ,t)
		} else {
			return pn;
		}
	}
	return 0;
}

interface Buf {
	x: number[];
	y: number[];
}
type Point = [number, number]
const bezierFromPositions = (positions: Point[], count: number) => {
	const buf = positions.reduce((acc, p) => {
		acc.x.push(p[0]);
		acc.y.push(p[1]);
		return acc;
	}, {x:[],y:[]} as Buf);

	const step = 1/count;
	const posX: number[] = []
	const posY: number[] = []
	for (let i=0; i< count; i++) {
		const t = step*i;
		posX.push(bezier([...buf.x], t));
		posY.push(bezier([...buf.y], t));
	}
	return posX.flatMap((x, i) => {
		return [x, posY[i], 0];
	});
};

(window as any).bez = bezier;
(window as any).bezier = bezierFromPositions;

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

const createMirrorHex = (basePosition: number[], baseColor: number[]) => {
	const index = [];
	for(let i=0; i < basePosition.length * 6; i++) {
		index.push(i);
	}
	const color = [];
	for(let i=0; i < 6; i++) {
		color.push(...baseColor);
	}
	const position = [...basePosition];
	for (let i=1; i <= 2; i++ ) {
		for(let head=0; head < basePosition.length; head += 3) {
			const [nx, ny] = rotate(basePosition[head], basePosition[head+1], 120 * i);
			position.push(nx, ny, 0);
		}
	}

	const nextBase: number[] = [];
	for(let head=0; head < basePosition.length; head += 3) {
		const [nx, ny] = [basePosition[head], -1 * basePosition[head+1]];
		nextBase.push(nx, ny, 0);
	}

	position.push(...nextBase);
	for (let i=1; i <= 2; i++ ) {
		for(let head=0; head < nextBase.length; head += 3) {
			const [nx, ny] = rotate(nextBase[head], nextBase[head+1], 120 * i);
			position.push(nx, ny, 0);
		}
	}

	return {
		index,
		position,
		color,
	};
};

function renderParticle(c: HTMLCanvasElement){
	c.width = window.innerWidth;
  c.height = window.innerHeight;
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
	const fieldOfView = 90 * Math.PI / 180;
	const zNear = 0;
	const zFar = 200.0;


	const drawPattern = (inputPos: number[], inputCol: number[]) => {
		const { position, color } = createMirrorHex(inputPos, inputCol);
		const pos = createVbo(position, gl) as WebGLBuffer;
		const col = createVbo(color, gl) as WebGLBuffer;
		setAttribute(pos, attLocations.position, 3, gl);
		setAttribute(col, attLocations.color, 4, gl);

		for (let xi = 0; xi < 14; xi++) {
			for (let yi = 0; yi < 14; yi++) {
				const modelMat = mat4.create();
				mat4.translate(modelMat, modelMat, [6*x * xi, yi * y * 2, 0])
				gl.uniformMatrix4fv(uniLocations.model, false, modelMat);
				gl.uniformMatrix4fv(uniLocations.projection, false, projectionMat);
				gl.drawArrays(gl.TRIANGLES, 0, position.length/3);

				mat4.translate(modelMat, modelMat, [3*x, y, 0])
				gl.uniformMatrix4fv(uniLocations.model, false, modelMat);
				gl.uniformMatrix4fv(uniLocations.projection, false, projectionMat);
				gl.drawArrays(gl.TRIANGLES, 0, position.length/3);
			}
		}
	}

	const rad = 30 * Math.PI/180;
	const y = 0.25 * Math.cos(rad);
	const x = 0.25 * Math.sin(rad);
	const [x2, y2] = rotate(x, y, 60);
	let counter = 0
	const basePrj = mat4.create();
	const projectionMat = mat4.create();
	mat4.perspective(basePrj, fieldOfView, gl.canvas.width/ gl.canvas.height, zNear, zFar);
	const srcBezPositions: Point[] = [
		[x,y],
		[x2*Math.random(),y2*Math.random()],
		[x*Math.random(),y*Math.random()],
		[x2*Math.random(),y2*Math.random()],
		[x*Math.random(),y*Math.random()],
		[x2*Math.random(),y2*Math.random()],
		[x*Math.random(),y*Math.random()],
		[x2,y2]
	];
	const pointLen = 30;
	const bezPositions = bezierFromPositions(srcBezPositions, pointLen);

	let colors: number[] = [];
	const render = () => {
		mat4.rotate(projectionMat, basePrj, counter * 0.1, [0, 0, 1]);
		mat4.translate(projectionMat, projectionMat, [-2 , -2, -1])
		gl.disable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE);
		gl.useProgram(prg);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		const c = Math.cos(counter);
		const s = Math.sin(counter);
		counter += 0.01;
		const positions = bezPositions.flatMap((p, i) => {
			if (i%6 === 0) {
				return [x*c, y*s, 0, p];
			}
			return [p];
		});
		if (colors.length === 0) {
			colors = [];
			for(let i=0; i<positions.length/3 ;i++) {
				if (i%3 === 0) {
					colors.push(0.0, 0.0, Math.random(), 1.0);
				} else if(i%3===1) {
					colors.push(Math.random(), Math.random(), Math.random(), 1.0);
				} else {
					colors.push(0.0, Math.random(), 1.0, 1.0);
				}
			}
		}
		drawPattern(positions, colors);
		gl.flush();
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

const loader = (ref: HTMLCanvasElement | null) => {
  if (ref) {
    renderParticle(ref);
  }
};


export default function() {
  return (<canvas className="bg_canvas" ref={loader}/>);
}
