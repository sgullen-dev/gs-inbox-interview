import { MessageType, PersonType } from "./types";
import { TypedDocumentNode, gql } from "@apollo/client";

interface MutationResponseType<T> {
  code: string;
  success: boolean;
  message: string;
  result: T;
}

type SendMessageData = { sendMessage: MutationResponseType<MessageType> };

interface SendMessageVariables {
  messageId: string;
  recipientId: string;
  body: string;
}

export const SEND_MESSAGE_MUTATION: TypedDocumentNode<
  SendMessageData,
  SendMessageVariables
> = gql`
  mutation SendMessage($messageId: ID!, $recipientId: ID!, $body: String!) {
    sendMessage(messageId: $messageId, recipientId: $recipientId, body: $body) {
      code
      success
      message
      result {
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
  }
`;

type MarkReadData = { markRead: MutationResponseType<PersonType> };

interface MarkReadVariables {
  personId: string;
  lastRead: string;
}

export const MARK_READ_MUTATION: TypedDocumentNode<
  MarkReadData,
  MarkReadVariables
> = gql`
  mutation MarkRead($personId: ID!, $lastRead: DateTime!) {
    markRead(personId: $personId, timestamp: $timestamp) {
      code
      success
      message
      result {
        id
        lastRead
      }
    }
  }
`;
