import { z } from "zod";

export const BlogSchema = z.object({
  userId: z.string(),
  title: z
    .string()
    .min(10, { message: "Title must be at least 10 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long" }),
  coverImage: z.string().optional(),
  isPublished: z.boolean(),
  tags: z.array(z.string()),
});

export type BlogSchemaType = z.infer<typeof BlogSchema>;
