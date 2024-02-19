// This is the core module for the implementation of the visualization
// It's analogous to model.js in terms of its relation to other modules,
// e.g. it reads the parameters and provides initialize, go and update functions
// to simulation.js where they get bundled with the analogous functions in model.js
// the observables and variables exported in model.js, e.g. the quantities
// used for the actual visualizations are also imported to viz.js

import {agents} from "./model.js"
import cfg from "./config.js"
import colors from "./colormaps.js"

/**
 * Created with d3-3d, https://github.com/niekes/d3-3d
 */
import {
    drag,
    select,
    range,
    selectAll,
} from "d3";

import {
    gridPlanes3D,
    points3D,
    lineStrips3D,
} from "d3-3d";
import { toInteger } from "lodash-es";

let init = (()=>{});

document.addEventListener("DOMContentLoaded", () => {
    const origin = { x: 750, y: 750 };
    const j = 5;
    const scale = 300;
    const key = (d) => d.id;
    const startAngle = Math.PI / 4;
    
    let scatter = [];
    let yLine = [];
    let xGrid = [];
    let beta = 0;
    let alpha = 0;
    let mx, my, mouseX = 0, mouseY = 0;
    var paint = colors[cfg.simulation.colormap];

    
    const svg = select("svg")
    .call(
    drag()
        .on("drag", dragged)
        .on("start", dragStart)
        .on("end", dragEnd)
    )
    .append("g");
      
      const grid3d = gridPlanes3D()
        .rows(11)
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(100);
  
    const points3d = points3D()
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(scale);
  
    const yScale3d = lineStrips3D()
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(scale);
  
    function processData(data, tt) {
        /* ----------- GRID ----------- */
    
        const xGrid = svg.selectAll("path.grid").data(data[0], key);
    
        xGrid
            .enter()
            .append("path")
            .attr("class", "d3-3d grid")
            .merge(xGrid)
            .attr("stroke", "black")
            .attr("stroke-width", 0.3)
            .attr("fill", (d) => (d.ccw ? "#aaa" : "#aaa"))
            .attr("fill-opacity", 0.3)
            .attr("d", grid3d.draw);
    
        xGrid.exit().remove();
    
        /* ----------- POINTS ----------- */
    
        const points = svg.selectAll("circle").data(data[1], key);
    
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
            //.attr("stroke", (d) => color(colorScale(d.p)).darker(2))
            //.style("fill",d=>paint( (d.p %   + Math.PI)/(2*Math.PI) % 1 ))
            .style("fill",d => {
                var x = d.p % (2*Math.PI)
                if (x<0) x+= 2*Math.PI
                return paint( x/(2*Math.PI))})
            .attr("opacity", 1)
            .attr("cx", posPointX)
            .attr("cy", posPointY);
    
        points.exit().remove();
    
        /* ----------- y-Scale ----------- */
    
        const yScale = svg.selectAll("path.yScale").data(data[2]);
    
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
        
        const yText = svg.selectAll("text.yText").data(data[2][0]);
    
        yText
            .enter()
            .append("text")
            .attr("class", "d3-3d yText")
            .attr("font-family", "system-ui, sans-serif")
            .merge(yText)
            .each(function (d) {
            d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
            })
            .attr("x", (d) => d.projected.x)
            .attr("y", (d) => d.projected.y)
            .text((d) => (d.y <= 0 ? d.y : ''));
    
        yText.exit().remove();
        
    
        selectAll(".d3-3d").sort(points3d.sort);
    }
  
    function posPointX(d) {
        return d.projected.x;
    }
  
    function posPointY(d) {
        return d.projected.y;
    }
  
    init = function() {
        xGrid = [];
        scatter = [];
        yLine = [];
        
        
        
        for (let z = -j; z <= j; z++) {
            for (let x = -j; x <= j; x++) {
                xGrid.push({ x: x, y: j, z: z});
        }};
        agents.forEach((val)=> {
            scatter.push({
                x: val.x, 
                y: val.y, 
                z: val.z, 
                p: val.theta,
                id: val.index,
            });
        });
    
        range(0, 1, j).forEach((d) => {
            yLine.push({ x: -j, y: -d, z: -j });
        });
        
        const data = [
            grid3d(xGrid),
            points3d(scatter),
            yScale3d([yLine]),
        ];
        processData(data, 0);
    }
  
    function dragStart(event) {
        mx = event.x;
        my = event.y;
    }
  
    function dragged(event) {
        beta = (event.x - mx + mouseX) * (Math.PI / 230);
        alpha = (event.y - my + mouseY) * (Math.PI / 230) * -1;
    
        const data = [
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
  
    init();
});


  export {init}
