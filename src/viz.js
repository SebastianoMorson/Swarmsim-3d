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



var L = param.L;
var X = d3.scaleLinear().domain([-L,L]);
var Y = d3.scaleLinear().domain([-L,L]);
var paint = colors[cfg.simulation.colormap];


var beta = 0;
var alpha = 0;
var mx, my, mouseX = 0, mouseY = 0;

var origin = { x: 550, y: 700 };
var j = 10;
var scale = 300;

var startAngle = Math.PI / 4;
var colorScale = scaleOrdinal(schemeCategory10);

var xGrid = [];
	var scatter = [];
	var yLine = [];

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

function posPointX(d) {
	return d.projected.x;
}

function posPointY(d) {
	return d.projected.y;
}

function posPointZ(d) {
	return d.projected.z;
}

function dragStart(event) {
	mx = event.x;
	my = event.y;
}



function dragEnd(event) {
	mouseX = event.x - mx + mouseX;
	mouseY = event.y - my + mouseY;

}

var initialize = (display,config) => {

	//document.addEventListener("DOMContentLoaded", () => {

	var key = (d) => d.index;


// the initialization function, this is bundled in simulation.js with the initialization of
// the model and effectively executed in index.js when the whole explorable is loaded
// typically here all the elements in the SVG or CANVAS element are set.
		
	function init() {
		
		//console.log(agents);
		console.log(agents);
		

		//in teoria per cambiare il piano di base che dovrebbe essere mostrato, è sufficiente usare 
		//4 punti e tracciare il piano che passa per questi 4 punti, il punto è che non viene visualizzato bene
		// e non so perchè, bisogna correggerlo
		xGrid.push({x: 0, y: 1, z: 0}); //qui cambio il piano di 
		xGrid.push({x: 0, y:1, z:2});
		xGrid.push({x: 0, y:1, z:2});
		xGrid.push({x: 2, y: 1, z: 0}); 

		
		agents.forEach((val)=> {
			console.log(val);

				scatter.push({
					x: val.x, // val.X(val.x),
					y: val.y, //val.Y(val.y), randomUniform(0, -10)(),
					z: val.z, //randomUniform(-10, 10)(),
					p: val.theta,
					id: val.index,
				});
		});
		
		/*
		for (var z = -j; z < j; z++) {
			for (var x = -j; x < j; x++) {
				xGrid.push({ x: x, y: 1, z: z}); //qui cambio il piano di 
				scatter.push({
					x: randomUniform(-10, 10)(),
					y: randomUniform(0, -10)(),
					z: randomUniform(-10, 10)(),
					id: "point-" + cnt++,
				});
			}
		}
		*/
		range(-1, 1, 1).forEach((d) => {
			yLine.push({ x: -j, y: -d, z: -j });
		});
		
		var data = [
			grid3d(xGrid),
			points3d(scatter),
			yScale3d([yLine]),
		];
		processData(data, 1000);
		console.log("prova");
	}

	
	function processData(data, tt) {
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
			.attr("fill-opacity", 0)
			.attr("d", grid3d.draw);

		xGrid.exit().remove();

		/* ----------- POINTS ----------- */

		var points = svg.selectAll("circle").data(data[1], key);

		points
			.enter()
			.append("circle")
			.attr("class", "d3-3d")
			.attr("opacity", 0)
			//.attr("cx", posPointX)
			//.attr("cy", posPointY)
			.merge(points)
			.transition()
			.duration(tt)
			.attr("r", 3)
			.attr("stroke", (d) => color(colorScale(d.p)).darker(3))
			.attr("fill", (d) => colorScale(d.p))
			.attr("opacity", 1)
			.attr("cx", posPointX)
			.attr("cy", posPointY)
			.attr("cz", posPointZ);


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
				d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
			})
			.attr("x", (d) => d.projected.x)
			.attr("y", (d) => d.projected.y)
			.text((d) => (d.y <= 0 ? d.y : ''));

		yText.exit().remove();

		selectAll(".d3-3d").sort(points3d.sort);
	}

	
	var svg = select("svg")
	.call(
	drag()
		.on("drag", dragged)
		.on("start", dragStart)
		.on("end", dragEnd)
	)
	.append("g");

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

	
	console.log("miaoo");
	init();	
	};


	

	
	/*

	var W = config.display_size.width;
	var H = config.display_size.height;
	
	X.range([0,W]);
	Y.range([0,H]);
	
	display.selectAll("#origin").remove();
	origin = display.append("g").attr("id","origin")
	
	origin.selectAll(".agent").data(agents).enter().append("circle")
	.attr("class","agent")
	.attr("r",param.agentsize)
	.attr("cx",d=>X(d.x)) //questa è la coordinata x del punto, se faccio +300, tutto si sposta a destra
	.attr("cy",d=>Y(d.y)) //suppongo sia quella y
	.style("fill",d => {
		var x = d.theta % (2*Math.PI) //qui credo si riferisca alla fase del punto, infatti se faccio +100, ottengo un colore molto acceso
		if (x<0) x+= 2*Math.PI
		return paint( x/(2*Math.PI))
	})
	*/
	
//};

// the go function, this is bundled in simulation.js with the go function of
// the model, typically this is the iteration function of the model that
// is run in the explorable. It contains the code that updates the parts of the display
// panel as a function of the model quantities.

var go = (display,config) => {


	console.log("go");

	
	//var xGrid = [];
	//var scatter = [];
	//var yLine = [];

	
	
//document.addEventListener("DOMContentLoaded", () => {


	//var origin = { x: 550, y: 700 };
	//var j = 10;
	//var scale = 300;
	var key = (d) => d.index;
	//var startAngle = Math.PI / 4;
	//var colorScale = scaleOrdinal(schemeCategory10);

	var scatter = [];
	var xGrid = [];
	//var beta = 0;
	//var alpha = 0;
	//var mx, my, mouseX = 0, mouseY = 0;


	var svg = select("svg")
	.call(
	drag()
		.on("drag", dragged)
		.on("start", dragStart)
		.on("end", dragEnd)
	)
	.append("g");
	
	

	

	function processData(data, tt) {

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
			.attr("fill-opacity", 0)
			.attr("d", grid3d.draw);

		xGrid.exit().remove();

		/* ----------- POINTS ----------- */
		

		var points = svg.selectAll("circle").data(data[1], key);
		
		
		points
			.enter()
			.append("circle")
			.attr("class", "d3-3d")
			.attr("opacity", 0)
			//.attr("cx", posPointX)
			//.attr("cy", posPointY)
			.merge(points)
			.transition()
			.duration(tt)
			.attr("r", 3)
			.attr("stroke", (d) => color(colorScale(d.p)).darker(3))
			.attr("fill", (d) => colorScale(d.p))
			.attr("opacity", 1)
			.attr("cx", posPointX)
			.attr("cy", posPointY);
		
		/*
		console.log(points.data);
		points.each((point)=>{
			
			agents.forEach((agent)=>{
				
				if(point.index == agent.index){
					
					point
					.attr("cx", agent.x)
					.attr("cy", agent.y)
					.attr("cy", agent.z)
					.attr("stroke", color(colorScale(agent.theta)).darker(3))
					.attr("fill", colorScale(agent.theta))
				}
			});
		});
		*/
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
				d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
			})
			.attr("x", (d) => d.projected.x)
			.attr("y", (d) => d.projected.y)
			.text((d) => (d.y <= 0 ? d.y : ''));

		yText.exit().remove();

		selectAll(".d3-3d").sort(points3d.sort);
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


// the initialization function, this is bundled in simulation.js with the initialization of
// the model and effectively executed in index.js when the whole explorable is loaded
// typically here all the elements in the SVG or CANVAS element are set.
    
	
	function init() {
		

		
		var cnt = 0;
		//console.log(agents);
		console.log(agents);
		
		xGrid.push({x: 0, y: 1, z: 0}); //qui cambio il piano di 
		xGrid.push({x: 0, y:1, z:2});
		xGrid.push({x: 0, y:1, z:2});
		xGrid.push({x: 2, y: 1, z: 0}); 
		/*
		var svg = select("svg")
		var points = svg.selectAll("circle").data(data[1], key);

		points.forEach((point)=>{
			agents.forEach((agent)=>{
				if(point.index == agent.index){
					point
					.attr("cx", agent.x)
					.attr("cy", agent.y)
				}
			});
		});
		*/
		///*
		agents.forEach((val)=> {
			console.log(val);

				scatter.push({
					x: val.x, // val.X(val.x),
					y: val.y, //val.Y(val.y), randomUniform(0, -10)(),
					z: val.z, //randomUniform(-10, 10)(),
					p: val.theta,
					id: val.index,
				});
		});
		//*/

		/*
		for (var z = -j; z < j; z++) {
			for (var x = -j; x < j; x++) {
				xGrid.push({ x: x, y: 1, z: z}); //qui cambio il piano di 
				scatter.push({
					x: randomUniform(-10, 10)(),
					y: randomUniform(0, -10)(),
					z: randomUniform(-10, 10)(),
					id: "point-" + cnt++,
				});
			}
		}
		*/
		range(-1, 1, 1).forEach((d) => {
			yLine.push({ x: -j, y: -d, z: -j });
		});
		
		var data = [
			grid3d(xGrid),
			points3d(scatter),
			yScale3d([yLine]),
		];
		processData(data, 1000);
		console.log("prova");
	}
	
	init();
//});
		
	
	//display.select("#origin").selectAll(".agent")
	//	.attr("cx",d=>X(d.x)) //qui vale la stessa cosa di prima 
//		.attr("cy",d=>Y(d.y))
//			.style("fill",d=>paint( (d.theta %   + Math.PI)/(2*Math.PI) % 1 ))
//		.style("fill",d => {
//			var x = d.theta % (2*Math.PI)
//			if (x<0) x+= 2*Math.PI
//			return paint( x/(2*Math.PI))
//		})
	

//
	};
	

// the update function is usually not required for running the explorable. Sometimes
// it makes sense to have it, e.g. to update the visualization, if a parameter is changed,
// e.g. a radio button is pressed, when the system is not running, e.g. when it is paused.

var update = go;


export {initialize,go,update};
