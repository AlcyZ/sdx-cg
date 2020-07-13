import { Buffer } from '../Util/buildBuffer';
import { IndexBuffer } from '../Util/buildIndexBuffer';
import { mat4, vec3 } from 'gl-matrix';
// @ts-ignore
import MeshRenderer, { MeshRendererDescriptor } from './MeshRenderer';
import MeshInitiator, { MeshInitiatorDescriptor } from './MeshInitiator';


interface BufferInfo {
  components: number;
}

interface VertexBufferInfo extends BufferInfo {
  value: Float32Array;
}

interface IndexBufferInfo extends BufferInfo {
  value: Uint16Array;
}

export interface MeshBufferInfo {
  normal: VertexBufferInfo;
  position: VertexBufferInfo;
  texCoord: VertexBufferInfo;
  indices: IndexBufferInfo;
}

export interface ShaderLocations {
  attribute: {
    positionLoc: number;
    normalLoc: number;
    textureCoordsLoc: number;
  };
  uniform: {
    modelMatrixLoc: WebGLUniformLocation;
    viewMatrixLoc: WebGLUniformLocation;
    projectionMatrixLoc: WebGLUniformLocation;
    lightPositionLoc: WebGLUniformLocation;
    lightColorLoc: WebGLUniformLocation;
  };
}

export interface Buffers {
  position: Buffer;
  normal: Buffer;
  index: IndexBuffer;
  textureCoords: Buffer;
}

export interface Texture {
  buffer: WebGLTexture;
  image: TexImageSource;
}

export interface MeshRenderDescriptor {
  gl: WebGLRenderingContext;
  matrices: {
    view: mat4;
    projection: mat4;
  };
  light: {
    position: vec3,
    color: vec3
  }
}

class Mesh {
  private readonly renderer: MeshRenderer;
  private readonly program: WebGLProgram;
  private readonly locations: ShaderLocations;
  private readonly buffers: Buffers;
  private readonly texture: Texture;
  private readonly transformation: mat4;

  constructor(
    program: WebGLProgram,
    locations: ShaderLocations,
    buffers: Buffers,
    texture: Texture,
  ) {
    this.program = program;
    this.locations = locations;
    this.buffers = buffers;
    this.texture = texture;
    this.transformation = mat4.create();
    this.renderer = new MeshRenderer();
  }

  public static init = async (
    descriptor: MeshInitiatorDescriptor,
  ): Promise<Mesh> => {
    return MeshInitiator.init(descriptor);
  };

  public render = (descriptor: MeshRenderDescriptor): void => {
    const renderDescriptor: MeshRendererDescriptor = {
      matrices: {
        transformation: this.transformation,
        ...descriptor.matrices,
      },
      shaderLocations: this.locations,
      buffers: this.buffers,
      texture: this.texture,
      program: this.program,
      gl: descriptor.gl,
      light: descriptor.light,
    };
    this.renderer.render(renderDescriptor);
  };

  public translate(x: number, y: number, z: number): void {
    mat4.translate(this.transformation, this.transformation, [x, y, z]);
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
}

export default Mesh;
