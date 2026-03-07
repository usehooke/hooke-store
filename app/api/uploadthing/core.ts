import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .onUploadComplete(async ({ file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for url:", file.url);

            // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: "Admin" };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
