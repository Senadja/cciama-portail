// Pilotage du widget gratuit « Google Website Translate » (chargé dans index.html).
// La langue cible est mémorisée dans le cookie `googtrans` que Google relit à chaque
// chargement de page ; un rechargement applique la traduction de tout le DOM.

type Lang = 'FR' | 'AR' | 'EN';

const SOURCE = 'fr';
const LANG_TO_GOOGLE: Record<Lang, string> = { FR: 'fr', AR: 'ar', EN: 'en' };

function clearGoogTransCookie(host: string) {
  const expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `googtrans=;path=/;expires=${expire}`;
  document.cookie = `googtrans=;path=/;domain=${host};expires=${expire}`;
  document.cookie = `googtrans=;path=/;domain=.${host};expires=${expire}`;
}

/** Applique la langue choisie en (ré)écrivant le cookie `googtrans` puis en rechargeant. */
export function applyGoogleTranslation(lang: Lang) {
  const target = LANG_TO_GOOGLE[lang];
  const host = window.location.hostname;

  clearGoogTransCookie(host);

  // Langue source → on laisse le cookie vidé (texte d'origine restauré au rechargement).
  if (target !== SOURCE) {
    const value = `/${SOURCE}/${target}`;
    document.cookie = `googtrans=${value};path=/`;
    document.cookie = `googtrans=${value};path=/;domain=${host}`;
    document.cookie = `googtrans=${value};path=/;domain=.${host}`;
  }

  window.location.reload();
}
