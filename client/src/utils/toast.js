// Minimal dependency-free toast — replaces antd `message`/`notification`.
let host

function ensureHost() {
    if (!host) {
        host = document.createElement("div")
        host.className = "sf-toast-host"
        document.body.appendChild(host)
    }
    return host
}

function show(text, type = "info") {
    const el = document.createElement("div")
    el.className = `sf-toast sf-toast-${type}`
    el.textContent = text
    ensureHost().appendChild(el)
    requestAnimationFrame(() => el.classList.add("show"))

    let removed = false
    const dismiss = () => {
        if (removed) return
        removed = true
        el.classList.remove("show")
        setTimeout(() => el.remove(), 250)
    }

    const timer = setTimeout(dismiss, 2600)
    return () => {
        clearTimeout(timer)
        dismiss()
    }
}

const toast = {
    success: (t) => show(t, "success"),
    error: (t) => show(t, "error"),
    info: (t) => show(t, "info"),
    // antd `message.loading(text, 0)` returned a manual-dismiss fn; keep parity.
    loading: (t) => show(t, "info"),
}

export default toast
