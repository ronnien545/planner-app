import styles from "./page.module.css";
import { GET_LISTS } from '@/lib/queries';
import { useMutation } from '@apollo/client';
import { UPDATE_LIST} from '@/lib/queries';

function ModifyListTtitle({TaskListID,title}:{TaskListID:string,title:string}){
   
    const [updateList, { loading, error }] = useMutation(UPDATE_LIST, {
        refetchQueries: [{ query: GET_LISTS,}],
    });
    
    const onUpdate = (TaskListID:string,title:string ) => {
    
        try {
          updateList({ variables: { TaskListID,title} });
          console.log("successful update");  
        }
        catch (err) {
            console.error('Error updating:', err);
        }
    }

    return (<button className={styles.saveTitleBtn} onClick={()=>onUpdate(TaskListID,title)}>Save title</button>)


}

export default ModifyListTtitle;