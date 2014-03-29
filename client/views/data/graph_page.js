Template.graphPage.helpers({
	rescount : function(){
		return Resources.find().count();
	}
});

Template.graphPage.rendered = function(){

  //console.log("rendered");
  
  // var datarr = [];
  // var rescurs = Resources.find({}, {fields: {title: 1, unit: 1}});
  // var titelarr = [];
  // titelarr.push('Timestamp');
  
  // rescurs.forEach(function(res){
    // var hasPlotData = Plotdata.find({resourceId: res._id}).count() > 0;
	// if(Plotdata.find({resourceId: res._id}).count() > 0){
		// titelarr.push(res.title +" ["+res.unit+"]");
	// }
  // });
  // console.log(titelarr);
  // datarr.push(titelarr);
  // i = 0;
  // var rescurs = Resources.find({}, {fields: {title: 1, unit: 1}});
  // rescurs.forEach(function(res){
	 // var id = res._id;    
	 // var curs = Plotdata.find({resourceId: id}, {sort: {datetime: 1}});
	 // var temparr = [];
	 // console.log(curs.count());
	 // if(curs.count() > 0){
		 // curs.forEach(function (sample) {
			 // if(temparr.length == 0) temparr.push(new Date(sample.datetime));
			 // temparr.push(sample.value);		
		 // });
		 // datarr.push(temparr);
	 // }    
  // });
  // var options = {
      // title: 'Company Performance'
    // };
  // var data = google.visualization.arrayToDataTable(datarr);
  // var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  // chart.draw(data, options); 
}