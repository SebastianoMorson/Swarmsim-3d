// the global properties of the explorable, widget geometries etc. depending on the choice and application
// you are free to define new variables and properties for later access and for setting up the explorable
// the only place this is needed is for setting up the interactions in setup_interactions.js and in
// controls.js

export default { 
	widgets:{
		slider_size: 360, //lunghezza dello slider
		slider_show: true,
		slider_gap : 1.5, //distanza tra uno slider e l'altro
		slider_anchor: {x:1,y:4.5},
		slider_girth: 10, //altezza dello slider (del rettangolo che rappresenta lo slider)
		slider_knob:14, //raggio della pallina dello slider
		
		adv_label:"Adv. settings",
		adv_slider_size: 200,
		adv_slider_show: false,
		adv_slider_gap : 1.25,
		adv_slider_anchor: {x:1,y:10},

		zoom_label:"zoom slider",
		zoom_slider_size: 200, //lunghezza dello slider
		zoom_slider_show: true,
		zoom_slider_gap : 1.5, //distanza tra uno slider e l'altro
		zoom_slider_anchor: {x:40,y:780},
		zoom_slider_girth: 8, //altezza dello slider (del rettangolo che rappresenta lo slider)
		zoom_slider_knob:10, //raggio della pallina dello slider


		toggle_anchor: {x:2,y:9}, //bottoni di advanced settings e freezing phase
		toggle_label_pos:"bottom",
		toggle_gap:3.5,
		toggle_size:12,

		viz_label:"2D/3D",
		viz_anchor: {x:750, y:75},
		viz_label_pos:"bottom",
		viz_size:12,

		freeze_label:"Freeze phase",
		freeze_anchor: {x:650, y:600},
		freeze_label_pos:"bottom",
		freeze_size:12,

		playbutton_size: 100,
		playbutton_anchor:{x:2.5,y:2},
		
		backbutton_anchor:{x:8.5,y:2},
		backbutton_label:"setup",
		backbutton_labelposition:"bottom",
		resetbutton_anchor:{x:6.5,y:2},
		resetbutton_label:"reset",
		resetbutton_labelposition:"bottom",
		
		perturbbutton_anchor:{x:10.5,y:2},
		perturbbutton_label:"perturb",
		perturbbutton_labelposition:"bottom",
		button_size:60,
		
		syncbutton_anchor:{x:11,y:4.5}, //bottone del reset
		syncbutton_size:30,

		likebutton_anchor:{x:11,y:6},
		likebutton_size:30,
		
		timebutton_anchor:{x:11,y:7.5},
		timebutton_size:30,

		probability_button_anchor:{x:11,y:9},
		probability_button_size:30,
		
		radio_anchor:{x:8,y:9.5}, // 7 bottone dei preset
		radio_size:110, //per modificare la distanza tra i bottoni
		radio_orientation:"vertical",
		radio_label_position:"right",
		radio_shape:"rect",

		radio_anchor_extra:{x:8,y:14}, // 7 bottone dei preset
		radio_size_extra:140, //per modificare la distanza tra i bottoni
		radio_orientation_extra:"vertical",
		radio_label_position_extra:"right",
		radio_shape_extra:"rect",

		radio_anchor_mem:{x:16, y:9.5},
		radio_size_mem:55, //per modificare la distanza tra i bottoni
		radio_orientation_mem:"vertical",
		radio_label_position_mem: "right",
		radio_shape_mem:"rect",

	},
	simulation: {
		delay:0,
		colormap:"vik"
	}
}