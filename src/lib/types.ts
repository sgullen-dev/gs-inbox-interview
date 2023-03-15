export interface PersonType {
  id: string;
  firstName: string;
  lastName: string;
  lastMessage?: {
    id: string;
    sender: {
      id: string;
      self: boolean;
    };
    recipient: {
      id: string;
      self: boolean;
    };
    body: string;
    timestamp: string;
  };
  lastRead?: string;
  self: boolean;
}

export interface MessageType {
  id: string;
  sender: PersonType;
  recipient: PersonType;
  body: string;
  timestamp: string;
}
