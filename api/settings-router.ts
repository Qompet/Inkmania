import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { settings, products } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(settings);
  }),

  getPublic: publicQuery.query(async () => {
    const db = getDb();
    const allSettings = await db.select().from(settings);
    const publicKeys = ["siteName", "siteTagline", "freeShippingEnabled", "freeShippingThreshold", "bulkDiscountEnabled", "bulkDiscountThreshold", "bulkDiscountPercent", "taxRate", "currency", "contactEmail", "contactPhone"];
    return allSettings.filter(s => publicKeys.includes(s.key));
  }),

  update: adminQuery
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(settings).set({ value: input.value }).where(eq(settings.key, input.key));
      return { success: true };
    }),

  bulkUpdate: adminQuery
    .input(z.array(z.object({
      key: z.string(),
      value: z.string(),
    })))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const item of input) {
        await db.update(settings).set({ value: item.value }).where(eq(settings.key, item.key));
      }
      return { success: true };
    }),

  // Admin product management
  updateProduct: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      price: z.string().optional(),
      compareAtPrice: z.string().optional(),
      inventoryQty: z.number().optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(products).set(data).where(eq(products.id, id));
      return { success: true };
    }),

  updateInventory: adminQuery
    .input(z.object({
      id: z.number(),
      inventoryQty: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(products)
        .set({ inventoryQty: input.inventoryQty })
        .where(eq(products.id, input.id));
      return { success: true };
    }),

  getDashboardStats: adminQuery.query(async () => {
    const db = getDb();
    const [productCount, lowStock, totalInventory] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(products),
      db.select({ count: sql<number>`count(*)` }).from(products).where(sql`${products.inventoryQty} <= ${products.lowStockThreshold} AND ${products.inventoryQty} > 0`),
      db.select({ total: sql<number>`COALESCE(SUM(${products.inventoryQty}), 0)` }).from(products),
    ]);

    return {
      totalProducts: productCount[0]?.count || 0,
      lowStockItems: lowStock[0]?.count || 0,
      totalInventory: totalInventory[0]?.total || 0,
    };
  }),
});
