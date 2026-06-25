import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, brands, categories } from "@db/schema";
import { eq, like, or, desc, sql } from "drizzle-orm";

const listInput = z.object({
  brand: z.string().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "name_asc", "name_desc", "newest"]).optional(),
  page: z.number().default(1),
  limit: z.number().default(24),
  inStock: z.boolean().optional(),
});

export const productRouter = createRouter({
  list: publicQuery
    .input(listInput)
    .query(async ({ input }) => {
      const db = getDb();
      const conditions: any[] = [];

      if (input.brand) {
        const brandList = input.brand.split(",");
        conditions.push(sql`${products.brandId} IN (SELECT id FROM ${brands} WHERE ${brands.slug} IN (${sql.join(brandList)}))`);
      }
      if (input.category) {
        conditions.push(sql`${products.categoryId} IN (SELECT id FROM ${categories} WHERE ${categories.slug} = ${input.category})`);
      }
      if (input.color) {
        conditions.push(eq(products.color, input.color));
      }
      if (input.type) {
        conditions.push(eq(products.type, input.type));
      }
      if (input.search) {
        conditions.push(or(
          like(products.name, `%${input.search}%`),
          like(products.model, `%${input.search}%`),
          like(products.description, `%${input.search}%`)
        ));
      }
      if (input.inStock) {
        conditions.push(sql`${products.inventoryQty} > 0`);
      }

      const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;

      let orderBy;
      switch (input.sort) {
        case "price_asc": orderBy = products.price; break;
        case "price_desc": orderBy = desc(products.price); break;
        case "name_asc": orderBy = products.name; break;
        case "name_desc": orderBy = desc(products.name); break;
        default: orderBy = desc(products.createdAt);
      }

      const limitNum = input.limit || 24;
      const offset = ((input.page || 1) - 1) * limitNum;

      const [items, countResult] = await Promise.all([
        db.select().from(products).where(whereClause).orderBy(orderBy).limit(limitNum).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause),
      ]);

      return {
        items,
        total: countResult[0]?.count || 0,
        page: input.page || 1,
        totalPages: Math.ceil((countResult[0]?.count || 0) / limitNum),
      };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.slug, input.slug));
      return result[0] || null;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.id, input.id));
      return result[0] || null;
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(products).where(eq(products.isFeatured, true)).limit(8);
  }),

  brands: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(brands).orderBy(brands.sortOrder);
  }),

  categories: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(categories).orderBy(categories.id);
  }),

  byBrand: publicQuery
    .input(z.object({ brandSlug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const brandResult = await db.select().from(brands).where(eq(brands.slug, input.brandSlug));
      if (!brandResult[0]) return { brand: null, products: [] };
      
      const items = await db.select().from(products)
        .where(sql`${products.brandId} = ${brandResult[0].id} AND ${products.isActive} = true`)
        .orderBy(products.name);
      
      return { brand: brandResult[0], products: items };
    }),
});
