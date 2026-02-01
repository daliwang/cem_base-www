
$( "#Overview_btn1" ).click(function() {


		
	$.ajax({
           		url: "http://cem-base.ornl.gov/cgi-bin/overview_structure.py",
                type: "get",
                datatype:"json",
                data: {'key1':$('#Overview_txtbox1').val()+'___'+$('#Overview_combobox1').val()},
                success: function(response)
                
                {
					if(response.data=='')
					{
					    alert($('#Overview_txtbox1').val()+' has no callee subroutines.'+'\n'+'Please choose another one.');
					    return;
					}
					 
                	 //alert(response.success);
                     //alert(response.message);
                     //alert(response.keys);
                     //alert(response.data);    
   
   
  					 //Clear the svg canvas
  					 d3.select("div.overview_plot1").select("svg").remove();
       				
       				 var margin = {top: 40, right: 120, bottom: 40, left: 150},
            		 width = $(window).width()-300 - margin.right - margin.left,
            		 height = 800 - margin.top - margin.bottom;
    
					 // Using "transform" and "translate" to define a 2D transation for all the elements in the svg
					 // All elements are reference by margin.left and margin.top
					 var svg = d3.select("div.overview_plot1").append("svg")
					 .attr("class","overview_svg_component")
    				 .attr("width", width + margin.right + margin.left)
    				 .attr("height", height + margin.top + margin.bottom)
    				 .append("g")
    				 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
                     var i = 0;
                     var duration = 750;
                     var root;
                    
                     // Create a new tree layout with the default settings
	                 var tree = d3.layout.tree()
                     .size([height,width]);
                    
                     // Construct a new diagonal generator with the default accessor functions.
                     // The returned function generates the path data for a cubic Bezier connecting the source and target points.
                     // The tangents are specified to produce smooth fan-in and fan-out when connecting nodes.
	                 var diagonal = d3.svg.diagonal()
                     .projection(function(d) { return [d.y, d.x]; });
   
                     // Pass the JSON object from server to variable
                     root = response.data;
  	                 root.x0 = height / 2;
  	                 root.y0 = 0;
                     
                     

                     function collapse(d) 
                     {
                        if (d.children) 
                        {
                            d._children = d.children;
                            d._children.forEach(collapse);
                            d.children = null;
                        }
                     }

                     root.children.forEach(collapse);
                     update(root);


    
       
                    d3.select(self.frameElement).style("height", height);
                    function update(source) 
                    {

                        // Runs the tree layout, returing the array of nodes associated with the specified root node
                        // Attributes of each node include: parent, children, depth, x and y coordinates
                        var nodes = tree.nodes(root).reverse();
                        
                        // Given the specified array of nodes, return an array of objects representing the links from parent to child for each node
                        // Attributes of each link include: source (parent node) and target (child node)
                        var links = tree.links(nodes);

                        
                        // Normalize for fixed-depth.
                        
                        nodes.forEach(function(d) 
                        { 
  	                         d.y = d.depth * (width*0.4);
                        });

                        // Bind data to each node by pairing them with id
                        // d.id=++i is the equivalent of i+=1; d.id=i
                        // A falsy value could be considered being equal to 0, false, undefined, null or NaN
                        var node = svg.selectAll("g.node")
                        .data(nodes, function(d) { return d.id || (d.id = ++i);});

  
                        // Enter any new nodes at the parent's previous position.
                        var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                        .on("click", click);

                        nodeEnter.append("circle")
                        .attr("r", 1e-6)
                        .style("fill", function(d) 
                            { 
                                return d._children ? "lightsteelblue" : "#fff"; 
                            });

                         nodeEnter.append("text")
                        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                        .text(function(d) { return d.name; })
                        .style("fill-opacity", 1e-6);

                        
                        // Transition nodes to their new position.
                        var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                        nodeUpdate.select("circle")
                        .attr("r", 8.5)
                        .style("fill", function(d) 
                        { 
                             if(d.mark=="1") {return "#7FFF00";}
      	                     else return d._children ? "lightsteelblue" : "#fff"; 
                        }
      	
                        );

                        nodeUpdate.select("text")
                        .style("fill-opacity", 1);

  
                        // Transition exiting nodes to the parent's new position.
                        var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();

                        nodeExit.select("circle")
                        .attr("r", 1e-6);

                        nodeExit.select("text")
                        .style("fill-opacity", 1e-6);

                        // Update the links…
                        var link = svg.selectAll("path.link")
                        .data(links, function(d) { return d.target.id; });

                        
                        // Enter any new links at the parent's previous position.
                        link.enter().insert("path", "g")
                        .attr("class", "link")
                        .style("stroke","#ccc")
                        .style("stroke-width","1px")
                        .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                        });

                        // Transition links to their new position.
                        link.transition()
                        .duration(duration)
                        .attr("d", diagonal);

                        // Transition exiting nodes to the parent's new position.
                        link.exit().transition()
                        .duration(duration)
                        .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                        })
                        .remove();


                        // Stash the old positions for transition.
                        nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                        });
                  
                  }//end of update function

                  
                  // Toggle children on click.
                  //d._children is used as a temp variable which holds the children when they are hidden
                  function click(d) {
                        if (d.children) 
                        {
                            d._children = d.children;
                            d.children = null;
                        } 
                        
                        else 
                        {
                            d.children = d._children;
                            d._children = null;
                        }
                        
                        update(d);
                                    }
   

                }//end of response

    
            }); //end of Ajax

            
        });//end of click


