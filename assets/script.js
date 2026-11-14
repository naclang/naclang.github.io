// Current year in the footer.
document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
});

// Smooth scrolling for in-page links, leaving external or unknown anchors alone.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");

        if (href === "#") {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// Example browser on the homepage.
const sidebarItems = Array.from(document.querySelectorAll(".editor-sidebar li[data-url]"));
const codeContent = document.getElementById("code-content");
const fileName = document.querySelector(".file-name");

async function loadExample(url) {
    if (!codeContent) return;

    codeContent.textContent = "Loading...";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.status);
        codeContent.textContent = await response.text();
    } catch (error) {
        codeContent.textContent =
            "Could not load " + url + "\n\n" + "Open the file in the repository to read it.";
    }
}

sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
        sidebarItems.forEach((other) => other.classList.remove("active"));
        item.classList.add("active");

        if (fileName) fileName.textContent = item.textContent.trim();
        loadExample(item.getAttribute("data-url"));
    });
});

// Keep the inline example visible until a file is selected. This also avoids a
// network round-trip (and a loading flash) on first paint.
if (sidebarItems[0]) {
    sidebarItems[0].classList.add("active");
}
