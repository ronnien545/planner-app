'use client'

import styles from './page.module.css';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { use } from 'react';
import { useQuery } from '@apollo/client';
import {useState,useEffect} from 'react';
import AddEntryIcon from '@/components/AddEntryIcon';
import AddEntryBtn from '@/components/AddEntryBtn';
import UpdateEntry from '@/components/UpdateEntry';
import DeleteEntry from '@/components/DeleteEntry';
import UpdateEntryOrder from '@/components/UpdateEntryOrder'
import { GET_ENTRIES} from '@/lib/queries';
import { GET_LISTS} from '@/lib/queries';
import { CgPen } from "react-icons/cg";

type EntryItem= {
  id:number;
  date:string;
  title:string;
  content:string;
  edit:boolean;
}

type TaskList={
  _id:string;
  title:string;
  newList:boolean;
  entries: EntryItem[];
}


export  default  function ListPage({params}:{params:  Promise<{ id: string }> }){
    
  const [todo,setToDo] = useState<EntryItem[]>([]);
  const [input,setInput] = useState<EntryItem[]>([]);

  const {id} = use(params);

  const {data,loading,error} = useQuery(GET_ENTRIES,{
      variables:{TaskListID: id}
  });

  const { onUpdateOrder } = UpdateEntryOrder();

  useEffect(() => {
      if (data?.TaskList.entries){
        setToDo(data.TaskList.entries);
        const edit_items = data.TaskList.entries.map((_:any,i:number)=> ({
          id:i+1,
          title:'',
          content:''
        }));
        setInput(edit_items);
  
      }
  }, [data]);

  console.log([...todo]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  

  const handleTextAreachange = (e: React.ChangeEvent<HTMLTextAreaElement>,item_id: number) => {
  const newObj = {...input[item_id-1],content:e.target.value};
  setInput((prev) => [...prev.slice(0,item_id-1),newObj, ...(prev.slice(item_id))])
  }

  const handleDateChange = (e:React.ChangeEvent<HTMLInputElement>,item_id: number) =>{
  const newObj = {...input[item_id-1],date:e.target.value};
  setInput((prev) =>[...prev.slice(0,item_id-1),newObj, ...(prev.slice(item_id))])
  }

  const handleTitleChange = (e:React.ChangeEvent<HTMLInputElement>,item_id: number) =>{
  const newObj = {...input[item_id-1],title:e.target.value};
  setInput((prev) =>[...prev.slice(0,item_id-1),newObj, ...(prev.slice(item_id))])
  }

  const onEdit = (item_id:number) =>{
  const newObj = {...todo[item_id-1],edit:true};
  setToDo((prev:any) => [...prev.slice(0,item_id-1),newObj, ...(prev.slice(item_id))]);
  }


  const createOnDragEnd = (TaskListID: string) => {
    return  async (result: DropResult) => {
      const updatedTodo = [...todo];

      console.log("check")
      if (!result.destination) return; 
      const itemToMove = { ...updatedTodo[result.source.index-1] };
      const itemToReplace = { ...updatedTodo[result.destination.index-1] };

      itemToMove.id = result.destination.index ;
      itemToReplace.id = result.source.index ;

      updatedTodo[result.source.index -1] = itemToReplace;
      updatedTodo[result.destination.index-1] = itemToMove;
      console.log(updatedTodo)

      setToDo(updatedTodo);

      console.log(result.source.index)
      console.log(result.destination.index)
      const success = await onUpdateOrder(TaskListID,result.source.index,result.destination.index);
      if (success){
         const a = 2;
      }
    };
  }

  if (todo.length==0){
    return (<section className={styles.page}>
      <h1 className={styles.h1}>{data.TaskList.title}</h1>
      <AddEntryBtn TaskListID={id}/>
      </section>)
  }

  return (
      <section className={styles.page}>
      <div>
      <h1 className={styles.h1}>{data.TaskList.title}</h1>
      <h2>Drag the number handles to change the order</h2>
      </div>
      <DragDropContext onDragEnd={createOnDragEnd(id)}>
      <Droppable droppableId="tasks">
       {(provided) =>(
          <div className={styles.container}  {...provided.droppableProps} ref={provided.innerRef}>
          {todo.map((item:any) => (
          <Draggable key={item.id} draggableId={item.id.toString()} index={item.id}>
          {(provided) => (
          <div key={item.id} ref={provided.innerRef} {...provided.draggableProps} className={styles.box}>
          <div className={styles.id} {...provided.dragHandleProps}>{item.id}</div>
          {
          item.edit?
          <div className={styles.topSectionEdit}>
          <div className={styles.date}><input defaultValue={item.date} onChange= {(e)=>handleDateChange(e,item.id)} type="date"/></div>
          <div className={styles.titleEdit}><input type="text" defaultValue={item.title} onChange= {(e)=>handleTitleChange(e,item.id)} placeholder={'Enter title of task here.....'} /></div>
          </div>
          :
          <div className={styles.topSection}>
          <div className={styles.date}>{item.date}</div>
          <div className={styles.title}>{item.title}</div>
          </div>
          }
          
          <div className={styles.lineContainerLeft}>
          <div className={styles.horizontalLine}></div> 
          </div>
          <div className={styles.lineContainerRight}>
          <div className={styles.rightLine}></div>
          </div> 
          
          {item.edit?
          <div className={styles.icons}>
          <UpdateEntry TaskListID={id} EditObject={input[item.id-1]}/>
          <p>Save</p>
          </div>
          :
          <div className={styles.icons}>
          <span className={styles.icon} onClick={() => onEdit(item.id)}><CgPen/></span> 
          <DeleteEntry TaskListID={id}  id={Number(item.id)}/>
          <AddEntryIcon TaskListID={id} id={Number(item.id)}/>
          </div>
          }
          {
          item.edit?
          <div className={styles.contentEdit}><textarea defaultValue={item.content} onChange= {(e)=>handleTextAreachange(e,item.id)} required placeholder={'Type task content here....'} rows={20} cols={82}/></div>:
          <div className={styles.content}>{item.content}</div>
          }
          </div>
          )}
          </Draggable>))}
          {provided.placeholder}
          </div>
       )} 
      </Droppable>
      </DragDropContext>
      </section>
  );
}
