import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { documents } from '../db/schema';
import { z } from 'zod';

export const documentsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(documents);
  }),
});
