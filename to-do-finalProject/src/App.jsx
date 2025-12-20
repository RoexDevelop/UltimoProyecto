import React from 'react'
import './style.css'
import { useState, useEffect } from 'react'

export function App () {
    const [inputTask, setInputTask] = useState('')
    const [tasks, setTasks] = useState([])

    function handleAddTask(e){
        e.preventDefault() //Evitar que el formulario recargue la página
        if (!inputTask?.trim()) return //Si inputTask es null o undefined, salir de la función
        setTasks(prev => [...prev, {id:Date.now(), text:inputTask, done:false, isEditing:false, tempText:''}])
        setInputTask('')
    }

    {/**Completa una tarea al dar al checkbox o viceversa si le quita el check */}
    function completeTask(id){
        const newArrayTasks = tasks.map((task) => {
            if (task.id === id) {
                return {...task, done: !task.done}
            }
            return task
        })
        setTasks(newArrayTasks)
    }

    function deleteTask(id){
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    function editTask(id){
        const newArrayTasks = tasks.map((task) => {
            if (task.id === id) {
                return{...task, isEditing: !task.isEditing, tempText: task.text}
            }
            return task
        })
        setTasks(newArrayTasks)
    }

    function changingText(text, id){
        const newArrayTasks = tasks.map((task) =>{
            if (task.id === id) {
                return{...task, tempText: text }
            }
            return task
        })
        setTasks(newArrayTasks)
    }

    function cancelEditTask(id){
        const newArrayTasks = tasks.map((task) => {
            if (task.id === id) {
                return {...task, isEditing: !task.isEditing, tempText: ''}
            }
            return task
        })
        setTasks(newArrayTasks) 
    }

    function updateTask(id){
        const newArrayTasks = tasks.map((task) => {
            if (task.id === id) {
                return {...task, text: task.tempText, tempText: '', isEditing: !task.isEditing}
            }
            return task
        })
        setTasks(newArrayTasks)
    }

    useEffect(() =>{
        console.log(tasks)
    },[tasks])
    
    return (
    <div className='min-h-screen bg-gray-500 flex items-center justify-center'>
        {/**Card */}
        <div id='card'
            className='bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-2xl space-y-4'>
            <h1 className='text-2xl font-semibold flex justify-center'>TO-DO APP</h1>
            <form name='formAddTask'
                className='flex gap-1'
                onSubmit={handleAddTask}>
                <input type="text" placeholder='Add new task'
                    value={inputTask}
                    onChange={e => setInputTask(e.target.value)}
                    className='flex-1 px-3 py-2 border rounded bg-gray-100'/>
                <button type='submit'
                    className='border rounded-md bg-blue-500 text-white px-3 py-1 cursor-pointer'>
                        Add</button>
            </form>


            <h3>{inputTask}</h3>
            {/**Tasks */}
            <div id='divTasks' className='grid lg:grid-cols-2 gap-3'>
                {tasks.map((task) =>
                // Div task
                task.isEditing?
                    //Si es true entra modo edición
                    (<div key={task.id} className='border-2 rounded border-gray-600 flex items-center gap-3 p-3'>
                        <input type="text"
                            className='flex-1 p-1 border rounded'
                            value={task.tempText ?? ""} // Operador coalescencia nula: devuelve izquierda si NO! es null || undefined 
                            onChange={e => changingText(e.target.value, task.id)}/>
                        <button onClick={() => updateTask(task.id)}
                                className='border rounded-md bg-green-400 text-white px-3 py-1 cursor-pointer '>
                            Guardar
                        </button>
                        <button onClick={() => cancelEditTask(task.id)}
                                className='border rounded-md bg-red-500 text-white px-3 py-1 cursor-pointer '>
                            Cancel
                        </button>
                    </div>)
                :
                    //Si no está editando, está normal
                    (<div key={task.id} className='border-2 rounded border-gray-600 flex items-center gap-3 p-3'>
                        <input type="checkbox" checked={task.done} onChange={() => completeTask(task.id)} />
                        <span className={ `flex-1 wrap-anywhere ${task.done?'line-through text-gray-400' : 'text-gray-800 text-lg '}`}>
                            {task.text}
                        </span>
                        <button onClick={() => editTask(task.id)}
                                className='border rounded-md bg-amber-500 text-white px-3 py-1 cursor-pointer'>
                            Edit
                        </button>
                        <button onClick={() => deleteTask(task.id)}
                                className='border rounded-md bg-red-500 text-white px-3 py-1 cursor-pointer '>
                            Delete
                        </button>
                    </div>)
                )}
            </div>
            
            <div className="w-full max-w-sm bg-red-300 sm:max-w-md sm:bg-yellow-300 lg:max-w-xl lg:bg-green-300 p-4 rounded-xl">
                Caja responsive
            </div>

        </div>

    </div>
    
    )
}