// This is the core module for the implementation of the visualization
// It's analogous to model.js in terms of its relation to other modules,
// e.g. it reads the parameters and provides initialize, go and update functions
// to simulation.js where they get bundled with the analogous functions in model.js
// the observables and variables exported in model.js, e.g. the quantities
// used for the actual visualizations are also imported to viz.js

import * as d3 from "d3"
import param from "./parameters.js"
import {agents} from "./model.js"
import cfg from "./config.js"
import colors from "./colormaps.js"

const L = param.L;
const X = d3.scaleLinear().domain([-L,L]);
const Y = d3.scaleLinear().domain([-L,L]);

const paint = colors[cfg.simulation.colormap];

// the initialization function, this is bundled in simulation.js with the initialization of
// the model and effectively executed in index.js when the whole explorable is loaded
// typically here all the elements in the SVG or CANVAS element are set.

const initialize = (display,config) => {

	const W = config.display_size.width;
	const H = config.display_size.height;
	
	X.range([0,W]);
	Y.range([0,H]);
	
	display.selectAll("#origin").remove();
	origin = display.append("g").attr("id","origin")
	
	origin.selectAll(".agent").data(agents).enter().append("circle")
	.attr("class","agent")
	.attr("r",param.agentsize)
	.attr("cx",d=>X(d.x))
	.attr("cy",d=>Y(d.y))
	.style("fill",d => {
		let x = d.theta % (2*Math.PI)
		if (x<0) x+= 2*Math.PI
		return paint( x/(2*Math.PI))
	})
	
};

// the go function, this is bundled in simulation.js with the go function of
// the model, typically this is the iteration function of the model that
// is run in the explorable. It contains the code that updates the parts of the display
// panel as a function of the model quantities.

const go = (display,config) => {
	
	
	display.select("#origin").selectAll(".agent")
		.attr("cx",d=>X(d.x))
		.attr("cy",d=>Y(d.y))
//			.style("fill",d=>paint( (d.theta %   + Math.PI)/(2*Math.PI) % 1 ))
		.style("fill",d => {
			let x = d.theta % (2*Math.PI)
			if (x<0) x+= 2*Math.PI
			return paint( x/(2*Math.PI))
		})
	

//
}

// the update function is usually not required for running the explorable. Sometimes
// it makes sense to have it, e.g. to update the visualization, if a parameter is changed,
// e.g. a radio button is pressed, when the system is not running, e.g. when it is paused.

const update = go;


export {initialize,go,update}
