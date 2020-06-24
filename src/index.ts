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
    light: {
      color: vec3.fromValues(0.8, 0.8, 0.8),
      // color: vec3.fromValues(1.0, 1.0, 1.0),
      position: vec3.fromValues(0.0, 0.0, 2.0)
    }
  };
  const gl = surface.gl;

  const renderLoop = () => {
    app.rotateX(0.02);

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    resizeCanvas(surface.canvas);
    gl.viewport(0, 0, surface.canvas.width, surface.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    app.render(descriptor);
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
});
