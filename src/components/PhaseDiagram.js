import React, { useEffect} from 'react';
import { getNodeNameByPoint, toFraction } from '../helpers/helper';
const functionPlot = require("function-plot");

const getAnnotations = (blancePoints, pValue, qValue) => {
    debugger;
    const annotations = [];
    blancePoints.map(point => {
      [-0.1,0,0.1].map(j =>
        annotations.push(
          { 
              x: point[0] + j * 5,
              text: getNodeNameByPoint(
                {
                  p: parseFloat(pValue.eval({a: toFraction(point[0] + j)}).toString()), 
                  q: parseFloat(qValue.eval({a: toFraction(point[0] + j)}).toString())
                }),
          }
        )
      );
    });
    return annotations;
  }

const PhaseDiagram = ({blancePoints, pValue, qValue, aValue}) => {
    useEffect(() => {
      if(blancePoints && blancePoints.length > 0){
      functionPlot({
            title: 'Diagrama de fases',
            target: document.querySelector("#phase-diagram"),
            yAxis: { domain: [-10, 10] },
            tip: {},
            grid: true,
            data: [
                {
                    fn: '0 * x',
                },
                {
                    points: blancePoints,
                    fnType: 'points',
                    graphType: 'scatter',
                    color: 'black',
                    attr: {
                    r: 3,
                    },
                },
                {
                    points: [[aValue,0]],
                    fnType: 'points',
                    graphType: 'scatter',
                    color: 'red',
                    attr: {
                    r: 3,
                    },
                },
            ],
            annotations: getAnnotations(blancePoints, pValue, qValue),
        });
      }
    });
    return (
        <div id="phase-diagram"></div>
    );
};

export default PhaseDiagram;