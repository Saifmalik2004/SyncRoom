import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel"
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { UseGetMessage } from "../api/use-get-message";
import { useCurrentMember } from "@/features/members/api/use-cuurent-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";
import Message from "@/components/message";

interface ThreadProps{
    messageId:Id<'messages'>;
    onClose:()=> void
}


const Thread=({messageId,onClose}:ThreadProps)=> {
    const workspaceId=useWorkspaceId()
    const {data:currentMember}=useCurrentMember({workspaceId})

    const [editingId, setEditingId] = useState<Id<"messages">|null>(null)
   
    const {data:message,isLoading:loadingMessage}=UseGetMessage({id:messageId})
  if(loadingMessage ){
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
  )
}

export default Thread