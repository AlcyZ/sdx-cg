const safeCreateTexture = (gl: WebGLRenderingContext): WebGLTexture => {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Could not create texture.');
  }

  return texture;
};

export default safeCreateTexture;
