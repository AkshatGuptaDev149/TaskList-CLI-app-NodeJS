//Importing necessary modules
import ListFunctions from "./ListFunctions.js";
import * as fs from 'node:fs/promises';
import { config } from "dotenv";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';


config();
let fileName=process.env.FILE_NAME;

//Checking if the tasks file specified by the environment variable exists or not.If not creating the file.
async function Initialize(){
    let dir=await fs.readdir('./')
    if(!(dir.includes(fileName))){
        let initialData = { "tasks":{} };
        await fs.writeFile(fileName, JSON.stringify(initialData, null, 2));
        console.log(`File ${fileName} created with initial content.`);
        return 
    }
}



//Function for handling the input for the function he chooses
async function handleInput(option){
    switch (option) {
        //Handling Add task 
        case '1':{
          let rl=readline.createInterface({input,output});
          let title=await rl.question('Enter the title of the task : ');
          let desc=await rl.question('Enter the content of the task : ');
          await ListFunctions.addTask(title,desc);
          rl.close()
          break;
        }
        //Handling Show a task  
        case '2':{
            let rl=readline.createInterface({input,output});
            let title=await rl.question('Enter the title of the task you want to read : ');
            await ListFunctions.readSpecificTask(title);
            rl.close()
            break;
        }

        //Handling Update a task
        case '3':{
            let rli=readline.createInterface({input,output});
            let title=await rli.question('Enter the title of the task you want to Update : ');
            await ListFunctions.Update(title);
            rli.close()
            break;
        }

        //Handling Show all tasks
        case '4':{
            await ListFunctions.showAll();
            break;
        }

        //Handling delete a task
        case '5':{
            let rl=readline.createInterface({input,output});
            let title=await rl.question('Enter the title of the task you want to delete : ');
            await ListFunctions.deleteSpecificTask(title)
            rl.close();
            break;  
        }

        //Handling delete all tasks
        case '6':{
            let rl=readline.createInterface({input,output});
            let cnfirm=await rl.question('Are you sure you want to delete all the tasks y/n : ');
            if (cnfirm.toLowerCase()=='y' || cnfirm.toLowerCase()=='yes'){
                await ListFunctions.deleteAll()
                rl.close();
                break;
            }
            else if(cnfirm.toLowerCase()=='n' || cnfirm.toLowerCase()=='no'){
                rl.close();
                break;
            }
            else{
                console.log("Invalid input, Please answer in y or n only")
                rl.close();
                break;
            }
        }

        //7th is handled in the Display menu function


        // Handle other options similarly
        default:
          console.log('Invalid option.');
      }
}


//Function for displaying the mainMenu and asking for a command
async function DisplayMenu(){
    await Initialize()
    while(true){
        console.log(`\n|______________TaskList Manager______________|\n`);
        console.log(`Our application provides the following functions`);
        console.log(`   __________________________________________`);
        console.log(`| 1.Add new task            2.Show a task     |`);
        console.log(`| 3.Update a task           4.Show All tasks  |`);
        console.log(`| 5.Delete a task           6.Delete all tasks|`);
        console.log(`| 7.Exit______________________________________|\n`);

        let rl=readline.createInterface({input,output});
        let answer=await rl.question('Write the Number of the function you wish to perform : ');
        
        let option=answer.trim();
        if (option=='7'){
            let p=new Promise((resolve,reject)=>{
                console.log("\n      __________Thanks for using our application__________");
                //Exiting the command line
                setTimeout(()=>{process.exit(0);},2000) 
            })
            let final=await p
            }
        else{await handleInput(option)}
            
    }
}


//Executing the Program
DisplayMenu()


