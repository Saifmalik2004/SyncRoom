import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";


interface UseGetChannelsProps{
    messageId:Id<"messages">
}

export const useGetReactionsByMessageId=({messageId}:UseGetChannelsProps)=>{
    const data=useQuery(api.reactions.getReactionsByMessageId,{messageId});
    const isLoading=data===undefined;

    return{data,isLoading};

}