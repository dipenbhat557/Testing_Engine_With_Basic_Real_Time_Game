import express, { Request, Response } from "express";
import { randomUUID } from "crypto";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const app = express();
app.use(express.json());
const redis = createClient();
const subscriber = createClient();
const prisma = new PrismaClient();
const QUEUE_NAME = "requestQueueTesting";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../worker/src", "test"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${randomUUID()}.test.js`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

interface Payload {
  id: string;
  username: string;
  testId: string;
  envs: { [key: string]: string };
}

app.post(
  "/test/register",
  upload.single("testFile"),
  async (req: Request, res: Response): Promise<any> => {
    const { username, envs } = req.body;

    if (!username || !envs || !req.file) {
      return res.status(400).json({
        error: "Username, environment variables, and test file are required",
      });
    }

    try {
      const testId = randomUUID();
      const filePath = req.file.path;

      const parsedEnvs = Array.isArray(envs) ? envs : JSON.parse(envs);

      await prisma.test.create({
        data: {
          id: testId,
          username: username,
          testFileUrl: filePath,
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
  console.log("user is ", username);

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
