import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cartItems, products } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const cartRouter = createRouter({
  get: publicQuery
    .input(z.object({ sessionId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user?.id;
      
      let items;
      if (userId) {
        items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
      } else if (input?.sessionId) {
        items = await db.select().from(cartItems).where(eq(cartItems.sessionId, input.sessionId));
      } else {
        return [];
      }

      const enriched = await Promise.all(
        items.map(async (item) => {
          const product = await db.select().from(products).where(eq(products.id, item.productId));
          return {
            ...item,
            product: product[0] || null,
            subtotal: product[0] ? Number(product[0].price) * item.quantity : 0,
          };
        })
      );

      return enriched;
    }),

  add: publicQuery
    .input(z.object({
      productId: z.number(),
      quantity: z.number().min(1).default(1),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      const existing = userId
        ? await db.select().from(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.productId, input.productId)))
        : input.sessionId
          ? await db.select().from(cartItems).where(and(eq(cartItems.sessionId, input.sessionId), eq(cartItems.productId, input.productId)))
          : [];

      if (existing[0]) {
        await db.update(cartItems)
          .set({ quantity: existing[0].quantity + input.quantity })
          .where(eq(cartItems.id, existing[0].id));
        return { success: true, updated: true };
      }

      await db.insert(cartItems).values({
        userId: userId || undefined,
        sessionId: input.sessionId || undefined,
        productId: input.productId,
        quantity: input.quantity,
      });

      return { success: true, updated: false };
    }),

  update: publicQuery
    .input(z.object({
      itemId: z.number(),
      quantity: z.number().min(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.quantity === 0) {
        await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
      } else {
        await db.update(cartItems).set({ quantity: input.quantity }).where(eq(cartItems.id, input.itemId));
      }
      return { success: true };
    }),

  remove: publicQuery
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
      return { success: true };
    }),

  clear: publicQuery
    .input(z.object({ sessionId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      if (userId) {
        await db.delete(cartItems).where(eq(cartItems.userId, userId));
      } else if (input?.sessionId) {
        await db.delete(cartItems).where(eq(cartItems.sessionId, input.sessionId));
      }

      return { success: true };
    }),
});
