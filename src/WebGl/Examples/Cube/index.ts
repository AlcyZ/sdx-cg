import Cube from './Cube';
import createSurface from "../../Util/createSurface";

const runExample = async (canvasId: string): Promise<void> => {
    const cube = await Cube.init(createSurface(canvasId));

    const renderFrame = () => {
        cube.render();
        requestAnimationFrame(renderFrame);
    }

    renderFrame();
}

export default runExample;
