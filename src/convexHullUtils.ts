import Vertex from "./Base/Vertex";

const REMOVED = -1;

export default class GrahamScan {
    private points: Vertex[] = [];

    clear() {
        this.points = [];
    }

    getPoints() {
        return this.points;
    }

    setPoints(points: Vertex[]) {
        this.points = points.slice(); 
    }

    addPoint(point: Vertex) {
        this.points.push(point);
    }

    getHull() {
        const pivot = this.preparePivotPoint();

        let indexes = Array.from(this.points, (point, i) => i);
        const angles = Array.from(this.points, (point) => this.getAngle(pivot, point));
        const distances = Array.from(this.points, (point) => this.euclideanDistanceSquared(pivot, point));

        indexes.sort((i, j) => {
            const angleA = angles[i];
            const angleB = angles[j];
            if (angleA === angleB) {
                const distanceA = distances[i];
                const distanceB = distances[j];
                return distanceA - distanceB;
            }
            return angleA - angleB;
        });

        for (let i = 1; i < indexes.length - 1; i++) {
            if (angles[indexes[i]] === angles[indexes[i + 1]]) { 
                indexes[i] = REMOVED;
            }
        }

        const hull = [];
        for (let i = 0; i < indexes.length; i++) {
            const index = indexes[i];
            const point = this.points[index];

            if (index !== REMOVED) {
                if (hull.length < 3) {
                    hull.push(point);
                } else {
                    while (this.checkOrientation(hull[hull.length - 2], hull[hull.length - 1], point) > 0) {
                        hull.pop();
                    }
                    hull.push(point);
                }
            }
        }

        return hull.length < 3 ? [] : hull;
    }

    checkOrientation(p1: Vertex, p2: Vertex, p3: Vertex) {
        return (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x);
    }

    getAngle(a: Vertex, b: Vertex) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }

    euclideanDistanceSquared(p1: Vertex, p2: Vertex) {
        const a = p2.x - p1.x;
        const b = p2.y - p1.y;
        return a * a + b * b;
    }

    preparePivotPoint() {
        let pivot = this.points[0];
        let pivotIndex = 0;
        for (let i = 1; i < this.points.length; i++) {
            const point = this.points[i];
            if (point.y < pivot.y || point.y === pivot.y && point.x < pivot.x) {
                pivot = point;
                pivotIndex = i;
            }
        }
        return pivot;
    }
}