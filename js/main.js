const DOMAIN = "fontawesome";

const ICON_STORE = {};

const PREFIXES = {
  fab: "brands",
  far: "regular",
  fas: "solid",
  fapro: "pro",
  facustom: "pro",
};

const PATH_CLASSES = {
  "fa-primary": "primary",
  "fa-secondary": "secondary",
  primary: "primary",
  secondary: "secondary",
};

const preProcessIcon = async (iconSet, iconName) => {
  const [icon, format] = iconName.split("#");
  const data = await fetch(`/${DOMAIN}/icons/${iconSet}/${icon}.svg`);
  const text = await data.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  if (!doc || !doc.querySelector("svg")) return {};

  const viewBox = doc.querySelector("svg").getAttribute("viewBox");
  const _paths = doc.querySelectorAll("path");
  const paths = {};
  let path = "";
  for (const pth of _paths) {
    path = path + pth.getAttribute("d");
    const cls = pth.classList[0];
    if (PATH_CLASSES[cls]) {
      paths[PATH_CLASSES[cls]] = pth.getAttribute("d");
    }
  }

  // Don't allow full code to be used if the svg may contain javascript
  let fullCode = null;
  const svgEl = doc.querySelector("svg");
  const hasOn = Array.from(svgEl.attributes).some((a) =>
    a.name.startsWith("on")
  );
  if (!hasOn) {
    if (!svgEl.getElementsByTagName("script").length) {
      fullCode = svgEl;
    }
  }

  return { viewBox, path, paths, format, fullCode };
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

// Duotone patches
customElements.whenDefined("ha-icon").then(() => {
  const HaIcon = customElements.get("ha-icon");
  HaIcon.prototype._setCustomPath = async function (promise, requestedIcon) {
    const icon = await promise;
    if (requestedIcon !== this.icon) return;
    this._path = icon.path;
    this._viewBox = icon.viewBox;

    await this.UpdateComplete;

    const el = this.shadowRoot.querySelector("ha-svg-icon");
    if (!el || !el.setPaths) {
      return;
    }
    el.clearPaths();

    if (icon.fullCode && icon.format === "fullcolor") {
      await el.updateComplete;
      const root = el.shadowRoot.querySelector("svg");
      const styleEl = document.createElement("style");
      styleEl.innerHTML = `
        svg:first-child>g:first-of-type>path {
          display: none;
        }
      `;
      root.appendChild(styleEl);
      root.appendChild(icon.fullCode.cloneNode(true));
    } else {
      el.setPaths(icon.paths);
      if (icon.format) {
        el.classList.add(...icon.format.split("-"));
      }
    }
  };
});

customElements.whenDefined("ha-svg-icon").then(() => {
  const HaSvgIcon = customElements.get("ha-svg-icon");

  HaSvgIcon.prototype.clearPaths = async function () {
    await this.updateComplete;

    const svgRoot = this.shadowRoot.querySelector("svg");
    while (svgRoot && svgRoot.children.length > 1)
      svgRoot.removeChild(svgRoot.lastChild);

    const svgGroup = this.shadowRoot.querySelector("g");
    while (svgGroup && svgGroup.children.length > 1)
      svgGroup.removeChild(svgGroup.lastChild);

    while (this.shadowRoot.querySelector("style")) {
      const el = this.shadowRoot.querySelector("style");
      el.parentNode.removeChild(el);
    }
  };

  HaSvgIcon.prototype.setPaths = async function (paths) {
    await this.updateComplete;
    if (paths == undefined || Object.keys(paths).length === 0) return;
    const styleEl =
      this.shadowRoot.querySelector("style") || document.createElement("style");
    styleEl.innerHTML = `
      .secondary {
        opacity: 0.4;
      }
      :host(.invert) .secondary {
        opacity: 1;
      }
      :host(.invert) .primary {
        opacity: 0.4;
      }
      :host(.color) .primary {
        opacity: 1;
      }
      :host(.color) .secondary {
        opacity: 1;
      }
      :host(.color:not(.invert)) .secondary {
        fill: var(--icon-secondary-color, var(--disabled-text-color));
      }
      :host(.color.invert) .primary {
        fill: var(--icon-secondary-color, var(--disabled-text-color));
      }
      path:not(.primary):not(.secondary) {
        opacity: 0;
      }
      `;
    this.shadowRoot.appendChild(styleEl);
    const root = this.shadowRoot.querySelector("g");
    for (const k in paths) {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el.setAttribute("d", paths[k]);
      el.classList.add(k);
      root.appendChild(el);
    }
  };
});
