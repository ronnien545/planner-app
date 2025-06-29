import { GET_ENTRIES } from '@/lib/queries';
import { useMutation } from '@apollo/client';
import { UPDATE_ORDER } from '@/lib/queries';
import { AiFillSave } from "react-icons/ai";

type EditItem = {
    id:number;
    date:string;
    title:string;
    content:string;
    
}  

export default function UpdateEntryOrder(){
    const [updateOrder, { loading, error }] = useMutation(UPDATE_ORDER);
    
    const onUpdateOrder = async (TaskListID:string,old_id:number,new_id:number) => {
    try {
        await updateOrder({ variables: {TaskListID,old_id,new_id}
        });
        console.log("successful update");  
        return true;
     }
     catch (err) {
        console.error('Error updating entry:', err);
        return false;
    }
    };
    
    return { onUpdateOrder, loading, error };
}