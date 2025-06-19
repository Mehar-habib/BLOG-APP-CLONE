import { cn } from "@/lib/utils";
import {
  IoIosCheckmarkCircleOutline,
  IoIosInformationCircleOutline,
} from "react-icons/io";
import { BiError } from "react-icons/bi";

export default function Alert({
  success,
  error,
  message,
}: {
  success?: boolean;
  error?: boolean;
  message: string;
}) {
  return (
    <div
      className={cn(
        "my-2 flex items-start gap-2 px-4 py-3 rounded-md border text-sm font-medium",
        // Success style
        success &&
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-700",
        // Error style
        error &&
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-700",
        // Info style
        !success &&
          !error &&
          "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-700"
      )}
    >
      <span className="mt-0.5">
        {success && <IoIosCheckmarkCircleOutline size={20} />}
        {error && <BiError size={20} />}
        {!success && !error && <IoIosInformationCircleOutline size={20} />}
      </span>
      <span>{message}</span>
    </div>
  );
}
