#!/usr/bin/env python3

import sys
import json
import cgi
import os


#Get the user specified function call(subroutines)
#Return the list of variables called by the function

#(1) Get the user-specified submodel cgi

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

#(2) Loop through the particular CLM version and generate unique nodes

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "html"))
dirpath = os.path.join(base_dir, "CLM_Components_New")
input_file = os.path.join(dirpath, CLM_version, input_function.split('()')[0] + '.txt')

label=['Subroutine_in','Subroutine_out','Global_readonly','Global_writeonly','Global_modified','Global_non','Function Call']
json_str=''

file1=open(input_file,'r')

line_count1=0
for line1 in file1:
    
    line_count1+=1
    if(line_count1==8):
        break
    items=line1.replace('\n','').split(', ')
    
    item_count=0
    for item in items:
        item_count+=1
        if(item!='' and item_count!=1):
            
            #If it is a variable
            if(line_count1<7):
                v_index=item.rfind("%")
                item_name=str(item[v_index+1:])
                item_type=str(item[0:v_index+1])
                item=item_name+'['+item_type+']'
                            
            #If it is a function
            if(line_count1==7):
                item=item+'()'
                
            json_str+='{'
            json_str+='"Variable / Function Name":"'+str(item)+'",'
            json_str+='"Type":"'+str(label[line_count1-1])+'"'
            json_str+='},'
file1.close()

json_str=json_str[:-1]
json_str='['+json_str+']'

    
result['message'] = input_file

model_json=json.loads(json_str)


result['data']=model_json


sys.stdout.write(json.dumps(result,indent=1))

sys.stdout.write("\n")

sys.stdout.close()
