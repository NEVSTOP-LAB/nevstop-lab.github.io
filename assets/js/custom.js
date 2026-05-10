'use strict';

const languageSwitcherId = 'siteLanguageSwitcher';
const languageStorageKey = 'nevstop-lab:language';
const translateScriptSrc = 'https://cdn.staticfile.net/translate.js/3.18.66/translate.js';
const sourceLanguage = 'chinese_simplified';
const defaultLanguage = 'zh';

const languages = {
  zh: {
    code: sourceLanguage,
    documentLanguage: 'zh-CN',
    label: '简体中文',
  },
  en: {
    code: 'english',
    documentLanguage: 'en',
    label: 'English',
  },
};

let translateLoader;

function readStoredLanguage() {
  try {
    return window.localStorage.getItem(languageStorageKey);
  } catch {
    return null;
  }
}

function writeStoredLanguage(languageKey) {
  try {
    window.localStorage.setItem(languageStorageKey, languageKey);
  } catch {
    // localStorage may be unavailable in strict privacy contexts.
  }
}

function getStoredLanguage() {
  const value = readStoredLanguage();
  return Object.prototype.hasOwnProperty.call(languages, value) ? value : defaultLanguage;
}

function setSwitcherState(languageKey) {
  const switcher = document.getElementById(languageSwitcherId);
  if (!switcher) return;

  switcher.querySelector('[data-language-current]').textContent = languages[languageKey].label;

  switcher.querySelectorAll('[data-site-language]').forEach((item) => {
    const isActive = item.dataset.siteLanguage === languageKey;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function configureTranslate() {
  const { translate } = window;
  if (!translate) return;

  translate.language?.setLocal(sourceLanguage);
  translate.service?.use('client.edge');

  if (translate.ignore?.class) {
    translate.ignore.class.push('notranslate');
  }

  if (translate.selectLanguageTag) {
    translate.selectLanguageTag.show = false;
    translate.selectLanguageTag.languages = `${sourceLanguage},english`;
  }

  translate.listener?.start();
}

function loadTranslate() {
  if (window.translate) return Promise.resolve(window.translate);
  if (translateLoader) return translateLoader;

  translateLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = translateScriptSrc;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
      configureTranslate();
      if (window.translate) {
        resolve(window.translate);
      } else {
        reject(new Error('translate.js loaded without exposing window.translate. Verify CDN availability or script loading conflicts.'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return translateLoader;
}

async function applyLanguage(languageKey) {
  const language = languages[languageKey] || languages[defaultLanguage];
  writeStoredLanguage(languageKey);
  document.documentElement.lang = language.documentLanguage;
  setSwitcherState(languageKey);

  if (languageKey === defaultLanguage && !window.translate) return;

  const translate = await loadTranslate();
  await translate.changeLanguage(language.code);
}

function createLanguageSwitcher() {
  const navBody = document.querySelector('#offcanvasNavMain .offcanvas-body');
  if (!navBody || document.getElementById(languageSwitcherId)) return;

  const switcher = document.createElement('div');
  switcher.id = languageSwitcherId;
  switcher.className = 'dropdown site-language-switcher notranslate mt-3 mt-lg-0 ms-lg-2';
  switcher.setAttribute('translate', 'no');
  switcher.innerHTML = `
    <button class="btn btn-link nav-link dropdown-toggle site-language-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="切换语言">
      <span class="site-language-icon" aria-hidden="true">文</span>
      <span data-language-current>${languages[defaultLanguage].label}</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-lg-end shadow rounded border-0">
      <li><button class="dropdown-item site-language-option" type="button" data-site-language="${defaultLanguage}">${languages[defaultLanguage].label}</button></li>
      <li><button class="dropdown-item site-language-option" type="button" data-site-language="en">${languages.en.label}</button></li>
    </ul>
  `;

  switcher.addEventListener('click', (event) => {
    const option = event.target.closest('[data-site-language]');
    if (!option) return;
    applyLanguage(option.dataset.siteLanguage).catch((error) => {
      console.warn('Failed to switch site language.', error);
      setSwitcherState(getStoredLanguage());
    });
  });

  const colorModeButton = navBody.querySelector('#buttonColorMode');
  const socialMenu = navBody.querySelector('#socialMenu');
  navBody.insertBefore(switcher, colorModeButton || socialMenu || null);

  const preferredLanguage = getStoredLanguage();
  setSwitcherState(preferredLanguage);
  if (preferredLanguage !== defaultLanguage) {
    applyLanguage(preferredLanguage).catch((error) => {
      console.warn('Failed to restore site language preference.', error);
      writeStoredLanguage(defaultLanguage);
      setSwitcherState(defaultLanguage);
    });
  }
}

document.addEventListener('DOMContentLoaded', createLanguageSwitcher);
