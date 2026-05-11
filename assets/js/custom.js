'use strict';

const languageSwitcherId = 'siteLanguageSwitcher';
const languageStorageKey = 'nevstop-lab:language';
// Resolved relative to the built /js/app*.js bundle; static/vendor is emitted beside /js.
const translateScriptPath = '../vendor/translate/translate.min.js';
const sourceLanguage = 'chinese_simplified';
const defaultLanguage = 'zh';
const languageSwitcherLabel = '切换语言 / Switch language';

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
let translateScriptSrc;

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
  return normalizeLanguageKey(value);
}

/**
 * Returns a supported language key, falling back to the source language for invalid values.
 */
function normalizeLanguageKey(languageKey) {
  return Object.prototype.hasOwnProperty.call(languages, languageKey) ? languageKey : defaultLanguage;
}

function setLanguageState(languageKey) {
  const normalizedLanguageKey = normalizeLanguageKey(languageKey);
  writeStoredLanguage(normalizedLanguageKey);
  document.documentElement.lang = languages[normalizedLanguageKey].documentLanguage;
  setSwitcherState(normalizedLanguageKey);
  return normalizedLanguageKey;
}

function setSwitcherState(languageKey) {
  const normalizedLanguageKey = normalizeLanguageKey(languageKey);
  const switcher = document.getElementById(languageSwitcherId);
  if (!switcher) return;

  switcher.querySelector('[data-language-current]').textContent = languages[normalizedLanguageKey].label;
  switcher.querySelector('.site-language-toggle')?.setAttribute('aria-label', languageSwitcherLabel);

  switcher.querySelectorAll('[data-site-language]').forEach((item) => {
    const isActive = item.dataset.siteLanguage === normalizedLanguageKey;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function configureTranslate() {
  const { translate } = window;
  if (!translate) return;

  // translate.js uses setLocal for the source language.
  translate.language?.setLocal(sourceLanguage);
  translate.service?.use('giteeai');

  const ignoreClass = translate.ignore?.class;
  if (Array.isArray(ignoreClass)) {
    if (!ignoreClass.includes('notranslate')) ignoreClass.push('notranslate');
  } else if (ignoreClass?.data && Array.isArray(ignoreClass.data)) {
    if (!ignoreClass.data.includes('notranslate')) ignoreClass.data.push('notranslate');
  } else if (typeof ignoreClass?.add === 'function') {
    ignoreClass.add('notranslate');
  }

  if (translate.selectLanguageTag) {
    translate.selectLanguageTag.show = false;
    translate.selectLanguageTag.languages = `${sourceLanguage},english`;
  }

  translate.listener?.start();
}

function loadTranslate() {
  if (window.translate) return Promise.resolve(window.translate);
  // Concurrent callers share the in-flight load; failures clear it so a later click can retry.
  if (translateLoader) return translateLoader;

  translateLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = getTranslateScriptSrc();
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
      try {
        configureTranslate();
      } catch (error) {
        script.remove();
        translateLoader = undefined;
        reject(new Error(`Failed to configure translate.js: ${error?.message || error}`));
        return;
      }
      if (window.translate) {
        resolve(window.translate);
      } else {
        translateLoader = undefined;
        reject(new Error('translate.js loaded without exposing window.translate. Verify local script publishing or script loading conflicts.'));
      }
    };
    script.onerror = () => {
      script.remove();
      translateLoader = undefined;
      reject(new Error('Failed to load local translate.js. Verify that /vendor/translate/translate.min.js is accessible and properly deployed.'));
    };
    document.head.appendChild(script);
  });

  return translateLoader;
}

function getTranslateScriptSrc() {
  if (translateScriptSrc) return translateScriptSrc;

  const scriptElement = document.currentScript || document.querySelector('script[src*="/js/"]');
  translateScriptSrc = scriptElement?.src
    ? new URL(translateScriptPath, scriptElement.src).toString()
    : new URL('/vendor/translate/translate.min.js', window.location.origin).toString();

  return translateScriptSrc;
}

function flashLanguageFeedback(message) {
  const el = document.getElementById(languageSwitcherId);
  if (!el) return;
  const current = el.querySelector('[data-language-current]');
  if (!current) return;
  const original = current.textContent;
  current.textContent = message;
  current.style.color = 'var(--bs-danger, #dc3545)';
  setTimeout(() => {
    current.textContent = original;
    current.style.color = '';
  }, 3000);
}

async function applyLanguage(languageKey) {
  const normalizedLanguageKey = normalizeLanguageKey(languageKey);
  const language = languages[normalizedLanguageKey];

  if (normalizedLanguageKey === defaultLanguage && !window.translate) {
    return setLanguageState(normalizedLanguageKey);
  }

  try {
    const translate = await loadTranslate();
    await translate.changeLanguage(language.code);
  } catch (error) {
    flashLanguageFeedback('翻译失败');
    throw new Error(`Failed to execute translate.changeLanguage for ${normalizedLanguageKey}: ${error?.message || error}`);
  }

  return setLanguageState(normalizedLanguageKey);
}

function initLanguageSwitcher() {
  const switcher = document.getElementById(languageSwitcherId);
  if (!switcher) return;

  switcher.addEventListener('click', (event) => {
    const option = event.target.closest('[data-site-language]');
    if (!option) return;
    const previousLanguage = getStoredLanguage();
    applyLanguage(option.dataset.siteLanguage).catch((error) => {
      console.warn('Failed to switch site language.', error);
      setLanguageState(previousLanguage);
    });
  });

  const preferredLanguage = getStoredLanguage();
  setSwitcherState(preferredLanguage);
  if (preferredLanguage !== defaultLanguage) {
    applyLanguage(preferredLanguage).catch((error) => {
      console.warn('Failed to restore site language preference.', error);
      setLanguageState(defaultLanguage);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}
