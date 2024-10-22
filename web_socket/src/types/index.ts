interface Position {
    x: number;
    y: number;
  }
  
  interface User {
    userId: string;
    position: Position;
  }
  
  interface Room {
    [userId: string]: User;
  }
  
  interface Rooms {
    [roomId: string]: Room;
  }