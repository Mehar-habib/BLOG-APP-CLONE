// Import Zod library for schema validation
import { z } from "zod";

// Define the validation schema for a registration form using Zod
export const RegisterSchema = z
  .object({
    // Validate the 'name' field: must be a string with at least 3 characters
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),

    // Validate the 'email' field: must be a valid email format
    email: z.string().email(),

    // Validate the 'password' field: must be a string with at least 3 characters
    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters long" }),

    // 'confirmPassword' is just a string for now, will be matched with 'password' in refine
    confirmPassword: z.string(),
  })

  // Refine method is used to add custom validation logic
  .refine(
    (values) => {
      // Ensure password and confirmPassword match
      return values.password === values.confirmPassword;
    },
    {
      // Error message if passwords do not match
      message: "Passwords do not match",

      // Attach the error to the 'confirmPassword' field
      path: ["confirmPassword"],
    }
  );

// Infer the TypeScript type from the schema for form typing
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
