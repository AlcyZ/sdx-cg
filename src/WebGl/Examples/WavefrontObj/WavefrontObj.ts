// import downloadShaderProgram from '../../Util/downloadShaderProgram';
// import downloadObj from '../../Util/downloadObj';
// import resizeCanvas from '../../Util/resizeCanvas';
// import { mat4, vec3 } from 'gl-matrix';
// import WavefrontLoader from '../../Util/Loader/WavefrontLoader';
//
// const vShaderUrl = './_dist_/WebGl/Examples/Cube/shaders/v.glsl.txt';
// const fShaderUrl = './_dist_/WebGl/Examples/Cube/shaders/f.glsl.txt';
//
// interface Surface {
//   canvas: HTMLCanvasElement;
//   gl: WebGLRenderingContext;
// }
//
// interface ExtendedGLBuffer extends WebGLBuffer {
//   itemSize: number;
//   numItems: number;
// }
//
// interface Program {
//   program: WebGLProgram;
//   positionLocation: number;
//   mvpLocation: WebGLUniformLocation;
// }
//
// export default class WavefrontObj {
//   private readonly surface: Surface;
//   private readonly program: Program;
//   private readonly normalBuffer: ExtendedGLBuffer;
//   private readonly textureBuffer: ExtendedGLBuffer;
//   private readonly vertexBuffer: ExtendedGLBuffer;
//   private readonly indexBuffer: ExtendedGLBuffer;
//
//   constructor(
//     surface: Surface,
//     program: Program,
//     normalBuffer: ExtendedGLBuffer,
//     textureBuffer: ExtendedGLBuffer,
//     vertexBuffer: ExtendedGLBuffer,
//     indexBuffer: ExtendedGLBuffer,
//   ) {
//     this.surface = surface;
//     this.program = program;
//     this.normalBuffer = normalBuffer;
//     this.textureBuffer = textureBuffer;
//     this.vertexBuffer = vertexBuffer;
//     this.indexBuffer = indexBuffer;
//   }
//
//   public static async init(surface: Surface): Promise<WavefrontObj> {
//     const program = await this.initProgram(surface.gl);
//
//     const mesh = await downloadObj(
//       './_dist_/WebGl/Examples/WavefrontObj/sample_tree.obj',
//     );
//
//     const [
//       normalBuffer,
//       textureBuffer,
//       vertexBuffer,
//       indexBuffer,
//     ] = initMeshBuffers(surface.gl, mesh);
//
//     return new WavefrontObj(
//       surface,
//       program,
//       normalBuffer,
//       textureBuffer,
//       vertexBuffer,
//       indexBuffer,
//     );
//   }
//
//   public render(): void {
//     const gl = this.surface.gl;
//
//     resizeCanvas(this.surface.canvas);
//     gl.viewport(0, 0, this.surface.canvas.width, this.surface.canvas.height);
//
//     gl.clearColor(0.1, 0.1, 0.1, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//
//     gl.enable(gl.DEPTH_TEST);
//     gl.enable(gl.CULL_FACE);
//
//     gl.useProgram(this.program.program);
//
//     gl.enableVertexAttribArray(this.program.positionLocation);
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
//     gl.vertexAttribPointer(
//       this.program.positionLocation,
//       this.vertexBuffer.itemSize,
//       gl.FLOAT,
//       false,
//       0,
//       0,
//     );
//
//     gl.uniformMatrix4fv(
//       this.program.mvpLocation,
//       false,
//       WavefrontObj.mvpMatrix(this.surface.canvas),
//     );
//
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
//     gl.drawElements(
//       gl.TRIANGLES,
//       this.indexBuffer.numItems,
//       gl.UNSIGNED_SHORT,
//       0,
//     );
//   }
//
//   private static mvpMatrix(canvas: HTMLCanvasElement): Float32Array {
//     const aspect = Math.abs(canvas.width / canvas.height);
//     let projectionMatrix = mat4.create();
//     mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);
//
//     let viewMatrix = mat4.create();
//     mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, -3, -10));
//
//     const modelMatrix = mat4.create();
//     mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-2, 0, 0));
//
//     const modelViewMatrix = mat4.create();
//     mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
//
//     let modelViewProjectionMatrix = mat4.create();
//     mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);
//
//     return modelViewProjectionMatrix as Float32Array;
//   }
//
//   private static async initProgram(
//     gl: WebGLRenderingContext,
//   ): Promise<Program> {
//     const program = await downloadShaderProgram(gl, vShaderUrl, fShaderUrl);
//     const positionLocation = gl.getAttribLocation(program, 'position');
//     const mvpLocation = gl.getUniformLocation(program, 'mvp');
//     if (positionLocation < 0) {
//       throw new Error('Invalid vertex shader. "position" attribute not found.');
//     }
//     if (!mvpLocation) {
//       throw new Error('Invalid vertex shader. "mvp" uniform not found.');
//     }
//     return {
//       program,
//       positionLocation,
//       mvpLocation,
//     };
//   }
// }
//
// function _buildBuffer(
//   gl: WebGLRenderingContext,
//   type: GLenum,
//   data: number[],
//   itemSize: number,
// ): ExtendedGLBuffer {
//   const buffer = gl.createBuffer() as ExtendedGLBuffer;
//   const arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
//   gl.bindBuffer(type, buffer);
//   gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
//   buffer.itemSize = itemSize;
//   buffer.numItems = data.length / itemSize;
//   return buffer;
// }
//
// function initMeshBuffers(
//   gl: WebGLRenderingContext,
//   mesh: WavefrontLoader,
// ): [ExtendedGLBuffer, ExtendedGLBuffer, ExtendedGLBuffer, ExtendedGLBuffer] {
//   const normalBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertexNormals, 3);
//   const textureBuffer = _buildBuffer(
//     gl,
//     gl.ARRAY_BUFFER,
//     mesh.textures,
//     mesh.textureStride,
//   );
//   const vertexBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, 3);
//   const indexBuffer = _buildBuffer(
//     gl,
//     gl.ELEMENT_ARRAY_BUFFER,
//     mesh.indices,
//     1,
//   );
//
//   return [normalBuffer, textureBuffer, vertexBuffer, indexBuffer];
// }
