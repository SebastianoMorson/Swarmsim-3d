// this connects the model and the visualization. For each we have three categories of events
// 1. initialization, 2. update, 3. iteration
// this is used by index.js, e.g. to initialize the explorable

import {initialize as model_init_3d, update as model_update_3d, go as model_go_3d} from "./model_3d.js"
import {init as init_3d, destroy_plot as destroy_3d} from "./viz_3d.js"
import {initialize as model_init, update as model_update, go as model_go} from "./model_2d.js"
import {initialize as visual_init, update as visual_update, go as visual_go, destroy_plot as destroy_2d} from "./viz_2d.js"

import {mode} from "./setup_interactions.js"
import { geoInterpolate } from "d3";
var last_mode = false;

function iterate (display,config) {
	var change = mode == last_mode;
	if(change){
		if(mode){
			model_go_3d();
			init_3d();
		}else{
			
			model_go();
			visual_go(display,config);
		}
	}else{
		last_mode = mode;
		

		if(mode){
			destroy_2d(display);
			initialize(display, config)
			model_go_3d();
		}else{
			destroy_3d();
			initialize(display, config)
			model_go();
		}
	}
	
};

function initialize (display,config) {	
	destroy_3d();
	
	if(mode){
		console.log("mode 3d");
		console.log("model 3d initialize ...");
		model_init_3d();
		init_3d();
		console.log("...model initialization finished");
	}else{
		destroy_3d();
		console.log("mode 2d");
		model_init();
		visual_init(display,config); 
	}

	//visual_init(display,config); 
};

function update (display,config) {
	var change = mode == last_mode;
	if(change){
		if(mode){
			model_update_3d();
			init_3d();
		}else{
			destroy_3d();
			initialize(display, config);
			model_update();
			visual_update(display,config);
		}
	}else{
		last_mode = mode;
		if(mode){
			destroy_2d(display);
			initialize(display, config)
			model_update_3d();
			
		}else{
			destroy_3d();
			initialize(display, config);
			model_update();
			visual_update(display,config);
		}
	}
	
	}

export {iterate,initialize,update}

