import { gql, TypedDocumentNode } from "@apollo/client";
import { MessageType } from "./types";

interface MessageReceivedSubscriptionData {
  messageReceived: MessageType;
}

export const MESSAGE_RECEIVED_SUBSCRIPTION: TypedDocumentNode<MessageReceivedSubscriptionData> = gql`
  subscription MessageReceived {
    messageReceived {
      id
      sender {
        id
        self
      }
      recipient {
        id
        self
      }
      body
      timestamp
    }
  }
`;
