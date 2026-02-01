#!/usr/bin/env python3

import sys
import json
import cgi
import os


#(1) Get the user-specified submodel cgi

fs = cgi.FieldStorage()

sys.stdout.write("Content-Type: application/json")

sys.stdout.write("\n")
sys.stdout.write("\n")

result = {}
result['success'] = True
result['message'] = "The command Completed Successfully"
result['keys'] = ",".join(fs.keys())


#The dictionary recording all the user-specified models
model_list = {}
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "html"))
components_dir = os.path.join(base_dir, "CLM_Components_New")
dirpath = components_dir


for k in fs.keys():

    key_string=(str(fs.getvalue(k))).split('___')
    
    input_model=str(key_string[0])
    elements=input_model.split('\n')
    for element in elements:
        if(element!=''):
            model_list[element]=0
    
    folder = (str(key_string[1])).replace('\n', '')
    dirpath = os.path.join(components_dir, folder)
    result['message'] = dirpath
        
    #model_list[str(fs.getvalue(k))]=0

    result['message']=result['message']+str(fs.getvalue(k))

#model_list['CanopyFluxes']=0
#model_list['Photosynthesis']=0


#(2) Read the CLM group information
group={}

path = components_dir
file_g = open(os.path.join(path, 'CLM_group.csv'), 'r')
line_count=0
for line in file_g:
    line_count+=1
    if(line_count==1):
        continue
    group_id=line.replace('\n','').split(',')[0]
    group_item=line.replace('\n','').split(',')[1]
    group[group_item]=group_id
file_g.close()


#(3) Loop through the particular CLM version and generate unique nodes

nodes={}

m_keys=model_list.keys()
for m_key in m_keys:
    
    #7 means the group category of function calls
    if m_key in nodes:
        nodes[m_key].append(7)
    else:
        nodes[m_key]=[]
        nodes[m_key].append(7)

    f_name = os.path.join(dirpath, str(m_key.split('()')[0]) + ".txt")
    
    file1=open(f_name,'r')
    #file1=open('/var/www/html/CLM_Components/CLM_45/Photosynthesis.txt','r')
    
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
                
                if item in nodes:
                    nodes[item].append(line_count1)

                else:
                    nodes[item]=[]
                    nodes[item].append(line_count1)
                                
    file1.close()
    

#(4) Generate group information

n_keys=nodes.keys()
for n_key in n_keys:
    
    group_info=''
    nodes[n_key].sort()
    for i in range(0,len(nodes[n_key])):
        if(i==0):
            group_info=group_info+str(nodes[n_key][i])
        else:
            if(nodes[n_key][i]!=nodes[n_key][i-1]):
                group_info=group_info+' '+str(nodes[n_key][i])
    nodes[n_key]=group[group_info]

#(5) Generate the JSON object

links=[]
link_num=0

m_keys=model_list.keys()
for m_key in m_keys:
    
    file1 = open(os.path.join(dirpath, str(m_key.split('()')[0]) + '.txt'), 'r')
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
                
                link_dis=0
                #If it is a variable
                if(line_count1<7):
                    v_index=item.rfind("%")
                    item_name=str(item[v_index+1:])
                    item_type=str(item[0:v_index+1])
                    item=item_name+'['+item_type+']'
                    link_dis=20
                            
                #If it is a function
                if(line_count1==7):
                    item=item+'()'
                    link_dis=80
                       
                source=str(m_key)
                s_group=str(nodes[m_key])
                target=str(item)
                t_group=str(nodes[target])
            
                link='{'
                link+='"s_group":"'+s_group+'",'+'"source":"'+source+'",'
                link+='"type":"licensing",'
                link+='"t_group":"'+t_group+'",'+'"target":"'+target+'",'
                link+='"distance":"'+str(link_dis)+'"'
                link+='}'
                links.append([])
                links[link_num].append(link)
                link_num+=1
                

#(6) Post the JSON object
json_str=''
json_str+='{\n'
json_str+='"links":[\n'

for j in range(0,len(links)):
    if(j!=len(links)-1):
        
        json_str+=str(links[j][0])+','+'\n'
    else:
        json_str+=str(links[j][0])+'\n'

json_str+=']\n'
json_str+='}\n'


model_json=json.loads(json_str)

result['data']=model_json

   
#result['data']=[]


sys.stdout.write(json.dumps(result,indent=1))

sys.stdout.write("\n")

sys.stdout.close()
