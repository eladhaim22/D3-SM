import React, { useEffect } from 'react';
import { toDecimal, toFraction } from '../helpers/helper';
const functionPlot = require("function-plot");

const AlfaFunction = ({pValue, qValue, func, handleSetA, handleSetPoints}) => {
  useEffect(() => {
    if(func){
      functionPlot({
        title: `q(a)=${func.replace(/x/g,'a')}`,
        target: document.querySelector("#alfa-function"),
        yAxis: { domain: [-10, 10] },
        tip: {
          renderer: (a) => {
            const p = pValue.eval({a: toFraction(a)});
            const q = qValue.eval({a: toFraction(a)});
            handleSetPoints([toDecimal(p.constants[0]), toDecimal(q.constants[0])]);
            handleSetA(a);
          },
        },
        grid: true,
        data: [
          {
            fn: func,
          },
        ]
      });
  }},[func]);

  return (
    <div id='alfa-function'></div>
  )
};

export default AlfaFunction;