import { useCreateMessage } from '@/features/messages/api/use-create-messages';
import { useGenerateUplaodUrl } from '@/features/uplaod/api/use-generate-upload-url';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner';
import { Id } from '../../../../../../../convex/_generated/dataModel';


const Editor=dynamic(()=> import("@/components/editor"),{ssr:false})

interface ChatInputProps{
  placeholder:string;
}
interface CreateMessageValues{
  channelId:Id<"channels">;
  workspaceId:Id<"workspaces">
  body:string;
  image:Id<"_storage"> | undefined
}

const ChatInput=({placeholder}:ChatInputProps)=> {
  const [editorKey,setEditorKey]=useState(0)
  const [isPending,setIspending]=useState(false)

  const editorRef=useRef< Quill | null>(null)
  const channelId=useChannelId();
  const workspaceId=useWorkspaceId()
  const {mutate:createMessage}= useCreateMessage()
  const {mutate:generateUplaodUrl}= useGenerateUplaodUrl()

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
    editorRef?.current?.enable(false)

    const values:CreateMessageValues={
      channelId,
      workspaceId,
      body,
      image:undefined,

    }

    if(image){
      const url=await generateUplaodUrl({},{throwError:true})
      

      if(!url){
        throw new Error("Url not found");
      }

      const result =await fetch(url,{
        method:"POST",
        headers:{"Content-Type":image.type},
        body:image,
      });

      

      if(!result.ok){
          throw new Error("Failed to uplaod image")
        }

      const {storagId}=await result.json();

      values.image=storagId;
    }
    const result =await createMessage(values,{throwError:true});
  
    setEditorKey((prevKey)=> prevKey +1)
   } catch (error) {

    toast.error("failed to send message")

   }finally{
    setIspending(false)
    editorRef?.current?.enable(true)


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