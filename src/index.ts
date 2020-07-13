import createSurface from './WebGl/Util/createSurface';
import { mat4, vec3 } from 'gl-matrix';
import resizeCanvas from './WebGl/Util/resizeCanvas';
import Mesh, { MeshRenderDescriptor } from './WebGl/Mesh/Mesh';

import './styles/main.scss';
import Camera from './Camera/Camera';

const createProjectionMatrix = (canvas: HTMLCanvasElement): mat4 => {
  const projectionMatrix = mat4.create();
  const aspect = Math.abs(canvas.width / canvas.height);
  const degree = 60;
  const fov = (degree * Math.PI) / 180;

  mat4.perspective(projectionMatrix, fov, aspect, 1, 100.0);

  return projectionMatrix;
};

const renderLoop = (meshes: Mesh[], renderDescriptor: MeshRenderDescriptor, canvas: HTMLCanvasElement) => {
  // renderDescriptor.gl.clearColor(0.1, 0.1, 0.1, 1.0);
  // renderDescriptor.gl.clearColor(1, 1, 1, 1.0);
  renderDescriptor.gl.clearColor(0.76, 0.76, 0.76, 1.0);
  renderDescriptor.gl.clear(renderDescriptor.gl.COLOR_BUFFER_BIT | renderDescriptor.gl.DEPTH_BUFFER_BIT);

  resizeCanvas(canvas);
  renderDescriptor.gl.viewport(0, 0, canvas.width, canvas.height);

  renderDescriptor.gl.enable(renderDescriptor.gl.CULL_FACE);
  renderDescriptor.gl.enable(renderDescriptor.gl.DEPTH_TEST);

  meshes.forEach((mesh: Mesh) => {
    mesh.render(renderDescriptor);
  });
};

const run = async () => {
  const surface = createSurface('surface');
  const projectionMatrix = createProjectionMatrix(surface.canvas);

  const camera = Camera.new();
  camera.translate(0, -3, -15);

  const light = {
    color: vec3.fromValues(0.8, 0.8, 0.8),
    position: vec3.fromValues(0.0, 0.0, 2.0),
  };

  const renderDescriptor: MeshRenderDescriptor = {
    gl: surface.gl,
    light: light,
    matrices: {
      projection: projectionMatrix,
      view: camera.position(),
    },
  };

  const monkeyOne = await Mesh.init({
    gl: surface.gl,
    url: './3DModels/Suzanne/glTf/monkey_sample.glb',
  });
  monkeyOne.translate(-7, 0, 0);

  const monkeyTwo = await Mesh.init({
    gl: surface.gl,
    url: './3DModels/Suzanne/glTf/monkey_sample.glb',
  });
  monkeyTwo.translate(7, 0, 0);
  monkeyTwo.rotateX(45);

  const idkModel = await Mesh.init({
    gl: surface.gl,
    url: './3DModels/idk.glb',
  });

  const meshes = [
    monkeyOne,
    monkeyTwo,
    idkModel,
  ];

  const render = () => {
    monkeyOne.rotateZ(0.05);
    idkModel.rotateY(0.05);

    renderLoop(meshes, renderDescriptor, surface.canvas);
    requestAnimationFrame(render);
  };

  render();
};

run();
