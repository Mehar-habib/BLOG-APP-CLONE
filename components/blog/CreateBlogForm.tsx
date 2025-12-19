"use client";
import { BlogSchema, BlogSchemaType } from "@/schemas/BlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import FormField from "../common/FormField";
import AddCover from "./AddCover";
import { useState } from "react";
import CoverImage from "./CoverImage";
import { tags } from "@/lib/tag";

export default function CreateBlogForm() {
  const session = useSession();
  const userId = session.data?.user.userId;
  const [uploadedCover, setUploadedCover] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogSchemaType>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      userId,
      isPublished: false,
    },
  });
  return (
    <form className="flex flex-col justify-between max-w-[1200px] m-auto min-h-[85vh]">
      <div>
        {!!uploadedCover && (
          <CoverImage
            url={uploadedCover}
            isEditor={true}
            setUploadedCover={setUploadedCover}
          />
        )}
        {!uploadedCover && <AddCover setUploadedCover={setUploadedCover} />}
        <FormField
          id="title"
          type="text"
          placeholder="Blog Title"
          register={register}
          errors={errors}
          disabled={false}
          inputClassNames="border-none text-5xl font-bold bg-transparent px-0"
        />
        <fieldset className="flex flex-col border-y mb-4 py-2">
          <legend className="mb-2 pr-2">Select 4 tags</legend>
          <div className="flex gap-4 flex-wrap w-full">
            {tags.map((tag) => {
              if (tag === "All") return null;
              return (
                <label key={tag} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={tag}
                    {...register("tags")}
                    disabled={false}
                  />
                  <span>{tag}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </form>
  );
}
