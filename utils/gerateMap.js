"use strict";

function getPointsInNet(point, net = []) {
    net.push(point);
    point.connectedPoints.forEach((p) => {
        if (!net.includes(p)) {
            getPointsInNet(p, net);
        }
    });

    return net;
}

function generateMap(width, height, points) {
    const pointsArray = [];

    for (let i = 0; i < points; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);

        pointsArray.push({ x, y, connectedPoints: [] });
    }

    pointsArray.forEach((point) => {
        const connectedPoints = pointsArray.filter((p) => {
            if (p === point) return false;
            return (
                Math.abs(p.x - point.x) <= 100 && Math.abs(p.y - point.y) <= 100
            );
        });
        if (connectedPoints.length == 0) {
            const nearestPoint = pointsArray.reduce(
                (acc, p) => {
                    const distance = Math.sqrt(
                        Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
                    );
                    if (distance < acc.distance) {
                        return { distance, point: p };
                    }
                    return acc;
                },
                { distance: Infinity, point: null }
            ).point;

            connectedPoints.push(nearestPoint);
        }

        point.connectedPoints = connectedPoints;
    });

    while (
        pointsArray.some((p) => getPointsInNet(p).length < pointsArray.length)
    ) {
        pointsArray.forEach((point) => {
            const net = getPointsInNet(point);

            if (net.length < pointsArray.length) {
                const nearestPoint = pointsArray.reduce(
                    (acc, p) => {
                        if (net.includes(p)) return acc;
                        const distance = Math.sqrt(
                            Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
                        );
                        if (distance < acc.distance) {
                            return { distance, point: p };
                        }
                        return acc;
                    },
                    { distance: Infinity, point: null }
                ).point;

                point.connectedPoints.push(nearestPoint);
            }
        });
    }

    return pointsArray;
}

export default generateMap;