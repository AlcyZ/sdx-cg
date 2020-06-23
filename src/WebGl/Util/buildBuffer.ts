export interface Buffer extends WebGLBuffer {
  itemSize: number;
}

const buildBuffer = (
  gl: WebGLRenderingContext,
  data: number[],
  itemSize: number,
): Buffer => {
  const buffer = gl.createBuffer() as Buffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  buffer.itemSize = itemSize;
  return buffer;
};

const buildBuffer2 = (
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

export default buildBuffer;
export { buildBuffer2 };
