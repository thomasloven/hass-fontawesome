import aliases from "./names.json";

const DOMAIN = "fontawesome";

const ICON_STORE = {};

const PATH_CLASSES = {
  "fa-primary": "primary",
  "fa-secondary": "secondary",
  primary: "primary",
  secondary: "secondary",
};

const preProcessIcon = async (iconSet, iconName) => {
  let [icon, format] = iconName.split("#");
  if (aliases[icon]) {
    icon = aliases[icon];
  }
  const data = await fetch(`/${DOMAIN}/icons/${iconSet}/${icon}.svg`);
  const text = await data.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  if (!doc || !doc.querySelector("svg")) return {};

  const viewBox = doc.querySelector("svg").getAttribute("viewBox");
  const _paths = doc.querySelectorAll("path");
  const paths = {};
  let path = undefined;
  let secondaryPath = undefined;
  let sumpath = "";
  for (const pth of _paths) {
    sumpath = sumpath + pth.getAttribute("d");
    const cls = pth.classList[0];
    if (PATH_CLASSES[cls] == "primary") path = pth.getAttribute("d");
    if (PATH_CLASSES[cls] == "secondary") secondaryPath = pth.getAttribute("d");
  }
  path = path ?? sumpath;

  // Don't allow full code to be used if the svg may contain javascript
  let innerSVG = doc.querySelector("svg");
  // Don't allow full code if any attribute is onClick or something
  if (Array.from(innerSVG?.attributes).some((a) => a.name.startsWith("on")))
    innerSVG = undefined;
  // Don't allow full code if it contains <script> tags
  if (innerSVG?.getElementsByTagName("script").length) innerSVG = undefined;

  return { viewBox, path, secondaryPath, paths: sumpath, format, innerSVG };
};

const getIcon = (iconSet, iconName) => {
  return new Promise(async (resolve, reject) => {
    const icon = `${iconSet}:${iconName}`;
    if (ICON_STORE[icon]) resolve(ICON_STORE[icon]);

    ICON_STORE[icon] = preProcessIcon(iconSet, iconName);

    resolve(ICON_STORE[icon]);
  });
};

const getIconList = async (iconSet) => {
  const data = await fetch(`/${DOMAIN}/list/${iconSet}`);
  const text = await data.text();
  return JSON.parse(text);
};

// window.getIconList = getIconList;
// window.getIcon = getIcon;

if (!("customIconsets" in window)) {
  window.customIconsets = {};
}
if (!("customIcons" in window)) {
  window.customIcons = {};
}

window.customIcons["fab"] = {
  getIcon: (iconName) => getIcon("brands", iconName),
  getIconList: () => getIconList("brands"),
};
window.customIcons["far"] = {
  getIcon: (iconName) => getIcon("regular", iconName),
  getIconList: () => getIconList("regular"),
};
window.customIcons["fas"] = {
  getIcon: (iconName) => getIcon("solid", iconName),
  getIconList: () => getIconList("solid"),
};
window.customIcons["fapro"] = {
  getIcon: (iconName) => getIcon("pro", iconName),
  getIconList: () => getIconList("pro"),
};
window.customIconsets["facustom"] = (iconName) => getIcon("pro", iconName);

// Fullcolor support patch
customElements.whenDefined("ha-icon").then((HaIcon) => {
  const orig = HaIcon.prototype._setCustomPath;
  HaIcon.prototype._setCustomPath = async function (promise, requestedIcon) {
    await orig?.bind(this)?.(promise, requestedIcon);

    const icon = await promise;
    if (requestedIcon !== this.icon) return;

    if (!icon.innerSVG || icon.format !== "fullcolor") return;

    await this.UpdateComplete;
    const el = this.shadowRoot.querySelector("ha-svg-icon");
    await el?.updateComplete;

    this._path = undefined;
    this._secondaryPath = undefined;

    const root = el?.shadowRoot.querySelector("svg");
    root?.appendChild(icon.innerSVG.cloneNode(true));
  };
});
