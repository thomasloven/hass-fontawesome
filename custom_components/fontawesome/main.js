/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/***/ (() => {

eval("const DOMAIN = \"fontawesome\";\n\nconst ICON_STORE = {};\n\nconst PREFIXES = {\n  fab: \"brands\",\n  far: \"regular\",\n  fas: \"solid\",\n  fapro: \"pro\",\n  facustom: \"pro\",\n};\n\nconst PATH_CLASSES = {\n  \"fa-primary\": \"primary\",\n  \"fa-secondary\": \"secondary\",\n  primary: \"primary\",\n  secondary: \"secondary\",\n};\n\nconst preProcessIcon = async (iconSet, iconName) => {\n  const [icon, format] = iconName.split(\"#\");\n  const data = await fetch(`/${DOMAIN}/icons/${iconSet}/${icon}.svg`);\n  const text = await data.text();\n  const parser = new DOMParser();\n  const doc = parser.parseFromString(text, \"text/html\");\n\n  if (!doc || !doc.querySelector(\"svg\")) return {};\n\n  const viewBox = doc.querySelector(\"svg\").getAttribute(\"viewBox\");\n  const _paths = doc.querySelectorAll(\"path\");\n  const paths = {};\n  let path = \"\";\n  for (const pth of _paths) {\n    path = path + pth.getAttribute(\"d\");\n    const cls = pth.classList[0];\n    if (PATH_CLASSES[cls]) {\n      paths[PATH_CLASSES[cls]] = pth.getAttribute(\"d\");\n    }\n  }\n\n  // Don't allow full code to be used if the svg may contain javascript\n  let fullCode = null;\n  const svgEl = doc.querySelector(\"svg\");\n  const hasOn = Array.from(svgEl.attributes).some((a) =>\n    a.name.startsWith(\"on\")\n  );\n  if (!hasOn) {\n    if (!svgEl.getElementsByTagName(\"script\").length) {\n      fullCode = svgEl;\n    }\n  }\n\n  return { viewBox, path, paths, format, fullCode };\n};\n\nconst getIcon = (iconSet, iconName) => {\n  return new Promise(async (resolve, reject) => {\n    const icon = `${iconSet}:${iconName}`;\n    if (ICON_STORE[icon]) resolve(ICON_STORE[icon]);\n\n    ICON_STORE[icon] = preProcessIcon(iconSet, iconName);\n\n    resolve(ICON_STORE[icon]);\n  });\n};\n\nwindow.getIcon = getIcon;\n\nif (!(\"customIconsets\" in window)) {\n  window.customIconsets = {};\n}\n\nwindow.customIconsets[\"fab\"] = (iconName) => getIcon(\"brands\", iconName);\nwindow.customIconsets[\"far\"] = (iconName) => getIcon(\"regular\", iconName);\nwindow.customIconsets[\"fas\"] = (iconName) => getIcon(\"solid\", iconName);\nwindow.customIconsets[\"fapro\"] = (iconName) => getIcon(\"pro\", iconName);\nwindow.customIconsets[\"facustom\"] = (iconName) => getIcon(\"pro\", iconName);\n\n// Duotone patches\ncustomElements.whenDefined(\"ha-icon\").then(() => {\n  const HaIcon = customElements.get(\"ha-icon\");\n  HaIcon.prototype._setCustomPath = async function (promise) {\n    const icon = await promise;\n    this._path = icon.path;\n    this._viewBox = icon.viewBox;\n\n    await this.UpdateComplete;\n\n    const el = this.shadowRoot.querySelector(\"ha-svg-icon\");\n    if (!el || !el.setPaths) {\n      return;\n    }\n    if (icon.fullCode && icon.format === \"fullcolor\") {\n      await el.updateComplete;\n      const root = el.shadowRoot.querySelector(\"g\");\n      if (root.firstElementChild) {\n        root.firstElementChild.style.display = \"none\";\n      }\n      root.appendChild(icon.fullCode.cloneNode(true));\n    } else {\n      el.setPaths(icon.paths);\n      if (icon.format) {\n        el.classList.add(...icon.format.split(\"-\"));\n      }\n    }\n  };\n});\n\ncustomElements.whenDefined(\"ha-svg-icon\").then(() => {\n  const HaSvgIcon = customElements.get(\"ha-svg-icon\");\n\n  HaSvgIcon.prototype.setPaths = async function (paths) {\n    await this.updateComplete;\n    if (paths == undefined || Object.keys(paths).length === 0) return;\n    const styleEl =\n      this.shadowRoot.querySelector(\"style\") || document.createElement(\"style\");\n    styleEl.innerHTML = `\n      .secondary {\n        opacity: 0.4;\n      }\n      :host(.invert) .secondary {\n        opacity: 1;\n      }\n      :host(.invert) .primary {\n        opacity: 0.4;\n      }\n      :host(.color) .primary {\n        opacity: 1;\n      }\n      :host(.color) .secondary {\n        opacity: 1;\n      }\n      :host(.color:not(.invert)) .secondary {\n        fill: var(--icon-secondary-color, var(--disabled-text-color));\n      }\n      :host(.color.invert) .primary {\n        fill: var(--icon-secondary-color, var(--disabled-text-color));\n      }\n      `;\n    this.shadowRoot.appendChild(styleEl);\n    const root = this.shadowRoot.querySelector(\"g\");\n    if (root.firstElementChild) {\n      root.firstElementChild.style.display = \"none\";\n    }\n    for (const k in paths) {\n      const el = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n      el.setAttribute(\"d\", paths[k]);\n      el.classList.add(k);\n      root.appendChild(el);\n    }\n  };\n});\n\n\n//# sourceURL=webpack://fontawesome/./js/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js/main.js"]();
/******/ 	
/******/ })()
;