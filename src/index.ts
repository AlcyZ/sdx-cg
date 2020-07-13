import createSurface from './WebGl/Util/createSurface';
import { mat4, vec3 } from 'gl-matrix';
import resizeCanvas from './WebGl/Util/resizeCanvas';
import Mesh, { MeshRenderDescriptor } from './WebGl/Mesh/Mesh';

import './styles/main.scss';

const surface = createSurface('surface');

Mesh.init({ gl: surface.gl, url: './3DModels/Suzanne/glTf/monkey_sample.glb' }).then((mesh: Mesh) => {
  const projectionMatrix = mat4.create();
  const aspect = Math.abs(surface.canvas.width / surface.canvas.height);
  const degree = 60;
  const fov = (degree * Math.PI) / 180;

  mat4.perspective(projectionMatrix, fov, aspect, 1, 100.0);

  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, -3, -10));

  const descriptor: MeshRenderDescriptor = {
    gl: surface.gl,
    matrices: {
      projection: projectionMatrix,
      view: viewMatrix,
    },
    light: {
      color: vec3.fromValues(0.8, 0.8, 0.8),
      // color: vec3.fromValues(1.0, 1.0, 1.0),
      position: vec3.fromValues(0.0, 0.0, 2.0),
    },
  };
  const gl = surface.gl;

  const renderLoop = () => {
    mesh.rotateY(0.05);

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    resizeCanvas(surface.canvas);
    gl.viewport(0, 0, surface.canvas.width, surface.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    mesh.render(descriptor);
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
});
