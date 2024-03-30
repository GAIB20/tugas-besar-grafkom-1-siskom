import Vertex from './Base/Vertex';

export const euclideanDistanceVtx = (a: Vertex, b: Vertex): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
};

// 360 DEG
export const getAngle = (origin: Vertex, target: Vertex) => {
    const plusMinusDeg = radToDeg(Math.atan2(origin.y - target.y, origin.x - target.x));
    const posDeg = plusMinusDeg % 180;
    const is_more_than_180 = origin.y > target.y;
    return !is_more_than_180 ? posDeg : posDeg + 180;
}

export const radToDeg = (rad: number) => {
    return rad * 180 / Math.PI;
}

export const degToRad = (deg: number) => {
    return deg * Math.PI / 180;
}