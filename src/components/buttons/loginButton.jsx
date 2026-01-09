import React from 'react'

const LoginButton = ({btntype, loginEvent, btntext}) => {
  return (
    <button 
        type={btntype} 
        onClick={loginEvent} 
        className='min-w-[100px] h-8 bg-red-700 text-white text-[12px] rounded cursor-pointer'>
            {btntext}
        </button>
  )
}

export default LoginButton