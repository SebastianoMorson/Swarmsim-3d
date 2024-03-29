// this sets up the container for the explorable, including the display panel and the controls panel
// this function really needs not to be touched and is fairly identical for all explorables
// it's only used by index.js for setting up the container as a first step.

import * as d3 from "d3";
import * as widgets from "./d3-widgets/";
import * as d3d from "d3-3d";
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
  


export default (container_id,config)=>{


	//questo controlla la griglia dei comandi
	const grid = widgets.grid(
			config.controls_size.width,
			config.controls_size.height,
			config.controls_grid.nx, 
			config.controls_grid.ny
		);

	

	const container = d3.select("#"+container_id).classed(config.container_class,true)
	

	//questa porzione gestisce il display dei punti
	const display = container.append("div")
		.attr("id","display")
		.attr("class","display-panel")
		.classed(config.display_class,true)
		.classed(config.debug_lattice,config.debug)
		.append(config.display_type)
		.attr("width",config.display_type=="canvas" ? config.display_size.width : null)
		.attr("height",config.display_type=="canvas" ? config.display_size.height : null)
		.attr("viewBox",config.display_type=="canvas" ? null: "0 0 "+config.display_size.width+" "+config.display_size.height)	
		.style("width","100%")
	//*/

	const controls = container.append("div")
		.attr("id","controls")
		.attr("class","control-panel")
		.classed(config.controls_class,true)
		.classed(config.debug_lattice,config.debug)
		.append("svg")
		.attr("viewBox", "0 0 "+config.controls_size.width+" "+config.controls_size.height)


	container.append("text").append("text")
	.text("Original Brockmann's project can be found here: https://www.complexity-explorables.org/explorables/swarmalators/")
	.attr("x", -20)
	.attr("y", -10)

	if (config.controls_border){
		controls.append("rect").attr("class","border")
		.attr("width",config.controls_size.width)
		.attr("height",config.controls_size.height)
	}
	
	if (config.display_border){
		if (config.display_type=="svg"){
		display.append("rect").attr("class","border")
		.attr("width",config.display_size.width)
		.attr("height",config.display_size.height)
		} else {			
			const ctx = display.node().getContext("2d");
			ctx.strokeStyle = "black";
			ctx.strokeRect(0, 0, config.display_size.width, config.display_size.height);
		}
	}

	//config.debug deve essere a false se voglio che non si vedano i puntini
	if (config.debug){		
		controls.selectAll(".grid").data(grid.points).enter().append("circle").attr("r",2)
			.attr("transform",d=>"translate("+d.x+","+d.y+")")
			.style("fill","red")	
	}
	
	

return { display:display, controls:controls, grid: grid }


	
}




