import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel"
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { UseGetMessage } from "../api/use-get-message";
import { useCurrentMember } from "@/features/members/api/use-cuurent-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRef, useState } from "react";
import Message from "@/components/message";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "../api/use-create-messages";
import { useGenerateUplaodUrl } from "@/features/uplaod/api/use-generate-upload-url";
import { toast } from "sonner";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
const Editor=dynamic(()=> import("@/components/editor"),{ssr:false})

const TIME_THRESHOLD=5;
interface ThreadProps{
    messageId:Id<'messages'>;
    onClose:()=> void
}
interface CreateMessageValues{
    channelId:Id<"channels">;
    workspaceId:Id<"workspaces">
    parentMessageId:Id<"messages">
    body:string;
    image:Id<"_storage"> | undefined
  }


const Thread=({messageId,onClose}:ThreadProps)=> {
    const workspaceId=useWorkspaceId()
    const channelId=useChannelId()
    const {data:currentMember}=useCurrentMember({workspaceId})
    const {data:message,isLoading:loadingMessage}=UseGetMessage({id:messageId})
    
    const {results,status,loadMore}=useGetMessages({channelId,parentMessageId:messageId});

    const {mutate:createMessage}= useCreateMessage()
    const {mutate:generateUplaodUrl}= useGenerateUplaodUrl()


    const [editorKey,setEditorKey]=useState(0)
    const [isPending,setIspending]=useState(false)
    const [editingId, setEditingId] = useState<Id<"messages">|null>(null)
    const editorRef=useRef< Quill | null>(null)

    const canLoadMore=status=== "LoadingMore"
    const isLoadingMore= status==="CanLoadMore"
    const handleSubmit=async({
        body,
        image
      }:{
        body:string;
        image:File|null
      })=>{
       
       try {
        setIspending(true)
        editorRef?.current?.enable(false)
    
        const values:CreateMessageValues={
          channelId,
          workspaceId,
          parentMessageId:messageId,
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
    
          const {storageId}=await result.json();
           
          values.image=storageId;
        }
        const result =await createMessage(values,{throwError:true});
      
        setEditorKey((prevKey)=> prevKey +1)
       } catch (error) {
    
        toast.error("failed to send message")
    
       }finally{
        setIspending(false)
        editorRef?.current?.enable(true)
    
    
       }
       
      };

      const groupedMessages=results?.reduce(

        (groups,message)=>{
          const date=new Date(message._creationTime);
          const dateKey=format(date,"yyyy-MM-dd");
    
          if(!groups[dateKey]){
            groups[dateKey]=[]
          }
          groups[dateKey].unshift(message);
    
          return groups;
        },
        {} as Record<string, typeof results>
      )

      const formatDateLabel=(dateStr:string)=>{
        const date=new Date(dateStr);
        if(isToday(date)) return "Today";
        if(isYesterday(date)) return "Yesterday";
        return format(date,"EEEE, MMMM d")
      }

  if(loadingMessage || status=== "LoadingFirstPage" ){
    return (
        <div className="h-full flex flex-col">
            <div className=" h-[49px] flex justify-between items-center px-4 border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size='iconSm' variant='ghost'>
                    <XIcon className=" size-5 stroke-[1.5]"/>
                </Button>
            </div>
            <div className="flex flex-col gap-y-2 h-full items-center justify-center">
              <Loader className="size-5 animate-spin"/>
            
            </div>
        </div>
      )
  }  
  if(!message){
    return (
        <div className="h-full flex flex-col">
            <div className=" h-[49px] flex justify-between items-center px-4 border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size='iconSm' variant='ghost'>
                    <XIcon className=" size-5 stroke-[1.5]"/>
                </Button>
            </div>
            <div className="flex flex-col gap-y-2 h-full items-center justify-center">
              <AlertTriangle className="size-5"/>
              <p className="text-sm text-muted-foreground">
                Message not found
              </p>
            </div>
        </div>
      )
  }
  return (
    <div className="h-full flex flex-col">
        <div className=" h-[49px] flex justify-between items-center px-4 border-b">
           <p className="text-lg font-bold">Thread</p>

            <Button onClick={onClose} size='iconSm' variant='ghost'>
                <XIcon className=" size-5 stroke-[1.5]"/>
            </Button>
        </div>
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        
        {Object.entries(groupedMessages || {}).map(([dateKey,messages])=>(
      <div key={dateKey}>
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 border-t border-gray-300"/>
          <span className="relative inline-block bg-white px-4 rounded-full py-1 text-xs border border-gray-300 shadow-sm">
            {formatDateLabel(dateKey)}
          </span>
        </div>
        {messages.map((message,index)=>{

          const prevMessage=messages[index-1];
          const isCompact=
          prevMessage&&
          prevMessage.user?._id===message.user?._id &&
          differenceInMinutes(
            new Date(message._creationTime),
            new Date(prevMessage._creationTime)

          )<TIME_THRESHOLD;

          return(
            <Message
            key={message._id}
            id={message._id}
            memberId={message.memberId}
            authorImage={message.user.image}
            authorName={message.user.name}
            isAuthor={message.memberId === currentMember?._id}
            reactions={message.reactions}
            body={message.body}
            image={message.image}
            updatedAt={message.updatedAt}
            createdAt={message._creationTime}
            isEditing={editingId === message._id}
            setEditingId={setEditingId}
            isCompact={isCompact}
            hideThreadButton
            threadCount={message.threadCount}
            threadImage={message.threadImage}
            threadTimeStamp={message.threadTimestamp}
            />


          )
        })}

      </div>
     ))}
     <div className="h-1"
     ref={(el)=>{
      if(el){
        const observer=new IntersectionObserver(
          ([entry])=>{
            if(entry.isIntersecting && canLoadMore){
              loadMore()
            }
          },{
            threshold:1.0
          }
        );
        observer.observe(el)
        return ()=> observer.disconnect()
      }
     }}
     />
     {isLoadingMore &&(
      <div className="text-center my-2 relative">
      <hr className="absolute top-1/2 left-0 border-t border-gray-300"/>
      <span className="relative inline-block bg-white px-4 rounded-full py-1 text-xs border border-gray-300 shadow-sm">
        <Loader className="size-4 animate-spin"/>
      </span>
    </div>
     ) }
           
           <Message
            key={message._id}
            id={message._id}
            memberId={message.memberId}
            authorImage={message.user.image}
            authorName={message.user.name}
            isAuthor={message.memberId === currentMember?._id}
            reactions={message.reactions}
            body={message.body}
            image={message.image}
            updatedAt={message.updatedAt}
            createdAt={message._creationTime}
            isEditing={editingId === message._id}
            setEditingId={setEditingId}
            isCompact={false}
            hideThreadButton
            
            />

            </div>
            <div className='px-4'>
        <Editor
        key={editorKey}
        placeholder='Reply..'
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}/>
    </div>
    </div>
  )
}

export default Thread