#!/usr/bin/env python3

import sys
import json
import cgi
import os


#(1) Get the user-specified cgi

fs = cgi.FieldStorage()

sys.stdout.write("Content-Type: application/json")

sys.stdout.write("\n")
sys.stdout.write("\n")

result = {}
result['success'] = True
result['message'] = "The command Completed Successfully"
result['keys'] = ",".join(fs.keys())



#Step 1: Summarize the number of unique locations of IP and how many types each location appears

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "html"))
dirpath3 = os.path.join(base_dir, "Visitor_Info")
dirpath4 = os.path.join(base_dir, "Visitor_Info")


file3 = open(os.path.join(dirpath3, "Traffic.csv"), 'r')
file4 = open(os.path.join(dirpath4, "Location_Stats.csv"), 'w')
file4.writelines("Latitude,Longitude,Frequency"+'\n')

location={}

line3_count=0
for line3 in file3:
    
    line3_count+=1
    if(line3_count!=1):
        
        
        lat_stat=line3.split(',')[1]
        lng_stat=line3.split(',')[2]
        stat=str(lat_stat)+'_'+str(lng_stat)
        
        if stat in location:
            location[stat]+=1
        else:
            location[stat]=1
file3.close()

keys=location.keys()
for key in keys:
    
    input_lat=str(key.split('_')[0])
    input_lng=str(key.split('_')[1])
    fre=str(location[key])
    
    file4.writelines(input_lat+','+input_lng+','+fre+'\n')
file4.close()


#Step 2: Start collecting ip address information and update into the database

dirpath1 = os.path.join(base_dir, "Visitor_Info")
dirpath2 = dirpath1
file1 = open(os.path.join(dirpath1, "Traffic.csv"), "a")
file2 = None
if dirpath2 != dirpath1:
    file2 = open(os.path.join(dirpath2, "Traffic.csv"), "a")

info=''


for k in fs.keys():
    
    key_string=(str(fs.getvalue(k))).split('_')
    
    
    for i in range(0,len(key_string)):

        if(i==len(key_string)-1):
            info+=str(key_string[i])
        
        else:    
            if(i==1):
                lat=str(key_string[i].split(',')[0])
                lng=str(key_string[i].split(',')[1])
                info=info+lat+','+lng+','   
            else:
                info+=str(key_string[i]+',')
        
    file1.writelines(info+'\n')
    if file2 is not None:
        file2.writelines(info+'\n')

file1.close()
if file2 is not None:
    file2.close()


result['data']=''
sys.stdout.write(json.dumps(result,indent=1))

sys.stdout.write("\n")

sys.stdout.close()    
