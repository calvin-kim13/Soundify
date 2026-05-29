import * as fs from "fs/promises"
import * as path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
dotenv.config()
import Song from "../models/Songs.js"
import User from "../models/User.js"

// Local-disk storage: uploaded files are written to server/uploads and served
// statically by Express at /uploads (see server.js). No cloud account needed.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, "..", "uploads")
const BASE_URL = (
    process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`
).replace(/\/$/, "")

await fs.mkdir(UPLOADS_DIR, { recursive: true })

// Strip any path components so a crafted filename can never escape UPLOADS_DIR.
const safeName = (name) => path.basename(name)
const publicUrl = (key) => `${BASE_URL}/uploads/${encodeURIComponent(key)}`

const uploadImage = async (content) => {
    const key = safeName(content.filename)
    await fs.writeFile(path.join(UPLOADS_DIR, key), content.file)
    return publicUrl(key)
}

const uploadSong = async (content, song, coverUrl) => {
    const key = safeName(content.filename)
    await fs.writeFile(path.join(UPLOADS_DIR, key), content.file)

    const newSong = new Song({
        title: song.title,
        genre: song.genre,
        tags: song.tags,
        artist: song.artist,
        username: song.username,
        filename: key,
        cover: coverUrl,
        link: publicUrl(key),
    })
    await newSong.save()
    await User.findOneAndUpdate(
        { username: song.username },
        { $addToSet: { songs: newSong._id } },
    )
    return newSong
}

const deleteSong = async (key) => {
    try {
        await fs.unlink(path.join(UPLOADS_DIR, safeName(key)))
        console.log("Success. File deleted.", key)
    } catch (err) {
        console.log("Error deleting file.", err)
    }
}

export { uploadSong, deleteSong, uploadImage }
