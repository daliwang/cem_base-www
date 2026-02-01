
$( "#btn2" ).click(function() {


	
$.ajax({
                        url: "/cgi-bin/submodel_structure.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':$('#txtarea1').val()+'___'+$('#combobox1').val()},
                        success: function(response){
							
							//console.log(response.message);
                            //alert(response.success);
                            //alert(response.message);
                            //alert(response.keys);
                            //alert(response.data);
                            //alert($('#txtbox1').val());
                
//'key1':'CanopyFluxes','key2':'c2g_1d','key3':'ch4_aere','key4':'p2c_1d','key5':'ch4_prod'
	
	d3.select("div.submodel_plot").select("svg").remove();
	
	var links=[];
	var nodes={};
	d=response.data;
	var width = $(window).width()-300;
    height = 1200;
    
    var fill=d3.scale.category20();

	
	var svg = d3.select("div.submodel_plot")
			.append("svg")
			.attr("width",width)
			.attr("height",height)
			.attr("pointer-events", "all")
			.append("g")
			.call(d3.behavior.zoom().on("zoom", redraw))
			.append("g");
	
	 svg.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#F0F0F0');

	function redraw() {
  console.log("here", d3.event.translate, d3.event.scale);
  svg.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}
	
	
	
	links=d.links;
		

		// Compute the distinct nodes from the links.
		d.links.forEach(function(link) {
		link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, group: link.s_group});
      	link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, group: link.t_group});
		});
	


//});


     var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(function(d) {return d.distance;})
    .charge(-300)
    .on("tick", tick)
    .start();

// Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
    .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");


var path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

//Color of each node is based on the category of variables/subroutines
var circle_color=["yellow","green","green","#3366CC","#3366CC",
                  "#3366CC","#3366CC","green","red","red",
                  "red","red","red","red","red",
                  "red","#3366CC","#3366CC","#3366CC","#3366CC",
                  "#3366CC","#3366CC","red","red","red",
                  "red","red","red","red","red",
                  "red","red","red","red","red",
                  "red","red","red","#3366CC","#3366CC",
                  "#3366CC","#3366CC","red","red","red",
                  "red","red","red","red","red",
                  "red","red","red","red","red",
                  "red","#3366CC","red","red","red",
                  "red","red","red","red"
                  ];


var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
    .enter().append("circle")
    .attr("r",
    
    	function(d)
    	{
    		if(d.group=="1") {return 10;}
    		else {return 6;}
    	}
    )
    .style("fill",
             
    	function(d)
    	{
    		return circle_color[d.group-1];
    	}
   )
    .call(force.drag);

circle.append("title")
	.text(function(d) {return "Name:  "+d.name+"\n"+"Group id:  "+d.group;});


var linkedByIndex={};
links.forEach(function(d)
{
   linkedByIndex[d.source.index + "," + d.target.index]=1;
});


//If the two nodes are connected
function isConnected(a, b) 
{
  return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}

//Define the opacity and color of nodes and links during "mouseover" and "mouseout" event
function fade(opacity,color)
{
  return function(d)
  {
      circle.style("opacity",function(o)
        {
           thisOpacity = isConnected(d, o) ? 1 : opacity;
           return thisOpacity;
        });
     
      //fade the text of the nodes that don't connect with the selected node
      text.style("opacity",function(o)
       {
           thisOpacity = isConnected(d, o) ? 1 : opacity;
           return thisOpacity;  
       });
       
      path.style("stroke-opacity", function(o) {
           return o.source === d || o.target === d ? 1: opacity;
       })
       .style("stroke", function(o) {
           return o.source === d || o.target === d ? color: "#21B6A8";
       });

      force.stop();  //freeze the graph
  };
}

circle.on("mouseover",fade(0.25,"6599FF"))
      .on("mouseout",fade(1,"#21B6A8"));



var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
	.text(
		
		function(d)
		{
			if (d.group=="1") {return d.name;}
			else {return "";}
		});



// Use elliptical arc path segments to doubly-encode directionality.

function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
  
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      //dr = Math.sqrt(dx * dx + dy * dy);
      dr = 0;
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}



function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}




circle.on("click", function(d) {
    //alert(d.name);
     force.stop();
});



                   }
                    });//end of ajax
                    
 

});//end of click


