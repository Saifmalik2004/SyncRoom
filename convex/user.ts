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

