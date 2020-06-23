export interface IndexBuffer extends WebGLBuffer {
  numItems: number;
}

const buildIndexBuffer = (
  gl: WebGLRenderingContext,
  data: number[],
  itemSize: number,
): IndexBuffer => {
  const buffer = gl.createBuffer() as IndexBuffer;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  buffer.numItems = data.length / itemSize;
  return buffer;
};

const buildIndexBuffer2 = (
  gl: WebGLRenderingContext,
  data: Uint16Array,
  itemSize: number,
): IndexBuffer => {
  const buffer = gl.createBuffer() as IndexBuffer;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.numItems = data.length / itemSize;
  return buffer;
};

export default buildIndexBuffer;
export { buildIndexBuffer2 };
