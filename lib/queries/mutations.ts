import { gql } from '@apollo/client';

export const CREATE_ENTRY = gql`
  mutation createEntryItem($TaskListID: ID!,$id: Int!,$date:String!, $title: String!, $content: String!, $edit:Boolean!) {
    createEntryItem(TaskListID:$TaskListID ,id: $id,date:$date, title: $title, content: $content,edit:$edit) {
      id
      date
      title
      content
      edit
    }
  }
`;

export const UPDATE_ENTRY = gql`
  mutation updateEntryItem($TaskListID: ID!,$id: Int!, $date:String!, $title: String!, $content: String!, $edit:Boolean!){
    updateEntryItem(TaskListID:$TaskListID, id: $id, date: $date, title: $title, content: $content,edit:$edit){
      id
      date
      title
      content
      edit
    }
  }
`;

export const DELETE_ENTRY = gql`
  mutation deleteEntryItem($TaskListID: ID!, $id: Int!){
    deleteEntryItem(TaskListID:$TaskListID, id: $id)
  }
`;

export const CREATE_LIST= gql`
  mutation createList($title:String!, $newList:Boolean!){
    createList(title:$title, newList:$newList)
  }
`;

export const UPDATE_LIST= gql`
  mutation updateList($TaskListID: ID!, $title: String!){
    updateList(TaskListID:$TaskListID, title:$title)
  }
`;