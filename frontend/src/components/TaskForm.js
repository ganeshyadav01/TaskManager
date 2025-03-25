import React, { useState } from 'react'
import Cookies from 'js-cookie'
import {toast} from 'react-toastify';
import {Button} from 'react-bootstrap';

import '../styles/TaskForm.css'


const TaskForm = ({taskDetails, addTask, viewTask, editTask, fetchData}) => {
    const [formData, setFormData] = useState({
        name: taskDetails ? taskDetails.name : "",
        description: taskDetails ? taskDetails.description : "",
        dueDate: taskDetails ? taskDetails.dueDate.split("T")[0] : "",
        status: taskDetails ? taskDetails.status : "Pending",
        priority: taskDetails ? taskDetails.priority : "Low",
      });
    const [showForm, setShowForm] = useState(true)

    const handlerchange = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handlerSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)
        const token = Cookies.get('jwtToken')

        let url = taskDetails ? `https://indpro-task-manager-application-backend.onrender.com/api/tasks/${taskDetails._id}`
         : 'https://indpro-task-manager-application-backend.onrender.com/api/tasks'

        // let url = taskDetails ? 
        // `http://localhost:5000/api/tasks/${taskDetails._id}`
        //  : 'http://localhost:5000/api/tasks'

        const options = {
            method:  taskDetails ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok) {
            setShowForm(false)
            toast.success(data.message)
            fetchData()
        } else {
            toast.error(data.message)
        }
    }

  return (
    <>
    { ((showForm && editTask === "editTask") || (showForm && addTask === 'addTask')) &&
        <form onSubmit={handlerSubmit} className='tenantform-form'>
            <h1 className='tenantform-form-heading'>{taskDetails ? 'Edit Task' : 'Add Task'}</h1>
             <div className='tenantform-input-card'>
                 <label className='tenantform-input-label' htmlFor='name'>Name</label>
                 <input onChange={handlerchange} className='tenantform-input' id='name' value={formData.name} type='text' name='name' placeholder='Enter task name' required />
             </div>
             <div className='tenantform-input-card'>
                 <label className='tenantform-input-label' htmlFor='description'>Description</label>
                 <input onChange={handlerchange} className='tenantform-input' id='description' value={formData.description} type='text' name='description' placeholder='Enter task description' required/>
             </div>
             <div className='tenantform-input-card'>
                 <label className='tenantform-input-label' htmlFor='dueDate'>Due Date</label>
                 <input onChange={handlerchange} className='tenantform-input' id='dueDate' value={formData.dueDate} type='date' name='dueDate' required/>
             </div>
             <div className='tenantform-input-card'>
                 <label className='tenantform-input-label' htmlFor='status'>Status</label>
                 <select onChange={handlerchange} className='tenantform-input' id='status' value={formData.status} type='text' name='status' placeholder='Enter status' required>
                    <option>Pending</option>
                   <option>Completed</option>
                 </select>
             </div>
             <div className='tenantform-input-card'>
                 <label className='tenantform-input-label' htmlFor='priority'>Priority</label>
                 <select onChange={handlerchange} className='tenantform-input' id='priority' value={formData.priority} type='text' name='priority' placeholder='Enter priority' required>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                 </select>
             </div>
             <div>
             <Button variant="success" className="me-3" type='submit'>{taskDetails ? 'Update' : 'Save'}</Button>
             <Button variant="primary" className="me-3" onClick={() => setShowForm(false)}>Close</Button>
             </div>
        </form>
    }
    {viewTask === "viewTask" && 
    <div className='tenant-info-card'>
        <h1 className='tenant-info-heading'>Task Info</h1>
        <p className='tenant-info-para'> <strong>Id:</strong> {taskDetails._id}</p>
        <p className='tenant-info-para'> <strong>Name:</strong> {taskDetails.name}</p>
        <p className='tenant-info-para'> <strong>Description:</strong> {taskDetails.description}</p>
        <p className='tenant-info-para'> <strong>Due Date:</strong> {new Date (taskDetails.dueDate).toLocaleDateString()}</p>
        <p className='tenant-info-para'> <strong>Status:</strong> {taskDetails.status}</p>
        <p className='tenant-info-para'> <strong>Priority:</strong> {taskDetails.priority}</p>
    </div>
    }
    </>
  )
}

export default TaskForm