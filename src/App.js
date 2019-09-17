import React from 'react';
import './App.css';
import * as d3 from 'd3';
import { TextField, Button, Grid } from '@material-ui/core';
import PhaseDiagram from './components/PhaseDiagram';
import Map from './components/Map';
import AlfaFunction from './components/AlfaFunction';

window.d3 = d3;
const algebra = require("algebra.js");

function App() {
  const [func, setFunc] = React.useState(null);
  const [points, setPoints] = React.useState([]);
  const [pValue, setP] = React.useState(null);
  const [qValue, setQ] = React.useState(null);
  const [aValue, setA] = React.useState(null);

  const calculateFunction = () => {
    const p = algebra.parse(`-((${values.inputA}) + (${values.inputD}))`);
    const q = algebra.parse(`(${values.inputA}) * (${values.inputD}) - (${values.inputB}) * (${values.inputC})`);
    setQ(q);
    setP(p);
    debugger;
    const func = q.subtract(p.multiply(p).divide(4));
    setFunc(func.toString().replace(/a/g,'x'));
  }

  const [values, setValues] = React.useState(
      {
        inputA: '-1',
        inputB: '2a',
        inputC: 'a',
        inputD: '-1',
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
          <Grid item xs={4}>
            {func && <Map points={points}/>}
          </Grid>
          <Grid item xs={4}>
            <AlfaFunction
              handleSetA={setA}
              handleSetPoints={setPoints}
              {...{
                  func, 
                  pValue, 
                  qValue}
              }
            />
            <PhaseDiagram
              {...{ 
                  func,  
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
