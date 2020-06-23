import { Buffer } from './buildBuffer';

const bindBuffer = (
  gl: WebGLRenderingContext,
  location: number,
  buffer: Buffer,
): void => {
  gl.enableVertexAttribArray(location);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(location, buffer.itemSize, gl.FLOAT, false, 0, 0);
};

export default bindBuffer;
