// Utility: check if a file exists via HEAD request
async function checkFile(url: string): Promise<boolean> {
    try {
        const r = await fetch(url, { method: "HEAD" });
        return r.ok;
    } catch {
        return false;
    }
}

// Theme handling
function applyTheme(theme: "light" | "dark" | "system") {
    const root = document.documentElement;

    if (theme === "system") {
        root.removeAttribute("data-theme");
    } else {
        root.setAttribute("data-theme", theme);
    }

    localStorage.setItem("theme", theme);
}

function initTheme() {
    const saved = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    applyTheme(saved || "system");
}

function setupThemeToggle() {
    const toggle = document.getElementById("theme-toggle") as HTMLButtonElement;

    toggle.onclick = () => {
        const current = localStorage.getItem("theme") || "system";

        const next =
            current === "system" ? "light" :
                current === "light" ? "dark" :
                    "system";

        applyTheme(next);

        toggle.textContent =
            next === "system" ? "Theme: System" :
                next === "light" ? "Theme: Light" :
                    "Theme: Dark";
    };

    // Initialize label
    const saved = localStorage.getItem("theme") || "system";
    toggle.textContent =
        saved === "system" ? "Theme: System" :
            saved === "light" ? "Theme: Light" :
                "Theme: Dark";
}

// Main initialization
(async () => {
    initTheme();
    setupThemeToggle();

    const hasHtml = await checkFile("resume.html");
    const hasPdf = await checkFile("resume.pdf");

    const htmlBtn = document.getElementById("show-html") as HTMLButtonElement;
    const pdfBtn = document.getElementById("show-pdf") as HTMLButtonElement;
    const dlBtn = document.getElementById("download-pdf") as HTMLAnchorElement;

    const htmlView = document.getElementById("html-view") as HTMLDivElement;
    const pdfView = document.getElementById("pdf-view") as HTMLDivElement;
    const fallback = document.getElementById("fallback") as HTMLDivElement;

    if (hasHtml) {
        htmlBtn.style.display = "inline-block";
        fetch("resume.html")
            .then(r => r.text())
            .then(html => { htmlView.innerHTML = html; });
    }

    if (hasPdf) {
        pdfBtn.style.display = "inline-block";
        dlBtn.style.display = "inline-block";
    }

    if (hasHtml) {
        htmlView.style.display = "block";
    } else if (hasPdf) {
        pdfView.style.display = "block";
    } else {
        fallback.style.display = "block";
    }

    htmlBtn.onclick = () => {
        htmlView.style.display = "block";
        pdfView.style.display = "none";
    };

    pdfBtn.onclick = () => {
        htmlView.style.display = "none";
        pdfView.style.display = "block";
    };
})();
