const downloadTexture = async (
  textureUrl: string,
): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = textureUrl;
  });
};

export default downloadTexture;
