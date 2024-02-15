// this contains information on the containers, the display and controls. It's essentially
// for the display and geometry of the explorable. An object like the one below can also
// be passed to the load() method defined in index.js.

export default {
	display_type:"svg", // either svg or canvas depending on explorable
	debug:false,  // if set to true, draws dots on the control panel to help widget placement
	controls_border:false,
	display_border:false,
	debug_lattice:"debug-grid-16",
	controls_grid:{nx:20,ny:20}, //12 12 regola il numero di elementi all'interno del box 
	display_size: {width:1100,height:1300}, //500 500
	controls_size: {width:800,height:900}, //480 480
	display_class:"fl w-100 w-50-ns pa2 ph3-ns",
	controls_class:"fl w-100 w-50-ns pa2 ph3-ns",
	container_class:"mw8 center cf"
}

