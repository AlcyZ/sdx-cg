type ShaderSrc = string;
type ShadersSrc = [ShaderSrc, ShaderSrc];

const downloadShader = async (url: string): Promise<ShaderSrc> => {
    let response = await fetch(url);

    return await response.text();
}

export default async (vShaderUrl: string, fShaderUrl: string): Promise<ShadersSrc> => {
    return await Promise.all([downloadShader(vShaderUrl), downloadShader(fShaderUrl)]);
}
