Template.dataPage.helpers({
  rule : function(){
    return Rules.find();
  }
});

Template.dataPage.events({
  
})



Template.dataPage.rendered = function(){

    var data = [
        {    
            x: 1,
            y: 2
        },
        {    
            x: 2,
            y: 3
        },
        {    
            x: 3,
            y: 5
        },
        {    
            x: 4,
            y: 7
        },
        {    
            x: 5,
            y: 14
        }
    ];

    var w = 600;
    var h = 400;

    var graph = d3.select("#myChart").append("svg")
        .attr("class", "line-graph")
        .attr("width", w + 20 + 20)
        .attr("height", h + 20 + 20)
    .append("g")
        .attr("transform", "translate(20,20)");
    //graph.append("svg:g")
        
    
    xScale = d3.scale.linear().domain([0,data.length]).range([0, w]);
    xAxis = d3.svg.axis().scale(xScale).tickSize(10).tickSubdivide(1);

  
    yScale = d3.scale.linear().domain([0,15]).range([h,0]);
    yAxis = d3.svg.axis().scale(yScale).orient("left");

    graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,400)")
      .call(xAxis);

    graph.append("g") 
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);


    line = d3.svg.line()
        .x(function(d,i){
            console.log(xScale(d.x));
            return xScale(d.x);
        })
        .y(function(d){
            console.log(yScale(d.y))
            return yScale(d.y);
        })

    graph.append("path")
        .attr("class", "line")
        .attr("d", line(data));

    


    /*lines = graph.append("svg:g")
        .attr("class", "line")
        .selectAll("path")
        .data(data);*/

};