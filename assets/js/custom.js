'use strict';

const languageSwitcherId = 'siteLanguageSwitcher';
const languageStorageKey = 'nevstop-lab:language';
const translateScriptSrc = 'https://cdn.staticfile.net/translate.js/3.18.66/translate.js';
const sourceLanguage = 'chinese_simplified';

const languages = {
  zh: {
    code: sourceLanguage,
    documentLanguage: 'zh-CN',
    label: '简体中文',
    shortLabel: '中',
  },
  en: {
    code: 'english',
    documentLanguage: 'en',
    label: 'English',
    shortLabel: 'EN',
  },
};

let translateLoader;

function getStoredLanguage() {
  const value = window.localStorage.getItem(languageStorageKey);
  return Object.prototype.hasOwnProperty.call(languages, value) ? value : 'zh';
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

  translate.language.setLocal(sourceLanguage);
  translate.service.use('client.edge');

  if (translate.ignore?.class) {
    translate.ignore.class.push('notranslate');
  }

  if (translate.selectLanguageTag) {
    translate.selectLanguageTag.show = false;
    translate.selectLanguageTag.languages = `${sourceLanguage},english`;
  }

  translate.listener.start();
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
      resolve(window.translate);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return translateLoader;
}

async function applyLanguage(languageKey) {
  const language = languages[languageKey] || languages.zh;
  window.localStorage.setItem(languageStorageKey, languageKey);
  document.documentElement.lang = language.documentLanguage;
  setSwitcherState(languageKey);

  if (languageKey === 'zh' && !window.translate) return;

  const translate = await loadTranslate();
  translate.changeLanguage(language.code);
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
      <span data-language-current>${languages.zh.label}</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-lg-end shadow rounded border-0">
      <li><button class="dropdown-item site-language-option" type="button" data-site-language="zh">${languages.zh.label}</button></li>
      <li><button class="dropdown-item site-language-option" type="button" data-site-language="en">${languages.en.label}</button></li>
    </ul>
  `;

  switcher.addEventListener('click', (event) => {
    const option = event.target.closest('[data-site-language]');
    if (!option) return;
    applyLanguage(option.dataset.siteLanguage).catch(() => {
      setSwitcherState(getStoredLanguage());
    });
  });

  const colorModeButton = navBody.querySelector('#buttonColorMode');
  const socialMenu = navBody.querySelector('#socialMenu');
  navBody.insertBefore(switcher, colorModeButton || socialMenu || null);

  const preferredLanguage = getStoredLanguage();
  setSwitcherState(preferredLanguage);
  if (preferredLanguage !== 'zh') {
    applyLanguage(preferredLanguage).catch(() => {
      window.localStorage.setItem(languageStorageKey, 'zh');
      setSwitcherState('zh');
    });
  }
}

document.addEventListener('DOMContentLoaded', createLanguageSwitcher);
