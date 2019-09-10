import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';
// import { scaleLinear } from 'd3-scale';
import { TextField, Button } from '@material-ui/core';
/*import { axisBottom, axisLeft } from 'd3-axis';
import { mouse } from 'd3-selection';
import { createPoints } from './drawHelper';*/
window.d3 = d3;
const functionPlot = require("function-plot");
const algebra = require("algebra.js");
var Fraction = require('fraction.js');

const toFraction = (x) => {
  debugger;
  return new algebra.Fraction(new Fraction(x).n * new Fraction(x).s, new Fraction(x).d)
};

const toDecimal = (x) => (
  x.numer / x.denom
);

function App() {
  const [func, setFunc] = React.useState(null);
  const [points, setPoints] = React.useState([]);
  const [pValue, setP] = React.useState(null);
  const [qValue, setQ] = React.useState(null);
  const [blancePoints, setBlancePoints] = React.useState([]);
  React.useEffect(() => {
    if(func){
      const a = functionPlot({
        target: document.querySelector("#div1"),
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
            color: 'black',
            attr: {
              r: 3,
            },
          },
        ]
      });
      const b = functionPlot({
        target: document.querySelector("#div2"),
        yAxis: { domain: [-10, 10] },
        tip: {
          renderer: (a) => {
            const p = pValue.eval({a: toFraction(a)});
            const q = qValue.eval({a: toFraction(a)});
            setPoints([toDecimal(p.constants[0]), toDecimal(q.constants[0])]);
          },
        },
        grid: true,
        data: [
          {
            fn: func,
          },
        ]
      });
      const c = functionPlot({
        target: document.querySelector("#div3"),
        yAxis: { domain: [-10, 10] },
        tip: {
          renderer: (a) => {
          },
        },
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
        ]
      });
    }
  },[func, points]);

  const calculateFunction = () => {
    const p = algebra.parse(`-((${values.inputA}) + (${values.inputD}))`);
    const q = algebra.parse(`(${values.inputA}) * (${values.inputD}) - (${values.inputB}) * (${values.inputC})`);
    setQ(q);
    setP(p);
    debugger;
    const func = q.subtract(p.multiply(p).divide(4));
    setBlancePoints(algebra.parse(`${func.toString()} = 0`).solveFor('a').map(x => 
      [toDecimal(x),0]
    ));
    console.log(func.toString());
    setFunc(func.toString().replace(/a/g,'x'));
  }

  const [values, setValues] = React.useState(
      {
        inputA: '-1',
        inputB: '-1+a',
        inputC: '1',
        inputD: '-a',
      },
  );

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className="App" id="app">
      <header className="App-header" id="app-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TextField
          name="inputA"
          label="a"
          value={values.inputA}
          onChange={handleChange('inputA')}
          margin="normal"
        />
        <TextField
          name="inputB"
          label="b"
          value={values.inputB}
          onChange={handleChange('inputB')}
          margin="normal"
        />
        <TextField
          name="inputC"
          label="c"
          value={values.inputC}
          onChange={handleChange('inputC')}
          margin="normal"
        />
        <TextField
          name="inputD"
          label="d"
          value={values.inputD}
          onChange={handleChange('inputD')}
          margin="normal"
        />
        <div style={{color: 'black'}}>{`q = ${qValue}`}</div>
        <div style={{color: 'black'}}>{`p = ${pValue}`}</div>
        <Button onClick={calculateFunction}>Calcular</Button>
        <div id="div1"></div>
        <div id="div2"></div>
        <div id="div3"></div>
      </header>
    </div>
  );
}

export default App;
