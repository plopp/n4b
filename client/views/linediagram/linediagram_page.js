Template.lineDiagramPage.helpers({
	  getValue : function(plcvar){
		//return plcvar;
      	var ret = Resources.findOne({plcVar: plcvar});
      	if(ret !== undefined){
      		return sprintf("%.1f °",ret.value);;
      	}
      	else{
      		return "N/A °";
      	}
  	},
  	getFlow : function(plcvar){
		//return plcvar;
      	var ret = Resources.findOne({plcVar: plcvar});
      	if(ret !== undefined){
      		return sprintf("%.2f m³/h",ret.value);
      	}
      	else {
      		return "N/A  m³/h";
      	}
  	},
    getVol : function(plcvar){
    //return plcvar;
        var ret = Resources.findOne({plcVar: plcvar});
        if(ret !== undefined){
          return sprintf("%.2f m³",ret.value);
        }
        else {
          return "N/A  m³";
        }
    },
    getEnergy : function(plcvar){
    //return plcvar;
        var ret = Resources.findOne({plcVar: plcvar});
        if(ret !== undefined){
          if(ret.unit == 'Wh'){
            return sprintf("%.2f kWh",ret.value/1000.0);
          }
          else if(ret.unit == 'kWh'){
            return sprintf("%.2f kWh",ret.value);
          }
        }
        else{
          return "N/A  kWh";
        }
    },
    getPower : function(plcvar){
    //return plcvar;
        var ret = Resources.findOne({plcVar: plcvar});
        if(ret !== undefined){
          if(ret.unit == 'W'){
            return sprintf("%.2f W",ret.value);
          }
          else if(ret.unit == 'kW'){
            return sprintf("%.2f W",ret.value*1000.0);
          }
        }
        else{
          return "N/A  W";
        }
    },
    getFifo : function(plcvar){
        var ret = Resources.findOne({plcVar: plcvar});
        if(ret !== undefined){
          var fifo = ret.fifo;
          var max = 0;
          var min = 0;
          var lines = [];
          fifo.forEach(function(o,i){
            if(i == 0){
              max = o;
              min = max;
            }
            if(o > max){
              max = o;
            }
            if(o < min){
              min = o;
            }
          });
          fifo.forEach(function(o,i){
            if(i < (fifo.length-1)){
              lines.push({
                x1: i*4.84,
                x2: (i+1)*4.84,
                y1: 16.0-((o-min)/((max-min) == 0 ? 1 : (max-min)))*16.0,
                y2: 16.0-((fifo[(i+1)]-min)/((max-min) == 0 ? 1 : (max-min)))*16.0
              });
            }
          });
          return lines;
        }
    },
    getCursor : function(plcvar){
    //return plcvar;
        return Resources.findOne({plcVar: plcvar});
    }
});

Template.lineDiagramPage.events = {
  'mouseenter #rect_vmmvs':function(event){
    //$("#rect_vmmvs_info").show();
    $('#rect_vmmvs_info').addClass('is-visible');
  },
  'mouseenter #rect_vmmvent':function(event){
    $("#rect_vmmvent_info").addClass('is-visible');
  },
  'mouseenter #rect_vmmkb':function(event){
    $("#rect_vmmkb_info").addClass('is-visible');
  },
  'mouseenter #rect_vmmradpl2':function(event){
    $("#rect_vmmradpl2_info").addClass('is-visible');
  },
  'mouseenter #rect_vmmgolvpl1':function(event){
    $("#rect_vmmgolvpl1_info").addClass('is-visible');
  },
  'mouseenter #rect_vmmgolvpl2':function(event){
    $("#rect_vmmgolvpl2_info").addClass('is-visible');
  },
  'mouseenter #rect_vmmradpl1':function(event){
    $("#rect_vmmradpl1_info").addClass('is-visible');
  },
  'mouseenter #rect_vmmgolvvindfang':function(event){
    $("#rect_vmmgolvvindfang_info").addClass('is-visible');
  },
  'mouseenter #rect_vmmgolvuterum':function(event){
    $("#rect_vmmgolvuterum_info").addClass('is-visible');
  },

  'mouseleave #rect_vmmvs':function(event){
    //$("#rect_vmmvs_info").hide();
    $('#rect_vmmvs_info').removeClass('is-visible');
  },
  'mouseleave #rect_vmmvent':function(event){
    $("#rect_vmmvent_info").removeClass('is-visible');
  },
  'mouseleave #rect_vmmkb':function(event){
    $("#rect_vmmkb_info").removeClass('is-visible');
  },
  'mouseleave #rect_vmmradpl2':function(event){
    $("#rect_vmmradpl2_info").removeClass('is-visible');
  },
  'mouseleave #rect_vmmgolvpl1':function(event){
    $("#rect_vmmgolvpl1_info").removeClass('is-visible');
  },
  'mouseleave #rect_vmmgolvpl2':function(event){
    $("#rect_vmmgolvpl2_info").removeClass('is-visible');
  },
  'mouseleave #rect_vmmradpl1':function(event){
    $("#rect_vmmradpl1_info").removeClass('is-visible');
  },
  'mouseleave #rect_vmmgolvvindfang':function(event){
    $("#rect_vmmgolvvindfang_info").removeClass('is-visible');
  },
  'mouseleave #rect_vmmgolvuterum':function(event){
    $("#rect_vmmgolvuterum_info").removeClass('is-visible');
  }
}

Template.lineDiagramPage.onRendered(function() {
	$("#rect_vmmvs_info").addClass("cd-popup");
  $("#rect_vmmvent_info").addClass("cd-popup");
  $("#rect_vmmkb_info").addClass("cd-popup");
  $("#rect_vmmradpl2_info").addClass("cd-popup");
  $("#rect_vmmgolvpl1_info").addClass("cd-popup");
  $("#rect_vmmgolvpl2_info").addClass("cd-popup");
  $("#rect_vmmradpl1_info").addClass("cd-popup");
  $("#rect_vmmgolvvindfang_info").addClass("cd-popup");
  $("#rect_vmmgolvuterum_info").addClass("cd-popup");
  // $("#rect_vmmvs_info").hide();
  // $("#rect_vmmvent_info").hide();
  // $("#rect_vmmkb_info").hide();
  // $("#rect_vmmradpl2_info").hide();
  // $("#rect_vmmgolvpl1_info").hide();
  // $("#rect_vmmgolvpl2_info").hide();
  // $("#rect_vmmradpl1_info").hide();
  // $("#rect_vmmgolvvindfang_info").hide();
  // $("#rect_vmmgolvuterum_info").hide();
	
});

function drawIntro(svg) { 
	// svg.circle(130, 75, 50, {fill: 'none', stroke: 'red', strokeWidth: 3});
	// var text1 = svg.text(250, 215, '13°', {fill: 'black', id:"vmm1"});
	// $("#vmm1").text(Session.get("vmm1rettemp"));
}