import React, { useEffect} from 'react';
const functionPlot = require("function-plot");

const Map = ({points}) => {
    useEffect(() => {
        functionPlot({
            title: 'q = p^2/4',
            target: document.querySelector("#map"),
            yAxis: { domain: [-10, 10] },
            grid: true,
            data: [
            {
                fn: "x^2/4",
            },
            {
                points: points.length > 0 ? [points] : [0,0],
                fnType: 'points',
                graphType: 'scatter',
                color: 'red',
                attr: {
                r: 3,
                },
            },
            ]
        });
    });

    return (
        <div id="map"></div>
    );
};

export default Map;