import downloadShaders from './downloadShaders';
import createShader from './createShader';
import createProgram from './createProgram';

export default async (gl: WebGLRenderingContext, vShaderUrl: string, fShaderUrl: string): Promise<WebGLProgram> => {
    const [vShaderSrc, fShaderSrc] = await downloadShaders(vShaderUrl, fShaderUrl);
    const [vShader, fShader] = await Promise.all([
        createShader(gl, gl.VERTEX_SHADER, vShaderSrc),
        createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc),
    ]);

    return await createProgram(gl, vShader, fShader);
}
