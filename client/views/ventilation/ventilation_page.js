Template.ventilationPage.helpers({
	  getValue : function(plcvar){
		//return plcvar;
      	var ret = Resources.findOne({plcVar: plcvar});
      	if(ret !== undefined){
      		return sprintf("%.1f °",ret.value);;
      	}
      	else{
      		return "N/A °";
      	}
  	}
});

Template.ventilationPage.events = {
  
}

Template.ventilationPage.onRendered(function() {

});