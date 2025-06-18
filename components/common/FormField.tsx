// Import utility function for merging class names conditionally
import { cn } from "@/lib/utils";

// Import required types from react-hook-form
import {
  FieldErrors,
  Path,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";

// Define the props for the generic FormField component
interface FormFieldProps<T extends FieldValues> {
  id: string; // Name of the input field (must be a key from T)
  type?: string; // Optional: input type (e.g., "text", "password")
  disabled?: boolean; // Optional: disables the input if true
  placeholder: string; // Placeholder text for the input
  label?: string; // Optional: label to display above the input
  inputClassNames?: string; // Optional: additional Tailwind classes for the input
  register: UseFormRegister<T>; // react-hook-form's register function
  errors: FieldErrors<T>; // Error messages from react-hook-form
}

// Generic, reusable input component
export default function FormField<T extends FieldValues>({
  id,
  type = "text", // Default input type to "text" if not provided
  disabled,
  placeholder,
  label,
  inputClassNames,
  register,
  errors,
}: FormFieldProps<T>) {
  // Get the error message for this input field, if any
  const message = errors[id]?.message as string | undefined;

  return (
    <div>
      {/* Render the label above the input if provided */}
      {label && <span className="text-sm block">{label}</span>}

      {/* Input field with conditional styles and validation */}
      <input
        id={id}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...register(id as Path<T>)} // Register the input using react-hook-form
        className={cn(
          "w-full p-3 my-2 outline-none rounded-md disabled:opacity-70 disabled:cursor-not-allowed border border-slate-300 dark:border-slate-700", // base styling
          errors[id] && "border-rose-400", // red border if there's an error
          inputClassNames // additional custom styles
        )}
      />

      {/* Show the validation error message if present */}
      {message && <span className="text-sm text-rose-400">{message}</span>}
    </div>
  );
}
