// Import utility for conditional class names
import { cn } from "@/lib/utils";

// Import types from react-hook-form for form validation and typing
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

// Define the shape of the form values expected (for type-safety)
interface LoginValues {
  email: string;
  password: string;
}

// Props for the FormField component
interface FormFieldProps {
  id: string; // Input field name (must match LoginValues keys)
  type?: string; // Optional input type (e.g., "password", "text")
  disabled?: boolean; // Optional flag to disable the input
  placeholder: string; // Placeholder text inside the input
  label?: string; // Optional label above the input
  inputClassNames?: string; // Extra Tailwind classes for customization
  register: UseFormRegister<LoginValues>; // react-hook-form register function for the field
  errors: FieldErrors; // react-hook-form errors object for showing validation messages
}

// FormField is a reusable form input component
export default function FormField({
  id,
  type,
  disabled,
  placeholder,
  label,
  inputClassNames,
  register,
  errors,
}: FormFieldProps) {
  // Extract the error message for this field (if it exists)
  const message = errors[id] && (errors[id]?.message as string);

  return (
    <div>
      {/* Conditionally render label if provided */}
      {label && <span className="text-sm block">{label}</span>}

      {/* Input field with react-hook-form registration and dynamic styling */}
      <input
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        {...register(id as Path<LoginValues>)} // Register this input with react-hook-form
        className={cn(
          "w-full p-3 my-2 outline-none rounded-md disabled:opacity-70 disabled:cursor-not-allowed border border-slate-300 dark:border-slate-700", // base styles
          errors[id] && "border-rose-400", // red border if there's an error
          inputClassNames // custom styles from parent
        )}
      />

      {/* Display validation message below the input if any */}
      {message && <span className="text-sm text-rose-400">{message}</span>}
    </div>
  );
}
