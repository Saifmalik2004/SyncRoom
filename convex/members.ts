import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const populateUser=(ctx:QueryCtx,id:Id<"users">)=>{
  return ctx.db.get(id)
}
export const current = query({
    args: {
      workspaceId:v.id('workspaces'),
    },
    handler: async (ctx,args) => {
      const userId=await getAuthUserId(ctx);
  
      if(!userId){
        return null;
      }
      
      const member=await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id',(q)=>
      q.eq("workspaceId",args.workspaceId).eq('userId',userId),)
      .unique();
      
      if(!member){
        return null
      }
  
       return member
      
    }
  });


  export const get = query({
    args: {workspaceId:v.id('workspaces')},
    handler: async (ctx,args) => {

      const userId=await getAuthUserId(ctx);
      if(!userId){
        return []
      }
      

      const member=await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id',(q)=>
      q.eq("workspaceId",args.workspaceId).eq('userId',userId),)
      .unique();
      
      if(!member){
        return []
      }
     
      const data= await ctx.db.query('members')
      .withIndex('by_workspace_id',(q)=> q.eq('workspaceId',args.workspaceId))
      .collect();
     const members=[];

      for(const member of data){
        const user =await populateUser(ctx,member.userId)

        if(user){
         members.push ({
           ...member,
            user,
         })
        }
      }

      return members

      
    }
  });
  

  export const getById = query({
      args: {id:v.id('members')},
      handler: async (ctx,args) => {
         
        const userId=await getAuthUserId(ctx);
        if(!userId){
           return null
        }
  

        const member=await ctx.db.get(args.id)
  
        if(!member){
          return null
        }
        const currentMember=await ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", (q)=>
        q.eq("workspaceId",member.workspaceId).eq("userId",userId))
        .unique()
 

        if(!currentMember){
          return null;
        }

        const user =await populateUser(ctx,member.userId)
       
       
        if(!user){
          return null
        }

  
        return {
          ...member,
          user
        }
      }
    });

    export const update = mutation({
      args: {
        id: v.id("members"),
        role: v.union(v.literal("admin"), v.literal("member")),
        workspaceId: v.id("workspaces"),
      },
      handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
    
        // If the user is not authenticated, throw an error
        if (!userId) {
          throw new Error("User not found");
        }
    
        // Get the member that we are trying to update (member to be changed)
        const member = await ctx.db.get(args.id);
    
        if (!member) {
          throw new Error("Member not found");
        }
    
        // Get the workspace by the ID passed in args
        const workspace = await ctx.db.get(args.workspaceId);
    
        if (!workspace) {
          throw new Error("Workspace not found");
        }
    
        // Get the current member (the one trying to update) in the context of the workspace
        const currentMember = await ctx.db
          .query("members")
          .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", args.workspaceId).eq("userId", userId)
          )
          .unique();
    
        // Ensure the current member exists and is an admin
        if (!currentMember || currentMember.role !== "admin") {
          throw new Error("Unauthorized: You must be an admin to perform this action");
        }
    
        // Check if the workspace's userId matches the current user's userId
        const isWorkspaceOwner = workspace.userId === userId;
    
        // Prevent changing the role of another admin, unless the current user is the workspace owner
        if (member.role === "admin" && !isWorkspaceOwner) {
          throw new Error("Unauthorized: You cannot change the role of another admin unless you own the workspace");
        }
    
        // Update the role of the member
        await ctx.db.patch(args.id, {
          role: args.role,
        });
    
        // Return the updated member ID
        return args.id;
      },
    });
    
    export const remove=mutation({
      args:{
        id:v.id("members"),
      
      },handler:async(ctx,args)=>{
        const userId=await getAuthUserId(ctx);
        if(!userId){
          throw new Error("User not found")

        }
        
  
        const member=await ctx.db.get(args.id)
  
        if(!member){
          throw new Error("Member not found")
        }
        const currentMember=await ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", (q)=>
        q.eq("workspaceId",member.workspaceId).eq("userId",userId))
        .unique()

        if(!currentMember){
          throw new Error("Unauthorized")

        }

        if(member.role=="admin"){
          throw new Error("Admin  cannot be removed")
          
        }
       
        if(currentMember._id ===args.id && currentMember.role === "admin"){
          throw new Error("Cannot remove self if self is an admin")

        }

        const [messages,reactions,conversations]=await Promise.all([
          ctx.db
          .query("messages")
          .withIndex("by_member_id",(q)=> q.eq("memberId",member._id))
          .collect(),
          ctx.db
          .query("reactions")
          .withIndex("by_member_id",(q)=> q.eq("memberId",member._id))
          .collect(),
          ctx.db
          .query("conversations")
          .filter((q)=>
             q.or(q.eq(q.field("memberOneId"),member._id),
             q.or(q.eq(q.field("memberTwoId"),member._id)),
        ))
          .collect(),

        ]);
         for(const message of messages){
          await ctx.db.delete(message._id)
          }
          for(const reaction of reactions){
            await ctx.db.delete(reaction._id)
          }
          for(const conversation of conversations){
              await ctx.db.delete(conversation._id)
          }
        
       await ctx.db.delete(args.id)
       
       return args.id
      }
      
    })
  
  



  
