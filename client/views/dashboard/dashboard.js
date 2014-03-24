Template.dashboard.rendered = function(){

data = [32, 57, 112, 293];


	var svg = d3.select("#chart").append("svg:svg");

	svg.selectAll("rectangle")
    .data(data)
  .enter().append("rectangle")
    .attr("cy", 90)
    .attr("cx", String)
    .attr("width", Math.sqrt)
    .attr("width", Math.sqrt);


var nofDaysBack = function(days){
	var today = new Date();
	var seeking = today.getTime() - days*24*3600*1000;
	var result = new Date(seeking).getDay();
	switch(result){
		case 0:
			return "Sunday";
		case 1:
			return "Monday";
		case 2:
			return "Tuesday";
		case 3:
			return "Wednesday"
		case 4:
			return "Thursday";
		case 5:
			return "Friday";
		case 6:
			return "Saturday";

	}
}

/* plcVar decides which resource should be picked from the Resource collection and div is used to scale the value*/
/*
var dataHistory = function(plcVar, div){
	var today = new Date();
	var sunResource = Resources.find({plcVar: plcVar}).fetch()[0];
	plotDataSun1 = Plotdata.find({resourceId: sunResource._id, datetime: {$gte: (today.getTime()-24*3600*1000*1) }}).fetch();
	plotDataSun2 = Plotdata.find({resourceId: sunResource._id, datetime: {$gte: (today.getTime()-24*3600*1000*2), $lt: (today.getTime()-24*3600*1000*1)}}).fetch();
	plotDataSun3 = Plotdata.find({resourceId: sunResource._id, datetime: {$gte: (today.getTime()-24*3600*1000*3), $lt: (today.getTime()-24*3600*1000*2)}}).fetch();
	plotDataSun4 = Plotdata.find({resourceId: sunResource._id, datetime: {$gte: (today.getTime()-24*3600*1000*4), $lt: (today.getTime()-24*3600*1000*3)}}).fetch();
	plotDataSun5 = Plotdata.find({resourceId: sunResource._id, datetime: {$gte: (today.getTime()-24*3600*1000*5), $lt: (today.getTime()-24*3600*1000*4)}}).fetch();
	plotDataSun6 = Plotdata.find({resourceId: sunResource._id, datetime: {$gte: (today.getTime()-24*3600*1000*6), $lt: (today.getTime()-24*3600*1000*5)}}).fetch();
	plotDataSun7 = Plotdata.find({resourceId: sunResource._id, datetime: {$gte: (today.getTime()-24*3600*1000*7), $lt: (today.getTime()-24*3600*1000*6)}}).fetch();

	var i = 0;

	var sum1 = 0;
	var dataSum1 = 0;
	if(plotDataSun1.length > 0){
		for (i = 0; i < plotDataSun1.length; i++) {
			sum1 += parseFloat(plotDataSun1[i].value);
		};
		dataSum1 = sum1/i/div;
	}
	else{
		dataSum1 = 0.7+0.1*Math.random();
	}
	var dataSum2 = 0;
	if(plotDataSun2.length > 0){
		var sum2 = 0;
		for (i = 0; i < plotDataSun2.length; i++) {
			sum2 += parseFloat(plotDataSun2[i].value);
		};
		dataSum2 = sum2/i/div;
	}
	else{
		dataSum2 = 0.7+0.1*Math.random();
	}

	var dataSum3 = 0;
	if(plotDataSun3.length > 0){
		var sum3 = 0;
		for (i = 0; i < plotDataSun3.length; i++) {
			sum3 += parseFloat(plotDataSun3[i].value);
		};
		dataSum3 = sum3/i/div;
	}
	else{
		dataSum3 = 0.7+0.1*Math.random();
	}
	var dataSum4 = 0;
	if(plotDataSun4.length > 0){
		var sum4 = 0;
		for (i = 0; i < plotDataSun4.length; i++) {
			sum4 += parseFloat(plotDataSun4[i].value);
		};
		dataSum4 = sum4/i/div;
	}
	else{
		dataSum4 = 0.7+0.1*Math.random();
	}
	var dataSum5 = 0;
	if(plotDataSun5.length > 0){
		var sum5 = 0;
		for (i = 0; i < plotDataSun5.length; i++) {
			sum5 += parseFloat(plotDataSun5[i].value);
		};
		dataSum5 = sum5/i/div;
	}
	else{
		dataSum5 = 0.7+0.1*Math.random();
	}
	var dataSum6 = 0;
	if(plotDataSun6.length > 0){
		var sum6 = 0;
		for (i = 0; i < plotDataSun6.length; i++) {
			sum6 += parseFloat(plotDataSun6[i].value);
		};
		dataSum6 = sum6/i/div;
	}
	else{
		dataSum6 = 0.7+0.1*Math.random();
	}

	var dataSum7 = 0;
	if(plotDataSun7.length > 0){
		var sum7 = 0;
		for (i = 0; i < plotDataSun7.length; i++) {
			sum7 += parseFloat(plotDataSun7[i].value);
		};
		dataSum7 = sum7/i/div;
	}
	else{
		dataSum7 = 0.7+0.1*Math.random();
	}


	var soldPower = []

	soldPower.push(dataSum1);
	soldPower.push(dataSum7);
	soldPower.push(dataSum6);
	soldPower.push(dataSum5);
	soldPower.push(dataSum4);
	soldPower.push(dataSum3);
	soldPower.push(dataSum2);

	return soldPower;
}

var data = {
  labels : ["Today",nofDaysBack(6),nofDaysBack(5),nofDaysBack(4),nofDaysBack(3),nofDaysBack(2), "Yesterday"],
  datasets : [
    {
      fillColor : "rgba(229,154,154,0.5)",
      strokeColor : "rgba(229,154,154,1)",
      pointColor : "rgba(229,154,154,1)",
      pointStrokeColor : "#fff",
      data : dataHistory("MAIN.totalPowerFromAbbMeter",1000),
      label: "Power consumption"
    },
    {
      fillColor : "rgba(149,228,149,0.5)",
      strokeColor : "rgba(149,228,149,1)",
      pointColor : "rgba(149,228,149,1)",
      pointStrokeColor : "#fff",
      data : dataHistory("MAIN.pvPower",1),
      label: "Solar power"
    }
  ]
}

options = {
        
  //Boolean - If we show the scale above the chart data     
  scaleOverlay : false,
  
  //Boolean - If we want to override with a hard coded scale
  scaleOverride : false,
  
  //** Required if scaleOverride is true **
  //Number - The number of steps in a hard coded scale
  scaleSteps : null,
  //Number - The value jump in the hard coded scale
  scaleStepWidth : null,
  //Number - The centre starting value
  scaleStartValue : null,
  
  //Boolean - Whether to show lines for each scale point
  scaleShowLine : true,

  //String - Colour of the scale line 
  scaleLineColor : "rgba(0,0,0,.1)",
  
  //Number - Pixel width of the scale line  
  scaleLineWidth : 1,

  //Boolean - Whether to show labels on the scale 
  scaleShowLabels : true,
  
  //Interpolated JS string - can access value
  scaleLabel : "<%=value%>",
  
  //String - Scale label font declaration for the scale label
  scaleFontFamily : "'Arial'",
  
  //Number - Scale label font size in pixels  
  scaleFontSize : 12,
  
  //String - Scale label font weight style  
  scaleFontStyle : "normal",
  
  //String - Scale label font colour  
  scaleFontColor : "#666",
  
  //Boolean - Show a backdrop to the scale label
  scaleShowLabelBackdrop : false,
  
  //String - The colour of the label backdrop 
  scaleBackdropColor : "rgba(255,255,255,0.75)",
  
  //Number - The backdrop padding above & below the label in pixels
  scaleBackdropPaddingY : 2,
  
  //Number - The backdrop padding to the side of the label in pixels  
  scaleBackdropPaddingX : 2,
  
  //Boolean - Whether we show the angle lines out of the radar
  angleShowLineOut : true,
  
  //String - Colour of the angle line
  angleLineColor : "rgba(0,0,0,.1)",
  
  //Number - Pixel width of the angle line
  angleLineWidth : 1,     
  
  //String - Point label font declaration
  pointLabelFontFamily : "'Arial'",
  
  //String - Point label font weight
  pointLabelFontStyle : "normal",
  
  //Number - Point label font size in pixels  
  pointLabelFontSize : 12,
  
  //String - Point label font colour  
  pointLabelFontColor : "#666",
  
  //Boolean - Whether to show a dot for each point
  pointDot : false,
  
  //Number - Radius of each point dot in pixels
  pointDotRadius : 3,
  
  //Number - Pixel width of point dot stroke
  pointDotStrokeWidth : 1,
  
  //Boolean - Whether to show a stroke for datasets
  datasetStroke : true,
  
  //Number - Pixel width of dataset stroke
  datasetStrokeWidth : 2,
  
  //Boolean - Whether to fill the dataset with a colour
  datasetFill : true,
  
  //Boolean - Whether to animate the chart
  animation : true,

  //Number - Number of animation steps
  animationSteps : 60,
  
  //String - Animation easing effect
  animationEasing : "easeOutQuart",

  //Function - Fires when the animation is complete
  onAnimationComplete : null
  
}
      
var ctx = document.getElementById("myChart").getContext("2d");
var myNewChart = new Chart(ctx).Radar(data,options);

*/
};
