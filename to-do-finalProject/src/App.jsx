import React from 'react'
import './style.css'
import { useState, useEffect } from 'react'

export function App () {
    const [filters, setFilters] = useState([{id:Date.now()+(Math.random()*1000).toPrecision(5), nameFilter: 'All', isFiltering: true},
        {id:Date.now()+(Math.random()*1000).toPrecision(5), nameFilter: 'Active', isFiltering: false},
        {id:Date.now()+(Math.random()*1000).toPrecision(5), nameFilter: 'Completed', isFiltering: false}
    ])
    const activeFilter = filters.find(f => f.isFiltering)?.nameFilter // Para mi lista derivada (mostrar mis datos segun el tipo de iltro que esté en acción)
    const [inputTask, setInputTask] = useState('')
    const [tasks, setTasks] = useState(() => {
        try {
            const storedTasks = localStorage.getItem("tasks") // Busco si hay algo en local storage para inicializar
            return storedTasks ? JSON.parse(storedTasks) : []
        } catch (error) {
            console.error("Error al parsear las tareas de localStorage", error)
            return []
        }
    })


    // --- Tasks ---
    function handleAddTask(e){
        e.preventDefault() //Evitar que el formulario recargue la página
        if (!inputTask?.trim()) return //Si inputTask es null o undefined, salir de la función
        setTasks(prev => [...prev, {id:Date.now()+(Math.random()*1000).toPrecision(5), text:inputTask, done:false, isEditing:false, tempText:''}])
        setInputTask('')
    }

    {/**Completa una tarea al dar al checkbox o viceversa si le quita el check */}
    function completeTask(id){
        // prev = previous state
        setTasks(prev => prev.map(task => 
            task.id === id
                ? { ...task, done: !task.done }
                : task
            )
        )
    }

    function deleteTask(id){
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    function editTask(id){
        setTasks(prev => prev.map(task => 
            task.id === id 
                ? {...task, isEditing: !task.isEditing, tempText: task.text} 
                : task
            )

        )
    }

    function changingText(text, id){
        setTasks(prev => prev.map(task =>
            task.id === id
                ? {...task, tempText: text }
                : task
        ))
    }

    function cancelEditTask(id){
        setTasks(prev => prev.map(task => 
            task.id === id
                ? {...task, isEditing: !task.isEditing, tempText: ''}
                : task
        ))
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

    // --- FILTERS FUNCTIONS --- 
    function switchFilter(id){ 
        setFilters(prev => prev.map(filter => ( 
            {...filter, isFiltering: filter.id === id} 
        )))
    }

    function getFilterCount(nameFilter){
        if (nameFilter === 'All') return tasks.length
        if (nameFilter === 'Active') return tasks.filter(task => !task.done).length
        if (nameFilter === "Completed") return tasks.filter(task => task.done).length
        return 0
    }

    // Lista filtrada
    function getFilteredTasks(){
        if (activeFilter === "Active") {
            return tasks.filter(task => !task.done)
        }

        if (activeFilter === "Completed"){
            return tasks.filter(task => task.done)
        }

        return tasks // -> All tasks
    }


    useEffect(() =>{
        localStorage.setItem("tasks", JSON.stringify(tasks))
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
                    Add
                </button>
            </form>
            {/**FILTROS */}
            <nav className='flex justify-center gap-2 sm:gap-10'>
                {filters.map((filter) => 
                    <div key={filter.id} onClick={() => switchFilter(filter.id)}
                        className={`flex flex-col items-center rounded px-8 py-1 cursor-pointer ${filter.isFiltering ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
                        <span className=''>{filter.nameFilter}</span>
                        <span className='text-sm'>{getFilterCount(filter.nameFilter)}</span>
                    </div>
                )}
            </nav>
            {/**Tasks */}
            <div id='divTasks' className='grid lg:grid-cols-2 gap-3'>
                {getFilteredTasks().map((task) =>
                // Div task
                task.isEditing ?
                    //Si es true entra modo edición
                    (<div key={task.id} className='border-2 rounded border-gray-600 flex items-center gap-3 p-3'>
                        <input type="text"
                            className='flex-1 p-1 border-2 border-blue-500 rounded'
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