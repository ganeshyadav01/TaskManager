import React, { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {Container, Table, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import { IoMdSearch } from "react-icons/io";

import Navbar from './Navbar'
import TaskForm from './TaskForm'

import '../styles/Home.css'


const Home = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage  = 5;
  const navigate = useNavigate()

  const token = Cookies.get('jwtToken')
  //let url = 'http://localhost:5000/api/tasks'
  let url = 'https://indpro-task-manager-application-backend.onrender.com/api/tasks'
  
  // fetching tasks
  const fetchTasks = useCallback(async () => {
    try {
      if (!token) {
        return navigate('/login');
      }

      const options = {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        setTasks(data)
        setFilteredTasks(data);
      } else {
        toast.error(data.message)
      }  
    } catch (error) {
      toast.error(error)
    }
}, [token, navigate, url])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // delete specific task by id
 const deleteTask = async id => {
    if (window.confirm("Are you sure you want to delete the task ?")) {
    const options = {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const response = await fetch(`${url}/${id}`, options)
    const data = await response.json()

    if (response.ok) {
        const updatedList = tasks.filter(task => task._id !== id);
        setTasks(updatedList);
      const filtered = updatedList.filter(each =>
        each.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredTasks(filtered);
      toast.success(data.message)
    } else {
      toast.error(data.message)
    }
    }
 }

 // fecthing tasks on updating, deleting tasks list
 const fetchData = () => {
   fetchTasks()
 }

 // Pagination Logic
 const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlerChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handlerSearchTask = () => {
    if (searchInput.trim() !== ''){
        const filteredTask = tasks.filter(each => each.name.toLowerCase().includes(searchInput.toLowerCase()))
        setFilteredTasks(filteredTask)
        setCurrentPage(1);
    } else {
        setFilteredTasks(tasks)
    }
  }

  return (
    <div>
      <Navbar />
      <Container>
        <h1 className="home-heading">Task Manager Application</h1>
        
        <div className='popup-search-card'>
        <Popup modal trigger={<Button variant="primary" className="mb-3">Add Task</Button>}>
          <TaskForm addTask="addTask" fetchData={fetchData} />
        </Popup>
         
         <div className='search-card'>
            <input className='search-input' type="search" value={searchInput} onChange={handlerChange} placeholder='Search Task' />
            <IoMdSearch onClick={handlerSearchTask} />
         </div>

        </div>
        
        <Table striped bordered hover>
          <thead>
            <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length !== 0 && 
            currentTasks.map(eachTask => (
              <tr key={eachTask._id}>
              <td>{eachTask.name}</td>
              <td>{eachTask.description}</td>
              <td>{new Date(eachTask.dueDate).toLocaleDateString()}</td>
              <td>{eachTask.status}</td>
              <td>{eachTask.priority}</td>
              <td>
                <Popup modal trigger={<Button variant="info" className="me-2 mb-2">View</Button>}>
                  <TaskForm taskDetails={eachTask} viewTask="viewTask" fetchData={fetchData} />
                </Popup>
                
                <Popup modal trigger={<Button variant="warning" className="me-2 mb-2">Edit</Button>}>
                  <TaskForm taskDetails={eachTask} editTask="editTask" fetchData={fetchData}/>
                </Popup>
                
                  <Button variant="danger" className="me-2 mb-2" onClick={() => deleteTask(eachTask._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {tasks.length > 0 &&
        <div style={{ marginTop: '10px'}}>
            <p style={{ margin: '0px'}}><strong>Total Tasks: </strong> {tasks.length}</p>
            <p style={{ margin: '0px'}}><strong>Pending Tasks: </strong>{(tasks.filter(each => each.status === "Pending")).length}</p>
            <p style={{ margin: '0px'}}><strong>Completed Tasks: </strong>{(tasks.filter(each => each.status === "Completed")).length}</p>
        </div>
        }     
        {currentTasks.length !== 0 &&
        <div className="pagination-container">
          <Pagination>
            <Pagination.Prev 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item 
                key={i + 1} 
                active={i + 1 === currentPage} 
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
        }
      </Container>
      {tasks.length === 0 &&
         <div className='home-emptylist-container'>
          <h1>Your tasks list is empty...</h1>
         </div>
        }
    </div>
  )
}

export default Home