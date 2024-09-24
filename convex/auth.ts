import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";


 

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub,Google],
  session: {
    totalDurationMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    inactiveDurationMs: 24 * 60 * 60 * 1000,   // 24 hours
  },
  
});
