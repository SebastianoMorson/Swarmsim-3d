// This is the core module for the implementation of the visualization
// It's analogous to model.js in terms of its relation to other modules,
// e.g. it reads the parameters and provides initialize, go and update functions
// to simulation.js where they get bundled with the analogous functions in model.js
// the observables and variables exported in model.js, e.g. the quantities
// used for the actual visualizations are also imported to viz.js

import * as d3 from "d3"
import * as d3d from "d3-3d"
import param from "./parameters.js"
import {agents} from "./model.js"
import cfg from "./config.js"
import colors from "./colormaps.js"



import {
	drag,
	color,
	select,
	range,
	randomUniform,
	scaleOrdinal,
	selectAll,
	schemeCategory10,
} from "d3";
  
import {
	gridPlanes3D,
	points3D,
	lineStrips3D,
} from "d3-3d";

let init;
var origin = { x: 480, y: 250 };
var j = 10;
var scale = 200;
var key = (d) => d.index;
var startAngle = Math.PI / 4;
var colorScale = scaleOrdinal(schemeCategory10);

let scatter = [];
let yLine = [];
let xGrid = [];
let beta = 0;
let alpha = 0;
let mx, my, mouseX = 0, mouseY = 0;


var grid3d = gridPlanes3D()
    .rows(20)
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale);

var points3d = points3D()
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale);

var yScale3d = lineStrips3D()
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale);


function dragStart(event) {
    mx = event.x;
    my = event.y;
}


function dragged(event) {
    beta = (event.x - mx + mouseX) * (Math.PI / 230);
    alpha = (event.y - my + mouseY) * (Math.PI / 230) * -1;

    var data = [
        grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(xGrid),
        points3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(scatter),
        yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([yLine]),
    ];
    
    processData(data, 0);
    }

function dragEnd(event) {
    mouseX = event.x - mx + mouseX;
    mouseY = event.y - my + mouseY;

}    

var svg = select("svg").call(
    drag()
        .on("drag", dragged)
        .on("start", dragStart)
        .on("end", dragEnd)
    )
    .append("g");



    function posPointX(d) {
    return d.projected.x;
    }

    function posPointY(d) {
    return d.projected.y;
    }

    function posPointZ(d) {
    return d.projected.z;
    }
    function processData(data, tt) {
        var points = svg.selectAll("circle");
        points.remove();
        /* ----------- GRID ----------- */
    
        //qui viene specificato l'asse x 
        
        var xGrid = svg.selectAll("path.grid").data(data[0], key);
    
        xGrid
            .enter()
            .append("path")
            .attr("class", "d3-3d grid")
            .merge(xGrid)
            .attr("stroke", "black")
            .attr("stroke-width", 0.3)
            .attr("fill", (d) => (d.ccw ? "##de2209" : "##de2209"))
            .attr("fill-opacity", 1)
            .attr("d", grid3d.draw);
    
        xGrid.exit().remove();
    
        /* ----------- POINTS ----------- */
    
        points = svg.selectAll("circle").data(data[1], key);
        points
            .enter()
            .append("circle")
            .attr("class", "d3-3d")
            .attr("opacity", 0)
            .attr("cx", posPointX)
            .attr("cy", posPointY)
            .merge(points)
            .transition()
            .duration(tt)
            .attr("r", 3)
            .attr("stroke", (d) => color(colorScale(d.p)).darker(3))
            .attr("fill", (d) => colorScale(d.p))
            .attr("opacity", 1)
            .attr("cx", posPointX)
            .attr("cy", posPointY);
    
    
        points.exit().remove();
    
        /* ----------- y-Scale ----------- */
    
        //qui viene specificato l'asse y 
        var yScale = svg.selectAll("path.yScale").data(data[2]);
    
        yScale
            .enter()
            .append("path")
            .attr("class", "d3-3d yScale")
            .merge(yScale)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", yScale3d.draw);
    
        yScale.exit().remove();
    
        /* ----------- y-Scale Text ----------- */
    
        var yText = svg.selectAll("text.yText").data(data[2][0]);
    
        yText
            .enter()
            .append("text")
            .attr("class", "d3-3d yText")
            .attr("font-family", "system-ui, sans-serif")
            .merge(yText)
            .each(function (d) {
                d.centroid = { x: d.rotated.x, y: d.rotated.y};
            })
            .attr("x", (d) => d.projected.x)
            .attr("y", (d) => d.projected.y)
            .text((d) => (d.y <= 0 ? d.y : ''));
    
        yText.exit().remove();
    
        selectAll(".d3-3d").sort(points3d.sort);
    }

//document.addEventListener("DOMContentLoaded", () => {



 init=function() {
    svg = select("svg").call(
        drag()
            .on("drag", dragged)
            .on("start", dragStart)
            .on("end", dragEnd)
        )
        .append("g");

    var xGrid = [];
    var scatter = [];
    var yLine = [];

    console.log("init start");
    //in teoria per cambiare il piano di base che dovrebbe essere mostrato, è sufficiente usare 
    //4 punti e tracciare il piano che passa per questi 4 punti, il punto è che non viene visualizzato bene
    // e non so perchè, bisogna correggerlo
    xGrid.push({x: 0, y: 1, z: 0}); //qui cambio il piano di 
    xGrid.push({x: 0, y:1, z:2});
    xGrid.push({x: 0, y:1, z:2});
    xGrid.push({x: 2, y: 1, z: 0}); 

    
    agents.forEach((val)=> {
        scatter.push({
            x: val.x, 
            y: val.y, 
            z: val.z, 
            p: val.theta,
            id: val.index,
        });
    });
    
    console.log(scatter.length);
    range(-1, 1, 1).forEach((d) => {
        yLine.push({ x: -j, y: -d, z: -j });
    });
    
    var data = [
        grid3d(xGrid),
        points3d(scatter),
        yScale3d([yLine]),
    ];
    
    processData(data, 1000);
    console.log("init stop");
}

//});

export {init};
