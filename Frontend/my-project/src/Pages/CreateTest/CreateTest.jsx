import React from 'react';

function CreateTest(params) {
    return (
        <div className='w-screen h-screen bg-blue-900 flex justify-center items-center'>
            <form className='bg-white p-8 rounded shadow-md w-3/5 flex flex-col'>
                <div className='flex mb-4'>
                    <div className='mr-4 w-1/2'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                            Name
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='name'
                            type='text'
                            placeholder='Enter test name'
                        />
                    </div>
                    <div className='w-1/2'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='duration'>
                            Duration
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='duration'
                            type='text'
                            placeholder='Enter test duration'
                        />
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='description'>
                        Description
                    </label>
                    <textarea
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='description'
                        placeholder='Enter test description'
                    />
                </div>
                <div className='flex mb-4'>
                    <div className='mr-4 w-1/2'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='start-time'>
                            Valid Start Time
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='start-time'
                            type='datetime-local'
                        />
                    </div>
                    <div className='w-1/2'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='end-time'>
                            Valid End Time
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='end-time'
                            type='datetime-local'
                        />
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='button'
                    >
                        Create Test
                    </button>
                </div>
            </form>
            
        </div>
    );
}

export default CreateTest;