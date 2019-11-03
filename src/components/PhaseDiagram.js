import React, { useMemo, useState } from 'react';
import { useTwoPointsPrecision } from '../customHooks';
import { getNodeNameByPoint, findPoints, evaluate } from '../helpers/helper';
import { uniqBy, round, uniq, orderBy, random } from 'loadsh';
const functionPlot = require("function-plot");

const getSamplePointsOnEachRange = (forkPoints, pValue, qValue) => {
  let phaseDiagramPoints = orderBy(uniq(forkPoints));
  let testPoints = [];
  for(let i=0;i<phaseDiagramPoints.length;i++){
    let numberToTest;
    if(i===0){
      numberToTest = random(phaseDiagramPoints[i] - 1,phaseDiagramPoints[i],true);
      phaseDiagramPoints[i+1] ? 
        testPoints.push(random(phaseDiagramPoints[i],phaseDiagramPoints[i+1],true)): 
        testPoints.push(phaseDiagramPoints[i]+1); 
    }
    else {
      if(i === phaseDiagramPoints.length -1){
        numberToTest = random(phaseDiagramPoints[i],phaseDiagramPoints[i] + 1,true);
        debugger;
      }
      else {
        numberToTest = random(phaseDiagramPoints[i-1], phaseDiagramPoints[i],true);
      }
    }
    testPoints.push(numberToTest);
    testPoints.push(phaseDiagramPoints[i]);
  }
  testPoints = orderBy(testPoints);
  return testPoints.map(point => 
    getNodeNameByPoint(
    {
      p: round(evaluate(pValue,{a: point}),10), 
      q: round(evaluate(qValue,{a: point}),10),
    })
  );
}

const PhaseDiagram = ({
  func,
  pValue,
  qValue,
  handleSetPoints,
}) => {
  const forkPoints = useMemo(() => findPoints(func, pValue, qValue), [func, pValue, qValue]);
  const trajectoryTypes = useMemo(() => uniqBy(getSamplePointsOnEachRange(forkPoints, pValue, qValue),'id'), [forkPoints]);
  const [activeClassId, setActiveClassId] = useState(0);
  
  const renderUpdate = (a) => {
    const p = round(evaluate(pValue,{a:a}),10);
    const q = round(evaluate(qValue,{a:a}),10);
    handleSetPoints([p,q]);  
    setActiveClassId(getNodeNameByPoint({p,q}).id);
  }

  const graph = useMemo(() => 
  {
    if(pValue && qValue){
      return functionPlot({
            title: 'Diagrama de fases',
            target: document.querySelector("#phase-diagram"),
            width: 900,
            height: 400,
            yAxis: { domain: [-5, 5] },
            tip: {
              renderer: renderUpdate,
            },
            grid: true,
            data: [
                {
                    fn: '0 * x',
                },
                {
                    points: forkPoints.map(point => [point,0]),
                    fnType: 'points',
                    graphType: 'scatter',
                    color: 'black',
                    attr: {
                      r: 3,
                    },
                },
            ],
            annotations: forkPoints.map(p => (
              {
                x: p,
                text: `a= ${round(p,3)}`
              })),
      });
    }
    else {
      return null;
    }
  },[pValue, qValue, forkPoints]);

  useTwoPointsPrecision(graph, renderUpdate, forkPoints);
  return (
    <div id='phase-diagram'>
      <div className='guide-container'>
        {trajectoryTypes.map(x => 
          <div id={x.id} key={x.id} className={activeClassId === x.id && 'active'}>{x.text}</div>
        )}
      </div>
    </div>
  );
};

export default PhaseDiagram;