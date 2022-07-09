export class PathfindingNode {
  id: number;
  column: number;
  row: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean = false;
  isCurrentlyVisited: boolean = false;
  isHovered: boolean = false;
  isShortestPath: boolean = false;
  previousNode?: PathfindingNode = undefined;
  weight: number;
  distance: number = Infinity;

  constructor(
    id: number,
    column: number,
    row: number,
    isStart: boolean,
    isEnd: boolean,
    isWall: boolean,
    weight: number,
  ) {
    this.id = id;
    this.column = column;
    this.row = row;
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.isWall = isWall;
    this.weight = weight;
  }
}
