"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.LIARA_REGION || "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.LIARA_SECRET_ACCESS_KEY || "",
    },
});

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, message: "فایل یافت نشد" };
        }

        const size = file.size;
        if (size > 10 * 1024 * 1024) {
            return { success: false, message: "فایل باید کمتر از 10 مگابایت باشد" };
        }

        const buffer = await file.arrayBuffer();
        const key = `articles/${Date.now()}-${file.name}`;

        const command = new PutObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(buffer),
            ContentType: file.type,
        });

        await s3Client.send(command);

        const imageUrl = `${process.env.LIARA_PUBLIC_URL}/${key}`;
        return { success: true, imageUrl };
    } catch (error) {
        console.error("Error uploading image:", error);
        return { success: false, message: "خطا در آپلود تصویر" };
    }
}

export async function deleteImage(imageUrl: string) {
    try {
      const publicBase = `${process.env.LIARA_PUBLIC_URL}/`;
      const key = imageUrl.startsWith(publicBase)
        ? imageUrl.replace(publicBase, "")
        : null;
  
        if (!key) {
            return { success: false, message: "آدرس تصویر نامعتبر است" };
        }

      const command = new DeleteObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: key,
      });
  
      await s3Client.send(command);
      return { success: true };
    } catch (error) {
      console.error("Error deleting image:", error);
      return { success: false, message: "خطا در حذف تصویر" };
    }
  }