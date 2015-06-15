Template.dashboardPage.rendered = function (argument) {
	// Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#barChartSolar").get(0).getContext("2d");
	var chartJQ = $("#barChartSolar");
	chartJQ.attr("width",chartJQ.parent().width());
	// This will get the first returned node in the jQuery collection.

	var options = {
	    // Boolean - Whether to animate the chart
	    animation: true,

	    // Number - Number of animation steps
	    animationSteps: 60,

	    // String - Animation easing effect
	    // Possible effects are:
	    // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
	    //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
	    //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
	    //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
	    //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
	    //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
	    //  easeOutElastic, easeInCubic]
	    animationEasing: "easeOutQuart",

	    // Boolean - If we should show the scale at all
	    showScale: true,

	    // Boolean - If we want to override with a hard coded scale
	    scaleOverride: false,

	    // ** Required if scaleOverride is true **
	    // Number - The number of steps in a hard coded scale
	    scaleSteps: null,
	    // Number - The value jump in the hard coded scale
	    scaleStepWidth: null,
	    // Number - The scale starting value
	    scaleStartValue: null,

	    // String - Colour of the scale line
	    scaleLineColor: "rgba(0,0,0,.1)",

	    // Number - Pixel width of the scale line
	    scaleLineWidth: 1,

	    // Boolean - Whether to show labels on the scale
	    scaleShowLabels: true,

	    // Interpolated JS string - can access value
	    scaleLabel: "<%=value%> kWh",

	    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
	    scaleIntegersOnly: true,

	    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
	    scaleBeginAtZero: true,

	    // String - Scale label font declaration for the scale label
	    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

	    // Number - Scale label font size in pixels
	    scaleFontSize: 12,

	    // String - Scale label font weight style
	    scaleFontStyle: "normal",

	    // String - Scale label font colour
	    scaleFontColor: "#666",

	    // Boolean - whether or not the chart should be responsive and resize when the browser does.
	    responsive: false,

	    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
	    maintainAspectRatio: true,

	    // Boolean - Determines whether to draw tooltips on the canvas or not
	    showTooltips: true,

	    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
	    customTooltips: false,

	    // Array - Array of string names to attach tooltip events
	    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

	    // String - Tooltip background colour
	    tooltipFillColor: "rgba(0,0,0,0.8)",

	    // String - Tooltip label font declaration for the scale label
	    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

	    // Number - Tooltip label font size in pixels
	    tooltipFontSize: 14,

	    // String - Tooltip font weight style
	    tooltipFontStyle: "normal",

	    // String - Tooltip label font colour
	    tooltipFontColor: "#fff",

	    // String - Tooltip title font declaration for the scale label
	    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

	    // Number - Tooltip title font size in pixels
	    tooltipTitleFontSize: 14,

	    // String - Tooltip title font weight style
	    tooltipTitleFontStyle: "bold",

	    // String - Tooltip title font colour
	    tooltipTitleFontColor: "#fff",

	    // Number - pixel width of padding around tooltip text
	    tooltipYPadding: 6,

	    // Number - pixel width of padding around tooltip text
	    tooltipXPadding: 6,

	    // Number - Size of the caret on the tooltip
	    tooltipCaretSize: 8,

	    // Number - Pixel radius of the tooltip border
	    tooltipCornerRadius: 6,

	    // Number - Pixel offset from point x to tooltip edge
	    tooltipXOffset: 10,

	    // String - Template string for single tooltips
	    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

	    // String - Template string for multiple tooltips
	    multiTooltipTemplate: "<%= value %>",

	    // Function - Will fire on animation progression.
	    onAnimationProgress: function(){},

	    // Function - Will fire on animation completion.
	    onAnimationComplete: function(){}
	}

	HTTP.call("GET","http://10.90.0.1:5984/n4b/_design/reduce/_view/"+"GVL.totalEnergyFromAbbMeter"+"?reduce=true&group_level=2", function(error,result1){
		if(result1){
				HTTP.call("GET","http://10.90.0.1:5984/n4b/_design/reduce/_view/"+"GVL.pvEnergy"+"?reduce=true&group_level=2", function(error,result2){
					if(result2){
						var data = JSON.parse(result1.content);			
						var data1 = data.rows;
						var data = JSON.parse(result2.content);			
						var data2 = data.rows;
						if(data1.length > 0 && data2.length > 0){

							var labels = [];
							dataabb = [];
							datapv = [];
							data1.forEach(function(o,i){
								if((o.key[0] == 2014 && o.key[1] == 5) || (o.key[0] == 2015 && o.key[1] == 2) || (o.key[0] == 2015 && o.key[1] ==4)){
									;
								}
								else{
									var timestampabb = moment([o.key[0],o.key[1]-1]).format("MMM YYYY");
									labels.push(timestampabb);
									if(o.key[0] == 2014 && o.key[1] == 8){
										//*** Fix for broken data for this specific app
										var correctedValue = o.value["max"]-data1[i-1].value["max"]+(data1[i+1].value["min"] - o.value["min"]);
										dataabb.push(correctedValue);	
										//***
									}
									else{
										dataabb.push(o.value["max"]-o.value["min"]);
									}

									var bFoundPvDataAtTime = false;
									data2.forEach(function(o2,i){
										var timestamppv = moment([o2.key[0],o2.key[1]-1]).format("MMM YYYY");
										if(timestamppv == timestampabb){
											datapv.push(o2.value["max"]-o2.value["min"]);
											bFoundPvDataAtTime = true;
										}
									});
									
									if(!bFoundPvDataAtTime){
										datapv.push(0);
										bFoundPvDataAtTime = true;
									}
								}
							});

							var data = {
							    labels: labels,
							    datasets: [
							        {
							            label: "Solar energy",
							            fillColor: "rgba(241, 196, 15,0.5)",
							            strokeColor: "rgba(241, 196, 15,0.8)",
							            highlightFill: "rgba(241, 196, 15,0.75)",
							            highlightStroke: "rgba(241, 196, 15,1.0)",
							            data: datapv
							        },
							        {
							            label: "Bought energy",
							            fillColor: "rgba(46, 204, 113,0.5)",
							            strokeColor: "rgba(46, 204, 113,0.8)",
							            highlightFill: "rgba(46, 204, 113,0.75)",
							            highlightStroke: "rgba(46, 204, 113,1)",
							            data: dataabb
							        }
							    ]
							};
							var myBarChart = new Chart(ctx).Bar(data, options);
						}
						else{
							console.log("No energy data.");
						}
					}
					else if(error){
						console.log("Error when downloading data. ",error);
					}
				});
		}
		else if(error){
			console.log("Error when downloading data. ",error);
		}
	});
}