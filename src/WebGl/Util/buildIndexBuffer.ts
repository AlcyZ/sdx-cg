export interface IndexBuffer extends WebGLBuffer {
  numItems: number;
}

export default (
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
