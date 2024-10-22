import express, { Request, Response } from "express";
import { randomUUID } from "crypto";
import { createClient } from "redis";

const app = express();
const redis = createClient();
const subscriber = createClient();
app.use(express.json());

const QUEUE_NAME = "requestQueue";

interface Payload {
  id: string;
  username: string;
  httpUrl: string;
  wsUrl: string;
}

app.post("/submit-test", async (req: Request, res: Response): Promise<any> => {
  const { username, httpUrl, wsUrl } = req.body;

  if (!username || !httpUrl || !wsUrl) {
    return res
      .status(400)
      .json({ error: "Username, HTTP URL, and WebSocket URL are required" });
  }

  const taskId = randomUUID();
  const payload: Payload = { id: taskId, username, httpUrl, wsUrl };

  const pubSubPromise = handlePubSubWithTimeout(taskId, 50000);

  await redis.lPush(QUEUE_NAME, JSON.stringify(payload));

  try {
    const response = await pubSubPromise;
    if(response.error)
        return res.status(404).json(response.msg)
    else
        return res.json(response.msg);
  } catch (e: any) {
    res.status(404).json({ msg: "Could not reach your URLs" });
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
      resolve(data);
    });
  });
};

app.listen(3000, () => {
  redis.connect();
  subscriber.connect();
  console.log("API server is running on port 3000");
});
