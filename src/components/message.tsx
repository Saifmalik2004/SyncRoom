import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel"
import dynamic from "next/dynamic";
import Hint from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Thumbnail } from "./thumbnail";
import Toolbar from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import Reactions from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";
import { ThreadBar } from "./thread-bar";




const Renderer=dynamic(()=> import("@/components/renderer"),{ssr:false})
const Editor=dynamic(()=> import("@/components/editor"),{ssr:false})


interface MessageProps{
id:Id<"messages">;
memberId:Id<"members">
authorImage?:string;
authorName?:string
isAuthor:boolean
reactions:Array<
Omit<Doc<"reactions">,"memberId">&{
count:number;
memberIds:Id<"members">[];
}>
body:Doc<"messages">["body"];
image:string|undefined|null
updatedAt:Doc<"messages">["updatedAt"];
createdAt:Doc<"messages">["_creationTime"];
isEditing:boolean
setEditingId:(id:Id<"messages"> |null)=> void
isCompact:boolean
hideThreadButton?:boolean 
threadCount?:number
threadImage?:string
threadName?:string
threadTimeStamp?:number;
}

const formatFullTime=(date:Date)=>{
    return `${isToday(date)? "Today":isYesterday(date)? "Yesterday": format(date,"MM d,yyyy")} at ${format(date,"h:mm:ss a")} `
}

function Message({
id,
memberId,
authorImage,
authorName="Member",
isAuthor,
reactions,
body,
image,
updatedAt,
createdAt,
isEditing,
setEditingId,
isCompact,
hideThreadButton,
threadCount,
threadImage,
threadName,
threadTimeStamp,

}:MessageProps) {
  const {onOpenMessage,onCloseMessage,onOpenProfile,parentMessageId}=usePanel()
  const  workspaceId=useWorkspaceId()
  const avatarFallback=authorName?.charAt(0).toUpperCase()
  
  const [ConfirmDialog,confirm]=useConfirm(
    'Delete message',
    'Are you sure you want to delete this message? This cannot be undone.'
  );

  const {mutate:updateMessage,isPending:isUpdateMessage}=useUpdateMessage()
  const {mutate:removeMessage,isPending:isRemoveMessage}=useRemoveMessage()
  const {mutate:toggleReaction,isPending:isToggleReaction}=useToggleReaction()

 
  const isPending=isUpdateMessage || isToggleReaction;
  
  const handleReaction=(value:string)=>{
    toggleReaction({messageId:id,value},{
      onError:()=>{
        toast.success(" Failed to toggle reaction");
        
      },

    })
  }

  const handleUpdate=({body}:{body:string})=>{
    updateMessage({id,body},{
      onSuccess:()=>{
        toast.success("Message updated");
        setEditingId(null);
      },
      onError:()=>{
        toast.success(" Failed to update message");
        
      },

    })
  }
  const handleRemove=async()=>{
    const ok=await confirm()

    if(!ok) return ;

    removeMessage({id},{
      onSuccess:()=>{
        toast.success("Message Deleted");
       if(parentMessageId===id){
        onCloseMessage()
       }
      },
      onError:()=>{
        toast.success(" Failed to delete message");
        
      },

    })
  }
    if(isCompact){
        return (
        <>
        <ConfirmDialog/>
          <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && 'bg-[#fc274433] hover:bg-[#f2c74433]/50',
            isRemoveMessage && 'bg-rose-500/50 transfrom transition-all scale-y-0 origin-bottom duration-200'
          
          )}>
                <div className="flex items-center gap-2">
                   <Hint label={formatFullTime(new Date(createdAt))}>
                   <button className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                        {format(new Date(createdAt),"hh:mm")}
                    </button>
                   </Hint>
                  {isEditing ?(
                   <div className="w-full h-full">
                   <Editor
                   onSubmit={handleUpdate}
                   disabled={isPending}
                   defaultValue={JSON.parse(body)}
                   onCancel={()=> setEditingId(null)}
                   variant="update"
                   />

                   </div>
                  ):(

                  
                    <div className="flex flex-col w-fulll">
                      <Renderer value={body}/>
                      <Thumbnail url={image}/>
                      {updatedAt ?(
                        <span className="text-xs text-muted-foreground">(edited)</span>
                      ):null}
                      <Reactions
                      id={id}
                      data={reactions}
                      onChange={handleReaction}
                    />
                    <ThreadBar
                    count={threadCount}
                    image={threadImage}
                    timestamp={threadTimeStamp}
                    name={threadName}
                    onCLick={()=> onOpenMessage(id)}
                    />

                    </div>
                    )}
                </div>
                {!isEditing &&(
              <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={()=>setEditingId(id)}
              handleThread={()=> onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
              
              />
            )}
            </div>
            </>
          );
    }

    return (
       <>
       <ConfirmDialog/>
        <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && 'bg-[#fc274433] hover:bg-[#f2c74433]/50',
          isRemoveMessage && 'bg-rose-500/50 transfrom transition-all scale-y-0 origin-bottom duration-200'
        )}>
            <div className="flex items-start gap-2">
              <button
              onClick={()=> onOpenProfile(memberId)}
              >
            <Avatar >
                <AvatarImage src={authorImage}/>
                <AvatarFallback >
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>

           
              </button>
              {isEditing ?(
                   <div className="w-full h-full">
                    <Editor
                    onSubmit={handleUpdate}
                    disabled={isPending}
                    defaultValue={JSON.parse(body)}
                    onCancel={()=> setEditingId(null)}
                    variant="update"
                    />

                    
                   </div>
              ):(
                <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button 
               onClick={()=>onOpenProfile(memberId)} className="font-bold text-primary hover:underline">
                    {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt),"h:mm a")}
                </button>
                </Hint>
              </div>
              <Renderer value={body}/>
              <Thumbnail url={image}/>
              {updatedAt? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ):null}
                    <Reactions
                    data={reactions}
                    onChange={handleReaction}
                    id={id}
                    />
                    <ThreadBar
                    count={threadCount}
                    image={threadImage}
                    timestamp={threadTimeStamp}
                    name={threadName}
                    onCLick={()=> onOpenMessage(id)}

                    />

              </div>
              )} 
              
            </div>
            {!isEditing &&(
              <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={()=>setEditingId(id)}
              handleThread={()=> onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
              
              />
            )}
           
        </div>
       </>
      );
  
}

export default Message