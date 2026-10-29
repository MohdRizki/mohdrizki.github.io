// src/data/artikelData.js
// Data artikel statis (dikosongkan agar sepenuhnya dikelola lewat Dashboard CMS Firestore)

export const artikelData = [];

export function getAllTags() {
  const tagSet = new Set();
  artikelData.forEach((artikel) => {
    artikel.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet);
}

export function getArtikelBySlug(slug) {
  return artikelData.find((a) => a.slug === slug) || null;
}

export function getArtikelByTag(tag) {
  return artikelData.filter((artikel) => artikel.tags.includes(tag));
}
