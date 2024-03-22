import Vertex from "./Vertex";

export default abstract class BaseShape {
    pointList: Vertex[] = [];
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}