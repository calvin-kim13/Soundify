// Lightweight client-side "liked songs" (persists in localStorage).
// No backend like-feature exists, so likes live per-browser.
const KEY = "sf_liked_songs"

export const getLikes = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
        return []
    }
}

export const toggleLike = (id) => {
    if (!id) return getLikes()
    const likes = getLikes()
    const next = likes.includes(id)
        ? likes.filter((x) => x !== id)
        : [...likes, id]
    localStorage.setItem(KEY, JSON.stringify(next))
    return next
}
