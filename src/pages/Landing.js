import React from 'react'
import SignUpButton from '../components/SignUpButton'


const Landing = () => {
  return (
    <div className='bg-gray-200'>
          <div>
      <SignUpButton />
    </div>
    <h1 className='font-mono font-bold text-white'> <span className='text-blue-400'> Create AI </span> <span className='text-black'>Art</span> share Ideas  <span className='text-black'> make connections</span> </h1>
        <img className='w-screen ' src="portl.png"alt={"image"} />
    </div>
  )
}

export default Landing