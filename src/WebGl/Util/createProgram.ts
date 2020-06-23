export default async (gl: WebGLRenderingContext, vShader: WebGLShader, fShader: WebGLShader): Promise<WebGLProgram> => {
    const program: WebGLProgram | null = gl.createProgram();
    if (!program) {
        throw new Error('could not create program');
    }

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        throw new Error(`program failed to link: ${gl.getProgramInfoLog(program)}`);
    }

    return program;
}
