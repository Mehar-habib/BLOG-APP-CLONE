"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import Button from "../common/Button";
import Heading from "../common/Heading";
import SocialAuth from "./SocialAuth";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";
import { signUp } from "@/actions/auth/register";
import { useState, useTransition } from "react";

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
    setSuccess("");
    setError("");
    startTransition(() => {
      signUp(data).then((res) => {
        setError(res.error);
        setSuccess(res.success);
      });
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] m-auto mt-8 gap-2"
    >
      <Heading title="Create a Developer Blog Account" lg center />
      <FormField
        id="name"
        placeholder="Name"
        type="text"
        register={register}
        errors={errors}
        disabled={isPending}
      />
      <FormField
        id="email"
        placeholder="Email"
        type="email"
        register={register}
        errors={errors}
        disabled={isPending}
      />
      <FormField
        id="password"
        placeholder="Password"
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
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <Button
        type="submit"
        label={isPending ? "Submitting..." : "Register"}
        disabled={isPending}
        className="cursor-pointer"
      />
      <div className="flex justify-center my-2">Or</div>
      <SocialAuth />
    </form>
  );
}
