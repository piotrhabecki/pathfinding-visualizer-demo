// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path

import { PathfindingNode } from "../models/pathfindingNode";

// by backtracking from the finish node.
export function* dijkstra(
  grid: PathfindingNode[][],
  startNode: PathfindingNode,
  finishNode: PathfindingNode
) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    closestNode!.isCurrentlyVisited = true;
    yield {};
    closestNode!.isCurrentlyVisited = false;
    // If we encounter a wall, we skip it.
    if (closestNode && closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode && closestNode.distance === Infinity)
      return visitedNodesInOrder;
    closestNode!.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    if (closestNode) updateUnvisitedNeighbors(closestNode, grid);
    yield {};
  }
}

function sortNodesByDistance(unvisitedNodes: PathfindingNode[]) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(
  node: PathfindingNode,
  grid: PathfindingNode[][]
) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(
  node: PathfindingNode,
  grid: PathfindingNode[][]
) {
  const neighbors = [];
  const { column, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][column]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][column]);
  if (column > 0) neighbors.push(grid[row][column - 1]);
  if (column < grid[0].length - 1) neighbors.push(grid[row][column + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid: PathfindingNode[][]) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function* getNodesInShortestPathOrder(finishNode: any) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    yield {};
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode.isShortestPath = true;
    
    currentNode = currentNode.previousNode ? currentNode.previousNode : null;
  }
  return nodesInShortestPathOrder.unshift();
}
