import BaseShape from '../Base/BaseShape';
import Color from '../Base/Color';
import Vertex from '../Base/Vertex';
import { euclideanDistanceVtx } from '../utils';

export default class FanPolygon extends BaseShape {
    private origin: Vertex;
    lenList: number[] = [];

    constructor(id: string, color: Color, vertices: Vertex[]) {
        super(1, id, color);

        this.origin = vertices[0];
        this.pointList.push(vertices[0], vertices[1]);
        this.center = new Vertex(
            (vertices[1].x + vertices[0].x) / 2,
            (vertices[1].y + vertices[0].y) / 2,
            new Color(0, 0, 0)
        );

        this.pointList.forEach((vtx, idx) => {
            if (idx < 2) return;
            this.glDrawType = 6;
            this.addVertex(vtx);
        });
    }

    addVertex(vertex: Vertex) {
        this.pointList.push(vertex);
        this.glDrawType = 6;
        this.recalc();
    }
    
    removeVertex(idx: number) {
        if (this.pointList.length <= 2) {
            alert("Cannot remove vertex any further");
            return;
        }
        this.pointList.splice(idx, 1);
        this.origin = this.pointList[0];
        if (this.pointList.length == 2)
            this.glDrawType = 1;
        this.recalc();
    }

    recalc() {
        let angles = this.pointList
            .filter((_, idx) => idx > 0)
            .map((vtx) => {
                return {
                    vtx,
                    angle: Math.atan2(
                        vtx.y - this.origin.y,
                        vtx.x - this.origin.x
                    ),
                };
            });

        angles.sort((a, b) => a.angle - b.angle);
        this.pointList = angles.map((item) => item.vtx);
        this.pointList.unshift(this.origin);

        this.center.x =
            this.pointList.reduce((total, vtx) => total + vtx.x, 0) /
            this.pointList.length;
        this.center.y =
            this.pointList.reduce((total, vtx) => total + vtx.y, 0) /
            this.pointList.length;
        this.lenList = this.pointList.map((vtx) =>
            euclideanDistanceVtx(vtx, this.center)
        );
    }
}
