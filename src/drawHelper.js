import * as d3 from 'd3';
//generate points y = ax^2+bx+c
export const createPoints = (a,b,c,rangeX,step) => {
    return Array.apply(null,Array((rangeX[1]-rangeX[0])/step|0 + 1))
    .map(function(d,i){
            var x = rangeX[0]+i*step;
            return [x,a * x * x + b * x + c];
    })
}

export const draw = () => {
    d3.selectAll(".coordinates").data(d3.range(2))
    .enter()
    .append("path")
    .attr("class","coordinates")
    .attr("stroke","black")
    .attr("d",function(d,i){
        return i
      ? "M0,100h200"
      : "M100,0v200"
    });
} 