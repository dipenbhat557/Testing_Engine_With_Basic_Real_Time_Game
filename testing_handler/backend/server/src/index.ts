import express, { Request, Response } from "express";
import { randomUUID } from "crypto";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import cors from 'cors'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let notion: any;
let NotionAPI: any;
(async () => {
  const { NotionAPI: NotionAPIClass } = await import("notion-client");
  NotionAPI = NotionAPIClass;
  notion = new NotionAPI();
})();

const app = express();
app.use(express.json());
app.use(cors())

const redis = createClient();
const subscriber = createClient();
const prisma = new PrismaClient();
const QUEUE_NAME = "requestQueueTesting";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    switch (file.fieldname) {
      case 'testFile':
        uploadPath = path.join(__dirname, "../../worker/src/test");
        break;
      case 'thumbnailImage':
        uploadPath = path.join(__dirname, "../../worker/src/thumbnail");
        break;
      default:
        return cb(new Error('Unexpected field'), "");
    }

    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${randomUUID()}-${file.originalname}`; 
    cb(null, uniqueName); 
  },
});

const upload = multer({ storage }); 

interface UploadedFiles {
  testFile?: Express.Multer.File[];
  thumbnailImage?: Express.Multer.File[];
}


interface Payload {
  id: string;
  username: string;
  testId: string;
  envs: { [key: string]: string };
}

app.get('/notion-page/:pageId', async (req, res) => {
  if (!notion) {
    res.status(500).json({ error: 'Notion API is not initialized yet' });
    return;
  }
  
  const { pageId } = req.params;
  try {
    const recordMap = await notion.getPage(pageId);
    res.json(recordMap);
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    res.status(500).json({ error: 'Failed to fetch Notion page' });
  }
});

app.post(
  "/test/register",
  upload.fields([{
    name: 'testFile', maxCount: 1
  }, {
    name: 'thumbnailImage', maxCount: 1
  }]), async (req: Request, res: Response): Promise<any> => {
    const { username, envs, notionLink, title } = req.body;

    const files = req.files as UploadedFiles; 

    // console.log("req files are ", files);

    const testFile = files.testFile ? files.testFile[0] : null;
    const thumbnailImage = files.thumbnailImage ? files.thumbnailImage[0] : null;

    // console.log("test file is ",testFile)
    // console.log("thumbnail image is ",thumbnailImage)

    if (!username || !envs || !testFile || !testFile.path ) {
      return res.status(400).json({
        error: "Username, environment variables, test file, and thumbnail image are required",
      });
    }

    try {
      const testId = randomUUID();
      const testFilePath = testFile.path; 
      // console.log("test file path is ",testFilePath)
      const thumbnailImagePath = thumbnailImage?.path || null 

      const parsedEnvs = Array.isArray(envs) ? envs : JSON.parse(envs);

      await prisma.test.create({
        data: {
          id: testId,
          username: username,
          testFileUrl: testFilePath,
          thumbnailUrl: thumbnailImagePath, 
          notionLink: notionLink,          
          title: title,                   
          envs: parsedEnvs,
        },
      });

      res.json({ testId, message: "Test registered successfully" });

    } catch (error) {
      console.error("Error registering test:", error);
      res.status(500).json({ error: "Failed to register test" });
    }
  }
);

app.post("/test/submit", async (req: Request, res: Response): Promise<any> => {
  // console.log("request is ",req)
  const { username, testId, envs } = await req.body;
  // console.log("user is ", username);

  if (!username || !testId || !envs) {
    return res
      .status(400)
      .json({
        error: "Username, testId, and environment variables are required",
      });
  }

  const taskId = randomUUID();

  const parsedEnvs = typeof envs === "object" ? envs : JSON.parse(envs);

  const testRecord = await prisma.test.findFirst({
    where: { id: testId },
  });

  if (
    !testRecord ||
    !testRecord.envs.every((key: string) => parsedEnvs.hasOwnProperty(key))
  ) {
    return res
      .status(404)
      .json({ error: "Please provide all required environment variables" });
  }

  console.log("reached bedore");
  await prisma.testResult.create({
    data: {
      id: taskId,
      username: username,
      success: false,
      testId:testId,
      timeTaken:{},
      createdAt: new Date(),
    },
  });
  console.log("reached after")

  try {
    const payload: Payload = { id: taskId, username, envs: parsedEnvs, testId };

    const pubSubPromise = handlePubSubWithTimeout(taskId, 50000);
    console.log("before pushing")
    await redis.lPush(QUEUE_NAME, JSON.stringify(payload));
    console.log("after pushing")

    const response = await pubSubPromise;
    console.log("response is ",response)

    if (response.error) {
      return res.status(404).json({ msg: response.msg });
    } else {
      console.log("response is ",response.msg)
      return res.json({
        taskId,
        message: "Test submitted successfully",
        result: response.msg,
      });
    }
  } catch (e: any) {
    res
      .status(500)
      .json({ msg: "Could not reach your URLs", error: e.message });
  }
});

app.get("/tests", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    console.log("page is ",page, " page size is ",pageSize)

    const skip = (page - 1) * pageSize;

    const totalTests = await prisma.test.count();

    const tests = await prisma.test.findMany({
      skip: skip,
      take: pageSize,
    });

    res.json({
      page,
      pageSize,
      totalTests,
      totalPages: Math.ceil(totalTests / pageSize),
      data: tests,
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Failed to fetch tests" });
  }
});

app.get("/tests/:testId", async (req: Request, res: Response):Promise<any> => {
  const { testId } = req.params;
  console.log("got req with ",testId)

  try {
    const test = await prisma.test.findUnique({
      where: {
        id: testId,
      },
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json(test);
  } catch (error) {
    console.error("Error fetching test details:", error);
    res.status(500).json({ error: "Failed to fetch test details" });
  }
});


const handlePubSubWithTimeout = (
  uid: string,
  timeoutMs: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const channel = `response.${uid}`;

    const timeout = setTimeout(() => {
      subscriber.unsubscribe(channel);
      reject(new Error("Response timed out"));
    }, timeoutMs);

    subscriber.subscribe(channel, (data) => {
      clearTimeout(timeout);
      subscriber.unsubscribe(channel);
      resolve(JSON.parse(data));
    });
  });
};

app.listen(3000, async () => {
  await redis.connect();
  await subscriber.connect();
  console.log("API server is running on port 3000");
});
