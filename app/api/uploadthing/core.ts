import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { isAdmin } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      if (!(await isAdmin())) {
        throw new UploadThingError("Não autorizado.");
      }

      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ file }) => {
      return {
        imageUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
