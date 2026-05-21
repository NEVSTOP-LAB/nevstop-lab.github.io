'use strict';

const languageSwitcherId = 'siteLanguageSwitcher';
const languageStorageKey = 'nevstop-lab:language';
// Resolved relative to the built /js/app*.js bundle; static/vendor is emitted beside /js.
const translateScriptPath = '../vendor/translate/translate.min.js';
const sourceLanguage = 'chinese_simplified';
const defaultLanguage = 'zh';
const languageSwitcherLabel = '切换语言 / Switch language';
const minimumTranslationIndicatorMs = 600;
const translationCompletionTimeoutMs = 20000;

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
let pendingLanguageKey;

function readStoredLanguage() {
  try {
    return window.localStorage.getItem(languageStorageKey);
  } catch {
    return null;
  }
}

function waitFor(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function removeHook(list, hook) {
  const index = list.indexOf(hook);
  if (index !== -1) {
    list.splice(index, 1);
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

  const current = switcher.querySelector('[data-language-current]');
  if (current) {
    current.textContent = languages[normalizedLanguageKey].label;
    current.style.color = '';
  }
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
  // The bundled giteeai channel is unreliable on localhost previews; Edge is more stable here.
  translate.service?.use('client.edge');

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

function waitForTranslationRender(targetCode) {
  const { translate } = window;
  if (!translate?.lifecycle?.execute) {
    return Promise.reject(new Error('translate.js lifecycle hooks unavailable.'));
  }

  return new Promise((resolve, reject) => {
    let executionUuid;
    let failureMessage;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      removeHook(translate.lifecycle.execute.start, startHook);
      removeHook(translate.lifecycle.execute.translateNetworkAfter, networkAfterHook);
      removeHook(translate.lifecycle.execute.renderFinish, renderFinishHook);
    };

    const startHook = (event) => {
      if (event?.to === targetCode && !executionUuid) {
        executionUuid = event.uuid;
      }
    };

    const networkAfterHook = (event) => {
      if (event?.to !== targetCode) return;
      if (executionUuid && event.uuid !== executionUuid) return;
      if (event.result !== 1 && !failureMessage) {
        failureMessage = event.info || `Translation request failed for ${event.from} -> ${event.to}.`;
      }
    };

    const renderFinishHook = (uuid, to) => {
      if (to !== targetCode) return;
      if (executionUuid && uuid !== executionUuid) return;
      cleanup();
      if (failureMessage) {
        reject(new Error(failureMessage));
        return;
      }
      resolve();
    };

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for translation render for ${targetCode}.`));
    }, translationCompletionTimeoutMs);

    translate.lifecycle.execute.start.push(startHook);
    translate.lifecycle.execute.translateNetworkAfter.push(networkAfterHook);
    translate.lifecycle.execute.renderFinish.push(renderFinishHook);

    try {
      translate.changeLanguage(targetCode);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
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
    if (current.textContent === message) {
      current.textContent = original;
    }
    current.style.color = '';
  }, 3000);
}

function setTranslationBusy(busy) {
  const switcher = document.getElementById(languageSwitcherId);
  if (!switcher) return;
  switcher.querySelectorAll('[data-site-language]').forEach((item) => {
    item.disabled = busy;
    const isPending = busy && item.dataset.siteLanguage === pendingLanguageKey;
    item.classList.toggle('is-processing', isPending);
    item.setAttribute('aria-busy', isPending ? 'true' : 'false');
  });
  if (busy) {
    switcher.setAttribute('aria-busy', 'true');
  } else {
    switcher.removeAttribute('aria-busy');
  }
}

function restoreSourceLanguage() {
  try {
    window.translate?.changeLanguage(sourceLanguage);
  } catch {
    // Ignore restore failures and keep the original label state.
  }
  return setLanguageState(defaultLanguage);
}

function closeLanguageSwitcherMenu() {
  const toggle = document.getElementById('siteLanguageSwitcherToggle');
  if (!toggle) return;

  const dropdown = window.bootstrap?.Dropdown?.getOrCreateInstance?.(toggle);
  if (dropdown) {
    dropdown.hide();
    return;
  }

  toggle.setAttribute('aria-expanded', 'false');
  document.querySelector('#siteLanguageSwitcher .dropdown-menu')?.classList.remove('show');
}

async function applyLanguage(languageKey) {
  const normalizedLanguageKey = normalizeLanguageKey(languageKey);
  const language = languages[normalizedLanguageKey];

  if (normalizedLanguageKey === defaultLanguage) {
    if (!window.translate) {
      return setLanguageState(normalizedLanguageKey);
    }
    return restoreSourceLanguage();
  }

  setSwitcherState(normalizedLanguageKey);
  pendingLanguageKey = normalizedLanguageKey;
  setTranslationBusy(true);
  const busyStartedAt = window.performance?.now?.() || Date.now();
  try {
    await loadTranslate();
    await waitForTranslationRender(language.code);
  } catch (error) {
    flashLanguageFeedback('翻译失败');
    throw new Error(`Failed to execute translate.changeLanguage for ${normalizedLanguageKey}: ${error?.message || error}`);
  } finally {
    const busyElapsedMs = (window.performance?.now?.() || Date.now()) - busyStartedAt;
    if (busyElapsedMs < minimumTranslationIndicatorMs) {
      await waitFor(minimumTranslationIndicatorMs - busyElapsedMs);
    }
    pendingLanguageKey = undefined;
    setTranslationBusy(false);
  }

  return setLanguageState(normalizedLanguageKey);
}

function initLanguageSwitcher() {
  const switcher = document.getElementById(languageSwitcherId);
  if (!switcher) return;

  switcher.addEventListener('click', (event) => {
    const option = event.target.closest('[data-site-language]');
    if (!option) return;
    event.preventDefault();
    event.stopPropagation();
    const previousLanguage = getStoredLanguage();
    closeLanguageSwitcherMenu();
    applyLanguage(option.dataset.siteLanguage)
      .catch((error) => {
        console.warn('Failed to switch site language.', error);
        if (previousLanguage === defaultLanguage) {
          restoreSourceLanguage();
        } else {
          setLanguageState(previousLanguage);
        }
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
