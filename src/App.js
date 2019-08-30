import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import { TextField } from '@material-ui/core';
import { axisBottom, axisLeft } from 'd3-axis';
import { mouse } from 'd3-selection';

const w = 760;
const h = 400;
const x = d3.scaleLinear().domain([-5, 5]).range([0,w]);
const y = d3.scaleLinear().domain([ 0, 1]).range([h,0]);

const make_gaussian_func = (mu, sigma_squared) => {
  // per: http://en.wikipedia.org/wiki/Gaussian_function
  // and: http://mathworld.wolfram.com/GaussianFunction.html
  var sqrt = Math.sqrt, pow = Math.pow, e = Math.E, pi = Math.PI;
  var sigma = sqrt(sigma_squared);
  var a = 1 / (sigma * sqrt(2 * pi));
  return (function(xi) {
      return pow( a * e, - pow(xi - mu, 2) / (2 * pow(sigma, 2)) )
    });
}

const make_rules = (vis) => {
  var rules = vis.append("svg:g").classed("rules", true)

  function make_x_axis() {
    return axisBottom(x)
        .ticks(10)
  }

  function make_y_axis() {
    return axisLeft(y)
        .ticks(10)
  }

  rules.append("svg:g").classed("grid x_grid", true)
      .attr("transform", "translate(0,"+h+")")
      .call(make_x_axis()
        .tickSize(-h,0,0)
        .tickFormat("")
      )

  rules.append("svg:g").classed("grid y_grid", true)
      .call(make_y_axis()
        .tickSize(-w,0,0)
        .tickFormat("")
      )

  rules.append("svg:g").classed("labels x_labels", true)
      .attr("transform", "translate(0,"+h+")")
      .call(make_x_axis()
        .tickSize(5)
        // .tickFormat(d3.time.format("%Y/%m"))
      )

  rules.append("svg:g").classed("labels y_labels", true)
      .call(make_y_axis()
        //.tickSubdivide(1)
        .tickSize(10, 5, 0)
      )
}

const chart_line = (vis, continuous) => {
  var g = vis.append("svg:g")
      .classed("series", true)
  console.log(x());
  g.append("svg:path")
      .attr("d", function(d) { return d3.line()(
        x.ticks(100).map(function(xi) {
          return [ x(xi), y(continuous(xi)) ]
        })
       )})
}

const make_mouseover_guides = (vis, continuous, legend) => {
  var guides = vis.append("svg:g")
          .classed("guides", true)
  var y_guides = guides.append("svg:g")
  guides.append("svg:line")
          .attr("y1",h)
  y_guides.append("svg:circle")
          .attr("r",7)
  y_guides.append("svg:line")
          .attr("x1",-20)
          .attr("x2",+20)

  vis.append("svg:rect")
      .classed("mouse_area", true)
      .attr("width",  w)
      .attr("height", h)
      .on("mousemove", update_legend_values)
      .on("mouseout",   blank_legend_values)

  blank_legend_values();

  var format_5f = d3.format(".5f");

  function update_legend_values() {
    var xi = x.invert(mouse(this)[0]);

    legend
        .text("x: "+format_5f(xi)+ " | y: "+format_5f(continuous(xi)));

    guides
        .attr("transform", "translate("+(x(xi))+",0)")
        .attr("visibility", "visible")

    y_guides
        .attr("transform", "translate(0,"+y(continuous(xi))+")")
  }

  function blank_legend_values() {
    legend
        .text("Mouse over the graph...")

    guides
        .attr("visibility", "hidden")
  }
}
const data = Array.from({length: 50}, (i,v) => ({x: Math.floor(Math.random() * 760),
y: Math.floor(Math.random() * 400)}));

const addRandomDots = () => {     
  d3.select("svg>g").selectAll("dot")
    .data(data)
    .enter().append("circle")
      .attr("r", 3.5)
      .attr("cx", function(value) { return value.x })
      .attr("cy", function(value) { return value.y });
}

function App() {
  React.useEffect(() => {
    var pad = 50;
    var svg = d3.select("body")
        .append("svg:svg")
        .attr("height", h + pad)
        .attr("width",  w + pad)

    var vis = svg.append("svg:g")
        .attr("transform", "translate(40,20)")

    var legend = d3.select("header").append("div")
        .classed("legend", true)

    var continuous = make_gaussian_func(-3, .7);
    make_rules(vis);
    chart_line(vis, continuous);
    make_mouseover_guides(vis, continuous, legend);
    addRandomDots();
    /*var margin = {top: 20, right:20, bottom:20, left:50};
    var svg = d3.select("body").append("svg")
      .attr("height", height).attr("width", width)
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.right + ")");
    
    const lineFunc = d3.line()
      .x(function(d) { return d.x })
      .y(function(d) { return d.y })

    // Add the path using this helper function
    svg.append('path')
      .attr('d', lineFunc(data))
      .attr('stroke', 'black')
      .attr('fill', 'none');
    */
  });

  const [values, setValues] = React.useState(
      {
        name: 'input1',
        value: ''
      },
      {
        name: 'input2',
        value:'',
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
          id="input1"
          label="X"
          value={values.input1}
          onChange={handleChange('input1')}
          margin="normal"
        />
        <TextField
          id="standard-name"
          label="Y"
          value={values.input2}
          onChange={handleChange('input2')}
          margin="normal"
        />
      </header>
    </div>
  );
}

export default App;
