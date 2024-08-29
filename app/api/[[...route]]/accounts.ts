import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createId } from '@paralleldrive/cuid2';

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

const app = new Hono().get(
    '/',
    clerkMiddleware(), 
    async (c) => {
        const auth = getAuth(c);

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        console.log('hello');
        
        const data = await db.select({
            id: accounts.id,
            name: accounts.name
        }).from(accounts);

        return c.json({ data });
}).get(
    '/:id',
    clerkMiddleware(),
    zValidator("param", z.object({
        id: z.string().optional()
    })),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if(!id) {
            return c.json({ error: "Invalid Account ID"}, 400);
        }

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }

        const [data] = await db.select({
            id: accounts.id,
            name: accounts.name,
        }).from(accounts).where(
            and(
                eq(accounts.userId, auth.userId),
                eq(accounts.id, id)
            )
        );

        return c.json({ data });
    }
).post('/',
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({
        name: true
    })),
    async (c) => {
        const auth = getAuth(c);
        if(!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const values = c.req.valid("json");

        const data = await db.insert(accounts).values({
            id: createId(),
            userId: auth.userId,
            ...values,
        }).returning();

        return c.json({ data });
    }
).post('/bulk-delete',
    clerkMiddleware(),
    zValidator("json", z.object({
        ids: z.array(z.string())
    })),
    async (c) => {
        const auth = getAuth(c);

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const values = c.req.valid("json");

        const data = await db.delete(accounts).where(
            and(
                eq(accounts.userId, auth.userId),
                inArray(accounts.id, values.ids),
            )
        ).returning({
            id: accounts.id
        });

        return c.json({ data });
    }
).patch('/:id',
   clerkMiddleware(),
   zValidator("param", z.object({
    id: z.string().optional(),
   })),
   zValidator("json", insertAccountSchema.pick({
    name: true
   })),
   async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");
        const values = c.req.valid("json");

        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }

        if(!id) {
            return c.json({ error: "Invalid Id" }, 400)
        }
        console.log(values, id);
        
        const [data] = await db.update(accounts)
            .set({
                name: values.name
            }).where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id)
                )
            )
            .returning({ 
                id: accounts.id
            });

        if(!data) {
            return c.json({ error: "No matching records found" }, 404);
        }

        return c.json({ data });
    }
).delete('/:id', 
    clerkMiddleware(),
    zValidator("param", z.object({
        id: z.string().optional(),
    })),
    async (c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");
        
        if(!auth?.userId) {
            return c.json({ error: "Unauthorized"}, 401);
        }

        if(!id) {
            return c.json({ error: "Invalid Id" }, 400)
        }

        const data = await db.delete(accounts)
            .where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id)
                )
            ).returning({ 
                id: accounts.id
            });

        console.log(data);
        
        if(!data) {
            return c.json({ error: "No matching records found!" }, 404);
        }

        return c.json({ data });
})

export default app;