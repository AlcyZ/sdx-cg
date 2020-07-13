import downloadShaderProgram from '../Util/downloadShaderProgram';
import { Buffer, buildBuffer2 } from '../Util/buildBuffer';
import { buildIndexBuffer2, IndexBuffer } from '../Util/buildIndexBuffer';
import safeGetAttribLocation from '../Util/safeGetAttribLocation';
import safeGetUniformLocation from '../Util/safeGetUniformLocation';
import bindBuffer from '../Util/bindBuffer';
import buildTexture from '../Util/buildTexture';
import { mat4, vec3 } from 'gl-matrix';
import { load } from '@loaders.gl/core';
// @ts-ignore
import { GLTFLoader } from '@loaders.gl/gltf';

const vShaderUrl = './WebGl/Mesh/Shaders/vertex.glsl.txt';
const fShaderUrl = './WebGl/Mesh/Shaders/fragment.glsl.txt';

interface BufferInfo {
  components: number;
}

interface VertexBufferInfo extends BufferInfo {
  value: Float32Array;
}

interface IndexBufferInfo extends BufferInfo {
  value: Uint16Array;
}

interface MeshBufferInfo {
  normal: VertexBufferInfo;
  position: VertexBufferInfo;
  texCoord: VertexBufferInfo;
  indices: IndexBufferInfo;
}

interface ShaderLocations {
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

interface Buffers {
  position: Buffer;
  normal: Buffer;
  index: IndexBuffer;
  texture: WebGLTexture;
  textureCoords: Buffer;
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

export interface MeshInitDescriptor {
  gl: WebGLRenderingContext;
  url: string;
}

class Mesh {
  private readonly program: WebGLProgram;
  private readonly locations: ShaderLocations;
  private readonly buffers: Buffers;
  private readonly transformation: mat4;

  constructor(
    program: WebGLProgram,
    locations: ShaderLocations,
    buffers: Buffers,
  ) {
    this.program = program;
    this.locations = locations;
    this.buffers = buffers;
    this.transformation = mat4.create();
  }

  public static init = async (
    descriptor: MeshInitDescriptor,
  ): Promise<Mesh> => {
    const program = await downloadShaderProgram(descriptor.gl, vShaderUrl, fShaderUrl);
    const locations = Mesh.initLocations(descriptor.gl, program);

    const glTf = await load(descriptor.url, GLTFLoader, { postProcess: true });

    try {
      const glTfMeshInfo = glTf.meshes[0].primitives[0];
      const bufferInfo: MeshBufferInfo = {
        position: glTfMeshInfo.attributes.POSITION,
        normal: glTfMeshInfo.attributes.NORMAL,
        texCoord: glTfMeshInfo.attributes.TEXCOORD_0,
        indices: glTfMeshInfo.indices,
      };
      const buffers = Mesh.initBuffers(descriptor.gl, bufferInfo, glTf.images[0].image);

      return new Mesh(program, locations, buffers);
    } catch (e) {
      throw new Error('Could not create mesh due to invalid glTf!');
    }
  };

  public render = (descriptor: MeshRenderDescriptor): void => {
    const gl = descriptor.gl;
    const uniformLocations = this.locations.uniform;
    const attribLocations = this.locations.attribute;

    gl.useProgram(this.program);

    bindBuffer(gl, attribLocations.positionLoc, this.buffers.position);
    bindBuffer(gl, attribLocations.normalLoc, this.buffers.normal);
    bindBuffer(
      gl,
      attribLocations.textureCoordsLoc,
      this.buffers.textureCoords,
    );

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
  };

  public rotateY(radian: number): void {
    mat4.rotateY(this.transformation, this.transformation, radian);
  }

  public rotateX(radian: number): void {
    mat4.rotateX(this.transformation, this.transformation, radian);
  }

  private static initLocations = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
  ): ShaderLocations => {
    return {
      attribute: {
        positionLoc: safeGetAttribLocation('position', gl, program),
        normalLoc: safeGetAttribLocation('normal', gl, program),
        textureCoordsLoc: safeGetAttribLocation('textureCoords', gl, program),
      },
      uniform: {
        modelMatrixLoc: safeGetUniformLocation('modelMatrix', gl, program),
        viewMatrixLoc: safeGetUniformLocation('viewMatrix', gl, program),
        projectionMatrixLoc: safeGetUniformLocation(
          'projectionMatrix',
          gl,
          program,
        ),
        lightPositionLoc: safeGetUniformLocation('lightPosition', gl, program),
        lightColorLoc: safeGetUniformLocation('lightColor', gl, program),
      },
    };
  };

  private static initBuffers = (
    gl: WebGLRenderingContext,
    bufferInfo: MeshBufferInfo,
    textureImage: HTMLImageElement,
  ): Buffers => {
    return {
      position: buildBuffer2(
        gl,
        bufferInfo.position.value,
        bufferInfo.position.components,
      ),
      normal: buildBuffer2(
        gl,
        bufferInfo.normal.value,
        bufferInfo.normal.components,
      ),
      index: buildIndexBuffer2(gl, bufferInfo.indices.value, bufferInfo.indices.components),
      texture: buildTexture(gl, textureImage),
      textureCoords: buildBuffer2(
        gl,
        bufferInfo.texCoord.value,
        bufferInfo.texCoord.components,
      ),
    };
  };
}

export default Mesh;
