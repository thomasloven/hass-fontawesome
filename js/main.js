const DOMAIN = "fontawesome";

const ICON_STORE = {};

const PREFIXES = {
  fab: "brands",
  far: "regular",
  fas: "solid",
  fapro: "pro",
};

const getIcon = (iconSet, iconName) =>
  new Promise(async (resolve, reject) => {
    const icon = `${iconSet}:${iconName}`;
    if (ICON_STORE[icon]) resolve(ICON_STORE[icon]);

    const data = await fetch(`/${DOMAIN}/icons/${iconSet}/${iconName}`);

    const js = data.json();
    if (js && (await js).path) {
      ICON_STORE[icon] = js;
    }

    resolve(ICON_STORE[icon]);
  });

if (!("customIconsets" in window)) {
  window.customIconsets = {};
}

window.customIconsets["fab"] = (iconName) => getIcon("brands", iconName);
window.customIconsets["far"] = (iconName) => getIcon("regular", iconName);
window.customIconsets["fas"] = (iconName) => getIcon("solid", iconName);
window.customIconsets["fapro"] = (iconName) => getIcon("pro", iconName);

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
  };
});

customElements.whenDefined("ha-svg-icon").then(() => {
  const HaSvgIcon = customElements.get("ha-svg-icon");

  HaSvgIcon.prototype.setPaths = async function (paths) {
    await this.updateComplete;
    const styleEl =
      this.shadowRoot.querySelector("style") || document.createElement("style");
    styleEl.innerHTML =
      "svg path.secondary { fill: var(--paper-item-icon-color); }";
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
