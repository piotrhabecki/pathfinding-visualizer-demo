import { PathfindingNode } from "../../models/pathfindingNode";
import classes from "./Node.module.css";

interface node {
  node: PathfindingNode;
  onHover: (node: PathfindingNode) => void;
  onLeave: (node: PathfindingNode) => void;
  onDragStart: (node: PathfindingNode) => void;
  onDragEnd: (node: PathfindingNode) => void;
}

const Node = (props: node) => {
  const getBackgroundColor = () => {
    if (props.node.isStart) return classes.node__start;
    if (props.node.isEnd) return classes.node__finish;
    if (props.node.isWall) return classes.node__wall;
    if (props.node.isShortestPath) return classes.node__shortest__path;
    if (props.node.isCurrentlyVisited) return classes.node__currently__visited;
    if (props.node.isVisited) return classes.node__visited;
  };

  const isDraggable = () => {
    if(props.node.isEnd) return true;
    if(props.node.isStart) return true;
    return false;
  }


  return (
    <div
      id={`${props.node.id}`}
      onMouseEnter={() => {
        props.onHover(props.node);
      }}
      onMouseLeave={() => {
        props.onLeave(props.node);
      }}
      
      draggable={isDraggable()}

      className={`${classes.node} ${getBackgroundColor()}`}
    >{props.node.id}
    </div>
  );
};

export default Node;
