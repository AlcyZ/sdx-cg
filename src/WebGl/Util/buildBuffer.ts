export interface Buffer extends WebGLBuffer {
  itemSize: number;
}

export default (
  gl: WebGLRenderingContext,
  data: Float32Array,
  itemSize: number,
): Buffer => {
  const buffer = gl.createBuffer() as Buffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.itemSize = itemSize;
  return buffer;
};
