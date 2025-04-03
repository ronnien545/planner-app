'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "./page.module.css";
import { CgAdd } from "react-icons/cg";
import { GET_LISTS} from '../lib/queries';
import { useQuery } from '@apollo/client';
import { useTransition } from "react";
import {useState,useEffect} from 'react';
import AddEntryBtn from '@/components/AddEntryBtn';
import AddTaskList from '@/components/AddTaskList';
import ModifyListTitle from '@/components/ModifyListTitle';
import { AiOutlineLoading } from "react-icons/ai";
import { CgPen } from "react-icons/cg";
import { CgTrash } from "react-icons/cg";

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


export default function Home() {
  type InputState = Record<string, string>
  const router = useRouter();
  const {data,loading,error} = useQuery(GET_LISTS);
  const [tasklists, setTaskLists] = useState<Map<string, TaskList>>(new Map());
  const [input,setInput] = useState<InputState>({});
  const [isLoading, startTransition] = useTransition();
  const [hoverIdRow, setHoverIdRow] = useState(''); 
  const [hoverIdEdit, setHoverIdEdit] = useState('');
  const [hoverIdDelete, setHoverIdDelete] = useState(''); 


  useEffect(() => {
    if (data?.TaskLists) {

      const newMap:Map<string, TaskList> = new Map(data.TaskLists.map((item:any)=> [item._id,item]));

      setTaskLists(newMap); 
      data.TaskLists.forEach((item:any) => {
        router.prefetch(`/lists/${item._id}`);
      });

    }
  }, [data, router]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  

  const handleTitleChange = (e:React.ChangeEvent<HTMLInputElement>,item_id: string) =>{
    const newTitle = e.target.value;
    setInput((prev) =>({
      ...prev,
      [item_id]:newTitle,
    }))
  }
  
  const handleRowClick = (id: string) => {
    startTransition(() => {
    router.push(`/lists/${id}`);
    }); 
  };

  const onEdit = (item_id:string) =>{
    console.log("test3"); 
    setTaskLists(prev => {
       const newMap = new Map(prev);
       const curritem = prev.get(item_id);
       newMap.set(item_id, {...(curritem||{ 
      _id: item_id, 
      title: '',
      newList: false,
      entries: [],
    }),newList:true})
       return newMap
    });
  }

  return (
    <section className={styles.page}>
      <h1>Pick a collection of tasks</h1>
      {isLoading&&<div className={styles.LoadingBox}>Loading...<span className={styles.spinner}></span></div>}
      <div className={styles.TableContainer}>
      <table className={styles.TaskTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number of Tasks</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(tasklists.entries()).map(([id,item]) => (
            item.newList?
            <tr key={id}>
              <td><input className={styles.InputTitle} type="text" defaultValue={item.title} onChange= {(e)=>handleTitleChange(e,item._id)} placeholder={'Enter title of task here.....'} /></td>
              <td><ModifyListTitle TaskListID={item._id} title={(input[item._id]||'')}/></td>
            </tr>:
            <tr key={id} className={styles.TaskRow}>
              <td style={{ backgroundColor: hoverIdRow === id ? '#414344' : '#f3f4f6', color:hoverIdRow === id?'aliceblue':''}}  onMouseEnter={() => setHoverIdRow(id)} onMouseLeave={() => setHoverIdRow('')} onClick={() => handleRowClick(id)}>{item.title}</td>
              <td style={{ backgroundColor: hoverIdRow === id ? '#414344' : '#f3f4f6', color:hoverIdRow === id?'aliceblue':''}} onMouseEnter={() => setHoverIdRow(id)}
        onMouseLeave={() => setHoverIdRow('')} onClick={() => handleRowClick(id)}>{item.entries.length}</td>
              <td><div className={styles.IconCircle}  onClick={() => onEdit(id)} style={{ backgroundColor: hoverIdEdit === id ? '#d9e00b' : '', color:hoverIdEdit === id?'aliceblue':''}} onMouseEnter={() => setHoverIdEdit(id)} onMouseLeave={() => setHoverIdEdit('')}><CgPen/>
              </div>
              {'   '}
              <div className={styles.IconCircle} style={{ backgroundColor: hoverIdDelete === item._id ? '#e04b0b' : '', color:hoverIdDelete === item._id?'aliceblue':''}} onMouseEnter={() => setHoverIdDelete(item._id)} onMouseLeave={() => setHoverIdDelete('')}><CgTrash/>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddTaskList/>
      </div>
    </section>
  );
}