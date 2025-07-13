"use client";
import {
  PasswordEmailSchema,
  PasswordEmailSchemaType,
} from "@/schemas/PasswordEmailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Heading from "../common/Heading";
import FormField from "../common/FormField";
import Alert from "../common/Alert";
import Button from "../common/Button";
import { passwordEmail } from "@/actions/auth/password-email";

export default function PasswordEmailForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordEmailSchemaType>({
    resolver: zodResolver(PasswordEmailSchema),
  });

  const onSubmit: SubmitHandler<PasswordEmailSchemaType> = (data) => {
    setError("");
    startTransition(() => {
      passwordEmail(data).then((res) => {
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
        <Heading title="Forgot your Developer Blog" lg center />
        <FormField
          id="email"
          placeholder="Email"
          type="email"
          register={register}
          errors={errors}
          disabled={isPending}
        />
        {error && <Alert error message={error} />}
        {success && <Alert success message={success} />}
        <Button
          type="submit"
          label={isPending ? "submitting..." : "Send Reset Email"}
          disabled={isPending}
        />
      </form>
    </>
  );
}
