Template.electricityPage.helpers({
	getCurrentPvPower: function(){
		var cursor = Resources.find({plcVar: "GVL.pvPower"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			Session.set("GVL.pvPower",val);
		}
	},
	getCurrentAbbPower: function(){
		var cursor = Resources.find({plcVar: "GVL.totalPowerFromAbbMeter"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			Session.set("AbbPower",val);
		}
	},
	getCurrentOutletsPower: function(){
		var cursor = Resources.find({plcVar: "GVL.totalPowerFromPulseMeters"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			Session.set("OutletsPower",val);
		}
	},
	getCurrentHeatingPower: function(){
		var cursor = Resources.find({plcVar: "GVL.p6_power"});
		if(cursor && cursor.count() > 0){
			var val = cursor.fetch()[0].value;
			Session.set("HeatingPower",val);
		}
	}
});

Template.electricityPage.rendered = function(){

	function Flow(x0,y0,x1,y1,colorpos,colorneg){
		this.init(x0,y0,x1,y1,colorpos,colorneg);
	}

	Flow.prototype = {
		init: function(x0,y0,x1,y1,colorpos,colorneg){
			this.x0 = x0;
			this.x1 = x1;
			this.y0 = y0;
			this.y1 = y1;
			this.parray = [];
			this.colorpos = colorpos;
			this.colorneg = colorneg;
			this.speed = 0;

			var distbetween = 10;
	    	var len = Math.sqrt(Math.pow(y1-y0,2)+Math.pow(x1-x0,2));
	    	var count = Math.round(len/distbetween);
	    	distbetween = len/count;

	    	for (var i = 0; i < count; i++) {
	    		var p = new Particle()
	    		if(x1-x0 == 0){
	    			p.init(x0,y0+i*distbetween,3);
	    		}
	    		else if(y1-y0 == 0){
	    			p.init(x0+i*distbetween,y0,3);
	    		}
	    		this.parray.push(p);
	    	};
		},
		move: function(speed){
			this.speed = speed;
			for (var i = 0; i < this.parray.length; i++) {
				//if(speed > 0){
				if(this.y1-this.y0 == 0){
    				this.parray[i].x += speed;	
    				if(this.parray[i].x > this.x1){
    					this.parray[i].x = this.x0;
    				}
    				else if(this.parray[i].x < this.x0){
    					this.parray[i].x = this.x1;
    				}
	    		}
	    		else if(this.x1-this.x0 == 0){
	    			this.parray[i].y += speed;		
	    			if(this.parray[i].y > this.y1){
    					this.parray[i].y = this.y0;
    				}
    				else if(this.parray[i].y < this.y0){
    					this.parray[i].y = this.y1;
    				}
	    		}
			};
		},
		draw: function(ctx){
			for (var i = 0; i < this.parray.length; i++) {
				this.parray[i].draw(ctx,this.colorpos,this.colorneg,this.speed);
			};
		}
	}

	function Rect(x,y,w,h){
		this.init(x,y,w,h);
	}

	Rect.prototype = {
		init: function(x,y,w,h){
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
		},
		draw: function(ctx){
			ctx.beginPath();
			ctx.rect(this.x,this.y,this.w,this.h);
			ctx.stroke();
			ctx.closePath();
		}
	}

	function Image(elementId){
		this.init(elementId);
	}

	Image.prototype = {
		init: function(elementId){
			this.img=document.getElementById(elementId);
		},
		draw: function(ctx){
			ctx.drawImage(this.img,0,0,750,600);	
		}		
	}

	// ----------------------------------------
    function Particle( x, y, radius ) {
        this.init( x, y, radius );
    }
    Particle.prototype = {
        init: function( x, y, radius ) {
            this.radius = radius || 3;
            this.x = x || 0.0;
            this.y = y || 0.0;
        },
        draw: function( ctx, colorpos, colorneg, speed) {
            ctx.beginPath();
            ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
            if(speed > 0){
            	ctx.fillStyle = colorpos;
            }
            else{
            	ctx.fillStyle = colorneg;
            }
            ctx.fill();
            ctx.closePath();
        }
    };

    var demo = Sketch.create({
        container: document.getElementById( 'container' )
    });

    var rect = new Rect(20,20,1000,800);
    var image = new Image("elsystemimg");
    var flow1 = new Flow(109/4*3,418/4*3,109/4*3,512/4*3,"#00ff00","#ff0000"); //grid1
    var flow2 = new Flow(109/4*3,418/4*3,443/4*3,418/4*3,"#ff0000","#00ff00"); //grid2
    var flow3 = new Flow(443/4*3,418/4*3,443/4*3,579/4*3,"#ff0000","#00ff00"); //outlet
    var flow4 = new Flow(443/4*3,418/4*3,687/4*3,418/4*3,"#ff0000","#00ff00"); //heat+notmeasured sum
    var flow5 = new Flow(687/4*3,418/4*3,687/4*3,497/4*3,"#ff0000","#00ff00"); //notmeasured
    var flow6 = new Flow(687/4*3,418/4*3,814/4*3,418/4*3,"#ff0000","#00ff00"); //heat
    var flow7 = new Flow(758/4*3,293/4*3,758/4*3,352/4*3,"#00ff00","#00ff00"); //pv1
    var flow8 = new Flow(443/4*3,352/4*3,758/4*3,352/4*3,"#00ff00","#00ff00"); //pv2
    var flow9 = new Flow(443/4*3,352/4*3,443/4*3,418/4*3,"#00ff00","#00ff00"); //pv3

    demo.setParticles = function(number){
    	console.log("#particles: ",number);
    	MAX_PARTICLES = number;
    };
    demo.update = function() {
        var pvPower = Session.get("GVL.pvPower")/1000.0;
        var abbPower = Session.get("AbbPower")/1000.0;
        var outletsPower = Session.get("OutletsPower")/1000.0;
        var heatingPower = Session.get("HeatingPower")/1000.0;
        var notMeasured = pvPower + abbPower - outletsPower;
        flow1.move(-abbPower);
        flow2.move(abbPower);
        flow3.move(outletsPower-heatingPower);
        flow4.move(heatingPower+notMeasured);
        flow5.move(notMeasured);
        flow6.move(heatingPower);
        flow7.move(pvPower);
        flow8.move(-pvPower);
        flow9.move(pvPower);
    };
    demo.draw = function() {
        image.draw(demo);
        flow1.draw(demo);
        flow2.draw(demo);
        flow3.draw(demo);
        flow4.draw(demo);
        flow5.draw(demo);
        flow6.draw(demo);
        flow7.draw(demo);
        flow8.draw(demo);
        flow9.draw(demo);
    };
}