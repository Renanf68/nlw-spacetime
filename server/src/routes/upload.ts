import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "fs";
import { extname, resolve } from "path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    console.log("Calling /upload...");
    try {
      const upload = await request.file({
        limits: {
          fileSize: 5_242_800, // 5mb
        },
      });

      console.log(`Calling /upload with ${upload?.fieldname}`);
      if (!upload) {
        return reply.status(400).send();
      }

      const mimitypeRegex = /^(image|video)\/[a-zA-Z]+/;

      const isValidFileFormat = mimitypeRegex.test(upload.mimetype);

      if (!isValidFileFormat) {
        return reply.status(400).send();
      }

      const fileId = randomUUID();
      const extension = extname(upload.filename);

      const fileName = fileId.concat(extension);

      const writeStream = createWriteStream(
        resolve(__dirname, "../../uploads", fileName)
      );

      await pump(upload.file, writeStream);

      const fullUrl = request.protocol.concat("://").concat(request.hostname);
      const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();

      return { fileUrl };
    } catch (error) {
      console.log("/upload ERROR: ", error);
    }
  });
}
