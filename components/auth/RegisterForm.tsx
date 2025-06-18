"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import Button from "../common/Button";
import Heading from "../common/Heading";
import SocialAuth from "./SocialAuth";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit: SubmitHandler<RegisterSchemaType> = (data) =>
    console.log(data);
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
      />
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
      <FormField
        id="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        register={register}
        errors={errors}
      />
      <Button type="submit" label="Register" />
      <div className="flex justify-center my-2">Or</div>
      <SocialAuth />
    </form>
  );
}
