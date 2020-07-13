import buildBuffer from '../Util/buildBuffer';
import buildIndexBuffer from '../Util/buildIndexBuffer';
import buildTexture from '../Util/buildTexture';
import Mesh, { Buffers, MeshBufferInfo, ShaderLocations } from './Mesh';
import safeGetAttribLocation from '../Util/safeGetAttribLocation';
import downloadShaderProgram from '../Util/downloadShaderProgram';
import { load } from '@loaders.gl/core';
// @ts-ignore
import { GLTFLoader } from '@loaders.gl/gltf';

export interface MeshInitiatorDescriptor {
  gl: WebGLRenderingContext;
  url: string;
}

export default class MeshInitiator {
  public static init = async (
    descriptor: MeshInitiatorDescriptor,
  ): Promise<Mesh> => {
    const vShaderUrl = './WebGl/Mesh/Shaders/vertex.glsl.txt';
    const fShaderUrl = './WebGl/Mesh/Shaders/fragment.glsl.txt';

    const program = await downloadShaderProgram(descriptor.gl, vShaderUrl, fShaderUrl);
    const locations = MeshInitiator.initLocations(descriptor.gl, program);

    const glTf = await load(descriptor.url, GLTFLoader, { postProcess: true });

    try {
      const glTfMeshInfo = glTf.meshes[0].primitives[0];
      const bufferInfo: MeshBufferInfo = {
        position: glTfMeshInfo.attributes.POSITION,
        normal: glTfMeshInfo.attributes.NORMAL,
        texCoord: glTfMeshInfo.attributes.TEXCOORD_0,
        indices: glTfMeshInfo.indices,
      };
      const buffers = MeshInitiator.initBuffers(descriptor.gl, bufferInfo, glTf.images[0].image);

      return new Mesh(program, locations, buffers);
    } catch (e) {
      throw new Error('Could not create mesh due to invalid glTf!');
    }
  };

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
        modelMatrixLoc: gl.getUniformLocation(program, 'modelMatrix') as WebGLUniformLocation,
        viewMatrixLoc: gl.getUniformLocation(program, 'viewMatrix') as WebGLUniformLocation,
        projectionMatrixLoc: gl.getUniformLocation(program, 'projectionMatrix') as WebGLUniformLocation,
        lightPositionLoc: gl.getUniformLocation(program, 'lightPosition') as WebGLUniformLocation,
        lightColorLoc: gl.getUniformLocation(program, 'lightColor') as WebGLUniformLocation,
      },
    };
  };

  private static initBuffers = (
    gl: WebGLRenderingContext,
    bufferInfo: MeshBufferInfo,
    textureImage: HTMLImageElement,
  ): Buffers => {
    return {
      position: buildBuffer(
        gl,
        bufferInfo.position.value,
        bufferInfo.position.components,
      ),
      normal: buildBuffer(
        gl,
        bufferInfo.normal.value,
        bufferInfo.normal.components,
      ),
      index: buildIndexBuffer(gl, bufferInfo.indices.value, bufferInfo.indices.components),
      texture: buildTexture(gl, textureImage),
      textureCoords: buildBuffer(
        gl,
        bufferInfo.texCoord.value,
        bufferInfo.texCoord.components,
      ),
    };
  };
}