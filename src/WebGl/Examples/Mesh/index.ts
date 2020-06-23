// import Mesh from '../../Mesh/Mesh';
// import createSurface from '../../Util/createSurface';
// import resizeCanvas from '../../Util/resizeCanvas';
// import { mat4, vec3 } from 'gl-matrix';
//
// const runExample = async (canvasId: string): Promise<void> => {
//   const surface = createSurface(canvasId);
//
//   const mesh = await Mesh.init(
//     surface.gl,
//     './3DModels/Suzanne/monkey.obj',
//     './3DModels/Suzanne/monkey.png',
//   );
//   const viewMatrix = mat4.create();
//   mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, -3, -10));
//
//   let position = vec3.fromValues(0, 0, 0);
//
//   const renderFrame = () => {
//     const gl = surface.gl;
//
//     resizeCanvas(surface.canvas);
//     gl.viewport(0, 0, surface.canvas.width, surface.canvas.height);
//
//     const aspect = Math.abs(surface.canvas.width / surface.canvas.height);
//     const projectionMatrix = mat4.create();
//
//     const degree = 60;
//     const fov = (degree * Math.PI) / 180;
//
//     mat4.perspective(projectionMatrix, fov, aspect, 1, 100.0);
//
//     gl.clearColor(0.1, 0.1, 0.1, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//
//     gl.enable(gl.DEPTH_TEST);
//     gl.enable(gl.CULL_FACE);
//
//     const now = Date.now() / 1000;
//     const rngPos = Math.sin(now) * 10;
//
//     position = vec3.fromValues(rngPos, 0, 0);
//
//     mesh.rotateY(0.035);
//     // mesh.asd(position);
//
//     mesh.render({
//       light: {
//         position: vec3.fromValues(5, 15, 5),
//         color: vec3.fromValues(0.9, 0.9, 0.9),
//       },
//       matrices: {
//         view: viewMatrix,
//         projection: projectionMatrix,
//       },
//       gl,
//     });
//     requestAnimationFrame(renderFrame);
//   };
//
//   renderFrame();
// };
//
// export default runExample;
