import React, { useEffect, useMemo } from 'react';
import { getNodeNameByPoint, toFraction, findPoints } from '../helpers/helper';
const functionPlot = require("function-plot");

const getAnnotations = (importantPoints, pValue, qValue) => {
  let phaseDiagramPoints = importantPoints.map(x => x[0])
    .filter((x, i, a) => a.indexOf(x) == i).sort((a,b) => (a - b));
  phaseDiagramPoints = phaseDiagramPoints.reduce((acc , cur, idx, src) => {
    if(idx == 0){
      return acc.concat([cur - 1, cur, src[idx + 1] ? (cur + src[idx + 1]) /2 : cur + 1])
    }

    if(idx == src.length - 1){
      return acc.concat([cur, cur + 1]);
    }

    return acc.concat([cur, (cur + src[idx + 1]) /2 ]);
  }, [])

  debugger;
  return phaseDiagramPoints.map(point => {
    const test =  toFraction(point);
    debugger;
    return {
      x: point,
      text: getNodeNameByPoint(
        {
          p: parseFloat(eval(pValue.eval({a: toFraction(point)}).toString())), 
          q: parseFloat(eval(qValue.eval({a: toFraction(point)}).toString()))
        }),
    }
  });
}

const PhaseDiagram = ({func, pValue, qValue, aValue}) => {
  const importantPoints = useMemo(() => 
      findPoints(func, pValue, qValue), [func, pValue, qValue]);
  useEffect(() => {
    if(func && pValue && qValue){
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
                    points: importantPoints.map(point => [point[0],0]),
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
            annotations: getAnnotations(importantPoints, pValue, qValue),
          });
        }
    }, [importantPoints, aValue]);
    return (
        <div id="phase-diagram"></div>
    );
};

export default PhaseDiagram;