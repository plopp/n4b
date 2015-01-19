Template.graphItem.helpers({
	resource : function(){
		var id = Session.get('currentResourceGraphId');
		return Resources.findOne(id,{fields: {value: 1,title: 1}});		
	},
  ppdata : function(){
    var id = Session.get('currentResourceGraphId');
    var nof = Plotdata.find({resourceId: id}).count(); 
    return nof;
  }
});

Template.graphItem.rendered = function(){
  
	var endkey = new Date().getTime()-3600*1000*24;
	drawChart(endkey);
  //console.log("Plotda  ta.find({resourceId: "+id+"}, {sort:{datetime: 1}});");
  
  
  
}

var drawChart = function(endkey){
	var datarr = []; 
	var id = Session.get('currentResourceGraphId');
	console.log(id);    
	var res = Resources.findOne(id);
	if(res){
		HTTP.call("GET","http://10.90.0.1:5984/n4b/_design/unit/_view/"+res.plcVar+"?descending=true&endkey="+endkey, function(error,result){
			if(result){
				var data = JSON.parse(result.content);			
				var data = data.rows;
				if(data.length > 0){
					data.forEach(function (sample) {
						datarr.push([new Date(sample.key),sample.value]);		
					});
					
					datarr.reverse();
					
					
					var g2 = new Dygraph(
							  document.getElementById("graphdiv"),
							  datarr, // path to data/CSV file
							  {animatedZooms: true}          // options
							);
							
				}
				else{
					$("#chart_div").text("Data missing...");
				}
			}
			else if(error){
				$("#chart_div").text("Data error...");
			}
		});
	}
}

Template.graphItem.events({
	'click #year' : function(evt){
		console.log("Year");
		drawChart(new Date().getTime()-3600*1000*24*365);
	},
	'click #month' : function(evt){
		console.log("Month");
		drawChart(new Date().getTime()-3600*1000*24*31);
		
	},
	'click #week' : function(evt){
		console.log("Week");
		drawChart(new Date().getTime()-3600*1000*24*7);
	},
	'click #24hr' : function(evt){
		console.log("24h");
		drawChart(new Date().getTime()-3600*1000*24);
	}
});