// Database seeder — populates demo users and songs.
//
//   npm run seed        (from the project root)
//   node seeders/seed.js (from the server/ directory)
//
// Songs point at public sample MP3s so they actually play in the app without
// needing local upload files. Existing accounts are preserved; all songs are
// cleared and re-created, so the script is safe to run repeatedly.

import mongoose from "mongoose"
import dotenv from "dotenv"
import pkg from "bcryptjs"
import User from "../models/User.js"
import Song from "../models/Songs.js"

const { hash } = pkg
dotenv.config()

const DEMO_PASSWORD = "password123"

const users = [
    { username: "dj_nova", email: "nova@demo.com" },
    { username: "luna_ray", email: "luna@demo.com" },
    { username: "mc_vertex", email: "vertex@demo.com" },
    { username: "demo", email: "demo@demo.com" },
]

// Public, reliable sample tracks (SoundHelix) + placeholder cover art (picsum).
const mp3 = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`
const cover = (seed) => `https://picsum.photos/seed/${seed}/400/400`

const songs = [
    { title: "Midnight Drive", artist: "Neon Pulse", genre: "EDM", username: "dj_nova", n: 1, tags: ["synth", "night"] },
    { title: "Afterglow", artist: "Neon Pulse", genre: "EDM", username: "dj_nova", n: 2, tags: ["chill", "dance"] },
    { title: "Golden Hour", artist: "Luna Ray", genre: "Pop", username: "luna_ray", n: 3, tags: ["summer", "feelgood"] },
    { title: "City Lights", artist: "Luna Ray", genre: "Pop", username: "luna_ray", n: 4, tags: ["upbeat"] },
    { title: "Concrete Jungle", artist: "MC Vertex", genre: "HipHop", username: "mc_vertex", n: 5, tags: ["beats", "urban"] },
    { title: "Velvet Soul", artist: "Amara Keys", genre: "RnB", username: "demo", n: 6, tags: ["smooth", "soul"] },
    { title: "Thunderbird", artist: "The Drifters Club", genre: "Rock", username: "demo", n: 7, tags: ["guitar", "classic"] },
    { title: "Open Road", artist: "Dusty Lane", genre: "Country", username: "demo", n: 8, tags: ["acoustic"] },
    { title: "Nocturne in Blue", artist: "E. Sokolov", genre: "Classical", username: "demo", n: 9, tags: ["piano"] },
    { title: "Saffron Skies", artist: "Ravi & The Monsoon", genre: "International", username: "demo", n: 10, tags: ["world", "fusion"] },
]

async function seed() {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not set. Add it to server/.env first.")
        process.exit(1)
    }

    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB")

    // Fresh set of songs every run.
    await Song.deleteMany({})

    // Upsert demo users without disturbing existing accounts; reset their songs.
    const hashedPassword = await hash(DEMO_PASSWORD, 10)
    const usersByName = {}
    for (const u of users) {
        let user = await User.findOne({ email: u.email })
        if (!user) {
            user = await User.create({
                username: u.username,
                email: u.email,
                password: hashedPassword,
                songs: [],
            })
        } else {
            user.songs = []
            await user.save()
        }
        usersByName[u.username] = user
    }

    // Create songs and link each one to its owner.
    for (const s of songs) {
        const song = await Song.create({
            title: s.title,
            artist: s.artist,
            genre: s.genre,
            username: s.username,
            tags: s.tags,
            filename: `seed-${s.n}.mp3`,
            link: mp3(s.n),
            cover: cover(s.n),
        })
        const owner = usersByName[s.username]
        if (owner) {
            owner.songs.push(song._id)
        }
    }
    for (const user of Object.values(usersByName)) {
        await user.save()
    }

    console.log(`Seeded ${users.length} users and ${songs.length} songs.`)
    console.log(`Demo logins (password: "${DEMO_PASSWORD}"):`)
    users.forEach((u) => console.log(`  • ${u.email}`))

    await mongoose.disconnect()
    console.log("Done.")
}

seed().catch((err) => {
    console.error("Seed failed:", err)
    process.exit(1)
})
