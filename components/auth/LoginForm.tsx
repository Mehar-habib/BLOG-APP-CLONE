"use client";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });

  const onSubmit: SubmitHandler<LoginSchemaType> = (data) => console.log(data);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] m-auto mt-8 gap-2"
    >
      <FormField
        id="email"
        placeholder="Email"
        type="email"
        register={register}
        errors={errors}
      />
      <FormField
        id="password"
        placeholder="Password"
        type="password"
        register={register}
        errors={errors}
      />
      <button type="submit">Login</button>
    </form>
  );
}
