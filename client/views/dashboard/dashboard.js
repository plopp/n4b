Template.dashboard.rendered = function(){

/*dial = $(".dial")
dial.val([4,2]);
dial.knob({
     'stepsize': 0.1,
     'thickness': 0.4,
     'angleOffset': -90,
     'angleArc': 180,
     //'fgColor': '#66cc66',
     'fgColor': '#ff4422',
     'bgColor': '#ABABAB',
     'readOnly': true,
     'max': 10.0,
     'min': -10.0,
     'width': 300,
     'height': 240
   });*/

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
      //
      //context.lineWidth = 15;
      // line color
      

//      context.beginPath();
      
 //     context.lineWidth = 15;

var chart;
Highcharts.setOptions({                                            // This is for all plots, change Date axis to local timezone
                global : {
                    useUTC : false
                },
                 credits: {
      enabled: false
  }
            });

/*  $('#container').highcharts({
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: 'Temperature vs Rainfall'
    },
    xAxis: [{
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        formatter: function() {
          return this.value + '°C';
        },
        style: {
          color: '#89A54E'
        }
      },
      title: {
        text: 'Temperature',
        style: {
          color: '#89A54E'
        }
      }
    }, { // Secondary yAxis
      title: {
        text: 'Rainfall',
        style: {
          color: '#4572A7'
        }
      },
      labels: {
        formatter: function() {
          return this.value + ' mm';
        },
        style: {
          color: '#4572A7'
        }
      },
      opposite: true
    }],

    tooltip: {
      shared: true
    },

    series: [{
      name: 'Rainfall',
      color: '#4572A7',
      type: 'column',
      yAxis: 1,
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      tooltip: {
        pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} mm</b> '
      }
    }, { 
      name: 'Rainfall error',
      type: 'errorbar',
      yAxis: 1,
      data: [[48, 51], [68, 73], [92, 110], [128, 136], [140, 150], [171, 179], [135, 143], [142, 149], [204, 220], [189, 199], [95, 110], [52, 56]],
      tooltip: {
        pointFormat: '(error range: {point.low}-{point.high} mm)<br/>'
      }
    }, {
      name: 'Temperature',
      color: '#89A54E',
      type: 'spline',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
      tooltip: {
        pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}°C</b> '
      }
    }, {
      name: 'Temperature error',
      type: 'errorbar',
      data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3], [26.1, 27.8], [23.2, 23.9], [18.0, 21.1], [12.9, 14.0], [7.6, 10.0]],
      tooltip: {
        pointFormat: '(error range: {point.low}-{point.high}°C)<br/>'
      }
    }]
  });
*/
        var series;

        $('#container').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'xy',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 100,
                events: {
                    load: function() {
    
                        // set up the updating of the chart each second
                        series = this.series[0];
                        /*setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);*/
                    }
                }
            },
            title: {
                text: 'Outside temperature'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
                                    /*var maxx = _.max(Plotdata.find().fetch(), function (plotdata) {
                      return plotdata.datetime;
                    });

                    var minx = _.min(Plotdata.find().fetch(), function (plotdata) {
                      return plotdata.datetime;
                    });
                    setExtremes(minx, maxx, true, true);*/
            },
            yAxis: {
              labels: {
                formatter: function() {
                  return this.value + '°C';
                },
                style: {
                  color: '#89A54E'
                }
              },
              title: {
                text: 'Temperature',
                style: {
                  color: '#89A54E'
                }
              },
              plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
              }]
            },
            tooltip: {
                  shared: true
                
                /*formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }*/
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Outside temperature',
                color: '#4572A7',
                data: (function() {
                    // generate an array of random data
                    var length = Plotdata.find().count();
                    var plotData = Plotdata.find({},{sort: {datetime: 1}}).fetch();
                    var data = [];

    
                    for (i = 0; i < length; i++) {
                        console.log(plotData[i].datetime+" "+plotData[i].value);
                        data.push({
                            x: plotData[i].datetime,
                            y: plotData[i].value
                        });
                    }
                    
                    return data;
                })(),
                tooltip: {
                  pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} °C</b> '
                }
            }, {
              name: 'Temperature error',
              type: 'errorbar',
              data: (function() {
                    // generate an array of random data
                    var length = Plotdata.find().count();
                    var plotData = Plotdata.find({},{sort: {datetime: 1}}).fetch();
                    var data = [];

    
                    for (i = 0; i < length; i++) {
                        data.push({
                          low: plotData[i].minvalue,
                          high: plotData[i].maxvalue,
                          x: plotData[i].datetime
                        });                            
                    }
                    
                    return data;
                })(),
              //data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3], [26.1, 27.8], [23.2, 23.9], [18.0, 21.1], [12.9, 14.0], [7.6, 10.0]],
              tooltip: {
                pointFormat: '(error range: {point.low:.1f}-{point.high:.1f}°C)<br/>'
              }}/*, 
              {
              name: 'Temperature low',
              type: 'spline',
              data: (function() {
                    // generate an array of random data
                    var length = Plotdata.find().count();
                    var plotData = Plotdata.find({},{sort: {datetime: 1}}).fetch();
                    var data = [];

    
                    for (i = 0; i < length; i++) {
                        data.push({
                          y: plotData[i].minvalue,
                          x: plotData[i].datetime
                        });                            
                    }
                    
                    return data;
                })(),
              //data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3], [26.1, 27.8], [23.2, 23.9], [18.0, 21.1], [12.9, 14.0], [7.6, 10.0]],
              tooltip: {
                pointFormat: '(error range: {point.min.low}-{point.max.high}°C)<br/>'
              }
              }, 
              {
              name: 'Temperature high',
              type: 'line',
              data: (function() {
                    // generate an array of random data
                    var length = Plotdata.find().count();
                    var plotData = Plotdata.find({},{sort: {datetime: 1}}).fetch();
                    var data = [];

    
                    for (i = 0; i < length; i++) {
                        data.push({
                          y: plotData[i].maxvalue,
                          x: plotData[i].datetime
                        });                            
                    }
                    
                    return data;
                })(),
              //data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3], [26.1, 27.8], [23.2, 23.9], [18.0, 21.1], [12.9, 14.0], [7.6, 10.0]],
              tooltip: {
                pointFormat: '(error range: {point.min.low}-{point.max.high}°C)<br/>'
              }
            }*/]
        });

Deps.autorun(function(){
  console.log("Autorun!"+ series.data.length);
  var plotDataVector = Plotdata.find();
  var plotDataFetch = plotDataVector.fetch();
  if(series.data.length === 0){
    console.log("EMPTY!");
    for (var i = 0; i<plotDataVector.count(); i++) {
      var curVal = plotDataFetch[i];
      series.addPoint([curVal.datetime, curVal.value], true, true);
    };
    
  }
  var plotNumber = Plotdata.find().count();
  console.log("#Plotdata "+plotNumber);
  var plotDataValue = Plotdata.findOne({},{sort: {datetime: -1}});
  console.log("series.addPoint(["+plotDataValue.datetime+", "+plotDataValue.value+"]);");
  series.addPoint([plotDataValue.datetime, plotDataValue.value], true, true);

});

function data() {
  return stream_layers(3,10+Math.random()*200,.1).map(function(data, i) {
    return {
      key: 'Stream' + i,
      values: data
    };
  });
}

/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}



function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}

  nv.addGraph(function() {
    var chart = nv.models.lineWithFocusChart();

    chart.xAxis
        .tickFormat(d3.format(',f'));

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    chart.y2Axis
        .tickFormat(d3.format(',.2f'));

    d3.select('#chart svg')
        .datum(data())
      .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
};
