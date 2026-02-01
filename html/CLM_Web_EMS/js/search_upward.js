var table2_data;

$( "#variable_call_btn1" ).click(function() {


         
                    $.ajax({

                        url: "http://cem-base.ornl.gov/cgi-bin/variable_call_query.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':$('#variable_call_txtbox1').val()+'___'+$('#variable_call_combobox1').val()},
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
    
       
 
 

});//end of click


