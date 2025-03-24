import styles from "./page.module.css";
import { IoAddCircle } from "react-icons/io5";
import { GET_ENTRIES } from '@/lib/queries';
import { useMutation } from '@apollo/client';
import { CREATE_ENTRY } from '@/lib/queries';


function AddEntryIcon({TaskListID,id}:{TaskListID:string,id:number}){

    const [createEntry, { loading, error }] = useMutation(CREATE_ENTRY, {
        refetchQueries: [{ query: GET_ENTRIES, variables:{TaskListID}, }],
    });
      

    const onAdd = (TaskListID:string,item_id:number) => {


    const id=item_id;
    const title= "This is new title";
    const date="2020-01-01"
    const content= "This is new content";
    const edit=true;

    try {
      createEntry({ variables: {TaskListID, id, date,title, content,edit} });
      console.log("successful creation");  
    }
    catch (err) {
        console.error('Error creating entry:', err);
    }
   }

    return (<span className={styles.icon} onClick={() => onAdd(TaskListID,id)}><IoAddCircle /></span> );
}

export default AddEntryIcon;