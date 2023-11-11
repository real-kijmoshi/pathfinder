import { useEffect, useRef, useState } from "react";
import generateMap from "../utils/gerateMap";
import alghoritm from "../utils/alghoritm";
import "./App.css";

const App = () => {
  const [map, setMap] = useState([]);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [numberOfPoints, setNumberOfPoints] = useState(null);
  const [path, setPath] = useState([]);
  const nowSelecting = useRef("destination")

  const [destination, setDestination] = useState(null);
  const [start, setStart] = useState(null);

  useEffect(() => {
    //load settings from local storage
    const storedWidth = localStorage.getItem("width");
    const storedHeight = localStorage.getItem("height");
    const storedNumberOfPoints = localStorage.getItem("numberOfPoints");

    if (storedWidth && storedHeight && storedNumberOfPoints) {
      setWidth(parseInt(storedWidth));
      setHeight(parseInt(storedHeight));
      setNumberOfPoints(parseInt(storedNumberOfPoints));
    } else {
      setWidth(500);
      setHeight(500);
      setNumberOfPoints(10);
    }
  }, []);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    map.forEach(point => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"

      if(path.includes(point)) ctx.fillStyle = "rgba(0, 0, 255, 0.5)"

      if(point === destination) ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
      if(point === start) ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
      //circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();

      point.connectedPoints.forEach(connectedPoint => {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        if(path.includes(point) && path.includes(connectedPoint)) ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(connectedPoint.x, connectedPoint.y);
        ctx.stroke();
      })
    })
  }, [map, width, height, destination, start, path]);

  useEffect(() => {
    if (width == null || height == null || numberOfPoints == null) return;

    setMap(generateMap(width, height, numberOfPoints));

    localStorage.setItem("width", width);
    localStorage.setItem("height", height);
    localStorage.setItem("numberOfPoints", numberOfPoints);
  }, [width, height, numberOfPoints]);


  const handleClick = () => {
    setDestination(null);
    setStart(null);
    nowSelecting.current = "destination";
    setMap(generateMap(width, height, numberOfPoints));
  };

  const getPoint = () => {
    return new Promise(resolve => {
      const canvas = document.querySelector("canvas");
      canvas.addEventListener("click", e => {
        //nearest point
        const nearestPoint = map.reduce((acc, point) => {
          const distance = Math.sqrt((point.x - e.offsetX) ** 2 + (point.y - e.offsetY) ** 2);
          if (acc.distance > distance) {
            return { point, distance };
          }
          return acc;
        }, { distance: Infinity, point: null });

        resolve(nearestPoint.point);
      })
    })
  }

  const handlePointSelection = async () => {
    if (nowSelecting.current === "destination") {
      const point = await getPoint();
      setDestination(point);
      nowSelecting.current = "start";
      handlePointSelection();
    } else {
      const point = await getPoint();
      setStart(point);
      nowSelecting.current = "destination";
    }
  }

  useEffect(() => {
    if (start == null || destination == null) return;

    const path = alghoritm(map, start, destination);
    path.push(start);
    setPath(path);
  }, [start, destination])


  return (
    <div className="App">
      <label htmlFor="width">Width: </label>
      <input type="number" id="width" value={width || "loading"} onChange={e => setWidth(parseInt(e.target.value))} />

      <label htmlFor="height">Height: </label>
      <input type="number" id="height" value={height|| "loading"} onChange={e => setHeight(parseInt(e.target.value))} />

      <label htmlFor="numberOfPoints">Number of points: </label>
      <input type="number" id="numberOfPoints" value={numberOfPoints|| "loading"} onChange={e => setNumberOfPoints(parseInt(e.target.value))} />

      <button onClick={handleClick}>Generate Map</button>
      <button onClick={handlePointSelection}>Select Points</button>
      <span>
        now selecting: {nowSelecting.current}
      </span>
      <br />
      <canvas>
      </canvas>
    </div>
  );
}

export default App;