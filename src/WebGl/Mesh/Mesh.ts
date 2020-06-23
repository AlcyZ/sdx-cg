import buildBuffer, { Buffer } from '../Util/buildBuffer';
import buildIndexBuffer, { IndexBuffer } from '../Util/buildIndexBuffer';
import downloadObj from '../Util/downloadObj';
import { mat4, vec3, vec4 } from 'gl-matrix';
import downloadShaderProgram from '../Util/downloadShaderProgram';
import safeGetAttribLocation from '../Util/safeGetAttribLocation';
import safeGetUniformLocation from '../Util/safeGetUniformLocation';
import WavefrontLoader from '../Util/Loader/WavefrontLoader';
import bindBuffer from '../Util/bindBuffer';
import downloadTexture from '../Util/downloadTexture';
import safeCreateTexture from '../Util/safeCreateTexture';

const vShaderUrl = './WebGl/Mesh/Shaders/vertex.glsl.txt';
const fShaderUrl = './WebGl/Mesh/Shaders/fragment.glsl.txt';

interface Buffers {
  vertex: Buffer;
  normal: Buffer;
  index: IndexBuffer;
  texture: Buffer;
}

interface Texture {
  image: HTMLImageElement;
  buffer: WebGLTexture;
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
  textureCoordsLoc: number;
}

interface ProgramUniformLocations {
  modelMatrixLoc: WebGLUniformLocation;
  viewMatrixLoc: WebGLUniformLocation;
  projectionMatrixLoc: WebGLUniformLocation;
  lightPositionLoc: WebGLUniformLocation;
  lightColorLoc: WebGLUniformLocation;
}

export interface MeshRenderDescriptor {
  gl: WebGLRenderingContext;
  matrices: {
    view: mat4;
    projection: mat4;
  };
  light: {
    position: vec3;
    color: vec3;
  };
}

export default class Mesh {
  private readonly program: Program;
  private readonly buffers: Buffers;
  private readonly texture: Texture;
  private readonly transformation: mat4;

  constructor(
    program: Program,
    buffers: Buffers,
    texture: Texture,
    transformation: mat4,
  ) {
    this.program = program;
    this.buffers = buffers;
    this.texture = texture;
    this.transformation = transformation;
  }

  public static async init(
    gl: WebGLRenderingContext,
    modelUrl: string,
    textureUrl: string,
  ): Promise<Mesh> {
    const [program, mesh, textureImage] = await Promise.all([
      await this.initProgram(gl),
      await downloadObj(modelUrl),
      await downloadTexture(textureUrl),
    ]);

    const buffers = this.initBuffers(gl, mesh);
    const texture = this.initTexture(gl, textureImage);

    const position = vec3.fromValues(0, 0, 0);
    const rotation = vec3.fromValues(0, 0, 0);
    const scale = vec3.fromValues(1, 1, 1);

    const transformation = mat4.create();
    mat4.translate(transformation, transformation, position);
    mat4.rotate(transformation, transformation, 1, rotation);
    mat4.scale(transformation, transformation, scale);

    return new Mesh(program, buffers, texture, transformation);
  }

  public rotateX(radian: number): void {
    mat4.rotateX(this.transformation, this.transformation, radian);
  }

  public rotateY(radian: number): void {
    mat4.rotateY(this.transformation, this.transformation, radian);
  }

  public rotateZ(radian: number): void {
    mat4.rotateZ(this.transformation, this.transformation, radian);
  }

  public asd(newPosition: vec3): void {
    const transformation = mat4.create();
    mat4.translate(this.transformation, transformation, newPosition);
  }

  public asd2(newPosition: vec3): void {
    mat4.translate(this.transformation, this.transformation, newPosition);
  }

  public render(descriptor: MeshRenderDescriptor): void {
    const gl = descriptor.gl;
    const uniformLocations = this.program.locations.uniform;
    const attribLocations = this.program.locations.attrib;

    gl.useProgram(this.program.program);

    bindBuffer(gl, attribLocations.positionLoc, this.buffers.vertex);
    bindBuffer(gl, attribLocations.normalLoc, this.buffers.normal);
    bindBuffer(gl, attribLocations.textureCoordsLoc, this.buffers.texture);

    gl.uniformMatrix4fv(
      uniformLocations.modelMatrixLoc,
      false,
      this.transformation,
    );
    gl.uniformMatrix4fv(
      uniformLocations.viewMatrixLoc,
      false,
      descriptor.matrices.view,
    );
    gl.uniformMatrix4fv(
      uniformLocations.projectionMatrixLoc,
      false,
      descriptor.matrices.projection,
    );
    gl.uniform3fv(
      uniformLocations.lightPositionLoc,
      descriptor.light.position as Float32List,
    );
    gl.uniform3fv(
      uniformLocations.lightColorLoc,
      descriptor.light.color as Float32List,
    );

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
      textureCoordsLoc: safeGetAttribLocation('textureCoords', gl, program),
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
    const texture = buildBuffer(gl, mesh.textures, mesh.textureStride);

    return {
      index,
      vertex,
      normal,
      texture,
    };
  }

  private static initTexture(
    gl: WebGLRenderingContext,
    image: HTMLImageElement,
  ): Texture {
    const buffer = safeCreateTexture(gl);
    gl.bindTexture(gl.TEXTURE_2D, buffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    return {
      image,
      buffer,
    };
  }
}
