const safeGetAttribLocation = (
  name: string,
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): number => {
  const attribute = gl.getAttribLocation(program, name);

  if (attribute < 0) {
    throw new Error(`"${name}" attribute not found.`);
  }

  return attribute;
};

export default safeGetAttribLocation;
