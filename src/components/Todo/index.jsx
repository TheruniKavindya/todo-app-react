import React, { useContext } from 'react'
import { TodoContext } from '../../Context'

function Todo({ id, text }) {

    const { dispatchEvent } = useContext(TodoContext);

    function removeTodo() {
        dispatchEvent("DELETE_TODO", { id, text });
    }
    return (

        <div id={id} className='bg-white w-[70%] h-12 rounded-md flex items-center px-5 py-auto relative'>
            <div className="flex items-center font-thin flex-1">
                <input id="default-checkbox" type="checkbox" value="" className="w-5 h-5 text-blue-600 bg-gray-100 rounded-full border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{text}</label>
            </div>
            <div className='flex items-center space-x-2'>
                <button type='button' onClick={removeTodo}>
                    <i className="bi bi-trash3"></i>
                </button>

                <button type='button'>
                    <i className="bi bi-pencil-square"></i>
                </button>
            </div>

        </div>

    )
}

export default Todo