// this sets up the controls in the control panel
// it adds the widgets to the container and generates attaches the widget to the 
// variables and parameters defined in parameters.js

import * as widgets from "d3-widgets"

import {range,map,toPairs,take,takeRight,concat,each} from "lodash-es"

import cfg from "./config.js"
import parameters from "./parameters.js"
import preset_parameters from "./presets.js"
import {toArray,add_id_label,add_widget,get_variables,get_booleans,get_choices} from "./utils.js"


// defined variables for variables, booleans and choices, extracting the information from parameters.js

const all_variables = get_variables(parameters);
const booleans = get_booleans(parameters);

const choices = get_choices(parameters);
// adding ids and labels to the variables based on names for the variables, see utils.js for the function add_id_label

add_id_label(all_variables)
add_id_label(booleans)
add_id_label(choices)

// making arrays for the three types of parameters

const all_va = toArray(all_variables);
const va = take(all_va,2) //se metto 3 mi mostra anche il terzo slider, mi sa che regola il numero di slider
const zoom_slid = [all_va[2]];
const adv_va = takeRight(all_va,4);

var bo = toArray(booleans,2);
const viz_bo = [bo[0]];
console.log(viz_bo);
bo = takeRight(bo, 2);
const ch = toArray(choices);

// making the slider widgets objects, based on the variables

const sliders = map(va,
		v => widgets.slider()
					.id(v.id)
					.label(v.label)
					.range(v.range)
					.value(v.default)
					.size(cfg.widgets.slider_size)
					.girth(cfg.widgets.slider_girth)
					.knob(cfg.widgets.slider_knob)
					.show(true)
		);



const adv_sliders = map(adv_va,
	v => widgets.slider()
			.id(v.id)
			.label(v.label)
			.range(v.range)
			.value(v.default)
			.size(cfg.widgets.adv_slider_size)
			.show(true)
	);


const zoom_slider = map(zoom_slid,
		v => widgets.slider()
					.id(v.id)
					.label(v.label)
					.range(v.range)
					.value(v.default)
					.size(cfg.widgets.zoom_slider_size)
					.girth(cfg.widgets.zoom_slider_girth)
					.knob(cfg.widgets.zoom_slider_knob)
					.position(cfg.widgets.zoom_slider_anchor)
					.show(true)
		);

// making the toggle widgets objects, based on the switches
		
const toggles = map(bo, 
		v => widgets.toggle()
					.id(v.id)
					.label(v.label)
					.value(v.default)					
		);
		
toggles[1].label(cfg.widgets.adv_label)

const viz_switch = map(viz_bo, 
	v => widgets.toggle()
				.id(v.id)
				.label(v.label)
				.value(v.default)					
	);
viz_switch[0].label(cfg.widgets.viz_label);
// making the radio widgets objects, based on the choices
		
const radios = map(ch, 
		v => widgets.radio()
					.choices(v.choices)
					.id(v.id)
					.value(v.default)
					.orientation(cfg.widgets.radio_orientation)
					.labelposition(cfg.widgets.radio_label_position)
		);


// you can remove some of these, if the explorable doesn't have a subset of parameters,
// e.g. if the explorable doesn't need toggles, you can remove all the toggle stuff


// this is handy, because the actual widgets are connected to the associated parameters
// this is important, if one wants to access the widgets based on parameters.
		
add_widget(bo,toggles);
add_widget(va,sliders);
add_widget(adv_va,adv_sliders);
add_widget(zoom_slid, zoom_slider);
add_widget(ch,radios);

add_widget(viz_bo, viz_switch);

// This is generic for many explorables, the action buttons, play/pause, back and rewind
// there are some explorables that have different buttons, so one needs to code this here.

const go = widgets.button().actions(["play","pause"])
const setup = widgets.button().actions(["back"])
const reset = widgets.button().actions(["rewind"])
const perturb = widgets.button().actions(["push"])
const reset_sync = widgets.button().actions(["rewind"])
const reset_like = widgets.button().actions(["rewind"])
//modified
//const reset_time = widgets.button().actions(["rewind"])
//const reset_probability = widgets.button().actions(["rewind"])

// all the buttons in an array
		
const buttons = [go,setup,reset,perturb,reset_sync,reset_like]; //reset_like, reset_N];

// here's the important function accessible to the outside, there's flexibility on how
// to code this. bottomline is that all the widgets get attached to the controls panel,
// that is provided as an argument. the grid object is also passed, which makes it easier
// to place the widgets on the grid. The positional stuff here needs to be adapted
// to the needs of the explorable

export default (controls,grid)=>{

	const sl_pos=grid.position(cfg.widgets.slider_anchor.x,range(sliders.length)
			.map(x=>(cfg.widgets.slider_anchor.y+cfg.widgets.slider_gap*x)));
	
	const adv_sl_pos=grid.position(cfg.widgets.adv_slider_anchor.x,range(adv_sliders.length)
			.map(x=>(cfg.widgets.adv_slider_anchor.y+cfg.widgets.adv_slider_gap*x)));
	
	

	//const zoom_sl_pos = grid.position(cfg.widgets.zoom_slider_anchor.x,range(zoom_slider.length)
	//		.map(x=>(cfg.widgets.zoom_slider_anchor.y+cfg.widgets.zoom_slider_gap*x)));

	const tg_pos=grid.position(range(toggles.length)
			.map(x=>(cfg.widgets.toggle_anchor.x+cfg.widgets.toggle_gap*x)),cfg.widgets.toggle_anchor.y);
	
	const ra_pos=grid.position(cfg.widgets.radio_anchor.x,cfg.widgets.radio_anchor.y);		
	const ra_pos_mem = grid.position(cfg.widgets.radio_anchor_mem.x, cfg.widgets.radio_anchor_mem.y);

	sliders.forEach((sl,i) => sl.position(sl_pos[i]));

	adv_sliders.forEach((sl,i) => sl.position(adv_sl_pos[i]));
	//zoom_slider.position = zoom_sl_pos[0];

	toggles.forEach((tg,i) => tg.position(tg_pos[i]).labelposition(cfg.widgets.toggle_label_pos));
	viz_switch.forEach((tg,i) => tg.position(cfg.widgets.viz_anchor).labelposition(cfg.widgets.viz_label_pos));

	radios[0].position(ra_pos)
		.size(cfg.widgets.radio_size).shape(cfg.widgets.radio_shape)

	radios[1].position(ra_pos_mem)
		.size(cfg.widgets.radio_size_mem).shape(cfg.widgets.radio_shape_mem);
	

	
	go.position(grid.position(cfg.widgets.playbutton_anchor.x,cfg.widgets.playbutton_anchor.y))
		.size(cfg.widgets.playbutton_size);
	
	reset.position(grid.position(cfg.widgets.backbutton_anchor.x,cfg.widgets.backbutton_anchor.y))
		.size(cfg.widgets.button_size);
	
	setup.position(grid.position(cfg.widgets.resetbutton_anchor.x,cfg.widgets.resetbutton_anchor.y))
		.size(cfg.widgets.button_size);
	
	perturb.position(grid.position(cfg.widgets.perturbbutton_anchor.x,cfg.widgets.perturbbutton_anchor.y))
		.size(cfg.widgets.button_size)
		.label(cfg.widgets.perturbbutton_label)
		.labelposition(cfg.widgets.perturbbutton_labelposition);
		
	reset_sync.position(grid.position(cfg.widgets.syncbutton_anchor.x,cfg.widgets.syncbutton_anchor.y))
		.size(cfg.widgets.syncbutton_size);
	
	reset_like.position(grid.position(cfg.widgets.likebutton_anchor.x,cfg.widgets.likebutton_anchor.y))
		.size(cfg.widgets.likebutton_size);
	
	//reset_time.position(grid.position(cfg.widgets.timebutton_anchor.x, cfg.widgets.timebutton_anchor.y))
	//	.size(cfg.widgets.timebutton_size);

	//reset_probability.position(grid.position(cfg.widgets.probability_button_anchor.x, cfg.widgets.probability_button_anchor.y))
	//	.size(cfg.widgets.probability_button_size);
	
	
	controls.selectAll(".slider").data(concat(sliders,adv_sliders, zoom_slider)).enter().append(widgets.widget);
	controls.selectAll(".toggle").data(toggles).enter().append(widgets.widget);
	controls.selectAll(".toggle").data(viz_switch).enter().append(widgets.widget);
	
	controls.selectAll(".button").data(buttons).enter().append(widgets.widget);
	controls.selectAll(".radio").data(radios).enter().append(widgets.widget)
	

	each(adv_sliders,s=>{
		controls.select("#slider_"+s.id()).style("opacity",parameters.advanced_settings.widget.value()?1:0)
	})
	
	const slider_zero_pos=grid.position(5.5,[6,4.5])

	controls.selectAll(".slider_zeros").data([0,1]).enter().append("circle")
		.attr("r",3)
		.attr("cx",d=>slider_zero_pos[d].x)
		.attr("cy",d=>slider_zero_pos[d].y)
	
	preset_parameters(controls)
	
	
}

// here are all the exported objects, all the parameters, their associated widgets and the action buttons

export {sliders,adv_sliders, toggles, zoom_slider, viz_switch, radios,go,setup,reset,perturb,all_variables,booleans,choices,reset_sync,reset_like} //reset_like, reset_time, reset_probability


