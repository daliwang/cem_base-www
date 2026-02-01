
$(function() 
{
    $( "#tabs" ).tabs(
      {
            activate: function (event, ui) 
            {
                        
                 if(ui.newTab.index()==1)
                                    
                 {
                        
                        $('#Overview_txtbox1').val("clm_drv()");
                        $('#Overview_combobox1').val('CLM_45_10');
                        
                        $('#Overview_txtbox2').val("clm_drv()");
                        $('#Overview_combobox2').val('CLM_45_68');
                        
                        $.ajax({
                        url: "http://cem-base.ornl.gov/cgi-bin/overview_structure.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':'clm_drv()___CLM_45_10'},
                        success: function(response)
                
                        {

                             //Clear the svg canvas
                             d3.select("div.overview_plot1").select("svg").remove();
                            
                             var margin = {top: 40, right: 120, bottom: 40, left: 150},
                             width = $(window).width()-300 - margin.right - margin.left,
                             height = $(window).height() - margin.top - margin.bottom;
            
                             // Using "transform" and "translate" to define a 2D transation for all the elements in the svg
                             // All elements are reference by margin.left and margin.top
                             var svg = d3.select("div.overview_plot1").append("svg")
                             .attr("width", width + margin.right + margin.left)
                             .attr("height", height + margin.top + margin.bottom)
                             .attr("class","overview_svg_component")
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
                    
                        $.ajax({
                url: "http://cem-base.ornl.gov/cgi-bin/overview_structure.py",
                type: "get",
                datatype:"json",
                data: {'key1':'clm_drv()___CLM_45_68'},
                success: function(response)
                
                {
   
                     //Clear the svg canvas
                     d3.select("div.overview_plot2").select("svg").remove();
                    
                     var margin = {top: 40, right: 120, bottom: 40, left: 150},
                     width = $(window).width()-300 - margin.right - margin.left,
                     height = 800 - margin.top - margin.bottom;
    
                     // Using "transform" and "translate" to define a 2D transation for all the elements in the svg
                     // All elements are reference by margin.left and margin.top
                     var svg = d3.select("div.overview_plot2").append("svg")
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
                             else return d._children ? "#66CDAA" : "#fff"; 
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
                        .style("stroke","#66CDAA")
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
            
            
            
            //draw the legend
            
            
            d3.select("div.overview1_legend").select("svg").remove();
            var width = 300,
            height = 150;
        
        var svg1 = d3.select("div.overview1_legend").
                            append("svg").
                            attr("width",width).
                            attr("height",height);
        var x_dis=35;
        
        //Adding the legend
        var text=svg1.append("text");
        var textLabels=text
            .attr("x", x_dis-8)
            .attr("y", 30)
            .text("Legend")
            .style("font-family", "Times New Roman")
            .style("font-size", "30px")
            .style("fill","white")
            .style("text-shadow","none");
                            

         var circle_index=[0,1];
         var circle_x=[x_dis,x_dis];
         var circle_y=[60,90];
         var circle_r=[8,8];
         var circle_color=["lightsteelblue","#7FFF00"];
                
         var circles= svg1.selectAll("circle").data(circle_index).enter().append("circle");
          
          
         circles.attr("cx",function(d) {return circle_x[d];})
            .attr("cy",function(d) {return circle_y[d];})
            .attr("r",function(d) {return circle_r[d];})
            .style("fill",function(d) {return circle_color[d];})
            .style("stroke", "white")
            .style("stroke-width","1px");
         
         
         
         var text_index=[0,1,2];
         var text_x=[-1,x_dis,x_dis];
         var text_y=[-1,60,90];
         var text_r=[-1,6,6];
         var text_name=["legend","Expandable Node","Node with Other Callee Subroutines"];
         var texts= svg1.selectAll("text").data(text_index).enter().append("text");
          
         texts
            .attr("x", function(d) {return text_x[d]+20;})
            .attr("y", function(d) {return text_y[d]+text_r[d];})
            .text(function(d) {return text_name[d];})
            .style("fill", "white")
            .style("font-family", "Times New Roman")
            .style("font-size", "15px")
            .style("text-shadow","none");
            
            
        
        d3.select("div.overview2_legend").select("svg").remove();
        
        var svg2 = d3.select("div.overview2_legend").
                            append("svg").
                            attr("width",width).
                            attr("height",height);

        //Adding the legend
        var text=svg2.append("text");
        var textLabels=text
            .attr("x", x_dis-8)
            .attr("y", 30)
            .text("Legend")
            .style("font-family", "Times New Roman")
            .style("font-size", "30px")
            .style("fill","white")
            .style("text-shadow","none");
                            

         var circle_index=[0,1];
         var circle_x=[x_dis,x_dis];
         var circle_y=[60,90];
         var circle_r=[8,8];
         var circle_color=["#66CDAA","#7FFF00"];
                
         var circles= svg2.selectAll("circle").data(circle_index).enter().append("circle");
          
          
         circles.attr("cx",function(d) {return circle_x[d];})
            .attr("cy",function(d) {return circle_y[d];})
            .attr("r",function(d) {return circle_r[d];})
            .style("fill",function(d) {return circle_color[d];})
            .style("stroke", "white")
            .style("stroke-width","1px");
         
         
         
         var text_index=[0,1,2];
         var text_x=[-1,x_dis,x_dis];
         var text_y=[-1,60,90];
         var text_r=[-1,6,6];
         var text_name=["legend","Expandable Node","Node with Other Callee Subroutines"];
         var texts= svg2.selectAll("text").data(text_index).enter().append("text");
          
         texts
            .attr("x", function(d) {return text_x[d]+20;})
            .attr("y", function(d) {return text_y[d]+text_r[d];})
            .text(function(d) {return text_name[d];})
            .style("fill", "white")
            .style("font-family", "Times New Roman")
            .style("font-size", "15px")
            .style("text-shadow","none");
            


                            
           }//end of if-statement for "overview" tab
           
           
             
           if(ui.newTab.index()==2)
           {
               
               $('#call_variable_combobox1').val('CLM_45_10');
               $('#call_variable_txtbox1').val('CanopyFluxes()');
               
               $('#variable_call_combobox1').val('CLM_45_68');
               $('#variable_call_txtbox1').val('rootfr[pps%]');
               $('#radio_v').prop('checked',true);
               
               var table1_data;
               $.ajax({

                        url: "http://cem-base.ornl.gov/cgi-bin/call_variable_query.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':'CanopyFluxes()___CLM_45_10'},
                        success: function(response){
                            
                            //alert(response.success);
                            //alert(response.message);
                            //alert(response.keys);
                            //alert(response.data);
                            

                    
                        function tabulate(data,columns)
                        {
                            var table=d3.select("#table1").append("table").attr("id","my_table1");
                            
                        
                            var thead=table.append("thead");
    
                            var tfoot=table.append("tfoot");
                            var tbody=table.append("tbody");
                        
                            //append the header row
                            
                            thead
                                .append("tr")
                                .selectAll("th")
                                .data(columns)
                                .enter()
                                .append("th")
                                .text(function(column) {return column;});

                        
                        
                            tfoot
                                .append("tr")
                                .selectAll("th")
                                .data(columns)
                                .enter()
                                .append("th")
                                .text(function(column) {return column;}
                                    
                                );
                        

                        
                            //create a row for each object in the data
                            
                            var rows=tbody.selectAll("tr")
                                    .data(data)
                                    .enter()
                                    .append("tr");
                                    
                            //create a cell in each row for each column
                            
                            var cells=rows.selectAll("td")
                                    .data(function(row) {
                                        return columns.map(function(column){
                                            return {column: column, value: row[column]};
                                        });
                                    })
                                    .enter()
                                    .append("td")
                                    .text(function(d) {return d.value;});
                            
                            
                            
                             return table;
                            
                         }


                             //Remove the previous table from view
                             d3.select("#table1").select("table").remove();
                            
                             //Get data from server and populate the table
                             table1_data=response.data;
                             var peopleTable=tabulate(table1_data,["Variable / Function Name","Type"]);
                            
                             
                             $("#my_table1").tablesorter();                             
                               
                             //Calculate the number of varibales in each type
                             var type_count=[0,0,0,0,0,0,0]; 
                             var type=['Subroutine_in','Subroutine_out','Global_readonly','Global_writeonly','Global_modified','Global_non','Function Call'];
                            
                             for (var i in table1_data)
                             { 
                                 //Get each element of json
                                 element=table1_data[i];
                                 for (var i=0;i<type.length;i++)
                                 {
                                     if(type[i]==element.Type)
                                     {
                                         type_count[i]++;
                                        
                                     }
                                 }   
                             }
                             
                            
                            
                            //Draw the legend
                            

                            
                            //Get the current width of the legend div


                          
                            

                            d3.select("div.tab4_table1_legend").select("svg").remove();
                            
                            var width=$('#tab4_section2_top_legend').width();
                            var height = 150;
                    
                            var svg_table1 = d3.select("div.tab4_table1_legend").
                                                append("svg").
                                                attr("width",width).
                                                attr("height",height);
                            /*
                            var x_dis=60;
                            
                            //Adding the legend
                            var text=svg1.append("text");
                            var textLabels=text
                                .attr("x", x_dis-8)
                                .attr("y", 30)
                                .text("Legend")
                                .style("font-family", "Times New Roman")
                                .style("font-size", "20px")
                                .style("font-weight", "bold")
                                .style("stroke","blue")
                                .style("stroke-width","0")
                                .style("fill", "blue");
                            */
                            
                            x_offset=width/10;
                            
                            var text_index=[0,1,2,3,4,5,6];
                            var text_x=[0, width/3, width*(2/3),0, width/3, width*(2/3), 0];
                            var text_y=[40,40,40,80,80,80,120];
                            
                            
                            var texts= svg_table1.selectAll("text").data(text_index).enter().append("text");
                            texts
                                .attr("x", function(d) {return text_x[d]+x_offset;})
                                .attr("y", function(d) {return text_y[d];})
                                .text(function(d) {return type[d]+':  '+type_count[d];})
                                .style("font-family", "Palatino")
                                .style("font-size", "15px")
                                .style("font-weight", "bold")
                                .style("stroke","black")
                                .style("stroke-width","0")
                                .style("fill", "black");
                            
                            
                            
                        
                        }//end of Ajax success response
                        
                        
                        
                    });//end of Ajax
    
                    
                    
                    var table2_data;
                    
                    $.ajax({

                        url: "http://cem-base.ornl.gov/cgi-bin/variable_call_query.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':'rootfr[pps%]___CLM_45_68'},
                        success: function(response){
                            
                            //alert(response.success);
                            //alert(response.message);
                            //alert(response.keys);
                            //alert(response.data);
                            

                        
                        function tabulate(data,columns)
                        {
                            var table=d3.select("#table2").append("table").attr("id","my_table2");
                        
                        
                            var thead=table.append("thead");
    
                            var tfoot=table.append("tfoot");
                            var tbody=table.append("tbody");
                        
                            //append the header row
                            
                            thead
                                .append("tr")
                                .selectAll("th")
                                .data(columns)
                                .enter()
                                .append("th")
                                .text(function(column) {return column;}
                                    
                            );
                            
                        
                        
                            tfoot
                                .append("tr")
                                .selectAll("th")
                                .data(columns)
                                .enter()
                                .append("th")
                                .text(function(column) {return column;}
                                    
                                );
                        

                        
                            //create a row for each object in the data
                            
                            var rows=tbody.selectAll("tr")
                                    .data(data)
                                    .enter()
                                    .append("tr");
                                    
                            //create a cell in each row for each column
                            
                            var cells=rows.selectAll("td")
                                    .data(function(row) {
                                        return columns.map(function(column){
                                            return {column: column, value: row[column]};
                                        });
                                    })
                                    .enter()
                                    .append("td")
                                    .text(function(d) {return d.value;});
                            
                            
                            
                             return table;
                            
                         }


                             //Remove the previous table from view
                             d3.select("#table2").select("table").remove();
                            
                             //Get data from server and populate the table
                             table2_data=response.data;
                             var peopleTable=tabulate(table2_data,["Function Name","Type"]);
                            
                            
                             //make the table sortable
                             $("#my_table2").tablesorter();
                            
                             var type_count=0; 
                             var type='Number of Function Calls Returned';
                            
                             for (var i in table2_data)
                             { 
                         
                                type_count++;

                             }
                             
                            d3.select("div.tab4_table2_legend").select("svg").remove();
                            
                            var width=$('#tab4_section2_bot_legend').width();
                            var height = 150;
                    
                            var svg_table2 = d3.select("div.tab4_table2_legend").
                                                append("svg").
                                                attr("width",width).
                                                attr("height",height);

                            x_offset=width/10;
                            
                            var text_index=[0];
                            var text_x=[0];
                            var text_y=[80];
                            
                            
                            var texts= svg_table2.selectAll("text").data(text_index).enter().append("text");
                            texts
                                .attr("x", function(d) {return text_x[d]+x_offset;})
                                .attr("y", function(d) {return text_y[d];})
                                .text(type+':  '+type_count)
                                .style("font-family", "Palatino")
                                .style("font-size", "15px")
                                .style("font-weight", "bold")
                                .style("stroke","black")
                                .style("stroke-width","0")
                                .style("fill", "black");

    
                        }//end of Ajax success response
                        
                        
                        
                    });//end of Ajax
    
       
 
 

           }
                  
           
           
           if(ui.newTab.index()==3)
                                    
           {
               
              $("#txtarea1").val("CanopyFluxes()\nPhotosynthesis()\nFrictionVelocity()\nMoninObukIni()\nQSat()\nFractionation()\n");
              $("#combobox1").val("CLM_45_10");
               
               d3.select("div.submodel_legend").select("svg").remove();
                var width = 300;
                var height = 250;
        
                var svg3 = d3.select("div.submodel_legend").
                                    append("svg").
                                    attr("width",width).
                                    attr("height",height);
                
                var x_dis=60;
                
                //Adding the legend
                var text=svg3.append("text");
                var textLabels=text
                    .attr("x", x_dis-8)
                    .attr("y", 30)
                    .text("Legend")
                    .style("font-family", "Times New Roman")
                    .style("font-size", "30px")
                    .style("fill","white")
                    .style("text-shadow","none");
                                    
                
                 
                 var circle_index=[0,1,2,3];
                 var circle_x=[x_dis,x_dis,x_dis,x_dis];
                 var circle_y=[62,92,112,132];
                 var circle_r=[10,6,6,6];
                 var circle_color=["yellow","green","#3366CC","red"];
                        
                 var circles= svg3.selectAll("circle").data(circle_index).enter().append("circle");
                  
                  
                 circles.attr("cx",function(d) {return circle_x[d];})
                    .attr("cy",function(d) {return circle_y[d];})
                    .attr("r",function(d) {return circle_r[d];})
                    .style("fill",function(d) {return circle_color[d];})
                    .style("stroke","white")
                    .style("stroke-width","1px");
                 
                 
                 
                 var text_index=[0,1,2,3,4];
                 var text_x=[-1,x_dis,x_dis,x_dis,x_dis];
                 var text_y=[-1,55,90,110,130];
                 var text_r=[-1,10,6,6,6];
                 var text_name=["legend","Function Calls","Subroutine Explicit","Global","Subroutine Explicit & Global"];
                 var texts= svg3.selectAll("text").data(text_index).enter().append("text");
                  
                 texts
                    .attr("x", function(d) {return text_x[d]+20;})
                    .attr("y", function(d) {return text_y[d]+text_r[d];})
                    .text(function(d) {return text_name[d];})
                    .style("fill", "white")
                    .style("font-family", "Times New Roman")
                    .style("font-size", "15px")
                    .style("text-shadow","none");


               
               $.ajax({
                        url: "http://cem-base.ornl.gov/cgi-bin/submodel_structure.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':'CanopyFluxes()\nPhotosynthesis()\nFrictionVelocity()\nMoninObukIni()\nQSat()\nFractionation()\n___CLM_45_10'},
                        success: function(response){
                            
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

console.log(text);


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
    
    force.stop();  //freeze the graph
});



                   }
                    });//end of ajax
                    
           }
           
           
           
           if(ui.newTab.index()==5)
           {

               d3.select("div.map").select("svg").remove(); 
                
               var width=$('#tab6_section1_bot').width();
               var height=$('#tab6_section1_bot').height();
               

               var svg = d3.select("div.map").append("svg")
                    .attr("width", width)
                    .attr("height",height);
               
               
               var projection = d3.geo.mercator()
                .scale(140)
                .translate([width / 2, height / 2]);
    
                var path = d3.geo.path().projection(projection);
                var g = svg.append("g");
                
                d3.json("map/countries.topojson", function(error, topology) 
                {
                    if (error) return console.error(error);
                    
                    var subunits = topojson.feature(topology, topology.objects.subunits);
                   
                    
                    svg.append("path")
                    .datum(subunits)
                    .attr("d",path)
                    .style("opacity",0.5);
                
                
                
                  d3.csv("map/Location_Stats.csv", function(error, data) {
                  
                  //d3.csv("http://cem-base.ornl.gov/var/www/html/Visitor_Info/Location_Stats.csv", function(error, data) {
    
                g.selectAll("circle")
                 .data(data)
                 .enter()
                 .append("circle")
                 .attr("cx",function(d)
                    {return projection([d.Longitude,d.Latitude])[0];}
                      )
                 .attr("cy",function(d)
                    {return projection([d.Longitude,d.Latitude])[1];}
                      )
                 .attr("r",function(d)
                    {return 3;
                        }
                      )
                 .style("fill",function(d)
                        {
                          return "green";
                        }
                       )
                 .style("opacity",0.5);

                    });
                    
                    
                    

                });
                
            
            
           }//end of tap 6

        }//end of active function
     
     });//end of tab initialization

});//end of function








