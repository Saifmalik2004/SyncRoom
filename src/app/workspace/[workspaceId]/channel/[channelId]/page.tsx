'use client'

import { useGetChannel } from "@/features/channels/api/use-get-channel"
import { useChannelId } from "@/hooks/use-channel-id"
import { Loader, TriangleAlert } from "lucide-react"
import Header from "./component/header"
import ChatInput from "./component/chat-input"
import { useGetMessages } from "@/features/messages/api/use-get-messages"

const ChannelIdPage=()=> {
  const channelId=useChannelId()
  const {results}=useGetMessages({channelId});

  const {data:channel,isLoading:channelLoading}=useGetChannel({id:channelId});
  console.log(results)
  if(channelLoading){
    return(
      <div className="h-full  flex-1 flex items-center justify-center  gap-2">
        <Loader className="s-ze6 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  if(!channel){
    return(
      <div className="h-full  flex-1 flex items-center justify-center flex-col gap-y-2">
        <TriangleAlert className="size-5  text-muted-foreground"/>
        <span className="text-sm text-muted-foreground">
          Channel not found
        </span>
      </div>
    )
  }
  return (
    <div className=' h-full flex flex-col '>
     <Header name={channel.name}/>
     <div className="flex-1"/>
     <ChatInput placeholder={`Message # ${channel.name}`}/>
     
      </div>
  )
}

export default ChannelIdPage