import { query } from './_generated/server'
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
