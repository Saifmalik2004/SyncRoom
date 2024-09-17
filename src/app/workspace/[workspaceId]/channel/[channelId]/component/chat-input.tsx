import { useCreateMessage } from '@/features/messages/api/use-create-messages';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner';

const Editor=dynamic(()=> import("@/components/editor"),{ssr:false})

interface CHatInputProps{
  placeholder:string;
}

const ChatInput=({placeholder}:CHatInputProps)=> {
  const [editorKey,setEditorKey]=useState(0)
  const [isPending,setIspending]=useState(false)

  const editorRef=useRef< Quill | null>(null)
  const channelId=useChannelId();
  const workspaceId=useWorkspaceId()
  const {mutate:createMessage}= useCreateMessage()
  const handleSubmit=async({
    body,
    image
  }:{
    body:string;
    image:File|null
  })=>{
    console.log({image,body})
   try {
    setIspending(true)
    await createMessage({
      channelId,
      workspaceId,
      body
  },{throwError:true});
  setEditorKey((prevKey)=> prevKey +1)
   } catch (error) {
    toast.error("failed to send message")
   }finally{
    setIspending(false)

   }
   
  }
  return (
    <div className='px-5 w-full'>
        <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        variant='create'
        innerRef={editorRef}/>
    </div>
  )
}

export default ChatInput