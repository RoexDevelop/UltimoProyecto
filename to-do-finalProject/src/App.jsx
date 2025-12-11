import React from 'react'
import './style.css'
import { useState, useEffect } from 'react'

export function App () {
    const [inputTask, setInputTask] = useState('')
    const [tasks, setTasks] = useState([])

    function addTask(){
        if (!inputTask?.trim()) return //Si inputTask es null o undefined, salir de la función
        setTasks(prev => [...prev, {id:Date.now(), text:inputTask, done:false}])
        setInputTask('')
    }

    function deleteTask(id){
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    useEffect(() =>{
        console.log(tasks)
    },[tasks])
    
    return (
    <div className='min-h-screen bg-gray-500 flex items-center justify-center'>
        {/**Card */}
        <div id='card'
            className='bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-2xl'>
            <h1 className='text-2xl font-semibold flex justify-center'>TO-DO APP</h1>
            <form name='formAddTask'
                className='flex gap-1'>
                <input type="text" placeholder='Add new task'
                value={inputTask}
                onChange={e => setInputTask(e.target.value)}
                className='flex-1 p-1 border rounded bg-gray-100'/>
                <button type='button'
                    className='border rounded-md bg-blue-500 text-white px-2 py-0.5'
                    onClick={addTask}>Add</button>
            </form>


            <h3>{inputTask}</h3>
            {/**Tasks */}
            <div id='divTasks' className='border border-amber-600 grid sm:grid-cols-2 lg:grid-cols-3'>
                {tasks.map((task,key) =>
                // Div task
                <div id={task.id} className='border-2 border-gray-600 flex items-center gap-2 p-2'>
                    <input type="checkbox" />
                    <span className='flex-1'>{task.text}</span>
                    <button onClick={() => deleteTask(task.id)}
                        className='border rounded-md bg-red-500 text-white px-2 py-0.5'>Delete</button>
                </div>)}
            </div>
            
            <div className="w-full max-w-sm bg-red-300 sm:max-w-md sm:bg-yellow-300 lg:max-w-xl lg:bg-green-300 p-4 rounded-xl">
                Caja responsive
            </div>

        </div>

    </div>
    
    )
}