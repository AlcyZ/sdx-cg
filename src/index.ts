import ExampleApp, {
  ExampleAppRenderDescriptor,
} from './WebGl/Examples/GlTfMesh/index';
import createSurface from './WebGl/Util/createSurface';
import { mat4, vec3 } from 'gl-matrix';
import resizeCanvas from './WebGl/Util/resizeCanvas';

import './styles/main.scss';

const surface = createSurface('surface');

ExampleApp.init(surface.gl).then((app) => {
  const projectionMatrix = mat4.create();
  const aspect = Math.abs(surface.canvas.width / surface.canvas.height);
  const degree = 60;
  const fov = (degree * Math.PI) / 180;

  mat4.perspective(projectionMatrix, fov, aspect, 1, 100.0);

  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, -3, -10));

  const descriptor: ExampleAppRenderDescriptor = {
    gl: surface.gl,
    matrices: {
      projection: projectionMatrix,
      view: viewMatrix,
    },
  };
  const gl = surface.gl;

  const renderLoop = () => {
    app.rotateY(0.035);

    resizeCanvas(surface.canvas);
    gl.viewport(0, 0, surface.canvas.width, surface.canvas.height);

    app.render(descriptor);
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
});
