//Add song

import { Router } from "express";
const router = Router();
import multer from "multer";
import { memoryStorage } from "multer";
import * as path from "path";
import { uploadSong, uploadImage } from "../../storage/index.js";

const storage = memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/upload",
  upload.fields([
    { name: "filename", maxCount: 1 },
    { name: "imgFilename", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, genre, username, tags, artist } = req.body;
      // Unique base name so concurrent/repeat uploads never collide on disk or
      // on the Song.link unique index.
      const fName = `${tags.toString()}${username}${Date.now()}`;

      const songFile = req.files["filename"][0];
      const songExt = path.extname(songFile.originalname) || ".mp3";
      const content = {
        filename: fName + songExt,
        file: songFile.buffer,
      };

      let coverUrl;
      if (req.files["imgFilename"] !== undefined) {
        const imgFile = req.files["imgFilename"][0];
        const imgExt = path.extname(imgFile.originalname) || ".jpg";
        const imageContent = {
          filename: fName + imgExt,
          file: imgFile.buffer,
        };
        coverUrl = await uploadImage(imageContent);
      }

      const newSong = {
        title: title,
        tags: tags,
        genre: genre,
        artist: artist,
        username: username,
      };

      await uploadSong(content, newSong, coverUrl);

      res.redirect("/");
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export { router };
