import { mat4, vec3 } from 'gl-matrix';
import downloadShaderProgram from '../../Util/downloadShaderProgram';
import resizeCanvas from '../../Util/resizeCanvas';
import cubeData from './cubeData';

const vShaderUrl = './_dist_/WebGl/Examples/Cube/shaders/v.glsl.txt';
const fShaderUrl = './_dist_/WebGl/Examples/Cube/shaders/f.glsl.txt';

interface Surface {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
}

interface Program {
  program: WebGLProgram;
  positionLocation: number;
  mvpLocation: WebGLUniformLocation;
}

interface Buffer {
  buffer: WebGLBuffer;
  size: number;
  count: number;
}

export default class Cube {
  private readonly surface: Surface;
  private readonly program: Program;
  private readonly buffer: Buffer;

  private constructor(surface: Surface, program: Program, buffer: Buffer) {
    this.surface = surface;
    this.program = program;
    this.buffer = buffer;
  }

  public static async init(surface: Surface): Promise<Cube> {
    const program = await this.initProgram(surface.gl);
    const buffer = this.initBuffer(surface.gl, program.program);

    return new Cube(surface, program, buffer);
  }

  public render(): void {
    const gl = this.surface.gl;

    resizeCanvas(this.surface.canvas);
    gl.viewport(0, 0, this.surface.canvas.width, this.surface.canvas.height);

    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.useProgram(this.program.program);

    gl.enableVertexAttribArray(this.program.positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
    gl.vertexAttribPointer(
      this.program.positionLocation,
      this.buffer.size,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.uniformMatrix4fv(
      this.program.mvpLocation,
      false,
      Cube.mvpMatrix(this.surface.canvas),
    );

    gl.drawArrays(gl.TRIANGLES, 0, this.buffer.count);
  }

  private static mvpMatrix(canvas: HTMLCanvasElement): Float32Array {
    const aspect = Math.abs(canvas.width / canvas.height);
    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

    let viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -5));

    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-3, 2, -3));
    let now = Date.now() / 1000;
    mat4.rotate(
      modelMatrix,
      modelMatrix,
      1,
      vec3.fromValues(Math.sin(now), Math.cos(now), 0),
    );

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

    let modelViewProjectionMatrix = mat4.create();
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    return modelViewProjectionMatrix as Float32Array;
  }

  private static initBuffer(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
  ): Buffer {
    // const data = [
    //     // first triangle
    //     -1.0, -1.0,
    //     1.0, -1.0,
    //     -1.0, 1.0,
    //
    //     // second triangle
    //     1.0, -1.0,
    //     1.0, 1.0,
    //     -1.0, 1.0,
    // ];
    const data = cubeData;
    const size = 4;
    const count = data.length / size;

    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error('Could not create webgl buffer.');
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    return {
      buffer,
      size,
      count,
    };
  }

  private static async initProgram(
    gl: WebGLRenderingContext,
  ): Promise<Program> {
    const program = await downloadShaderProgram(gl, vShaderUrl, fShaderUrl);
    const positionLocation = gl.getAttribLocation(program, 'position');
    const mvpLocation = gl.getUniformLocation(program, 'mvp');
    if (positionLocation < 0) {
      throw new Error('Invalid vertex shader. "position" attribute not found.');
    }
    if (!mvpLocation) {
      throw new Error('Invalid vertex shader. "mvp" uniform not found.');
    }
    return {
      program,
      positionLocation,
      mvpLocation,
    };
  }
}
