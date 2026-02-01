var table1_data;






$( "#call_variable_btn1" ).click(function() {


                    
                    $.ajax({

                        url: "/cgi-bin/call_variable_query.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':$('#call_variable_txtbox1').val()+'___'+$('#call_variable_combobox1').val()},
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
                             d3.select("#table1").select("table").remove();
                            
                             //Get data from server and populate the table
                             table1_data=response.data;
                             var peopleTable=tabulate(table1_data,["Variable / Function Name","Type"]);
                        
                              
                             //make the table sortable
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
    
       
 
 

});//end of click


