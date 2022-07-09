import { useEffect, useRef, useState } from "react";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../../algorithms/dijkstra";
import { PathfindingNode } from "../../models/pathfindingNode";
import Node from "../Node/Node";
import { useRafLoop } from "react-use";

import classes from "./PathfindingVisualizer.module.css";

const PathfindingVisualizer = () => {
  const [startNodeRowAndCol, setStartNodeAndCol] = useState({
    row: 10,
    col: 15,
  });

  const [endNodeRowAndCol, setEndNodeAndCol] = useState({ row: 10, col: 20 });

  const getInitialGrid = () => {
    const grid: PathfindingNode[][] = [];
    let index = -1;
    for (let row = 0; row < 20; row++) {
      const currentRow: PathfindingNode[] = [];
      for (let col = 0; col < 50; col++) {
        index = index + 1;
        currentRow.push(createNode(index, col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (index: number, col: number, row: number) => {
    const isStartNode =
      row === startNodeRowAndCol.row && col === startNodeRowAndCol.col;
    const isFinishNode =
      row === endNodeRowAndCol.row && col === endNodeRowAndCol.col;
    const node = new PathfindingNode(
      index,
      col,
      row,
      isStartNode,
      isFinishNode,
      false,
      0
    );

    return node;
  };

  const [grid, setGrid] = useState(getInitialGrid());

  const getNodeWithIndex = (row: number, col: number) => grid[row][col];

  const [startNode, setStartNode] = useState(
    grid[startNodeRowAndCol.row][startNodeRowAndCol.col]
  );
  const [endNode, setEndNode] = useState(
    grid[endNodeRowAndCol.row][endNodeRowAndCol.col]
  );
  const [generator, setGenerator] = useState<any>(
    dijkstra(grid, startNode, endNode)
  );
  const [shorthestPathGenerator, setShorthestPathGenerator] = useState<any>(
    getNodesInShortestPathOrder(endNode)
  );
  const [pathfindingState, setPathfindingState] = useState<any>();
  const [shortestPathState, setShortestPathState] = useState<any>();
  const [finding, setFinding] = useState(false);
  const [timer, setTimer] = useState(1);
  const [buildWall, setBuildWall] = useState<boolean>(false);
  const [onMousePushedDown, setOnMousePushedDown] = useState<boolean>(false);
  const [dragged, setDragged] = useState<PathfindingNode>();
  const [draggedBackgroundImage, setDraggedBackgroundImage] =
    useState<string>("");

  const step = () => {
    if (!pathfindingState?.done) {
      setPathfindingState(generator.next());
      return;
    }
    if (!shortestPathState?.done) {
      setShortestPathState(shorthestPathGenerator.next());
      return;
    }
    if (pathfindingState?.done && shortestPathState?.done) {
      return;
    }
  };

  const lastCalled = useRef(0);
  const delta = useRef(5);

  const [loopStop, loopStart] = useRafLoop((time: number) => {
    if (time - lastCalled.current > delta.current) {
      step();
      lastCalled.current = time;
    }
    if (pathfindingState?.done === true && shortestPathState?.done === true) {
      setFinding(false);
      return;
    }
  });

  useEffect(() => {
    if (!finding) {
      loopStop();
      return;
    }
    loopStart();
    if (finding) {
      delta.current = timer;
    }
  }, [loopStop, loopStart, finding, timer]);

  const onMouseHoverHandler = (node: PathfindingNode) => {
    if (buildWall) {
      document.getElementById(`${node.id}`)!.style.backgroundColor = "black";
      if (onMousePushedDown) {
        document.getElementById(`${node.id}`)!.style.backgroundColor = "black";
        getNodeWithIndex(node.row, node.column).isWall = true;
      }
    }
    if (onMousePushedDown) {
      if (node.isStart || node.isEnd) {
        setDragged(node);
        console.log('dragged')
        if (node.isEnd) {
          setDraggedBackgroundImage(`'../../assets/racing-flag.png'`);
        }
        if (node.isStart) {
          setDraggedBackgroundImage(`'../../assets/play-button.png'`);
        }
      }
    }
    if (!onMousePushedDown && (dragged?.isStart || dragged?.isEnd)) {
      getNodeWithIndex(node.row, node.column).isStart = dragged.isStart;
      getNodeWithIndex(node.row, node.column).isEnd = dragged.isEnd;

    }
  };

  const onMouseLeaveHandler = (node: PathfindingNode) => {
    if (buildWall) {
      document.getElementById(`${node.id}`)!.style.backgroundColor = "";
    }
  };

  const handleOnDragStart = (node: PathfindingNode) => {
    setDragged(node);
    if (node.isEnd || node.isStart) {
      document.getElementById(node.id.toString())!.style.backgroundImage =
        "url()";
    }
  };

  const handleOnDragOver = (node: PathfindingNode) => {
    const tempGrid = grid;
    tempGrid[node.row][node.column] = dragged!;
    setGrid(tempGrid);
    setDragged(node);
    if (dragged!.isEnd || dragged!.isStart) {
      console.log(draggedBackgroundImage);
      console.log(`${node.id}`);
      document.getElementById(
        node.id.toString()
      )!.style.backgroundImage = `url(${draggedBackgroundImage})`;
    }
  };

  return (
    <div className={classes.pathfinding__container}>
      <button onClick={() => setFinding(!finding)}>
        {!finding ? `Start` : `Stop`}
      </button>
      <button onClick={() => setBuildWall(!buildWall)}>
        Build wall {!buildWall ? `` : `deactivate`}
      </button>
      <div
        onMouseDown={() => setOnMousePushedDown(!onMousePushedDown)}
        onMouseUp={() => setOnMousePushedDown(!onMousePushedDown)}
        className={classes.pathfinding__container__grid__container}
      >
        <div className={classes.grid}>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  return (
                    <Node
                      key={nodeIdx}
                      node={{ ...node }}
                      onHover={onMouseHoverHandler}
                      onLeave={onMouseLeaveHandler}
                      onDragStart={handleOnDragStart}
                      onDragEnd={handleOnDragOver}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
