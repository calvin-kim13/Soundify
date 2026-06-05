// Shared playlist cover gradients so the sidebar, the playlists grid, and the
// opened playlist view all show the SAME color for a given playlist.
export const PLAYLIST_GRADIENTS = [
    "linear-gradient(135deg,#6366f1,#22d3ee)",
    "linear-gradient(135deg,#10b981,#84cc16)",
    "linear-gradient(135deg,#a855f7,#ec4899)",
    "linear-gradient(135deg,#f472b6,#8b5cf6)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#3b82f6,#06b6d4)",
]

export const playlistGradient = (i) => {
    const n = PLAYLIST_GRADIENTS.length
    return PLAYLIST_GRADIENTS[(((i || 0) % n) + n) % n]
}
