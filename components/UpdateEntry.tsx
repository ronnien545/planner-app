import styles from "./page.module.css";
import { GET_ENTRIES } from '@/lib/queries';
import { useMutation } from '@apollo/client';
import { UPDATE_ENTRY } from '@/lib/queries';
import { AiFillSave } from "react-icons/ai";

type EditItem = {
    id:number;
    date:string;
    title:string;
    content:string;
}  

function UpdateEntry({TaskListID,EditObject}:{TaskListID:string,EditObject:EditItem}){
    const [UpdateEntry, { loading, error }] = useMutation(UPDATE_ENTRY, {
        refetchQueries: [{ query: GET_ENTRIES,variables:{TaskListID} }],
    });

    const onUpdate = (TaskListID:string,id:number,date:string,title:string,content:string) => {
      const edit = false;
      date = (date)?date:"2020-01-01";
        
      try {
         UpdateEntry({ variables: {TaskListID,id, date,title, content,edit} });
         console.log("successful update");  
      }
      catch (err) {
         console.error('Error updating entry:', err);
      }
    }

    return (
    <span className={styles.icon} onClick={()=>onUpdate(TaskListID,EditObject.id,EditObject.date,EditObject.title,EditObject.content)}>
    <AiFillSave />
    </span>
    );
}

export default UpdateEntry;