export default async (
  gl: WebGLRenderingContext,
  shaderType: GLenum,
  shaderSrc: string,
): Promise<WebGLShader> => {
  const shader: WebGLShader | null = gl.createShader(shaderType);
  if (!shader) {
    throw new Error('could not create shader');
  }

  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const type = shaderType === gl.VERTEX_SHADER ? 'vertex' : 'fragment';

    throw Error(
      `could not compile ${type} shader: ${gl.getShaderInfoLog(shader)}`,
    );
  }

  return shader;
};
