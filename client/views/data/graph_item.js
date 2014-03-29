Template.graphItem.helpers({
	resource : function(){
		var id = Session.get('currentResourceGraphId');
		return Resources.findOne(id,{fields: {value: 1,title: 1}});		
	}
});

Template.graphItem.rendered = function(){
  //google.setOnLoadCallback(drawChart);
  //console.log("Rendered graph");
    var id = Session.get('currentResourceGraphId');
    var datarr = [];
	var curs = Plotdata.find({resourceId: id}, {sort:{datetime: 1}});
	datarr.push(['Timestamp',Resources.findOne(id).unit]);
	curs.forEach(function (sample) {
		datarr.push([new Date(sample.datetime),sample.value]);		
	});
    var data = google.visualization.arrayToDataTable(datarr);

    var options = {
      title: 'Company Performance'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}