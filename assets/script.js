// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, observerOptions);

document.querySelectorAll(".scroll-reveal").forEach((el) => {
    observer.observe(el);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

const sidebarItems = document.querySelectorAll(".editor-sidebar li");
const codeContent = document.getElementById("code-content");
const fileName = document.querySelector(".file-name");

async function loadFromGithub(url) {
    try {
        codeContent.textContent = "Loading...";

        const res = await fetch(url);
        const text = await res.text();

        codeContent.textContent = text;
    } catch (err) {
        codeContent.textContent = "Error loading file.";
    }
}

sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
        sidebarItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const url = item.getAttribute("data-url");
        fileName.textContent = item.textContent;

        loadFromGithub(url);
    });
});

// İlk dosyayı otomatik yükle
if (sidebarItems[0]) {
    sidebarItems[0].click();
}