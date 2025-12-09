// Placeholder Supabase client for compatibility
// This project uses a Prisma backend instead of Supabase
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signUp: async () => ({
      data: null,
      error: new Error('Auth not configured'),
    }),
    signInWithPassword: async () => ({
      data: null,
      error: new Error('Auth not configured'),
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback) => {
      // Return a subscription object
      return {
        data: { subscription: { unsubscribe: () => {} } },
      };
    },
  },
  from: (table) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: null,
          error: new Error('Supabase not configured'),
        }),
      }),
    }),
  }),
};
