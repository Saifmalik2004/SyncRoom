import { v } from 'convex/values';
import { mutation, query } from './_generated/server'
import { getAuthUserId } from "@convex-dev/auth/server";  // Import the new method

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);  // Use the new method here
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  }
});




export const updateName=mutation({
  args:{
    name:v.string()
  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
 
    if(!userId){
     throw new Error("Unauthorized")
    }

   

     await ctx.db.patch(userId,{
      name:args.name,
    

    })

    return userId
  }
})
export const updateImage=mutation({
  args:{
    
    image:v.id("_storage"),
  },
  handler:async(ctx,args)=>{
    const userId=await getAuthUserId(ctx);
 
    if(!userId){
     throw new Error("Unauthorized")
    }

   
     const url= await ctx.storage.getUrl(args.image);

     if(!url){
      throw new Error("Error in save image")
     }
     
     await ctx.db.patch(userId,{
      image:url,
    

    })

    return userId
  }
})
