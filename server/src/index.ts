import express, { Request, Response } from 'express';
import { randomUUID } from 'crypto'
import multer from 'multer';

const users: { [userId: string]: { username: string, password: string, avatarUrl?: string, sessionToken: string } } = {};
const rooms: { [roomId: string]: { ownerId: string, dimensions: string } } = {};
const sessionTokens: { [sessionToken: string]: string } = {}; 

const app = express();
const PORT = 8000;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());

const generateSessionToken = (): string => randomUUID()

const authenticate = (req: Request, res: Response, next: any):any => {
  let authHeader = req.headers['authorization'];
  console.log("auth headers are ",authHeader)
  if (!authHeader) {
    return res.status(404).json({msg:"Please provide your token"});
  }else if(typeof authHeader == 'object'){
    authHeader = authHeader![0]
  }

  const token = authHeader.split(' ')[1];
  if (!token || !sessionTokens[token]) {
    return res.status(404).json({msg:"Please provide correct token"});
  }

  req.body.userId = sessionTokens[token]; 
  next();
};

app.post('/signup', (req: Request, res: Response):any => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    const userId = randomUUID()
    const sessionToken = generateSessionToken();
  
    users[userId] = { username, password,avatarUrl:"", sessionToken };
  
    sessionTokens[sessionToken] = userId;
  
    res.json({ sessionToken, userId });
  });

  app.post('/rooms', authenticate, (req: Request, res: Response):any => {
    const { dimensions } = req.body;
    let authHeader = req.headers['authorization']
    if (!authHeader) {
      return res.status(404).json({msg:"Please provide auth header"});
    }else if(typeof authHeader == 'object'){
      authHeader = authHeader![0]
    }
    let userId;

    if (!dimensions || !/^\d+x\d+$/.test(dimensions)) {
      return res.status(400).json({ error: 'Invalid room dimensions format. Use nxm.' });
    }

    for(let id in sessionTokens){
      if(sessionTokens[authHeader] == id){
        userId = id
      }
    }
  
    const roomId = randomUUID();
    rooms[roomId] = { ownerId: userId, dimensions };
  
    res.json({ roomId });
  });

app.get('/users/:userId', (req: Request, res: Response):any => {
  const { userId } = req.params;

  const user = users[userId];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ username: user.username, avatarUrl: user.avatarUrl || "Not assigned yet" });
});

app.put('/users/:userId/avatar', authenticate, upload.single('avatarImage'), (req: Request, res: Response):any => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No avatar image provided' });
  }

  const avatarUrl = `/uploads/${req.file.filename}`; 

  users[userId].avatarUrl = avatarUrl;

  res.json({ avatarUrl });
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
