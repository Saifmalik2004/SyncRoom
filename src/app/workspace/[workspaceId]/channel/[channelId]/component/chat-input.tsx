import dynamic from 'next/dynamic'
import Quill from 'quill'

import React, { useRef } from 'react'
interface CHatInputProps{
  placeholder:string;
}
const Editor=dynamic(()=> import("@/components/editor"),{ssr:false})
const ChatInput=({placeholder}:CHatInputProps)=> {
  const editorRef=useRef< Quill | null>(null)
  return (
    <div className='px-5 w-full'>
        <Editor
        placeholder={placeholder}
        onSubmit={()=>{}}
        disabled={false}
        variant='create'
        innerRef={editorRef}/>
    </div>
  )
}

export default ChatInput