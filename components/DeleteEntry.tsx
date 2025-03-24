import styles from "./page.module.css";
import { GET_LISTS } from '@/lib/queries';
import { DELETE_ENTRY } from '@/lib/queries';
import { useMutation } from '@apollo/client';
import { CgTrash } from "react-icons/cg";


function DeleteEntry({TaskListID,id}:{TaskListID:string,id:number}){
   
    const [DeleteEntry, { loading, error }] = useMutation(DELETE_ENTRY, {
        refetchQueries: [{ query: GET_LISTS, variables:{TaskListID}}],
    });
    
    const onDelete = (TaskListID:string,id:number) => {
    
    try {
        DeleteEntry({ variables: { TaskListID,id} });
        console.log("successful deletion");  
    }
    catch (err) {
        console.error('Error deleting entry:', err);
    } 
    
    }

    return (<span className={styles.icon} onClick={() => onDelete(TaskListID,id)}><CgTrash/></span>);

}

export default DeleteEntry;