import { MessageType, PersonType } from "./types";
import { TypedDocumentNode, gql } from "@apollo/client";

interface GetPeopleData {
  people: PersonType[];
}

export const GET_PEOPLE_QUERY: TypedDocumentNode<GetPeopleData> = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      lastMessage {
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
      lastRead
    }
  }
`;

export interface MessagesData {
  messages: MessageType[];
}

export interface MessagesVariables {
  personId?: string;
}

export const GET_MESSAGES_QUERY: TypedDocumentNode<
  MessagesData,
  MessagesVariables
> = gql`
  query GetMessages($personId: ID) {
    messages(personId: $personId) {
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
