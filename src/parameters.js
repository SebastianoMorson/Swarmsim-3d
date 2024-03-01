// this object defines the parameters of the model
// - constants
// - variables (connected to sliders) properties range and default
// - choices (connected to radios) properties choices and default
// - switches (connected to toggles) property default
// utils.js provides methods for extracting various types of parameters for later use

export default {
		dt:0.1,	//velocità
		N:300,
		
		agentsize: 5.0,
		L:1.2, //1.3			//rappresenta ...
		omega:1.0,		 	
		
		synchronization_strength: {
			range:[-1,1],
			default:0.51
		},
		
		like_attracts_like_strength: {
			range:[-1,1],
			default:1
		},
		zoom:{
			range : [1,10],
			default : 1
		},
		
		interaction_period:{
			range:[0.001,1],
			default:0.01
		},

		coupling_probability:{
			range:[0,1],
			default:0.1
		},

		wiggle:{
			range : [0,0.05],
			default : 0
		},

		frequency_variation:{
			range : [0,1],
			default : 0.4439
		},
		
		presets : {
			choices:[
				"Static Sync",
				"Static Async",
				"Static Phase Wave",
				"Splintered Phase Wave",
				"Active Phase Wave",		
			],
			default: 0
		},

		extra_presets :{
			choices:[
				"Makes Me Dizzy",
				"Fractions",
				"Rainbow Ring",
				"Dancing Circus",
				"Schizo Wobble",
				"Solar Convection",				
			],
			default: 0
		},

		memory_initialization : {
			choices:[
				"All zero",
				"Sthocastic values",
				"True values",
				"Gradual approach"
			],
			default:0
		},
	
		viz_switch:{
			label:"2D/3D",
			default: true
		},

		freeze_phase: {
			default: false
		},
		advanced_settings: {
			default: false
		},
		
		
		

}


