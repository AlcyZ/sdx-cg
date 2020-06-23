// @ts-ignore
import { load } from '@loaders.gl/core';
// @ts-ignore
import { GLTFLoader } from '@loaders.gl/gltf';

import runCubeExample from './WebGl/Examples/Cube/index';
import runWavefrontObjExample from './WebGl/Examples/WavefrontObj/index';
import runShadedExample from './WebGl/Examples/Shaded/index';
import runMeshExample from './WebGl/Examples/Mesh/index';
import Example from './WebGl/Examples/Example';

const test = async () => {
  const url = './3DModels/Suzanne/glTf/suzanne.glb';
  // const response = await fetch('./3DModels/Suzanne/glTf/suzanne.glb');
  const data = await load(url, GLTFLoader, { postProcess: true });
  return data;
};

test().then((result) => console.log('glb:', result));

export interface Surface {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
}

// console.log(parse, GLTFLoader);

export interface ExampleCallback {
  (surface: Surface): Promise<void>;
}

const run = async (canvasId: string, callback: Example): Promise<void> => {
  await callback(canvasId);
};

// renders the sample cube
// run('canvas', runMeshExample).then(() => console.log('rendered mesh example'));
// run('canvas', runCubeExample).then(() => console.log('rendered sample cube'));
// run('canvas', runShadedExample).then(() =>
//   console.log('finished wavefront object sample'),
// );
