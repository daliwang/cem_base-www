$( "#btn2" ).click(function() {

		d3.select("div.submodel_legend").select("svg").remove();
		var width = 300;
        var height = 400;

		var svg1 = d3.select("div.submodel_legend").
							append("svg").
							attr("width",width).
							attr("height",height);
		
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
            .style("stroke","white")
            .style("stroke-width","0")
            .style("fill", "white");
							

         
         var circle_index=[0,1,2,3];
         var circle_x=[x_dis,x_dis,x_dis,x_dis];
         var circle_y=[62,92,112,132];
         var circle_r=[10,6,6,6];
         var circle_color=["yellow","green","#3366CC","red"];
           		
         var circles= svg1.selectAll("circle").data(circle_index).enter().append("circle");
          
          
         circles.attr("cx",function(d) {return circle_x[d];})
          	.attr("cy",function(d) {return circle_y[d];})
          	.attr("r",function(d) {return circle_r[d];})
          	.style("fill",function(d) {return circle_color[d];});
         
         
         
         var text_index=[0,1,2,3,4];
         var text_x=[-1,x_dis,x_dis,x_dis,x_dis];
         var text_y=[-1,55,90,110,130];
         var text_r=[-1,10,6,6,6];
         var text_name=["legend","Function Calls","Subroutine Explicit","Global","Subroutine Explicit & Global"];
         var texts= svg1.selectAll("text").data(text_index).enter().append("text");
          
         texts
         	.attr("x", function(d) {return text_x[d]+20;})
			.attr("y", function(d) {return text_y[d]+text_r[d];})
			.text(function(d) {return text_name[d];})
			.style("font-family", "Times New Roman")
			.style("font-size", "14px")
            .style("fill", "white")
            .style("stroke","white")
            .style("stroke-width","0.5");
	
	

});//end of click
