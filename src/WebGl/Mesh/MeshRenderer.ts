import bindBuffer from '../Util/bindBuffer';
import { Buffers, ShaderLocations } from './Mesh';
import { mat4, vec3 } from 'gl-matrix';

export interface MeshRendererDescriptor {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  shaderLocations: ShaderLocations;
  buffers: Buffers;
  matrices: {
    transformation: mat4;
    view: mat4;
    projection: mat4;
  }
  light: {
    position: vec3,
    color: vec3
  }
}

export default class MeshRenderer {
  public render(descriptor: MeshRendererDescriptor): void {
    const gl = descriptor.gl;
    const uniformLocations = descriptor.shaderLocations.uniform;
    const attribLocations = descriptor.shaderLocations.attribute;

    gl.useProgram(descriptor.program);

    bindBuffer(gl, attribLocations.positionLoc, descriptor.buffers.position);
    bindBuffer(gl, attribLocations.normalLoc, descriptor.buffers.normal);
    bindBuffer(
      gl,
      attribLocations.textureCoordsLoc,
      descriptor.buffers.textureCoords,
    );

    gl.uniformMatrix4fv(
      uniformLocations.modelMatrixLoc,
      false,
      descriptor.matrices.transformation,
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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, descriptor.buffers.index);
    gl.drawElements(
      gl.TRIANGLES,
      descriptor.buffers.index.numItems,
      gl.UNSIGNED_SHORT,
      0,
    );
  }
}