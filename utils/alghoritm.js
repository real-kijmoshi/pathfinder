const heuristic = (a, b) => {
    const d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return d;
}

const alghoritm = (map, start, end) => {
    const openList = [];
    const closedList = [];
    const path = [];
    let currentNode = start;
    openList.push(currentNode);

    while (openList.length > 0) {
        currentNode = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < currentNode.f) {
                currentNode = openList[i];
            }
        }

        openList.splice(openList.indexOf(currentNode), 1);
        closedList.push(currentNode);

        if (currentNode === end) {
            let current = currentNode;
            path.push(current);
            while (current.parent) {
                path.push(current.parent);
                current = current.parent;
            }
            return path.reverse();
        }

        const neighbors = currentNode.connectedPoints;
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];

            if (closedList.includes(neighbor) || neighbor.isWall) {
                continue;
            }

            const gScore = currentNode.g + 1;
            let gScoreIsBest = false;

            if (!openList.includes(neighbor)) {
                gScoreIsBest = true;
                neighbor.h = heuristic(neighbor, end);
                openList.push(neighbor);
            } else if (gScore < neighbor.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                neighbor.parent = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }

    return path;
}

export default alghoritm;