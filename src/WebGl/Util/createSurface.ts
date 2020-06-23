interface Surface {
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext
}

export default (canvasId: string): Surface => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        throw new Error(`Canvas with id (#${canvas}) not found.`)
    }

    const gl = (canvas as HTMLCanvasElement).getContext('webgl');
    if (!gl) {
        throw new Error(`Failed to create webgl rendering context`);
    }
    return {
        canvas: canvas as HTMLCanvasElement,
        gl
    }
}
