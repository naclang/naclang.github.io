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

// Highlight the current section in the docs sidebar.
const tocLinks = Array.from(document.querySelectorAll(".docs-toc a[href^='#']"));
if (tocLinks.length && "IntersectionObserver" in window) {
	const byId = new Map(tocLinks.map((link) => [link.getAttribute("href").slice(1), link]));
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				tocLinks.forEach((link) => link.classList.remove("is-current"));
				const link = byId.get(entry.target.id);
				if (link) link.classList.add("is-current");
			});
		},
		{ rootMargin: "-90px 0px -70% 0px" },
	);
	byId.forEach((_, id) => {
		const section = document.getElementById(id);
		if (section) observer.observe(section);
	});
}

// Docs dropdown in the main navigation.
const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));

function closeDropdowns(except) {
	dropdowns.forEach((dropdown) => {
		if (dropdown === except) return;
		dropdown.classList.remove("open");
		const button = dropdown.querySelector(".nav-dropbtn");
		if (button) button.setAttribute("aria-expanded", "false");
	});
}

dropdowns.forEach((dropdown) => {
	const button = dropdown.querySelector(".nav-dropbtn");
	if (!button) return;

	button.addEventListener("click", (event) => {
		event.stopPropagation();
		closeDropdowns(dropdown);
		const open = dropdown.classList.toggle("open");
		button.setAttribute("aria-expanded", String(open));
		// Closing with a click while the pointer is still over the menu must not
		// let :hover reopen it; hover works again once the pointer leaves.
		dropdown.classList.toggle("no-hover", !open);
	});

	dropdown.addEventListener("mouseleave", () => dropdown.classList.remove("no-hover"));
});

document.addEventListener("click", () => closeDropdowns());
document.addEventListener("keydown", (event) => {
	if (event.key !== "Escape") return;
	const openDropdown = dropdowns.find((dropdown) => dropdown.classList.contains("open"));
	closeDropdowns();
	if (openDropdown) openDropdown.querySelector(".nav-dropbtn").focus();
});

// Mobile menu button.
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");

function setMenu(open) {
	if (!siteHeader || !navToggle) return;
	siteHeader.classList.toggle("menu-open", open);
	navToggle.setAttribute("aria-expanded", String(open));
	navToggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
	if (!open) closeDropdowns();
}

if (navToggle) {
	navToggle.addEventListener("click", (event) => {
		event.stopPropagation();
		setMenu(!siteHeader.classList.contains("menu-open"));
	});

	// Leaf links close the menu (the Docs button only opens its submenu).
	document.querySelectorAll(".site-nav a").forEach((link) => {
		link.addEventListener("click", () => setMenu(false));
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") setMenu(false);
	});

	window.matchMedia("(min-width: 761px)").addEventListener("change", () => setMenu(false));
}

// Docs sidebar: collapsible on small screens.
const tocBox = document.querySelector(".docs-toc");
const tocButton = document.querySelector(".toc-toggle");

if (tocBox && tocButton) {
	function setToc(open) {
		tocBox.classList.toggle("open", open);
		tocButton.setAttribute("aria-expanded", String(open));
	}

	tocButton.addEventListener("click", () => setToc(!tocBox.classList.contains("open")));

	// Jumping to a section of this page closes the list.
	tocBox.querySelectorAll('.toc-panel a[href^="#"]').forEach((link) => {
		link.addEventListener("click", () => setToc(false));
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") setToc(false);
	});
}
