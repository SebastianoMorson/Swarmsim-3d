// this is a module that contains most of the explorable specific code
// the "math" of the explorable, the model itself, without the elements
// of visualization which are done in viz.js

import param from "./parameters.js"
import {each,range,map,mean,meanBy,maxBy,minBy} from "lodash-es"
import {dist} from "./utils"
import {randomNormal} from "d3"

const L = param.L;
const dt = param.dt;
const rd = randomNormal(0,1);
const ddt = Math.sqrt(dt);

// typically objects needed for the explorable
// are defined here

var agents = [];
var agents_shared = [];
var mem_not_initialized = [];
var old_time = new Date();
var current_time = 0;
var prob = new Array(100).fill(0);



	
// the initialization function, this is bundled in simulation.js with the initialization of
// the visualization and effectively executed in index.js when the whole explorable is loaded

const initialize = () => {
	
	console.log("Initialized");

	// set/reset timer
	param.timer={}; param.tick=0;
	
	mem_not_initialized = range(param.N).map(i => {
		let theta = 2*Math.PI*Math.random();
		  return {
			index: i,
			x: 2*param.L*(Math.random()-0.5),
			y: 2*param.L*(Math.random()-0.5),  
			vx : Math.cos(theta),
			vy : Math.sin(theta),  
			dx : 0,
			dy : 0,
			omega:param.omega,
			domega:rd(),
			theta: Math.random()*2*Math.PI,
			dtheta : 0,
			last_update: new Date()
		  };
	});	


	agents = range(param.N).map(i => {
		let theta = 2*Math.PI*Math.random();
		  return {
		    index: i,
			x: 2*param.L*(Math.random()-0.5),
			y: 2*param.L*(Math.random()-0.5),  
			vx : Math.cos(theta),
			vy : Math.sin(theta),  
			dx : 0,
			dy : 0,
			omega:param.omega,
			domega:rd(),
			theta: Math.random()*2*Math.PI,
			dtheta : 0,
			memory: Array.from(mem_not_initialized),
			last_update: new Date()
		  };
	});
	//initialize the memory
	
	var choice = param.memory_initialization.widget.value();

	switch (choice){
		
		case 0: //zero values
			each (agents, n => {
			n.memory = range(param.N).map(i => {
			let theta = 2*Math.PI*Math.random();
			  return {
				index: i,
				x: 0*2*param.L*(Math.random()-0.5),
				y: 0*2*param.L*(Math.random()-0.5),  
				vx : Math.cos(theta),
				vy : Math.sin(theta),  
				dx : 0,
				dy : 0,
				omega:param.omega,
				domega:rd(),
				theta: Math.random()*2*Math.PI,
				dtheta : 0,
				last_update: new Date()
			  };
			})});
			break;
			
		case 1: //stochastic value
			each (agents, n => {
				n.memory = range(param.N).map(i => {
				let theta = 2*Math.PI*Math.random();
				  return {
					index: i,
					x: 0*2*param.L*(Math.random()-0.5),
					y: 0*2*param.L*(Math.random()-0.5),  
					vx : Math.cos(theta),
					vy : Math.sin(theta),  
					dx : 0,
					dy : 0,
					omega:param.omega,
					domega:rd(),
					theta: Math.random()*2*Math.PI,
					dtheta : 0,
					last_update: new Date()
				  };
			})});
			break;	
		case 2: //true values
			each (agents, n => {
				n.memory = agents;
			});	
			break;
		case 3: //Gradual approach is like zero values for the moment
			each (agents, n => {
			agents.memory = range(param.N).map(i => {
				let theta = 2*Math.PI*Math.random();
				  return {
					index: i,
					x: 0*2*param.L*(Math.random()-0.5),
					y: 0*2*param.L*(Math.random()-0.5),  
					vx : Math.cos(theta),
					vy : Math.sin(theta),  
					dx : 0,
					dy : 0,
					omega:param.omega,
					domega:rd(),
					theta: Math.random()*2*Math.PI,
					dtheta : 0,
					last_update: new Date()
				  };
			})});	
			break;
	}
	
	//console.log("ciao: ",agents);
	const mvx = meanBy(agents,d=>d.vx)
	const mvy = meanBy(agents,d=>d.vy)
	const mvx_shared = meanBy(agents_shared,d=>d.vx)
	const mvy_shared = meanBy(agents_shared,d=>d.vy)
	
	each(agents,d=>{ d.vx-=mvx; d.vy-=mvy;})
	each(agents_shared,d=>{ d.vx-=mvx_shared; d.vy-=mvy_shared;})
};

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
	  // Genera un indice casuale compreso tra 0 e i
	  var randomIndex = Math.floor(Math.random() * (i + 1));
  
	  // Scambia gli elementi con l'indice casuale
	  var temp = array[i];
	  array[i] = array[randomIndex];
	  array[randomIndex] = temp;
	}
  }

function getRandomElement(array) {
	// Genera un indice casuale compreso tra 0 e la lunghezza dell'array - 1
	var randomIndex = Math.floor(Math.random() * 99);
  
	// Restituisci l'elemento corrispondente all'indice casuale
	return array[randomIndex];
}


function generateRandomArray(prob, P){
	prob.fill(0);
	// Imposta a 1 i valori per gli ultimi 70 elementi del vettore
	for (var i = Math.floor(P*100); i < 100; i++) {
	prob[i] = 1;
	}
	shuffleArray(prob);
	return prob
}



// the go function, this is bundled in simulation.js with the go function of
// the visualization, typically this is the iteration function of the model that
// is run in the explorable.

const go  = () => {

	current_time = new Date();
	param.tick++;
	const T = param.interaction_period.widget.value();
	const phasemod = param.freeze_phase.widget.value() ? 0 : 1;
	const varomega = param.frequency_variation.widget.value();
	const J = param.like_attracts_like_strength.widget.value();
	const K = param.synchronization_strength.widget.value();
	const P = param.coupling_probability.widget.value();
	const sigma = param.wiggle.widget.value();
	var share_info = false;

	
	//console.log(P);
	prob = generateRandomArray(prob, P);
	//console.log(prob);

	each(agents,n=>{
		//console.log(share_info);
		
		n.dtheta = n.omega*phasemod+varomega*n.domega;
		each(n.memory,m=>{
			//console.log(share_info);
			//console.log(K);
			if (n.index!=m.index){
				let d = dist(n,m);
				let kernel = (1+J*Math.cos(m.theta-n.theta)/d - 1.0/(d*d))/param.N;
				n.dx += (m.x-n.x)*kernel;
				n.dy += (m.y-n.y)*kernel;
				n.dtheta += K/param.N*Math.sin(m.theta-n.theta)/d;
			}	
		})
		n.dx*=param.dt;
		n.dy*=param.dt;
		n.dtheta*=param.dt;
	})//})

	each(agents,n=>{
		n.x+=n.dx+ddt*sigma*(Math.random()-0.5);
		n.y+=n.dy+ddt*sigma*(Math.random()-0.5);
		n.theta+=n.dtheta;
		
		share_info = getRandomElement(prob)==0 ;
		//console.log(share_info);
		if(((new Date() - n.last_update)/1000 >= T) || (share_info)){	
			each (agents, m=>{
				m.memory[n.index].x = n.x;
				m.memory[n.index].y = n.y;
				m.memory[n.index].theta = n.theta;
				m.memory[n.index].last_update = new Date();
				})
		
		n.last_update = new Date();
	}})

	

	//}
	
	
//	console.log(maxBy(agents,a=>a.theta).theta)
//	console.log(minBy(agents,a=>a.theta).theta)	

}

// the update function is usually not required for running the explorable. Sometimes
// it makes sense to have it, e.g. to update the model, if a parameter is changed,
// e.g. a radio button is pressed. 

const update = () => {
	
	each(agents,n=>{
		n.theta+=0.25*Math.PI*2*(Math.random()-0.5) % (2*Math.PI)
		let w = 2*Math.PI*Math.random()
		n.x+=0.01*Math.cos(w);
		n.y+=0.01*Math.sin(w);
		n.last_update = new Date();
		each (agents, m=>{
			m.memory[n.index].x = n.x;
			m.memory[n.index].y = n.y;
			m.memory[n.index].theta = n.theta;
			m.memory[n.index].last_update = new Date();
		})
	})

	console.log("Update");

}

// the three functions initialize, go and update are exported, also all variables
// that are required for the visualization
export {agents,initialize,go,update}
