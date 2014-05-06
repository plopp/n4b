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
  
  //google.setOnLoadCallback(drawChart);
    var id = Session.get('currentResourceGraphId');
    console.log(id);
    var datarr = [];
	  var curs = Plotdata.find({resourceId: id}, {sort:{datetime: 1}, limit: 30}); 
  //console.log("Plotdata.find({resourceId: "+id+"}, {sort:{datetime: 1}});");
  
  if(curs.count() > 0){
  	//datarr.push(['Timestamp',Resources.findOne(id).unit]);
  	curs.forEach(function (sample) {
  		datarr.push([new Date(sample.datetime),sample.value]);		
  	});
    
    /*var data = google.visualization.arrayToDataTable(datarr);

    var options = {
      title: 'Company Performance'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);*/
    console.log(datarr[0]);
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