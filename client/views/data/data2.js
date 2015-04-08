var labels = [];
Template.cardsPage.helpers({
  resources : function(){
	var curs = Resources.find({},{sort: {title: 1}});
	if(curs){
		labels = [];
		labels.push("x");
	    var all = curs.fetch();			
		all.forEach(function(o){           	
			if(o.unit){
				labels.push(o.title+" ["+o.unit+"]");
			}
			else{
				labels.push(o.title);
			}							
		});
		chunks = [];
        size = 4;
        while (all.length > size) {
            chunks.push({ row: all.slice(0, size)});
            all = all.slice(size);
        }
        chunks.push({row: all});
		//console.log("Labels length: "+labels.length);
        return chunks;
		//return curs;
	}
  },
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
	var cursor = Resources.find({plcVar: "GVL.pvEnergy"});
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
	var cursor = Resources.find({plcVar: "GVL.totalEnergyFromAbbMeter"});
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
		var cursor = Resources.find({plcVar: "GVL.totalPowerFromAbbMeter"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			return sprintf("%.0f", val);
		}			
		else{
			return "Loading...";
		}				
  },
  getCurConsL1 : function(){
		//return 10;
		var cursor = Resources.find({plcVar: "GVL.totalPowerAbbL1"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			return sprintf("%.0f", val);
		}			
		else{
			return "Loading...";
		}				
  },
  getCurConsL2 : function(){
		//return 10;
		var cursor = Resources.find({plcVar: "GVL.totalPowerAbbL2"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			return sprintf("%.0f", val);
		}			
		else{
			return "Loading...";
		}				
  },
  getCurConsL3 : function(){
		//return 10;
		var cursor = Resources.find({plcVar: "GVL.totalPowerAbbL3"});
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
		var cursor1 = Resources.find({plcVar: "GVL.totalPowerFromAbbMeter"});
		var cursor2 = Resources.find({plcVar: "GVL.pvPower"});
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
  		var cursor = Resources.find({plcVar: "GVL.pvPower"});
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
		var cursor = Resources.find({plcVar: "GVL.tempControlRoom"});
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
    Router.go('/exportDataToCsv/data.csv');
  },
  'click #butJson' : function(evt){
    Router.go('/exportDataToJson/data.json');
  },
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
	},
  'click input[type=checkbox]': function(e) {
	var curId = e.currentTarget.id;
	var isChecked = $(e.currentTarget).is(':checked');
	//console.log($(e.source).is(':checked'));
	$('input[type=checkbox]').each(function (index) {	  	  
	 if(this.id == curId){
		change(index, isChecked);	
	 }
	});
  }
  
});

var g;
var visarr = [];
var resArr = [];	

Template.cardsPage.rendered = function(){
    if(visarr.length == 0){
		$('input[type=checkbox]').each(function () {
			resArr.push(this.id);
			visarr.push(false);
		});
	}
	else{
		//console.log(visarr);
		$('input[type=checkbox]').each(function (index) {
		   $(this).prop('checked',visarr[index]);
		   //resArr.push(this.id);
		   //visarr.push(false);
		});			
	}
	drawChart(new Date().getTime()-3600*1000*24);
}

function drawChart(endkey){
	var data;
	HTTP.call("GET","http://10.90.0.1:5984/n4b/_design/unit/_view/all?descending=true&endkey="+endkey, function(error,result){
		if(result){
				
			var data = [];
			var datarr = [];			
			data = JSON.parse(result.content).rows;					
			for(var i = data.length-1; i>=0; i--){			
				rowarr = [];				
				rowarr.push(new Date(data[i].key));				
				for(var j = 0; j<resArr.length; j++){                    				
					rowarr.push(data[i].value[resArr[j]]);
					//datarr.push([,i,i+2,i+5]);					
				}
				datarr.push(rowarr);
			}		
			g = new Dygraph(
				document.getElementById("div_g"),
				datarr,
				{
				  /*rollPeriod: 7,*/
				  /*errorBars: true,*/		  
				  visibility: visarr,
				  labels: labels
				}
			  );	
		}
		else if(error){
			console.log(error);
		}
	});		
}

function change(el, checked) {	
	g.setVisibility(el, checked);
}