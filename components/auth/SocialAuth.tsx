"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import Button from "../common/Button";

export default function SocialAuth() {
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
        onClick={() => {}}
      />
      <Button
        type="button"
        label="Sign in with Google"
        outlined
        icon={FaGoogle}
        onClick={() => {}}
      />
    </div>
  );
}
