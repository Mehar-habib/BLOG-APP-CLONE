"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import Button from "../common/Button";
import { signIn } from "next-auth/react";
import { LOGIN_REDIRECT } from "@/routes";

export default function SocialAuth() {
  const handleOnClick = (provider: "google" | "github") => {
    signIn(provider, {
      redirectTo: LOGIN_REDIRECT,
    });
  };
  return (
    <div
      suppressHydrationWarning
      className="flex gap-2 flex-col md:flex-row justify-center"
    >
      <Button
        type="button"
        label="Sign in with Github"
        outlined
        icon={FaGithub}
        onClick={() => handleOnClick("github")}
      />
      <Button
        type="button"
        label="Sign in with Google"
        outlined
        icon={FaGoogle}
        onClick={() => handleOnClick("google")}
      />
    </div>
  );
}
