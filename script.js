// Verander die name/onderskrifte hieronder soos jy wil.
// Foto's moet in die aangeduide photos/-vouers wees. Gebruik JPG, PNG of WEBP.

const specialPeople = [
  { name: "Mamma", note: "My veilige plekkie", file: "mamma.jpg" },
  { name: "Ouma", note: "Drukkies en liefde", file: "ouma.jpg" },
  { name: "Oupa", note: "My spesiale maatjie", file: "oupa.jpg" },
  { name: "Peetmamma", note: "Nog ’n hart vol liefde", file: "peetmamma.jpg" },
  { name: "Spesiale mensie", note: "Iemand baie besonders", file: "mensie-5.jpg" },
  { name: "Spesiale mensie", note: "Dankie vir al die liefde", file: "mensie-6.jpg" },
  { name: "Spesiale mensie", note: "’n Deel van my storie", file: "mensie-7.jpg" },
  { name: "Spesiale mensie", note: "My klein wêreldjie", file: "mensie-8.jpg" }
];

const monthNames = [
  "Maand 1", "Maand 2", "Maand 3", "Maand 4", "Maand 5", "Maand 6",
  "Maand 7", "Maand 8", "Maand 9", "Maand 10", "Maand 11", "Maand 12"
];

const monthGrid = document.getElementById("monthGrid");
const weekGrid = document.getElementById("weekGrid");
const specialGrid = document.getElementById("specialGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let currentPhotos = [];
let currentPhotoIndex = 0;

function photoButton(src, alt, caption, className = "photo-button") {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.setAttribute("aria-label", `Maak foto groter: ${alt}`);
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.onerror = () => {
    img.onerror = null;
    img.src = makePlaceholder(alt);
  };
  button.appendChild(img);
  button.addEventListener("click", () => openLightbox(src, alt, caption));
  return button;
}

function makePlaceholder(label) {
  const safe = String(label).replace(/[<>&"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="500" viewBox="0 0 700 500"><rect width="700" height="500" fill="#fff0f5"/><circle cx="350" cy="205" r="105" fill="#f4c6d8"/><circle cx="270" cy="125" r="65" fill="#f4c6d8"/><circle cx="430" cy="125" r="65" fill="#f4c6d8"/><path d="M350 58 C315 20 270 48 290 85 C310 118 350 105 350 105 C350 105 390 118 410 85 C430 48 385 20 350 58Z" fill="#d9789f"/><text x="350" y="370" text-anchor="middle" font-family="Arial" font-size="27" fill="#9d607a">${safe}</text><text x="350" y="410" text-anchor="middle" font-family="Arial" font-size="18" fill="#b17d94">Plaas jou foto hier ♡</text></svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function openLightbox(src, alt, caption) {
  currentPhotos = Array.from(document.querySelectorAll(".photo-button img"))
    .filter(img => img.dataset.caption !== undefined)
    .map(img => ({ src: img.src, alt: img.alt, caption: img.dataset.caption }));
  const clicked = currentPhotos.findIndex(photo => photo.caption === caption && photo.alt === alt);
  currentPhotoIndex = clicked >= 0 ? clicked : 0;
  showLightboxPhoto(src, alt, caption);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function showLightboxPhoto(src, alt, caption) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption || alt;
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function moveLightbox(direction) {
  if (!currentPhotos.length) return;
  currentPhotoIndex = (currentPhotoIndex + direction + currentPhotos.length) % currentPhotos.length;
  const photo = currentPhotos[currentPhotoIndex];
  showLightboxPhoto(photo.src, photo.alt, photo.caption);
}

specialPeople.forEach((person, index) => {
  const card = document.createElement("article");
  card.className = "special-card";
  const path = `photos/special-people/${person.file}`;
  const button = photoButton(path, person.name, person.note);
  button.querySelector("img").dataset.caption = person.note;
  card.appendChild(button);
  const heading = document.createElement("h3");
  heading.textContent = person.name;
  const note = document.createElement("p");
  note.textContent = person.note;
  card.append(heading, note);
  specialGrid.appendChild(card);
});

monthNames.forEach((month, monthIndex) => {
  const card = document.createElement("article");
  card.className = "month-card";
  const title = document.createElement("div");
  title.className = "month-title";
  const heading = document.createElement("h3");
  heading.textContent = month;
  const count = document.createElement("span");
  count.textContent = "6 herinneringe";
  title.append(heading, count);
  const photos = document.createElement("div");
  photos.className = "month-photos";
  for (let photoIndex = 1; photoIndex <= 6; photoIndex++) {
    const file = `month-${String(monthIndex + 1).padStart(2, "0")}-${photoIndex}.jpg`;
    const caption = `${month} — Foto ${photoIndex}`;
    const button = photoButton(`photos/months/${file}`, caption, caption);
    button.querySelector("img").dataset.caption = caption;
    photos.appendChild(button);
  }
  card.append(title, photos);
  monthGrid.appendChild(card);
});

for (let week = 1; week <= 52; week++) {
  const card = document.createElement("article");
  card.className = "week-card";
  card.dataset.week = String(week);
  const caption = `Week ${week}`;
  const button = photoButton(`photos/weeks/week-${String(week).padStart(2, "0")}.jpg`, caption, caption);
  button.querySelector("img").dataset.caption = caption;
  const heading = document.createElement("h3");
  heading.textContent = caption;
  const note = document.createElement("p");
  note.textContent = "My weeklikse herinnering ♡";
  card.append(button, heading, note);
  weekGrid.appendChild(card);
}

document.getElementById("weekSearch").addEventListener("input", event => {
  const query = event.target.value.trim().toLowerCase().replace("week", "").trim();
  let visible = 0;
  document.querySelectorAll(".week-card").forEach(card => {
    const match = !query || card.dataset.week.includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  document.getElementById("weekCount").textContent = `${visible} ${visible === 1 ? "week" : "weke"}`;
});

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => moveLightbox(-1));
document.getElementById("lightboxNext").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
