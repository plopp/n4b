Template.cardsPage.helpers({
  outletsOn : function(){
	var type = Types.findOne({title: 'Digital'});
	if(type){
		return Resources.find({value: 1, typeId: type._id},{sort: {title: 1}});
	}
  },
  outletsOff : function(){
	var type = Types.findOne({title: 'Digital'});
	if(type){
		return Resources.find({value: 0, typeId: type._id},{sort: {title: 1}});
	}
  },
  getCurSolarEnergy : function(){
  //return 11;
	var cursor = Resources.find({plcVar: "MAIN.pvEnergy"});
	if(cursor && cursor.count() > 0){
		var val = cursor.fetch()[0].value;
		return sprintf("%.1f", val);
	}			
	else{
		return "Loading...";
	}
  },
  getCurGridEnergy : function(){
  //return 11;
	var cursor = Resources.find({plcVar: "MAIN.totalEnergyFromAbbMeter"});
	if(cursor && cursor.count() > 0){
		var val = cursor.fetch()[0].value;
		return sprintf("%.1f", val);
	}			
	else{
		return "Loading...";
	}
  },
  //timeDepthReactive : function(){
    //return Session.get("timeDepth");
  //},
  getCurCons : function(){
		//return 10;
		var cursor = Resources.find({plcVar: "MAIN.totalPowerFromAbbMeter"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			return sprintf("%.0f", val);
		}			
		else{
			return "Loading...";
		}				
  },
  getTotCons : function(){
		//return 10;
		var cursor1 = Resources.find({plcVar: "MAIN.totalPowerFromAbbMeter"});
		var cursor2 = Resources.find({plcVar: "MAIN.pvPower"});
		if(cursor1 && cursor1.count() > 0 && cursor2 && cursor2.count() > 0){
			var val1 = cursor1.fetch()[0].value;
			var val2 = cursor2.fetch()[0].value;
			return sprintf("%.0f", val1+val2);
		}			
		else{
			return "Loading...";
		}		
  },
  getCurProd : function(){
		//return 11;
  		var cursor = Resources.find({plcVar: "MAIN.pvPower"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			return sprintf("%.0f", val);
		}			
		else{
			return "Loading...";
		}
  },
  getCurTemp : function(){
		//return 20;
		var cursor = Resources.find({plcVar: "MAIN.tempControlRoom"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			return sprintf("%.1f", val);
		}			
		else{
			return "Loading...";
		}
  },
  getPowerMeters : function(){
  		return Resources.find({unit: "W"});
  }
});

Template.cardsPage.events({
  'click #butCsv' : function(evt){
    Meteor.Router.to('/exportDataToCsv/data.csv');
  },
  'click #butJson' : function(evt){
    Meteor.Router.to('/exportDataToJson/data.json');
  }
});

Template.cardsPage.rendered = function(){
  
  //google.setOnLoadCallback(drawChart);
  console.log(google);
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales', 'Expenses'],
      ['2004',  1000,      400],
      ['2005',  1170,      460],
      ['2006',  660,       1120],
      ['2007',  1030,      540]
    ]);

    var options = {
      title: 'Company Performance'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    console.log(chart);
    chart.draw(data, options);
  
	//console.log("REndered!");

    // var sin = [], cos = [];
    // for (var i = 0; i < 14; i += 0.1) {
      // sin.push([i, Math.sin(i)]);
      // cos.push([i, Math.cos(i)]);

    // }

    // datArr = [];
    // curdat = Plotdata.find().fetch()
    // for (var i = 0; i < curdat.length; i++) {
      // datArr.push([curdat[i].datetime,curdat[i].value]);
    // };

    // plot = $.plot($("#placeholder"), [
      // { data: datArr, label: "sin(x) = -0.00"}
    // ], {
      // series: {
        // lines: {
          // show: true
        // }
      // },
      // crosshair: {
        // mode: "x"
      // },
      // grid: {
        // hoverable: true,
        // autoHighlight: false
      // },
      // yaxis: {
        // min: -2,
        // max: 20
      // },
      // xaxis: { mode: "time" }
    // });

    // var legends = $("#placeholder .legendLabel");

    // legends.each(function () {
      // $(this).css('width', $(this).width());
    // });

    // var updateLegendTimeout = null;
    // var latestPosition = null;

    // function updateLegend() {

      // updateLegendTimeout = null;

      // var pos = latestPosition;

      // var axes = plot.getAxes();
      // if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
        // pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
        // return;
      // }

      // var i, j, dataset = plot.getData();
      // for (i = 0; i < dataset.length; ++i) {

        // var series = dataset[i];


        // for (j = 0; j < series.data.length; ++j) {
          // if (series.data[j][0] > pos.x) {
            // break;
          // }
        // }


        // var y,
          // p1 = series.data[j - 1],
          // p2 = series.data[j];

        // if (p1 == null) {
          // y = p2[1];
        // } else if (p2 == null) {
          // y = p1[1];
        // } else {
          // y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
        // }

        // legends.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
      // }
    // }

    // $("#placeholder").bind("plothover",  function (event, pos, item) {
      // latestPosition = pos;
      // if (!updateLegendTimeout) {
        // updateLegendTimeout = setTimeout(updateLegend, 50);
      // }
    // });


	// if (!this.rendered){
			
			// renderGraph();
	    	
	    // this.rendered = true;
	 // }
	// Meteor.defer(function(){
		
	   
	// });
}

var renderGraph = function(){
	var width = 150,
    height = 150,
    τ = 2 * Math.PI; // http://tauday.com/tau-manifesto

// An arc function with all values bound except the endAngle. So, to compute an
// SVG path string for a given angle, we pass an object with an endAngle
// property to the `arc` function, and it will return the corresponding string.

var arc = d3.svg.arc()
    .innerRadius(40)
    .outerRadius(50)
    .startAngle(-0.25 * τ)
    


// Create the SVG container, and apply a transform such that the origin is the
// center of the canvas. This way, we don't need to position arcs individually.
var svg = d3.select("#cons-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

var svg2 = d3.select("#prod-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

svg.append("svg:text")
    .text("5 kW")
    .attr("font-size", 12)
    .attr("color", "#468847")
    .attr("y", function(d, i) {
       return 70;
    })
    .attr("x", function(d, i) {
       return -15;
    });

svg2.append("svg:text")
    .text("5 kW")
    .attr("font-size", 12)
    .style("font-color", "#468847")
    .attr("y", function(d, i) {
       return 70;
    })
    .attr("x", function(d, i) {
       return -15;
    });

// Add the background arc, from 0 to 100% (τ).
var background1 = svg.append("path")
    .datum({endAngle: 0.5 * τ})
    .style("fill", "#ddd")
    .attr("d", arc);

var background2 = svg2.append("path")
    .datum({endAngle: 0.5 * τ})
    .style("fill", "#ddd")
    .attr("d", arc);

// Add the foreground arc in orange, currently showing 12.7%.
var foreground = svg.append("path")
    .datum({endAngle:  τ})
    .style("fill", "#c09853")
    .attr("d", arc);

var foreground2 = svg2.append("path")
    .datum({endAngle:  τ})
    .style("fill", "#468847")
    .attr("d", arc);


Deps.autorun(function(){
	var cons = Resources.find({plcVar: "MAIN.totalPowerFromAbbMeter"}).fetch();
	var consvalue = cons[0].value/5000.0;
	var scaleConsValue = consvalue*((0.5+0.25)*τ)-0.25*τ;
	foreground.transition()
     .duration(750)
      .call(arcTween, scaleConsValue);

});

Deps.autorun(function(){
	var prod = Resources.find({plcVar: "MAIN.pvPower"}).fetch();
	var prodvalue = prod[0].value/5000.0;
	var scaleProdValue = prodvalue*((0.5+0.25)*τ)-0.25*τ;
	foreground2.transition()
     .duration(750)
      .call(arcTween, scaleProdValue);
})

// Every so often, start a transition to a new random angle. Use transition.call
// (identical to selection.call) so that we can encapsulate the logic for
// tweening the arc in a separate function below.
/*setInterval(function() {
  
}, 1000);*/


// Creates a tween on the specified transition's "d" attribute, transitioning
// any selected arcs from their current angle to the specified new angle.
function arcTween(transition,newAngle) {

  // The function passed to attrTween is invoked for each selected element when
  // the transition starts, and for each element returns the interpolator to use
  // over the course of transition. This function is thus responsible for
  // determining the starting angle of the transition (which is pulled from the
  // element's bound datum, d.endAngle), and the ending angle (simply the
  // newAngle argument to the enclosing function).
  transition.attrTween("d", function(d) {

    // To interpolate between the two angles, we use the default d3.interpolate.
    // (Internally, this maps to d3.interpolateNumber, since both of the
    // arguments to d3.interpolate are numbers.) The returned function takes a
    // single argument t and returns a number between the starting angle and the
    // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
    // newAngle; and for 0 < t < 1 it returns an angle in-between.
    var interpolate = d3.interpolate(d.endAngle, newAngle);

    // The return value of the attrTween is also a function: the function that
    // we want to run for each tick of the transition. Because we used
    // attrTween("d"), the return value of this last function will be set to the
    // "d" attribute at every tick. (It's also possible to use transition.tween
    // to run arbitrary code for every tick, say if you want to set multiple
    // attributes from a single function.) The argument t ranges from 0, at the
    // start of the transition, to 1, at the end.
    return function(t) {

      // Calculate the current arc angle based on the transition time, t. Since
      // the t for the transition and the t for the interpolate both range from
      // 0 to 1, we can pass t directly to the interpolator.
      //
      // Note that the interpolated angle is written into the element's bound
      // data object! This is important: it means that if the transition were
      // interrupted, the data bound to the element would still be consistent
      // with its appearance. Whenever we start a new arc transition, the
      // correct starting angle can be inferred from the data.
      d.endAngle = interpolate(t);

      // Lastly, compute the arc path given the updated data! In effect, this
      // transition uses data-space interpolation: the data is interpolated
      // (that is, the end angle) rather than the path string itself.
      // Interpolating the angles in polar coordinates, rather than the raw path
      // string, produces valid intermediate arcs during the transition.
      return arc(d);
    };
  });
}
}