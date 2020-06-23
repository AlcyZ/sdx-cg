import downloadShaderProgram from '../../Util/downloadShaderProgram';
import WavefrontLoader from '../../Util/Loader/WavefrontLoader';
import downloadObj from '../../Util/downloadObj';
import resizeCanvas from '../../Util/resizeCanvas';
import { mat4, vec3 } from 'gl-matrix';
import { Surface } from '../../../indexBackup';
import safeGetAttribLocation from '../../Util/safeGetAttribLocation';
import safeGetUniformLocation from '../../Util/safeGetUniformLocation';
import buildBuffer, { Buffer } from '../../Util/buildBuffer';
import buildIndexBuffer, { IndexBuffer } from '../../Util/buildIndexBuffer';

const vShaderUrl = './_dist_/WebGl/Examples/Shaded/Shaders/vertex.glsl.txt';
const fShaderUrl = './_dist_/WebGl/Examples/Shaded/Shaders/fragment.glsl.txt';

interface Buffers {
  vertex: Buffer;
  normal: Buffer;
  index: IndexBuffer;
}

interface Program {
  program: WebGLProgram;
  locations: {
    attrib: ProgramAttribLocations;
    uniform: ProgramUniformLocations;
  };
}

interface ProgramAttribLocations {
  positionLoc: number;
  normalLoc: number;
}

interface ProgramUniformLocations {
  modelMatrixLoc: WebGLUniformLocation;
  viewMatrixLoc: WebGLUniformLocation;
  projectionMatrixLoc: WebGLUniformLocation;
  lightPositionLoc: WebGLUniformLocation;
  lightColorLoc: WebGLUniformLocation;
}

export default class ExampleApp {
  private surface: Surface;
  private program: Program;
  private buffers: Buffers;

  constructor(surface: Surface, program: Program, buffers: Buffers) {
    this.surface = surface;
    this.program = program;
    this.buffers = buffers;
  }

  public static async init(surface: Surface): Promise<ExampleApp> {
    const [program, mesh] = await Promise.all([
      await this.initProgram(surface.gl),
      await downloadObj('./_dist_/WebGl/Examples/WavefrontObj/sample_tree.obj'),
    ]);

    const buffers = this.initBuffers(surface.gl, mesh);

    return new ExampleApp(surface, program, buffers);
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

    gl.enableVertexAttribArray(this.program.locations.attrib.positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertex);
    gl.vertexAttribPointer(
      this.program.locations.attrib.positionLoc,
      this.buffers.vertex.itemSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.enableVertexAttribArray(this.program.locations.attrib.normalLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
    gl.vertexAttribPointer(
      this.program.locations.attrib.normalLoc,
      this.buffers.normal.itemSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    const uniformLocations = this.program.locations.uniform;
    const aspect = Math.abs(
      this.surface.canvas.width / this.surface.canvas.height,
    );

    const now = Date.now() / 300;
    const rotation = Math.cos(now);

    const modelMatrix = mat4.create();
    // mat4.rotate(modelMatrix, modelMatrix, rotation, vec3.fromValues(1, 1, 0));

    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, -3, -10));

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

    const lightPosition = vec3.fromValues(5, 15, 5);
    const lightColor = vec3.fromValues(0.9, 0.9, 0.9);

    gl.uniformMatrix4fv(uniformLocations.modelMatrixLoc, false, modelMatrix);
    gl.uniformMatrix4fv(uniformLocations.viewMatrixLoc, false, viewMatrix);
    gl.uniformMatrix4fv(
      uniformLocations.projectionMatrixLoc,
      false,
      projectionMatrix,
    );
    gl.uniform3fv(
      uniformLocations.lightPositionLoc,
      lightPosition as Float32List,
    );
    gl.uniform3fv(uniformLocations.lightColorLoc, lightColor as Float32List);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
    gl.drawElements(
      gl.TRIANGLES,
      this.buffers.index.numItems,
      gl.UNSIGNED_SHORT,
      0,
    );
  }

  private static async initProgram(
    gl: WebGLRenderingContext,
  ): Promise<Program> {
    const program = await downloadShaderProgram(gl, vShaderUrl, fShaderUrl);

    const attribLocations: ProgramAttribLocations = {
      positionLoc: safeGetAttribLocation('position', gl, program),
      normalLoc: safeGetAttribLocation('normal', gl, program),
    };

    const uniformLocations: ProgramUniformLocations = {
      modelMatrixLoc: safeGetUniformLocation('modelMatrix', gl, program),
      viewMatrixLoc: safeGetUniformLocation('viewMatrix', gl, program),
      projectionMatrixLoc: safeGetUniformLocation(
        'projectionMatrix',
        gl,
        program,
      ),
      lightPositionLoc: safeGetUniformLocation('lightPosition', gl, program),
      lightColorLoc: safeGetUniformLocation('lightColor', gl, program),
    };

    return {
      program,
      locations: {
        attrib: attribLocations,
        uniform: uniformLocations,
      },
    };
  }

  private static initBuffers(
    gl: WebGLRenderingContext,
    mesh: WavefrontLoader,
  ): Buffers {
    const normal = buildBuffer(gl, mesh.vertexNormals, 3);
    const vertex = buildBuffer(gl, mesh.vertices, 3);
    const index = buildIndexBuffer(gl, mesh.indices, 1);

    return {
      index,
      vertex,
      normal,
    };
  }
}
