import { gql } from '@apollo/client';

export const GET_ENTRIES= gql`
  query GetEntries($TaskListID: ID!){
    TaskList(TaskListID: $TaskListID){
      _id
      title
      newList
      entries {
       id
       date
       title
       content
       edit
      }
    }
  }
`

export const GET_LISTS = gql`
  query GetLists {
    TaskLists{
      _id
      title
      newList
      entries {
       id
       date
       title
       content
       edit
      }
    }
  }
`;