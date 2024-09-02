import React from 'react';

const DroneCard = ({ drone }) => {
    return (
        <div className='shadow p-2 rounded-md bg-blue-50 px-3 text-gray-800 flex justify-between gap-3 w-[300px]'>
            <div>
                <p className='font-semibold text-tiny md:text-sm'>{drone?.name}</p>
                <p className='text-xs md:font-medium'>{drone?.droneId}</p>
            </div>

            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQUaCzq95FRU8OgLagfhSQH2NdLq6oSqFNLw&s" alt="" className='h-14 w-24 object-cover' />
        </div>
    );
}

export default DroneCard;
