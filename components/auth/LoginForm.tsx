"use client";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import Button from "../common/Button";
import Heading from "../common/Heading";
import SocialAuth from "./SocialAuth";
import { useState, useTransition } from "react";
import { login } from "@/actions/auth/login";
import Alert from "../common/Alert";
import { useRouter } from "next/navigation";
import { LOGIN_REDIRECT } from "@/routes";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });

  const onSubmit: SubmitHandler<LoginSchemaType> = (data) => {
    setError("");
    startTransition(() => {
      login(data).then((res) => {
        if (res?.error) {
          setError(res.error);
        }
        if (!res?.error) {
          router.push(LOGIN_REDIRECT);
        }
      });
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] m-auto mt-8 gap-2"
    >
      <Heading title="Login to Developer Blog" lg center />
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
      {error && <Alert error message={error} />}
      <Button
        type="submit"
        label={isPending ? "submitting..." : "Login"}
        disabled={isPending}
      />
      <div className="flex justify-center my-2">Or</div>
      <SocialAuth />
    </form>
  );
}
