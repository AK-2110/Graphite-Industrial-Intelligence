import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { assets } from '../db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

export const assetsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(assets);
  }),
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      type: z.string(),
      location: z.string().optional(),
      description: z.string().optional(),
      status: z.string(),
    }))
    .mutation(async ({ input }) => {
      const newAsset = await db.insert(assets).values({
        name: input.name,
        type: input.type,
        location: input.location,
        description: input.description,
        status: input.status as 'operational' | 'maintenance' | 'offline',
      }).returning();
      return newAsset[0];
    }),
});
