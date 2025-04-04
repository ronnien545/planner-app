import styles from "./page.module.css";
import { GET_LISTS } from '@/lib/queries';
import { useMutation } from '@apollo/client';
import { DELETE_LIST} from '@/lib/queries';
import {useState,useEffect} from 'react';
import { CgTrash } from "react-icons/cg"


function DeleteTaskList({TaskListID}:{TaskListID:string}){

    const [hoverIdDelete, setHoverIdDelete] = useState(''); 

    const [deleteList, { loading, error }] = useMutation(DELETE_LIST, {
        refetchQueries: [{ query: GET_LISTS,}],
    });

    const onDelete = (TaskListID:string ) =>{

        try {
            deleteList({ variables: { TaskListID} });
            console.log("successful delete");  
          }
          catch (err) {
              console.error('Error deleting:', err);
        }

    }

   return( <span onClick={() => onDelete(TaskListID)} ><CgTrash/></span>);
}

export default DeleteTaskList;