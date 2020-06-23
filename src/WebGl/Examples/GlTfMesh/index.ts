import downloadShaderProgram from '../../Util/downloadShaderProgram';
import buildBuffer, { Buffer, buildBuffer2 } from '../../Util/buildBuffer';
import buildIndexBuffer, {
  buildIndexBuffer2,
  IndexBuffer,
} from '../../Util/buildIndexBuffer';
import safeGetAttribLocation from '../../Util/safeGetAttribLocation';
import safeGetUniformLocation from '../../Util/safeGetUniformLocation';

// @ts-ignore
import { load } from '@loaders.gl/core';
// @ts-ignore
import { GLTFLoader } from '@loaders.gl/gltf';
import bindBuffer from '../../Util/bindBuffer';
import { mat4, vec3 } from 'gl-matrix';
import safeCreateTexture from '../../Util/safeCreateTexture';

const vShaderUrl = './WebGl/Examples/GlTfMesh/Shaders/vertex.glsl.txt';
const fShaderUrl = './WebGl/Examples/GlTfMesh/Shaders/fragment.glsl.txt';

interface BufferInfo {
  value: Float32Array;
  components: number;
}

interface IndexBufferInfo {
  value: Uint16Array;
  components: number;
}

interface GlTfMesh {
  attributes: {
    NORMAL: BufferInfo;
    POSITION: BufferInfo;
    TEXCOORD_0: BufferInfo;
  };
  indices: IndexBufferInfo;
}

interface Locations {
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
  };
}

interface Buffers {
  position: Buffer;
  normal: Buffer;
  textureCoords: Buffer;
  index: IndexBuffer;
}

interface Texture {
  image: HTMLImageElement;
  buffer: WebGLTexture;
}

export interface ExampleAppRenderDescriptor {
  gl: WebGLRenderingContext;
  matrices: {
    view: mat4;
    projection: mat4;
  };
}

class ExampleApp {
  private readonly program: WebGLProgram;
  private readonly locations: Locations;
  private readonly buffers: Buffers;
  private readonly texture: Texture;
  private readonly transformation: mat4;

  constructor(
    program: WebGLProgram,
    locations: Locations,
    buffers: Buffers,
    texture: Texture,
  ) {
    this.program = program;
    this.locations = locations;
    this.buffers = buffers;
    this.texture = texture;
    this.transformation = mat4.create();
  }

  public static init = async (
    gl: WebGLRenderingContext,
  ): Promise<ExampleApp> => {
    const program = await downloadShaderProgram(gl, vShaderUrl, fShaderUrl);
    const locations = ExampleApp.initLocations(gl, program);

    const url = './3DModels/Suzanne/glTf/monkey_sample.glb';
    const glTf = await load(url, GLTFLoader, { postProcess: true });

    console.log(glTf);

    const buffers = ExampleApp.initBuffers(gl, glTf.meshes[0].primitives[0]);
    const texture = ExampleApp.initTexture(gl, glTf);

    return new ExampleApp(program, locations, buffers, texture);
  };

  public render = (descriptor: ExampleAppRenderDescriptor): void => {
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
    // gl.uniform3fv(
    //   uniformLocations.lightPositionLoc,
    //   descriptor.light.position as Float32List
    // );
    // gl.uniform3fv(
    //   uniformLocations.lightColorLoc,
    //   descriptor.light.color as Float32List
    // );

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

  private static initLocations = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
  ): Locations => {
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
      },
    };
  };

  private static initBuffers = (
    gl: WebGLRenderingContext,
    mesh: GlTfMesh,
  ): Buffers => {
    const attributes = mesh.attributes;

    return {
      position: buildBuffer2(
        gl,
        attributes.POSITION.value,
        attributes.POSITION.components,
      ),
      normal: buildBuffer2(
        gl,
        attributes.NORMAL.value,
        attributes.NORMAL.components,
      ),
      textureCoords: buildBuffer2(
        gl,
        attributes.TEXCOORD_0.value,
        attributes.TEXCOORD_0.components,
      ),
      index: buildIndexBuffer2(gl, mesh.indices.value, mesh.indices.components),
    };
  };

  private static initTexture = (gl: WebGLRenderingContext, mesh: any) => {
    const image = mesh.images[0].image;
    const buffer = safeCreateTexture(gl);
    gl.bindTexture(gl.TEXTURE_2D, buffer);

    console.log('easy peasy');
    // gl.texImage2D();

    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // gl.generateMipmap(gl.TEXTURE_2D);

    return {
      image,
      buffer,
    };
  };
}

export default ExampleApp;
