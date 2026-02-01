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

CLM_version=''
input_function=''

for k in fs.keys():

    key_string=(str(fs.getvalue(k))).split('___')
    
    CLM_version=str(key_string[1])
    input_function=str(key_string[0])
    
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "html"))
dirpath = os.path.join(base_dir, "CLM_call_graph")

input_node = os.path.join(dirpath, CLM_version + "_call_node.csv")
input_edge = os.path.join(dirpath, CLM_version + "_call_edge.csv")

result['message']=result['message']+'\n'+input_node+'\n'+input_edge+'\n'+input_function


#Step1: Read all the unique nodes and edges

nodes={}
nodes2={}
    
file1=open(input_node,'r')
line_count1=0
for line1 in file1:
        
    line_count1+=1
    if(line_count1!=1):
            
        elements=str(line1.replace('\n',''))
        node_id=elements.split(',')[0]
        node_name=elements.split(',')[1]
        nodes[node_name]=node_id
        nodes2[node_id]=node_name
file1.close()

edges=[]
edge_num=0
file2=open(input_edge,'r')
line_count2=0
for line2 in file2:
        
    line_count2+=1
    if(line_count2!=1):  
        elements=str(line2.replace('\n',''))
        source_id=elements.split(',')[0]
        target_id=elements.split(',')[1]
        edges.append([])
        edges[edge_num].append(source_id)
        edges[edge_num].append(target_id)
        edge_num+=1
    
file2.close()

#Step 2: Get the first tier
first_tier={}
first_tier[input_function]=[]


#Step 3: Get the child of the first tier & Get the name list of second tier
    
second_tier={}
for key in first_tier:
        
    parent_id=nodes[key]
        
    for i in range(0,len(edges)):
            
        source_id=str(edges[i][0])
        target_id=str(edges[i][1])
            
        if(parent_id==source_id):
                
            first_tier[key].append(nodes2[target_id])
            second_tier[nodes2[target_id]]=[]

#Step 4: Get the child of the second tier & Get the name list of third tier
            
third_tier={}
for key in second_tier:
        
    parent_id=nodes[key]
        
    for i in range(0,len(edges)):
            
        source_id=str(edges[i][0])
        target_id=str(edges[i][1])
            
        if(parent_id==source_id):
                
            second_tier[key].append(nodes2[target_id])
            third_tier[nodes2[target_id]]=[]

#Step 5: Get the child of the third tier & Get the name list of fourth tier
            
fourth_tier={}
for key in third_tier:
        
    parent_id=nodes[key]
        
    for i in range(0,len(edges)):
            
        source_id=str(edges[i][0])
        target_id=str(edges[i][1])
            
        if(parent_id==source_id):
                
            third_tier[key].append(nodes2[target_id])
            fourth_tier[nodes2[target_id]]=[]
    

#Write the output to JSON
json_str=''
    
json_str+='{'+'\n'

#1st tier
for element_1 in first_tier:

    json_str+='"name":"'+str(element_1)+'",'+'\n'
    json_str+='"mark":"'+'0'+'"'+'\n'
        
    #2nd tier
        
    #If first tier has no child
    if(len(first_tier[element_1])==0):
            
        json_str+='}'+'\n'
        
    else:
            
        json_str+=',"children":['+'\n'
            
            
        count2=0
        for element_2 in first_tier[element_1]:
                
            count2+=1
            json_str+='{"name": "'+str(element_2)+'",'+'\n'
            json_str+='"mark":"'+'0'+'"'+'\n'
                
            #If second tier has no child node
            if(len(second_tier[element_2])==0):
                    
                if(count2!=len(first_tier[element_1])):
                        json_str+='},'+'\n'
                else:
                        json_str+='}'+'\n'
                
            else:
                    
                json_str+=',"children":['+'\n'
                count3=0
                    
                for element_3 in second_tier[element_2]:
                    count3+=1
                        
                    json_str+='{"name": "'+str(element_3)+'",'+'\n'
                    if(len(third_tier[element_3])==0):
                        json_str+='"mark":"'+'0'+'"'+'\n'
                    else:
                        json_str+='"mark":"'+'1'+'"'+'\n'
                        
                    if(count3!=len(second_tier[element_2])):
                            
                        json_str+='},'+'\n'
                    else:
                        json_str+='}'+'\n'
                    
                json_str+=']'+'\n'
                    
                if(count2!=len(first_tier[element_1])):
                    json_str+='},'+'\n'
                else:
                    json_str+='}'+'\n'
                  
    
    
        json_str+=']'+'\n'
        json_str+='}'+'\n'

model_json=json.loads(json_str)


result['data']=model_json

if(len(first_tier[element_1])==0):
    
    result['data']=''


sys.stdout.write(json.dumps(result,indent=1))

sys.stdout.write("\n")

sys.stdout.close()    
