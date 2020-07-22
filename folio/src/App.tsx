import React from 'react';
import './App.css';

function hsva(h: number, s: number, v: number, a: number): number[] {
	if(s > 1 || v > 1 || a > 1){return [];}
	const th = h % 360;
	const i = Math.floor(th / 60);
	const f = th / 60 - i;
	const m = v * (1 - s);
	const n = v * (1 - s * f);
	const k = v * (1 - s * (1 - f));
	const color = [];
	if(!(s > 0) && !(s < 0)){
		color.push(v, v, v, a); 
	} else {
		const r = [v, n, m, m, k, v];
		const g = [k, v, v, n, m, m];
		const b = [m, m, k, v, v, n];
		color.push(r[i], g[i], b[i], a);
	}
	return [1, 0, 1, 1];
}


function renderParticle(c: HTMLCanvasElement){
	let run = true;           // アニメーション継続フラグ
	let velocity = 0;         // パーティクルの加速度係数

	c.width = Math.min(window.innerWidth, window.innerHeight);
  c.height = c.width;
  let mousePositionX = Math.random()* 2 -1;
	let mousePositionY = Math.random()* 2 -1; //Math.random()*c.height - c.height/2; // マウス座標Y（-1.0 から 1.0）
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
	const pPrg = create_program(v_shader, f_shader) as WebGLProgram;
	const pAttLocation: number[] = [];
	pAttLocation[0] = gl.getAttribLocation(pPrg, 'index');
	const pAttStride: number[] = [];
	pAttStride[0] = 1;
	const pUniLocation: WebGLUniformLocation[] = [];
	pUniLocation[0] = gl.getUniformLocation(pPrg, 'resolution') as WebGLUniformLocation;
	pUniLocation[1] = gl.getUniformLocation(pPrg, 'texture') as WebGLUniformLocation;
	pUniLocation[2] = gl.getUniformLocation(pPrg, 'pointScale') as WebGLUniformLocation;
	pUniLocation[3] = gl.getUniformLocation(pPrg, 'ambient') as WebGLUniformLocation;
	// テクスチャへの描き込みを行うシェーダ
	v_shader = create_shader('velocity_vs') as WebGLShader;
	f_shader = create_shader('velocity_fs') as WebGLShader;
	const vPrg = create_program(v_shader, f_shader) as WebGLProgram;
	// locationの初期化
	const vAttLocation: number[] = [];
	vAttLocation[0] = gl.getAttribLocation(vPrg, 'position');
	const vAttStride: number[] = [];
	vAttStride[0] = 3;
	const vUniLocation: WebGLUniformLocation[] = [];
	vUniLocation[0] = gl.getUniformLocation(vPrg, 'resolution') as WebGLUniformLocation;
	vUniLocation[1] = gl.getUniformLocation(vPrg, 'texture') as WebGLUniformLocation;
	vUniLocation[2] = gl.getUniformLocation(vPrg, 'mouse') as WebGLUniformLocation;
	vUniLocation[4] = gl.getUniformLocation(vPrg, 'velocity') as WebGLUniformLocation;
	// テクスチャへの描き込みを行うシェーダ
	v_shader = create_shader('default_vs') as WebGLShader;
	f_shader = create_shader('default_fs') as WebGLShader;
	const dPrg = create_program(v_shader, f_shader) as WebGLShader;
	// locationの初期化
	const dAttLocation: number[] = [];
	dAttLocation[0] = gl.getAttribLocation(dPrg, 'position');
	const dAttStride: number[] = [];
	dAttStride[0] = 3;
	const dUniLocation: WebGLUniformLocation[] = [];
	dUniLocation[0] = gl.getUniformLocation(dPrg, 'resolution') as WebGLUniformLocation;
	// テクスチャの幅と高さ
	const TEXTURE_WIDTH  = 512;
	const TEXTURE_HEIGHT = 512;
	const resolution = [TEXTURE_WIDTH, TEXTURE_HEIGHT];
	// 頂点
	const vertices = new Array(TEXTURE_WIDTH * TEXTURE_HEIGHT);
	// 頂点のインデックスを連番で割り振る
	for(let i = 0, j = vertices.length; i < j; i++){
		vertices[i] = i;
	}
	// 頂点情報からVBO生成
	const vIndex = create_vbo(vertices) as WebGLBuffer;
	const vVBOList = [vIndex];
	const position = [
		-1.0,  1.0,  0.0,
		-1.0, -100.0,  0.0,
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
  // ビューポートを設定
  gl.viewport(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  // フレームバッファを初期化
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // プログラムオブジェクトの選択
  gl.useProgram(dPrg);
  // テクスチャへ頂点情報をレンダリング
  set_attribute(planeVBOList, dAttLocation, dAttStride);
  gl.uniform2fv(dUniLocation[0], resolution);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);
	// レンダリング関数の呼び出し
	let count = 0;
	let ambient = [];
	render();
	// 恒常ループ
	function render(){

    mousePositionX = mousePositionX + 0.001;
	  mousePositionY = mousePositionY + 0.001; //Ma
		// ブレンドは無効化
		gl.disable(gl.BLEND);
		// フレームバッファをバインド
		gl.bindFramebuffer(gl.FRAMEBUFFER, frontBuffer.frame);
		// ビューポートを設定
		gl.viewport(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
		// フレームバッファを初期化
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		// プログラムオブジェクトの選択
		gl.useProgram(vPrg);
		// テクスチャとしてバックバッファをバインド
		gl.bindTexture(gl.TEXTURE_2D, backBuffer.texture);
		// テクスチャへ頂点情報をレンダリング
		set_attribute(planeVBOList, vAttLocation, vAttStride);
		gl.uniform2fv(vUniLocation[0], resolution);
		gl.uniform1i(vUniLocation[1], 0);
		gl.uniform2fv(vUniLocation[2], [mousePositionX, mousePositionY]);
		gl.uniform1f(vUniLocation[4], velocity);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);
		// パーティクルの色
		count++;
		ambient = hsva(count % 360, 1.0, 0.8, 1.0);
		// ブレンドを有効化
		gl.enable(gl.BLEND);
		// ビューポートを設定
		gl.viewport(0, 0, c.width, c.height);
		// フレームバッファのバインドを解除
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		// プログラムオブジェクトの選択
		gl.useProgram(pPrg);
		// フレームバッファをテクスチャとしてバインド
		gl.bindTexture(gl.TEXTURE_2D, frontBuffer.texture);
		// 頂点を描画
		set_attribute(vVBOList, pAttLocation, pAttStride);
		gl.uniform2fv(pUniLocation[0], resolution);
		gl.uniform1i(pUniLocation[1], 0);
		gl.uniform1f(pUniLocation[2], velocity);
		gl.uniform4fv(pUniLocation[3], ambient);
		gl.drawArrays(gl.POINTS, 0, vertices.length);
		// コンテキストの再描画
		gl.flush();
		// 加速度の調整
		velocity = 1.0;
		// フレームバッファをフリップ
		flip = backBuffer;
		backBuffer = frontBuffer;
		frontBuffer = flip;
		// ループのために再帰呼び出し
		if(run){requestAnimationFrame(render);}
	}

	// シェーダを生成する関数
	function create_shader(id: string){
		// シェーダを格納する変数
		let shader: WebGLShader;
		// HTMLからscriptタグへの参照を取得
		const scriptElement = document.getElementById(id) as (HTMLScriptElement | null);
		// scriptタグが存在しない場合は抜ける
		if(!scriptElement){return;}
		// scriptタグのtype属性をチェック
		switch(scriptElement.type){
			// 頂点シェーダの場合
			case 'x-shader/x-vertex':
				shader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
				break;
			// フラグメントシェーダの場合
			case 'x-shader/x-fragment':
				shader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
				break;
			default :
				return;
		}
		// 生成されたシェーダにソースを割り当てる
		gl.shaderSource(shader, scriptElement.text);
		// シェーダをコンパイルする
		gl.compileShader(shader);
		// シェーダが正しくコンパイルされたかチェック
		if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			// 成功していたらシェーダを返して終了
			return shader;
		}else{
			// 失敗していたらエラーログをアラートする
			alert(gl.getShaderInfoLog(shader));
		}
	}
	// プログラムオブジェクトを生成しシェーダをリンクする関数
	function create_program(vs: WebGLShader, fs: WebGLShader): WebGLProgram |undefined {
		// プログラムオブジェクトの生成
		const program = gl.createProgram() as WebGLProgram;
		// プログラムオブジェクトにシェーダを割り当てる
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		// シェーダをリンク
		gl.linkProgram(program);
		// シェーダのリンクが正しく行なわれたかチェック
		if(gl.getProgramParameter(program, gl.LINK_STATUS)){
			// 成功していたらプログラムオブジェクトを有効にする
			gl.useProgram(program);
			// プログラムオブジェクトを返して終了
			return program;
		}else{
      console.error(gl.getProgramInfoLog(program));
      return;
		}
	}
	// VBOを生成する関数
	function create_vbo(data: number[]){
		// バッファオブジェクトの生成
		const vbo = gl.createBuffer();
		// バッファをバインドする
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		// バッファにデータをセット
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		// バッファのバインドを無効化
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		// 生成した VBO を返して終了
		return vbo;
	}
	// VBOをバインドし登録する関数
	function set_attribute(vbo: WebGLBuffer[], attL: number[], attS: number[]){
		// 引数として受け取った配列を処理する
		for(const i in vbo){
			// バッファをバインドする
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
			// attributeLocationを有効にする
			gl.enableVertexAttribArray(attL[i]);
			// attributeLocationを通知し登録する
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
		}
	}
	// フレームバッファをオブジェクトとして生成する関数
	function create_framebuffer(width: number, height: number, format?: number){
		// フォーマットチェック
		let textureFormat: number;
		if(!format){
			textureFormat = gl.UNSIGNED_BYTE;
		}else{
			textureFormat = format;
		}
		// フレームバッファの生成
		const frameBuffer = gl.createFramebuffer();
		// フレームバッファをWebGLにバインド
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
		// 深度バッファ用レンダーバッファの生成とバインド
		const depthRenderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
		// レンダーバッファを深度バッファとして設定
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
		// フレームバッファにレンダーバッファを関連付ける
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
		// フレームバッファ用テクスチャの生成
		const fTexture = gl.createTexture();
		// フレームバッファ用のテクスチャをバインド
		gl.bindTexture(gl.TEXTURE_2D, fTexture);
		// フレームバッファ用のテクスチャにカラー用のメモリ領域を確保
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, textureFormat, null);
		// テクスチャパラメータ
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);

    // reset
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

function App() {
  return (
    <div className="App">
      <canvas className="bg_canvas" ref={loader}/>
    </div>
  );
}

export default App;
