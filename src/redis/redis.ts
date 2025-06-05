import { createClient } from "redis";

// For production change to your redis instance inside of createClient({url: process.env.REDIS_URL})

export const redisClient = await createClient().connect()