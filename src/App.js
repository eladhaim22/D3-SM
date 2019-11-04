import React from 'react';
import './App.css';
import * as d3 from 'd3';
import PhaseDiagram from './components/PhaseDiagram';
import Map from './components/Map';
import { AppBar, Toolbar, Typography, makeStyles, TextField, Button, Grid  } from '@material-ui/core';
const nerdamer = require('nerdamer/all');

window.d3 = d3;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar:{
    marginBottom: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [func, setFunc] = React.useState(null);
  const [points, setPoints] = React.useState([]);
  const [pValue, setP] = React.useState(null);
  const [qValue, setQ] = React.useState(null);
  const calculateFunction = () => {
    const p = nerdamer(`simplify(-((${values.inputA}) + (${values.inputD})))`);
    const q = nerdamer(`simplify((${values.inputA}) * (${values.inputD}) - (${values.inputB}) * (${values.inputC}))`); 
    setQ(q);
    setP(p);
    setFunc(nerdamer(`${q}-((${p})^2)/4`));
  }

  const [values, setValues] = React.useState(
      {
        inputA: '-1',
        inputB: 'a',
        inputC: '-1',
        inputD: 'a + 1',
      },
  );

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className={classes.root} id="app">
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            Sistema linales 2D con escenarios(Acoplados)
          </Typography>
          <Button onClick={calculateFunction} variant="contained">Calcular</Button>
        </Toolbar>
      </AppBar>
      <Grid container justify="center">
          <Grid item xs={3}>
            <div style={{display:'inline-block',fontSize: '128px'}}>A=(</div>
          </Grid>
          <Grid container item xs={4}> 
            <Grid item xs={6}>
              <TextField
                name="inputA"
                label="a"
                value={values.inputA}
                onChange={handleChange('inputA')}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="inputB"
                label="b"
                value={values.inputB}
                onChange={handleChange('inputB')}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="inputC"
                label="c"
                value={values.inputC}
                onChange={handleChange('inputC')}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="inputD"
                label="d"
                value={values.inputD}
                onChange={handleChange('inputD')}
                margin="normal"
              />
            </Grid>
        </Grid>
          <Grid item xs={1}>
            <div style={{display:'inline-block',fontSize: '128px'}}>)</div>
          </Grid>
          <Grid container item xs={4}>
            {func &&
              <>
                <Grid item xs={12}>
                  <Typography variant="h5">{`q = ${qValue}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">{`p = ${pValue}`}</Typography>
                </Grid>
              </>
            }
          </Grid>
          <Grid container>
            <Grid item xs={6}>
                {func && <Map 
                  points={points}
                  qValue={qValue}
                  pValue={pValue}
                />} 
            </Grid>
            <Grid item xs={6}>
              <PhaseDiagram
                handleSetPoints={setPoints}
                func={func}
                pValue={pValue}
                qValue={qValue}
              />
            </Grid>
          </Grid>
        </Grid>
    </div>
  );
}

export default App;
