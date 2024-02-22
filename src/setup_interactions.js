// here all functions are connected to the widgets, these functions can be defined here, like the 
// startstop function connected to the go button, or they can be functions defined elsewhere,
// like the initialization functions, or reset parameter functions. Regardless, here
// all functions that need to be execuded for example if a controls element is modified, are connected
// to the update() method of an widget object. See below.


import {interval,select} from "d3"
import {each} from "lodash-es"
import * as ct from "./controls.js"
import cfg from "./config.js"
import param from "./parameters.js"
import preset_parameters from "./presets.js"
import resetparameters from "./reset_parameters.js"
import {iterate,initialize,update} from "./simulation.js"


var timer = {}

// this defines a startstop simulation function that execute the function iterate() that is defined in simulation.js
// it also uses information defined in config.js, in this case the delay time between iteration steps.

const startstop = (display,config) => {
	ct.go.value() == 1 ? timer = interval(()=>iterate(display,config),cfg.simulation.delay) : timer.stop()

}

// this function is called by index.js to connect actions and update functions to the explorables.
// once this is called, all widgets are usable in the controls panel

export default (display,controls,config) => {
	
	ct.reset.update(()=>resetparameters(controls))	// one button gets the resetparameters() method defined in resetparameters.js
	ct.go.update(()=>startstop(display,config)) // one button gets the startstop function defined above
	ct.setup.update(()=>initialize(display,config)) // this once gets the initialize() method defined in simulation.js
	ct.perturb.update(()=>update(display,config))
	ct.reset_sync.update(()=>{
		param.synchronization_strength.widget.reset(controls,0)
	})
	
	ct.reset_like.update(()=>{
		param.like_attracts_like_strength.widget.reset(controls,0)
	})
	
	//ct.reset_time.update(()=>{
	//	param.interaction_period.widget.reset(controls,0.5)
	//})

	//ct.reset_probability.update(()=>{
	//	param.coupling_probability.widget.reset(controls,1)
	//})


	param.presets.widget.update(() => preset_parameters(controls))
	
	param.zoom.widget.update(()=>{
		each(ct.zoom_slider, s =>{
			controls.select("#slider_"+s.id()).transition(1000);
		})
	})
	param.advanced_settings.widget.update(()=>{
		each(ct.adv_sliders,s=>{
			controls.select("#slider_"+s.id()).transition(1000).style("opacity",param.advanced_settings.widget.value()?1:0)
		})
	})
	
}

