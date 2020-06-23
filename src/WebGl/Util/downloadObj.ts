import WavefrontLoader from './Loader/WavefrontLoader';

const downloadObj = async (url: string): Promise<WavefrontLoader> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to request wavefront/obj file resource with url: ${url}`,
    );
  }
  const data = await response.text();

  return new WavefrontLoader(data);
};

export default downloadObj;
