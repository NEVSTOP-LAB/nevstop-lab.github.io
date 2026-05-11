const autoprefixer = require("autoprefixer");
const purgeCSSPlugin = require("@fullhuman/postcss-purgecss");

const purgecss = purgeCSSPlugin({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    let els = {};
    try {
      els = JSON.parse(content).htmlElements || {};
    } catch {
      return [];
    }
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  dynamicAttributes: [
    "aria-expanded",
    "data-bs-popper",
    "data-bs-target",
    "data-bs-theme",
    "data-dark-mode",
    "data-global-alert",
    "data-pane",
    "data-popper-placement",
    "data-sizes",
    "data-toggle-tab",
    "id",
    "size",
    "type",
  ],
  safelist: [
    "active",
    "btn-clipboard",
    "clipboard",
    "disabled",
    "hidden",
    "modal-backdrop",
    "selected",
    "show",
    "img-fluid",
    "blur-up",
    "lazyload",
    "lazyloaded",
    "alert-link",
    "container-fw",
    "container-lg",
    "container-fluid",
    "offcanvas-backdrop",
    "figcaption",
    "dt",
    "dd",
    "showing",
    "hiding",
    "page-item",
    "page-link",
    "not-content",
    "copy",
    "btn-copy",
    // Language switcher classes injected via Hugo template; safelist as extra guard
    // so PurgeCSS never strips them even if the static analysis misses them.
    /^site-language/,
    "notranslate",
  ],
});

module.exports = {
  plugins: [
    autoprefixer(),
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
