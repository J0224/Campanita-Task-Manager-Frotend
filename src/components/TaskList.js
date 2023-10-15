import axios from "axios"
import  { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import { toast } from "react-toastify";
import { URL } from "../App";
import loadingImg from "../assets/loader.gif";

//http://localhost:4000/api/tasks

//This is an async fuction called TaskList is what we can do
//this is the functionally part from the frontend connected to DB
const TaskList = () => {

  //These are useStateSnipet variables
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [taskId, setTaskId] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    completed: false
  });
  const { name } = formData;
//Fuction to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
   //Async fuction to get all Tasks from the server
  const getTasks = async () => {
    setIsLoading(true);// Set isLoading to true when loading tasks
    try {
    const {data} =  await axios.get(`${URL}/api/tasks`);
    setTasks(data);
    } catch (error) {
      toast.error (error.message);
    }finally{
      setIsLoading(false);// Set isLoading to false after loading tasks
    }
  };

  useEffect(() =>{
    getTasks();
  }, []);
  //This is an async fuction called createTask
  const createTask = async (e) => {
    e.preventDefault();
    if (name === ""){
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`,formData);
      toast.success("Task added successfully");
      setFormData({...formData, name: ""});
      getTasks()
      
    } catch (error) {
      toast.error(error.message);
    }
  };
  //This is an async fuction called deleteTask
  const deleteTask = async (id) =>{
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() =>{
    const cTask = tasks.filter((task) => {
      return task.completed === true
    })
    setCompletedTasks(cTask)

  }, [tasks] )

  //This is an async fuction called getSingleTask
  const getSingleTask = async (task) => {
    setFormData({name: task.name, completed: false});
    setTaskId(task._id)
    setIsEditing(true)
  };

  //This is an async fuction called updateTask
  const updateTask = async (e) =>{
    e.preventDefault()
    if(name === ""){
      return toast.error("Input fields cannot be empty.")
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskId}`, formData)
      setFormData({...formData, name: ""})
      setIsEditing(false)
      getTasks()
    } catch (error) {
      toast.error(error.message);
    }
  };

  //This is an async fuction called setTocomplete
  const setTocomplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      getTasks()
    } catch (error) {
      toast.error(error.message);
    }
  };

  //This is jsx Mock 
  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm name={name} 
      handleInputChange={handleInputChange} 
      createTask={createTask}
      isEditing={isEditing}
      updateTask={updateTask}
      />

     {tasks.length > 0 && (
      <div className="--flex-between --pb">
      <p>
        <b>Total Tasks:</b> {tasks.length}
      </p>
      <p>
        <b>Completed Tasks:</b> {completedTasks.length}
      </p>
    </div>
     )}
      
      <hr />
      {
        isLoading && (
          <div className="--flex-center">

            <img src={loadingImg} alt="loading" />
            
          </div>
        )}
        {
          !isLoading && tasks.length === 0 ? (
            <p className="py">No task added. Please add a task</p>
          ): (
            <>
            {tasks.map((task, index ) =>{
              return ( 
                <Task
                 key={task._id} 
                 task={task} 
                 index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setTocomplete={setTocomplete}
                 />
              )
            })}
            </>
          )
        }

    </div>
  );
};

export default TaskList;
