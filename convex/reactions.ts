
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";


const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">) => {

    return ctx.db.query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();
  };

// export const get = query({
//     args: {
//       channelId: v.optional(v.id("channels")),
//       conversationId: v.optional(v.id("conversations")),
//       parentMessageId: v.optional(v.id("messages")),
//       paginationOpts: paginationOptsValidator,
//     },
//     handler: async (ctx, args) => {
  
//       const userId = await getAuthUserId(ctx);
//       if (!userId) {
//         throw new Error("Unauthorized");
//       }
  
//       let _conversationId = args.conversationId;
  
//       if (!args.conversationId && !args.channelId && args.parentMessageId) {
        
//         const parentMessage = await ctx.db.get(args.parentMessageId);
        
//         if (!parentMessage) {
//           throw new Error("Parent message not found");
//         }
  
//         _conversationId = parentMessage.conversationId;
//       }
  
//       const results = await ctx.db.query("messages")
//         .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
//           q.eq("channelId", args.channelId)
//             .eq('parentMessageId', args.parentMessageId)
//             .eq("conversationId", _conversationId)
//         )
//         .order("desc")
//         .paginate(args.paginationOpts);
  
//       return {
//         ...results,
//         page: (
//           await Promise.all(
//             results.page.map(async (message) => {
//               const member = await populateMember(ctx, message.memberId);
//               const user = member ? await populateUser(ctx, member.userId) : null;
  
//               if (!member || !user) {
//                 return null;
//               }
  
//               const reactions = await populateReaction(ctx, message._id);
//               const thread = await populateThread(ctx, message._id);
//               const image = message.image ? await ctx.storage.getUrl(message.image) : undefined;
  
//               const reactionsWithCounts = reactions.map((reaction) => {
//                 return {
//                   ...reaction,
//                   count: reactions.filter((r) => r.value === reaction.value).length,
//                 };
//               });
  
//               const dedupedReactions = reactionsWithCounts.reduce(
//                 (acc, reaction) => {
//                   const existingReaction = acc.find((r) => r.value === reaction.value);
                  
//                   if (existingReaction) {
                    
//                     existingReaction.memberIds = Array.from(
//                       new Set([...existingReaction.memberIds, reaction.memberId])
//                     );
//                   } else {
//                     acc.push({ ...reaction, memberIds: [reaction.memberId] });
//                   }
                  
//                   return acc;
//                 },
//                 [] as (Doc<"reactions"> & {
//                   count: number;
//                   memberIds: Id<"members">[];
//                 })[]
//               );
  
//               const reactionsWithoutMemberId = dedupedReactions.map(({ memberId, ...rest }) => rest);
  
//               return {
//                 ...message,
//                 image,
//                 member,
//                 user,
//                 reactions: reactionsWithoutMemberId,
//                 threadCount: thread.count,
//                 threadImage: thread.image,
//                 threadTimestamp: thread.timeStamp,
//               };
//             })
//           )
//         ).filter((message): message is NonNullable<typeof message> => message !== null),
//       };
//     },
//   });
  
  // Mutation to toggle a reaction
  export const toggle = mutation({
    args: {
      messageId:v.id("messages"),
      value:v.string()
    },
    handler: async (ctx, args) => {
      
        const userId = await getAuthUserId(ctx);
      if (!userId) {
        throw new Error("Unauthorized");
      }
  
      const message = await ctx.db.get( args.messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      const member=await getMember(ctx,message.workspaceId,userId)
      
      if(!member){
        throw new Error("Unauthorized");
        
      } 
  
      const existingMessageReactionfromUser = await ctx.db.query("reactions")
      .filter((q)=>
    q.and(
        q.eq(q.field("messageId"),args.messageId),
        q.eq(q.field("memberId"),member._id),
        
        
         )
       )
       .first();

       if(existingMessageReactionfromUser){
        if (existingMessageReactionfromUser.value === args.value){
            await ctx.db.delete(existingMessageReactionfromUser._id);
            return existingMessageReactionfromUser._id;
        }else {
            // If the reaction value is different, update the reaction
            await ctx.db.patch(existingMessageReactionfromUser._id, {
              value: args.value,
            });
            return existingMessageReactionfromUser._id;
          }
    
        
       }else{
        const newReactionId =await ctx.db.insert("reactions",{
            value:args.value,
            memberId:member._id,
             messageId:message._id,
             workspaceId:message?.workspaceId,
        });
        
        return newReactionId ;
       }
  
      
    },
  });

  export const getReactionsByMessageId = query({
    args: {
      messageId: v.id("messages"),
    },
    handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        throw new Error("Unauthorized");
      }
  
      const message = await ctx.db.get(args.messageId);
      if (!message) {
        throw new Error("Message not found");
      }
  
      // Query all reactions for the given messageId
      const reactions = await ctx.db.query("reactions")
        .withIndex("by_message_id", (q) => q.eq("messageId", args.messageId))
        .collect();
  
      if (!reactions.length) {
        return { message: "No reactions found for this message." };
      }
  
      // For each reaction, fetch the member and user details
      const populatedReactions = await Promise.all(
        reactions.map(async (reaction) => {
          // Fetch the member using the memberId
          const member = await ctx.db.get(reaction.memberId);
  
          if (!member) {
            throw new Error(`Member not found for memberId: ${reaction.memberId}`);
          }
  
          // Fetch the user using the userId from the member
          const user = await ctx.db.get(member.userId);
  
          if (!user) {
            throw new Error(`User not found for userId: ${member.userId}`);
          }
  
          return {
            user: {
              id: user._id,
              name: user.name,
              image:user.image,   // Assuming user has a 'name' field
              email: user.email, // Assuming user has an 'email' field
            },
            value: reaction.value,  // Reaction value (emoji or type)
          };
        })
      );
  
      return {
        messageId: args.messageId,
        reactions: populatedReactions, // Return reactions with user details
      };
    },
  });
  