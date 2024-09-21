import { useMemberId } from "@/hooks/use-memberId-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMemberById } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps{
    id:Id<'conversations'>;
}

export const Conversation=({id}:ConversationProps)=>{
   const memberId=useMemberId();
   const {data:member,isLoading:memberLoading}=useGetMemberById({id:memberId})
   const {results,status,loadMore}=useGetMessages({
      conversationId:id, 
   })

   if(memberLoading || status=="LoadingFirstPage"){
    return(
        <div className="h-full flex items-center justify-center">
            <Loader className='size-6 animate-spin text-muted-foreground'/>
        </div>
    )
}
    return (
        <div className="flex flex-col h-full">
                <Header
                memberName={member?.user?.name}
                memberImage={member?.user?.image}
                />
                <MessageList
                  variant="conversation"
                   data={results}
                   memberImage={member?.user.image}
                   memberName={member?.user.name}
                   loadMore={loadMore}
                   isLoadingMore={status=== "LoadingMore"}
                   canLoadMore={status==="CanLoadMore"}
                   />
                <ChatInput 
                conversationId={id}
                placeholder={`Message # ${member?.user?.name}`}/>

        </div>
    )
}