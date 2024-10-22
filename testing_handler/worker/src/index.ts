import { exec } from 'child_process';
import { createClient } from 'redis';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client'

const redis = createClient();
const publisher = createClient()
const QUEUE_NAME = 'requestQueue';
// const execPromise = promisify(exec);
const prisma = new PrismaClient()

interface Task {
  id: string;
  username: string;
  httpUrl: string;
  wsUrl: string;
}
async function processTask(payload: string) {
  const jestTestFile = `./test/index.test.js`;

  let task;
  try {
    task = JSON.parse(payload);
    console.log("task is ", JSON.parse(task));
    task = JSON.parse(task)
    console.log("HTTP URL is ", task["httpUrl"],Object.keys(task));
  } catch (error) {
    console.error("Error parsing payload:", error);
    return; 
  }

  const command = `npx jest ${jestTestFile}`;

  try {
    // const { stdout, stderr } = await execPromise(command);
    let stdout1 , stderr1

    exec(command, {env:{'HTTP_URL':task.httpUrl, 'WS_URL':task.wsUrl}}, (error, stdout, stderr) =>{
      stdout1 = stdout
      stderr1 = stderr
    })

    await new Promise(r=>{
      setTimeout(r,150000)
    })

    if (stderr1) {
      console.error(`Error: ${stderr1}`);
    }

    const success = !stderr1;

    await prisma.testResult.create({
      data: {
        id: task.id,
        username: task.username,
        httpUrl: task.httpUrl,
        wsUrl: task.wsUrl,
        success: success,
      },
    });

    const result = {
      error: false,
      msg: {
        id: task.id,
        username: task.username,
        output: stdout1,
        success: success,
      },
    };

    console.log("Task result:", result);

    await publisher.publish(`response.${task.id}`, JSON.stringify(result));

  } catch (error) {
    console.error("Error executing Jest:", error);
  }
}

async function worker() {
    const result = await redis.brPop(QUEUE_NAME, 0); 
    console.log("the result is ",result)
    const task = result?.element
    console.log('Processing task:', task);
    await processTask(JSON.stringify(task));
    worker()
}

redis.connect()
publisher.connect()
worker()