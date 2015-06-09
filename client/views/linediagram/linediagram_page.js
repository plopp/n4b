Template.lineDiagramPage.helpers({
	getValue : function(plcvar){
		//return plcvar;
      	var ret = Resources.findOne({plcVar: plcvar});
      	if(ret !== undefined){
      		return sprintf("%.1f °",ret.value);;
      	}
      	else{
      		return "N/A °";
      	}
  	},
  	getFlow : function(plcvar){
		//return plcvar;
      	var ret = Resources.findOne({plcVar: plcvar});
      	if(ret !== undefined){
      		return sprintf("%.2f m³/h",ret.value);
      	}
      	else{
      		return "N/A  m³/h";
      	}
  	}
});

Template.lineDiagramPage.onRendered(function() {
	//$("#svgcontainer").svg({loadURL: '/img/Principscheman.svg',onLoad: drawIntro});
	
});

function drawIntro(svg) { 
	// svg.circle(130, 75, 50, {fill: 'none', stroke: 'red', strokeWidth: 3});
	// var text1 = svg.text(250, 215, '13°', {fill: 'black', id:"vmm1"});
	// $("#vmm1").text(Session.get("vmm1rettemp"));
}