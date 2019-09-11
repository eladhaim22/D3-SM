import React from 'react';
import './App.css';
import * as d3 from 'd3';
import { TextField, Button, Grid } from '@material-ui/core';
import { toFraction, toDecimal, findBalancePoints } from './helpers/helper';
import PhaseDiagram from './components/PhaseDiagram';
window.d3 = d3;
const functionPlot = require("function-plot");
const algebra = require("algebra.js");

function App() {
  const [func, setFunc] = React.useState(null);
  const [points, setPoints] = React.useState([]);
  const [pValue, setP] = React.useState(null);
  const [qValue, setQ] = React.useState(null);
  const [aValue, setA] = React.useState(null);
  const [blancePoints, setBlancePoints] = React.useState([]);
  React.useEffect(() => {
    if(func){
      functionPlot({
        title: 'q = p^2/4',
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
            color: 'red',
            attr: {
              r: 3,
            },
          },
        ]
      });
      functionPlot({
        title: func.replace(/x/g,'a'),
        target: document.querySelector("#div2"),
        yAxis: { domain: [-10, 10] },
        tip: {
          renderer: (a) => {
            const p = pValue.eval({a: toFraction(a)});
            const q = qValue.eval({a: toFraction(a)});
            setPoints([toDecimal(p.constants[0]), toDecimal(q.constants[0])]);
            setA(a);
          },
        },
        grid: true,
        data: [
          {
            fn: func,
          },
        ]
      });
  }},[func, points]);

  const calculateFunction = () => {
    const p = algebra.parse(`-((${values.inputA}) + (${values.inputD}))`);
    const q = algebra.parse(`(${values.inputA}) * (${values.inputD}) - (${values.inputB}) * (${values.inputC})`);
    setQ(q);
    setP(p);
    const func = q.subtract(p.multiply(p).divide(4));
    setBlancePoints(findBalancePoints(func, p, q ));
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
      <Grid container justify="center">
        <Grid container xs={6}>
          <Grid item xs={5}>
            <div style={{display:'inline-block',fontSize: '128px'}}>A=(</div>
          </Grid>
          <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={1}>
              <div style={{display:'inline-block',fontSize: '128px'}}>)</div>
            </Grid>
          </Grid>
        </Grid>
        <div style={{color: 'black'}}>{`q = ${qValue}`}</div>
        <div style={{color: 'black'}}>{`p = ${pValue}`}</div>
        <Button onClick={calculateFunction}>Calcular</Button>
        <Grid container justify="center">
          <Grid item xs={6}>
            <div id="div1"></div>
          </Grid>
          <Grid item xs={6}>
            <div id="div2"></div>
          </Grid>
          <Grid item xs={6}>
            <PhaseDiagram
              {...{
                  blancePoints, 
                  pValue, 
                  qValue, 
                  aValue}
              }
            />
          </Grid>
        </Grid>
    </div>
  );
}

export default App;
