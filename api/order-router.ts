import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems, products } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = createRouter({
  create: publicQuery
    .input(z.object({
      email: z.string().email(),
      items: z.array(z.object({
        productId: z.number(),
        quantity: z.number().min(1),
        price: z.number(),
      })),
      subtotal: z.number(),
      discountAmount: z.number().default(0),
      total: z.number(),
      shippingAddress: z.object({
        firstName: z.string(),
        lastName: z.string(),
        address1: z.string(),
        address2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        country: z.string(),
        phone: z.string(),
      }),
      paymentMethod: z.string(),
      discountCode: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      const orderNumber = `INK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const result = await db.insert(orders).values({
        orderNumber,
        email: input.email,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: input.paymentMethod,
        subtotal: String(input.subtotal),
        discountAmount: String(input.discountAmount),
        shippingCost: "0",
        taxAmount: "0",
        total: String(input.total),
        discountCode: input.discountCode,
        shippingAddress: input.shippingAddress,
      });

      const orderId = Number(result[0].insertId);

      for (const item of input.items) {
        const product = await db.select().from(products).where(eq(products.id, item.productId));
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          productName: product[0]?.name || "Unknown Product",
          productModel: product[0]?.model || "",
          productImage: product[0]?.images?.[0] || "",
          price: String(item.price),
          quantity: item.quantity,
          total: String(item.price * item.quantity),
        });

        // Update inventory
        if (product[0]) {
          await db.update(products)
            .set({ inventoryQty: Math.max(0, product[0].inventoryQty - item.quantity) })
            .where(eq(products.id, item.productId));
        }
      }

      return { success: true, orderNumber, orderId };
    }),

  myOrders: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }),

  getByNumber: publicQuery
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(orders).where(eq(orders.orderNumber, input.orderNumber));
      if (!result[0]) return null;
      
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, result[0].id));
      return { ...result[0], items };
    }),

  // Admin endpoints
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }),

  updateStatus: adminQuery
    .input(z.object({ orderId: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({ status: input.status as any }).where(eq(orders.id, input.orderId));
      return { success: true };
    }),
});
