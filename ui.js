function toggleStorageDisplay() {
    const storage = document.getElementById("storageUI")
    const cpanel = document.getElementById("controlPanel")
    if (storage.style.display == "flex") {
        storage.style.translate = "-100% 0"
        setTimeout(function() {
            storage.style.display = "none"
        }, 500)
        
    } else {
        storage.style.display = "flex"

        requestAnimationFrame(() => {
            storage.style.translate = "0 0"
        })
    }

    if (cpanel.style.display == "none") {
        cpanel.style.display = "block"

        requestAnimationFrame(() => {
            cpanel.style.translate = "0 0"
        })
    } else {
        cpanel.style.translate = "0 100%"
        setTimeout(function() {
            cpanel.style.display = "none"
        }, 200)
    }
}

// window.toggleStorageDisplay = toggleStorageDisplay()