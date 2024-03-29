import styles from './widgets.module.css'
import {select} from "d3";
import {randomId,textPosition} from "./utils.js"
import symbol from "./button-symbols.js"

export default (d,i) => {
	
	const id = "button_"+d.id();
	const lb = d.label();
	const lbpos = d.labelposition();
	 	
	const element = document.createElementNS("http://www.w3.org/2000/svg", "g");
 	
	const base = select(element).attr("class",styles.widget+" "+styles.button).attr("id", id)
		.attr("transform","translate("+d.x()+","+d.y()+")")
	
	var backbox ;

	if (d.shape()=="rect"){
		backbox = base.append("rect")
			.attr("width",d.size())
			.attr("height",d.size())
			.attr("transform","translate("+(-d.size()/2)+","+(-d.size()/2)+")")
			.attr("rx",5).attr("ry",5)
	} else {
		backbox = base.append("circle").attr("r",d.size()/2)	
	}

	backbox.attr("class",styles.background)
		.on("click", d.click )
		.on("mouseover",function(){
			select(this).classed(styles.lit,true);
			select(this.parentNode).select("."+styles.symbol).classed(styles.lit,true)
		})
		.on("mouseout",function(){select(this).classed(styles.lit,false);select(this.parentNode)
			.select("."+styles.symbol).classed(styles.lit,false)})
	base.append("path")
		.attr("d",symbol( d.actions()[ d.value() ]) ( d.symbolsize()*d.size() ) )
		.attr("class",styles.symbol)
	
	
	
	if (lb){

		const tp = textPosition(d.size(),d.size(),lbpos)
			base.append("text").text(lb)
				.attr("class", styles.label)
				.style("text-anchor",tp.anchor)
				.style("font-size",d.fontsize())
				.style("alignment-baseline",tp.valign)
				.attr("transform", "translate(" + (tp.x) + "," + (tp.y) + ")")
		}

 	return element;
}

