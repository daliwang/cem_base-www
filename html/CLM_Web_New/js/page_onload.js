
var ip_info='';

function page_onload()
    {
        
        var time = new Date();

        $.get("http://ipinfo.io", function(location) 
        
        {

            ip_info=ip_info+location.ip+'_';
            ip_info=ip_info+location.loc+'_';
            ip_info=ip_info+location.city+'_';
            ip_info=ip_info+location.region+'_';
            ip_info=ip_info+location.country+'_';
            ip_info=ip_info+time;
            
            //alert("hello");
            //alert(ip_info);
            
            
            $.ajax({
                        url: "/cgi-bin/Visitor_Info.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':ip_info},
                        success: function(response)
                
                            {      
                                // In order to make it work, make the CLM_Web directory writable
                                // Chmod -R 755 CLM_Web
                                //alert("finished");
                                console.log("finished");
                
                            }//end of response

    
                }); //end of Ajax
            
            
        
        
                
        }, "jsonp");//the end of $.get

        
       /*
          
       //Get IP location
       $.ajax( { 
          url: '//freegeoip.net/json/', 
          type: 'POST', 
          dataType: 'jsonp',
          success: function(location) 
            {
                         
                ip_info=ip_info+location.ip+'_';
                ip_info=ip_info+location.country_name+'_';
                ip_info=ip_info+location.country_code+'_';
                ip_info=ip_info+location.city+'_';
                ip_info=ip_info+location.zipcode+'_';
                ip_info=ip_info+location.longitude+'_';
                ip_info=ip_info+location.latitude+'_';
                ip_info=ip_info+location.areacode+'_';       
                ip_info=ip_info+location.region_code+'_';
                ip_info=ip_info+location.region_name+'_';
                
                

                var currentdate = new Date(); 
                var current_time =(currentdate.getMonth()+1)  + "/" 
                            + currentdate.getDate() + "/" 
                            + currentdate.getFullYear() + " @ "  
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();
                            
                
                ip_info=ip_info+current_time;
                
                //alert(ip_info);
                
                
                         $.ajax({
                        url: "/cgi-bin/Visitor_Info.py",
                        type: "get",
                        datatype:"json",
                        data: {'key1':ip_info},
                        success: function(response)
                
                            {      
                                //alert("finished");
                
                            }//end of response

    
                }); //end of Ajax
                
                
           }
           

        });//for ajax getting ip information
        
        */
     
    }//end of page onload
    


