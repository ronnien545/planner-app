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

export default function Home() {
  type InputState = Record<string, string>
  const router = useRouter();
  const {data,loading,error} = useQuery(GET_LISTS);
  const [input,setInput] = useState<InputState>({});
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    if (data?.TaskLists) { 
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
          {data.TaskLists.map((item:any) => (
            item.newList?
            <tr key={item._id}>
              <td><input className={styles.InputTitle} type="text" defaultValue={item.title} onChange= {(e)=>handleTitleChange(e,item._id)} placeholder={'Enter title of task here.....'} /></td>
              <td><ModifyListTitle TaskListID={item._id} title={(input[item._id]||'')}/></td>
            </tr>:
            <tr key={item._id}  onClick={() => handleRowClick(item._id)}  className={styles.TaskRow}>
              <td>{item.title}</td>
              <td>{item.entries.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddTaskList/>
      </div>
    </section>
  );
}