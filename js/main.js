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
