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

  return { viewBox, path, paths, format };
};

const getIcon = (iconSet, iconName) => {
  return new Promise(async (resolve, reject) => {
    const icon = `${iconSet}:${iconName}`;
    if (ICON_STORE[icon]) resolve(ICON_STORE[icon]);

    ICON_STORE[icon] = preProcessIcon(iconSet, iconName);

    resolve(ICON_STORE[icon]);
  });
};

if (!("customIconsets" in window)) {
  window.customIconsets = {};
}

window.customIconsets["fab"] = (iconName) => getIcon("brands", iconName);
window.customIconsets["far"] = (iconName) => getIcon("regular", iconName);
window.customIconsets["fas"] = (iconName) => getIcon("solid", iconName);
window.customIconsets["fapro"] = (iconName) => getIcon("pro", iconName);
window.customIconsets["facustom"] = (iconName) => getIcon("pro", iconName);

// Duotone patches
customElements.whenDefined("ha-icon").then(() => {
  const HaIcon = customElements.get("ha-icon");
  HaIcon.prototype._setCustomPath = async function (promise) {
    const icon = await promise;
    this._path = icon.path;
    this._viewBox = icon.viewBox;

    await this.UpdateComplete;

    const el = this.shadowRoot.querySelector("ha-svg-icon");
    if (!el || !el.setPaths) {
      return;
    }
    el.setPaths(icon.paths);
    if (icon.format) {
      el.classList.add(...icon.format.split("-"));
    }
  };
});

customElements.whenDefined("ha-svg-icon").then(() => {
  const HaSvgIcon = customElements.get("ha-svg-icon");

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
      `;
    this.shadowRoot.appendChild(styleEl);
    const root = this.shadowRoot.querySelector("g");
    if (root.firstElementChild) {
      root.firstElementChild.style.display = "none";
    }
    for (const k in paths) {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el.setAttribute("d", paths[k]);
      el.classList.add(k);
      root.appendChild(el);
    }
  };
});
