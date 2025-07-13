"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Heading from "../common/Heading";
import FormField from "../common/FormField";
import Alert from "../common/Alert";
import Button from "../common/Button";
import { useSearchParams } from "next/navigation";
import {
  PasswordResetSchema,
  PasswordResetSchemaType,
} from "@/schemas/PasswordResetSchema";
import { passwordReset } from "@/actions/auth/password-reset";

export default function PasswordResetFormClient() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetSchemaType>({
    resolver: zodResolver(PasswordResetSchema),
  });
  const token = searchParams.get("token");

  const onSubmit: SubmitHandler<PasswordResetSchemaType> = (data) => {
    setError("");
    startTransition(() => {
      passwordReset(data, token).then((res) => {
        if (res?.error) {
          setError(res.error);
        }
        if (res?.success) {
          setSuccess(res.success);
        }
      });
    });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-[500px] m-auto mt-8 gap-2"
      >
        <Heading title="Enter Your new Developer password" lg center />
        <FormField
          id="password"
          placeholder="password"
          type="password"
          register={register}
          errors={errors}
          disabled={isPending}
        />
        <FormField
          id="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          register={register}
          errors={errors}
          disabled={isPending}
        />
        {error && <Alert error message={error} />}
        {success && <Alert success message={success} />}
        <Button
          type="submit"
          label={isPending ? "submitting..." : "Save New Password"}
          disabled={isPending}
        />
      </form>
    </>
  );
}
