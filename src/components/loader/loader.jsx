import React from 'react'

export const Loader = () => {
  return (
    <div className='loader_main_wraper'>
      <div className='loader_main'>
        <div className="spinner-dot-border" role="status">
          <div className='dotCircle' />
          <div className='dotCircle' />
          <div className='dotCircle' />
          <div className='dotCircle' />
        </div>
      </div>
    </div>
  )
}