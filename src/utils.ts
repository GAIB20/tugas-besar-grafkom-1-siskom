import Vertex from './Base/Vertex';

export const euclideanDistanceVtx = (a: Vertex, b: Vertex): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
};

export const euclideanDistance = (ax: number, ay: number, bx: number, by: number): number => {
  const dx = ax - bx;
  const dy = ay - by;

  return Math.sqrt(dx * dx + dy * dy);
};

// 360 DEG
export const getAngle = (origin: Vertex, target: Vertex) => {
    const plusMinusDeg = radToDeg(Math.atan2(origin.y - target.y, origin.x - target.x));
    return plusMinusDeg >= 0 ? 180 - plusMinusDeg : Math.abs(plusMinusDeg) + 180;
}

export const radToDeg = (rad: number) => {
    return rad * 180 / Math.PI;
}

export const degToRad = (deg: number) => {
    return deg * Math.PI / 180;
}

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

export const m3 = {
    identity: function() : number[] {
      return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      ];
    },
  
    translation: function(tx : number, ty : number) : number[] {
      return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1,
      ];
    },
  
    rotation: function(angleInRadians : number) : number[] {
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      return [
        c,-s, 0,
        s, c, 0,
        0, 0, 1,
      ];
    },
  
    scaling: function(sx : number, sy : number) : number[] {
      return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
      ];
    },
  
    multiply: function(a : number[], b : number[]) : number[] {
      const a00 = a[0 * 3 + 0];
      const a01 = a[0 * 3 + 1];
      const a02 = a[0 * 3 + 2];
      const a10 = a[1 * 3 + 0];
      const a11 = a[1 * 3 + 1];
      const a12 = a[1 * 3 + 2];
      const a20 = a[2 * 3 + 0];
      const a21 = a[2 * 3 + 1];
      const a22 = a[2 * 3 + 2];
      const b00 = b[0 * 3 + 0];
      const b01 = b[0 * 3 + 1];
      const b02 = b[0 * 3 + 2];
      const b10 = b[1 * 3 + 0];
      const b11 = b[1 * 3 + 1];
      const b12 = b[1 * 3 + 2];
      const b20 = b[2 * 3 + 0];
      const b21 = b[2 * 3 + 1];
      const b22 = b[2 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ];
    },

    inverse: function(m : number[]) {
      const det = m[0] * (m[4] * m[8] - m[7] * m[5]) -
                  m[1] * (m[3] * m[8] - m[5] * m[6]) +
                  m[2] * (m[3] * m[7] - m[4] * m[6]);
  
      if (det === 0) return null;
  
      const invDet = 1 / det;
  
      return [ 
          invDet * (m[4] * m[8] - m[5] * m[7]), 
          invDet * (m[2] * m[7] - m[1] * m[8]),
          invDet * (m[1] * m[5] - m[2] * m[4]),
          invDet * (m[5] * m[6] - m[3] * m[8]),
          invDet * (m[0] * m[8] - m[2] * m[6]),
          invDet * (m[2] * m[3] - m[0] * m[5]),
          invDet * (m[3] * m[7] - m[4] * m[6]),
          invDet * (m[1] * m[6] - m[0] * m[7]),
          invDet * (m[0] * m[4] - m[1] * m[3])
      ];
  },

    multiply3x1: function(a : number[], b : number[]) : number[] {
      const a00 = a[0 * 3 + 0];
      const a01 = a[0 * 3 + 1];
      const a02 = a[0 * 3 + 2];
      const a10 = a[1 * 3 + 0];
      const a11 = a[1 * 3 + 1];
      const a12 = a[1 * 3 + 2];
      const a20 = a[2 * 3 + 0];
      const a21 = a[2 * 3 + 1];
      const a22 = a[2 * 3 + 2];
      const b00 = b[0 * 3 + 0];
      const b01 = b[0 * 3 + 1];
      const b02 = b[0 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
      ];
    },

    translate: function(m : number[], tx:number, ty:number) {
      return m3.multiply(m, m3.translation(tx, ty));
    },
  
    rotate: function(m:number[], angleInRadians:number) {
      return m3.multiply(m, m3.rotation(angleInRadians));
    },
  
    scale: function(m:number[], sx:number, sy:number) {
      return m3.multiply(m, m3.scaling(sx, sy));
    },
  };