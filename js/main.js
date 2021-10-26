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

const parseOptions = (optionStr) => {
  const options = {};
  if (!optionStr) {
    return options;
  }

  const optionParts = optionStr.split(",");
  optionParts.forEach((part) => {
    part = part.trim();
    if (["invert", "color", "color-invert"].includes(part)) {
      options.format = part;
      return;
    }

    const [prop, val] = part.split("=").map((subpart) => subpart.trim());
    if (prop === "primary-color") {
      options.primaryColor = val;
    } else if (prop === "secondary-color") {
      options.secondaryColor = val;
    } else if (prop === "primary-opacity") {
      options.primaryOpacity = val;
    } else if (prop === "secondary-opacity") {
      options.secondaryOpacity = val;
    } else if (prop === "size") {
      options.size = val;
    }
    // could log a warning here that there was an unsupported option
  });

  return options;
};

const preProcessIcon = async (iconSet, iconName) => {
  const [icon, ...optionStrs] = iconName.split("#");
  // need to account for `#f8bb2f` style colors
  const options = parseOptions((optionStrs || []).join("#").trim());
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
  const hasOn = Array.from(svgEl.attributes).some((a) => a.name.startsWith("on"));
  if (!hasOn) {
    if (!svgEl.getElementsByTagName("script").length) {
      fullCode = svgEl;
    }
  }

  return { name: icon, viewBox, path, paths, options, fullCode };
};

const getIcon = (iconSet, iconName) => {
  return new Promise(async (resolve, reject) => {
    const icon = `${iconSet}:${iconName}`;
    if (ICON_STORE[icon]) resolve(ICON_STORE[icon]);

    ICON_STORE[icon] = preProcessIcon(iconSet, iconName);

    resolve(ICON_STORE[icon]);
  });
};

window.getIcon = getIcon;

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
    icon.options = icon.options || {};

    await this.UpdateComplete;

    const el = this.shadowRoot.querySelector("ha-svg-icon");
    if (!el || !el.setPaths) {
      return;
    }
    if (icon.fullCode && icon.options.format === "fullcolor") {
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
      if (
        icon.options.primaryColor ||
        icon.options.secondaryColor ||
        icon.options.primaryOpacity ||
        icon.options.secondaryOpacity
      ) {
        el.classList.add("custom-colors");
      } else if (icon.options.format) {
        el.classList.add(...icon.options.format.split("-"));
      }
      if (icon.options.primaryColor) {
        el.style.setProperty("--fa-primary-color", icon.options.primaryColor);
        el.style.color = icon.options.primaryColor;
      }
      if (icon.options.secondaryColor) {
        el.style.setProperty("--fa-secondary-color", icon.options.secondaryColor);
        if (!icon.options.secondaryOpacity) {
          el.style.setProperty("--fa-secondary-opacity", "1.0");
        }
      }
      if (icon.options.primaryOpacity) {
        el.style.setProperty("--fa-primary-opacity", icon.options.primaryOpacity);
      }
      if (icon.options.secondaryOpacity) {
        el.style.setProperty("--fa-secondary-opacity", icon.options.secondaryOpacity);
      }
      if (icon.options.size) {
        el.style.setProperty("--fa-icon-size", icon.options.size);
      }
    }
  };
});

customElements.whenDefined("ha-svg-icon").then(() => {
  const HaSvgIcon = customElements.get("ha-svg-icon");

  HaSvgIcon.prototype.setPaths = async function (paths) {
    await this.updateComplete;
    if (paths == undefined || Object.keys(paths).length === 0) return;
    const styleEl = this.shadowRoot.querySelector("style") || document.createElement("style");
    styleEl.innerHTML = `
    :host {
        display: var(--ha-icon-display, inline-flex);
        align-items: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;

        width: var(--fa-icon-size, var(--mdc-icon-size, 24px));
        height: var(--fa-icon-size, var(--mdc-icon-size, 24px));
        color: var(--fa-primary-color, inherit);
      }
      .secondary {
        opacity: 0.4;
      }
      :host(.custom-colors), :host(.custom-colors) .primary {
        color: var(--fa-primary-color, inherit);
        opacity: var(--fa-primary-opacity, 1.0);
      }
      :host(.custom-colors) .secondary {
        color: var(--fa-secondary-color, var(--fa-primary-color, inherit));
        opacity: var(--fa-secondary-opacity, 0.4);
      }
      :host(.invert:not(.custom-colors)) .secondary {
        opacity: 1;
      }
      :host(.invert:not(.custom-colors)) .primary {
        opacity: 0.4;
      }
      :host(.color:not(.custom-colors)) .primary {
        opacity: 1;
      }
      :host(.color:not(.custom-colors)) .secondary {
        opacity: 1;
      }
      :host(.color:not(.invert):not(.custom-colors)) .secondary {
        fill: var(--icon-secondary-color, var(--disabled-text-color));
      }
      :host(.color.invert:not(.custom-colors)) .primary {
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
