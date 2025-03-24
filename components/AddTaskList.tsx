import styles from "./page.module.css";
import { GET_LISTS } from '@/lib/queries';
import { useMutation } from '@apollo/client';
import { CREATE_LIST} from '@/lib/queries';
import { CgAdd } from "react-icons/cg";

function AddTaskList(){
    const [createList, { loading, error }] = useMutation(CREATE_LIST, {
        refetchQueries: [{ query: GET_LISTS,}],
    });

    const onAdd = () => {
        const title= "This is new title";
        const newList= true;
    
        try {
          createList({ variables: { title,newList} });
          console.log("successful creation");  
        }
        catch (err) {
            console.error('Error creating entry:', err);
        }
    }
    
    return(<button className={styles.addLstButton} onClick={()=>onAdd()}>
        <span className={styles.iconCircle}>
        Create a New List
        <CgAdd className={styles.icon}/>
        </span>
      </button>)
}

export default AddTaskList;