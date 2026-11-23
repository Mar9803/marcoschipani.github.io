declare module "d3-delaunay" {
  export class Delaunay {
    static from(points: ArrayLike<ArrayLike<number>>): Delaunay;
    find(x: number, y: number, i?: number): number;
    voronoi(bounds: [number, number, number, number]): Voronoi;
  }

  export class Voronoi {
    render(context: CanvasRenderingContext2D): void;
    renderCell(i: number, context: CanvasRenderingContext2D): void;
  }
}
