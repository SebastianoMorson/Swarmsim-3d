// this connects the model and the visualization. For each we have three categories of events
// 1. initialization, 2. update, 3. iteration
// this is used by index.js, e.g. to initialize the explorable

import {initialize as model_init, update as model_update, go as model_go} from "./model.js"
import {init as init} from "./viz.js"


function iterate (display,config) {
	model_go();
	init();
	//visual_go(display,config);
};

function initialize (display,config) {	

	model_init();
	init();
	//visual_init(display,config); 
};

function update (display,config) {
	model_update();
	init();
	//visual_update(display,config);
}

export {iterate,initialize,update}
