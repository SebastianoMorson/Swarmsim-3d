// this connects the model and the visualization. For each we have three categories of events
// 1. initialization, 2. update, 3. iteration
// this is used by index.js, e.g. to initialize the explorable

import {initialize as model_init, update as model_update, go as model_go} from "./model.js"
import {init as init} from "./viz.js"

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


async function iterate (display,config) {
	model_go();
	//await sleep(1000);
	init();
	//visual_go(display,config);
};

async function initialize (display,config) {	
	console.log("maio");
	//await sleep(1000);
	console.log("bau");
	model_init();
	init();
	//visual_init(display,config); 
};

async function update (display,config) {
	model_update();
	//await sleep(1000);
	init();
	//visual_update(display,config);
}

export {iterate,initialize,update}
