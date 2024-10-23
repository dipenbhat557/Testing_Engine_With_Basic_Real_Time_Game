import { exec } from "child_process";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
import path from "path";

const redis = createClient();
const publisher = createClient();
const QUEUE_NAME = "requestQueueTesting";
const prisma = new PrismaClient();

interface Task {
  id: string;
  username: string;
  testId: string;
  envs: Record<string, string>;
}

function convertToStringMap(obj: any): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === 'object' && value !== null) {
              Object.assign(result, convertToStringMap(value));
          } else {
              result[key] = String(value);
          }
      }
  }

  return result;
}

function parseTestTimes(output: string): Array<{ name: string, time: number }> {
  const testTimes: Array<{ name: string, time: number }> = [];
  const regex = /√ (.+?) \((\d+) ms\)/g; 
  let match;

  while ((match = regex.exec(output)) !== null) {
    const testName = match[1];
    const time = parseInt(match[2], 10);
    testTimes.push({ name: testName, time });
  }

  return testTimes;
}

function parseFailedTests(output: string): string[] {
  const failedTests: string[] = [];
  const regex = /× (.+?) \((\d+) ms\)/g;  
  let match;
  // console.log("Inside parseFailedTests with output: ", output);

  while ((match = regex.exec(output)) !== null) {
    // console.log("Failed test match found:", match);
    const testName = match[1] || match[3];
    if (testName) {
      failedTests.push(testName);
    }
  }

  return failedTests;
}

function parseSuiteStats(output: string) {
  const suitesMatch = output.match(/Test Suites:\s*(\d+)\s*failed,\s*(\d+)\s*total/);
  const testsMatch = output.match(/Tests:\s*(\d+)\s*failed,\s*(\d+)\s*total/);
  const timeMatch = output.match(/Time:\s*([\d.]+)\s*s/); 

  const failedSuites = suitesMatch ? parseInt(suitesMatch[1], 10) : 0;
  const totalSuites = suitesMatch ? parseInt(suitesMatch[2], 10) : 0;

  const failedTests = testsMatch ? parseInt(testsMatch[1], 10) : 0;
  const totalTests = testsMatch ? parseInt(testsMatch[2], 10) : 0;

  const timeTakenInSec = timeMatch ? parseFloat(timeMatch[1]) : 0.0; 

  const passedSuites = totalSuites - failedSuites;
  const passedTests = totalTests - failedTests;

  return {
    totalSuites,
    failedSuites,
    passedSuites,
    totalTests,
    failedTests,
    passedTests,
    timeTakenInSec
  };
}


async function processTask(payload: string) {
  // console.log("inside this")
  let task: Task;
  try {
    task = JSON.parse(payload);
  } catch (error) {
    console.error("Error parsing payload:", error);
    return;
  }

  try {
    const testRecord = await prisma.test.findUnique({
      where: { id: task.testId },
    });

    if (!testRecord) {
      throw new Error(`Test with ID ${task.testId} not found.`);
    }

    let testFilePath = testRecord.testFileUrl;
    testFilePath = "./test/" + path.basename(testFilePath);
    const requiredEnvs = testRecord.envs;

    const providedEnvs = convertToStringMap(task.envs);

    for (let env in requiredEnvs) {
      if (!(env in Object.keys(providedEnvs))) {
        throw new Error(`Missing required environment variable: ${env}`);
      }
    }

    const command = `npx jest ${testFilePath}`;

    exec(command, { env: providedEnvs }, async (_, stderr, stdout) => {
      console.log("output is ", stdout);
      console.log("error is ", stderr);

      const success = !stdout.includes("FAIL");
      const testTimes = parseTestTimes(stdout);
      const failedTests = parseFailedTests(stdout);
      const suiteStats = parseSuiteStats(stdout);

      console.log("Individual test times:", testTimes);
      console.log("Failed test cases:", failedTests);
      console.log("Suite statistics:", suiteStats);

      await prisma.testResult.update({
        where: { id: task.id },
        data: {
          success: success,
          timeTaken: JSON.stringify(testTimes),  
          // failedTests: failedTests.length > 0 ? JSON.stringify(failedTests) : null, 
        },
      });

      const result = {
        error: false,
        msg: {
          id: task.id,
          username: task.username,
          success: success,
          testTimes: testTimes,
          failedTests: failedTests,
          suiteStats: suiteStats
        },
      };

      await publisher.publish(`response.${task.id}`, JSON.stringify(result));
    });
  } catch (error: any) {
    console.error("Error executing test:", error);

    const result = {
      error: true,
      msg: {
        id: task.id,
        username: task.username,
        output: error.message,
        success: false,
      },
    };

    await publisher.publish(`response.${task.id}`, JSON.stringify(result));
  }
}

async function worker() {
  const result = await redis.brPop(QUEUE_NAME, 0);
  const task = result?.element;

  if (task) {
    console.log("Processing task:", task);
    await processTask(task);
  }

  worker();
}

async function startServer() {
  await redis.connect();
  await publisher.connect();
  console.log("successfully connected to redis");
  worker();
}

startServer();