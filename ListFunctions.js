//Importing necessary modules
import * as fs from "fs/promises"
import { config } from "dotenv";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
config();

let fileName=process.env.FILE_NAME;

//Function to Check whether a task already exists in the file or not.
async function CheckDuplicate(taskName){
    let data=await fs.readFile(fileName,'utf-8');
    let parsedData=JSON.parse(data);
    for (let key in parsedData.tasks){
        if(key==taskName){
            return true;
            break;
        }
    }
    return false
    
}


//Function to add new tasks or write new tasks in the json file
async function addTask(title,value) {
    let IsDuplicate=await CheckDuplicate(title);
    if (!IsDuplicate){
        try {
        // Read existing data from file
        let existingData = await fs.readFile(fileName, 'utf-8');
        let parsedData = JSON.parse(existingData);

        // Add newData to the parsed data
        parsedData['tasks'][title]=value;

        // Write the modified data back to the file
        let jsonContent = JSON.stringify(parsedData, null, 2);
        await fs.writeFile(fileName, jsonContent, 'utf-8');
        console.log('Task Added Sucessfully');
        }
        catch (error) {
            throw new Error(`Error appending to JSON file: ${error.message}`);
        }
    }    
    else{
        console.log("A task with this title already exists, So please choose a different one")
    }
}



//Function to read a specific task from the List/Json file

async function readSpecificTask(title) {
    let doesExist=await CheckDuplicate(title);
    if(doesExist){
        let data=await fs.readFile(fileName,'utf-8');
        let parsedData=JSON.parse(data);
        console.log(`    Task             Description \n    ${title}:    ${parsedData['tasks'][title]}` )
    }
    else{
        console.log(`A task with the title '${title}' does not exist.`)
    }
}

//Function to show/read all tasks with a single command
async function showAll(){
    let show=`    Task             Description \n`
    let Srno=0
    let data=await fs.readFile(fileName,'utf-8');
    let parsedData=JSON.parse(data);
    for (let key in parsedData.tasks){
        Srno++;
        show+=`  ${Srno}. ${key}:    ${parsedData['tasks'][key]}\n`
    }
    console.log(show)
}


//Function to update a task
async function Update(title){
    let doesExist=await CheckDuplicate(title);
    if(doesExist){
        try {
            // Read existing data from file
            let existingData = await fs.readFile(fileName, 'utf-8');
            let parsedData = JSON.parse(existingData);
    
            // Update the task 
            let rl=readline.createInterface({input,output});
            console.log(`\npreviously this task had the following content : ${parsedData['tasks'][title]}`);
            let desc=await rl.question('Enter the new Updated content of the task : ');
            parsedData['tasks'][title]=desc;
            
            // Write the modified data back to the file
            let jsonContent = JSON.stringify(parsedData, null, 2);
            await fs.writeFile(fileName, jsonContent, 'utf-8');
            console.log('Task Updated Sucessfully');
            rl.close()
            }
        catch (error) {
            throw new Error(`Error appending to JSON file: ${error.message}`);
        }
    }
    else{
        console.log(`task with the title ${title} doesn't exist.`)
    }
}


//Function to delete a specific task
async function deleteSpecificTask(title){
    let doesExist=await CheckDuplicate(title);
    if(doesExist){
        try {
            // Read existing data from file
            let existingData = await fs.readFile(fileName, 'utf-8');
            let parsedData = JSON.parse(existingData);
    
            // Delete the task 
            delete parsedData['tasks'][title];
    
            // Write the modified data back to the file
            let jsonContent = JSON.stringify(parsedData, null, 2);
            await fs.writeFile(fileName, jsonContent, 'utf-8');
            console.log('Task Deleted Sucessfully');
            }
        catch (error) {
            throw new Error(`Error appending to JSON file: ${error.message}`);
        }
    }
    else{
        console.log(`task with title ${title} doesn't exist.`)
    }
}


//Function to Delete all tasks at once
async function deleteAll(){
    let newFile={
        "tasks":{
        }
    }
    let newFileString=JSON.stringify(newFile,null,2);
    await fs.writeFile(fileName, newFileString, 'utf-8');
    console.log("All tasks deleted Sucessfully")
}


//exporting all functions to use them in index.js
export default {CheckDuplicate,addTask,readSpecificTask,showAll,Update,deleteSpecificTask,deleteAll}