// this is just a collection of utility functions that are frequently used in some explorables

import * as d3 from "d3"
import {map, replace, capitalize, each, has, isBoolean, pickBy, toPairs, pick } from "lodash-es"
import styles from './d3-widgets/src/widgets.module.css'
import {select} from "d3";

const add_id_label = (x) => map(toPairs(x), d => {d[1]["id"]=d[0]; d[1]["label"]=replace(capitalize(d[0]),/_/g," ")} );


const change_label = function (list, olabel, nlabel){
	each(list, e => {
		if(e.label == olabel){
			e.label = nlabel;
		}
	});
};

const toArray = (x) => map(toPairs(x),d=>d[1]);

const add_widget = (p,w) => each(p,(v,i) => v["widget"]=w[i]);	

const get_variables = (p) => pickBy(p, v =>  has(v, "range"))  
const get_booleans = (p) => pickBy(p, v =>  isBoolean(v.default))  
const get_choices = (p) => pickBy(p, v =>  has(v, "choices"))  


const deg2rad = d3.scaleLinear().domain([0,360]).range([0,2*Math.PI]);
const rad2deg = d3.scaleLinear().range([0,360]).domain([0,2*Math.PI]);

const dist_3d = (a,b) => {
	const dx = (a.x-b.x);
	const dy = (a.y-b.y);
	const dz = (a.z - b.z);
	return Math.sqrt(dx*dx + dy*dy+dz*dz);
}

const dist_2d = (a,b) => {
	const dx = (a.x-b.x);
	const dy = (a.y-b.y);
	return Math.sqrt(dx*dx + dy*dy);
}

var selected = "default"
function reset_extra_presets(buttons) {
	select("#radio_extra_presets").selectAll("."+styles.symbol)
			.classed(styles.selected, false)
	selected = "default";
}

function reset_presets(buttons) {
	select("#radio_presets").selectAll("."+styles.symbol)
			.classed(styles.selected, false)
	selected = "extra";
}

export {toArray,add_id_label,change_label, selected, add_widget,get_variables,get_booleans,get_choices,deg2rad,rad2deg,dist_3d, dist_2d, reset_extra_presets, reset_presets}