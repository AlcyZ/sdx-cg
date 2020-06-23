const safeGetUniformLocation = (
  name: string,
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): WebGLUniformLocation => {
  const attribute = gl.getUniformLocation(program, name);

  if (!attribute) {
    throw new Error(`"${name}" uniform not found.`);
  }

  return attribute;
};

export default safeGetUniformLocation;
