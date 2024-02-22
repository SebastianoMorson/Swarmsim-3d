import param from "./parameters.js"

const presets =  {
	"Static Sync":{J:0.1,K:1,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false},
	"Static Async":{J:0.1,K:-1,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false},
	"Static Phase Wave":{J:1,K:0,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false},
	"Splintered Phase Wave":{J:1,K:-0.1,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false},
	"Active Phase Wave":{J:1,K:-0.75,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false},

	
	"Rainbow Ring":{J:0.5,K:0,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false},
	"Dancing Circus":{J:0.93,K:-0.88,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false},
	"Schizo Wobble":{J:1.0,K:0.51,T:0.001,P:1,noise:0,varomega:0.8,zoom:1,adv:true},
	"Solar Convection":{J:0.1,K:1,T:0.001,P:1,noise:0,varomega:0.8,zoom:1,adv:true},
	"Makes Me Dizzy":{J:1.0,K:.51,T:0.001,P:1,noise:0,varomega:0.4439,zoom:1,adv:true},
	"Fractions":{J:1.0,K:-0.12,T:0.001,P:1,noise:0,varomega:0,zoom:1,adv:false}
}



export default (controls) => {
		const v = param.presets.widget.value();
		const ch = param.presets.choices;
		
		const parset = presets[ch[v]];
		param.synchronization_strength.widget.reset(controls,parset["K"]);
		param.like_attracts_like_strength.widget.reset(controls,parset["J"]);
		
		param.interaction_period.widget.reset(controls,parset["T"]);
		param.coupling_probability.widget.reset(controls, parset["P"]);
		param.wiggle.widget.reset(controls,parset["noise"]);
		param.frequency_variation.widget.reset(controls,parset["varomega"]);	
		param.zoom.widget.reset(controls,parset["zoom"]);
}
