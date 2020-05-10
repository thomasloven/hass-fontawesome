import txt from "@fortawesome/fontawesome-free/sprites/regular.svg"
const iconset = document.createElement("ha-iconset-svg");
iconset.name="far";
iconset.size="1024";
iconset.innerHTML = txt.replace(/\<symbol/g, '<g').replace(/\<\/symbol\>/g, '</g>');

if(! customElements.get("ha-iconset-svg")) {
  const meta = document.createElement("iron-meta")
  meta.type = "iconset";
  meta.key = iconset.name;
  meta.value = iconset;
  iconset.appendChild(meta);

  iconset.applyIcon = function(element, iconName) {
    this.removeIcon(element);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const content = this.querySelector(`[id='${iconName}']`).cloneNode(true);
    svg.appendChild(content);
    svg.setAttribute('viewBox', content.getAttribute('viewBox') || '0 0 24 24');
    svg.style.cssText = 'pointer-events: none; display: block; width: 100%; height: 100%;';
    element.shadowRoot.insertBefore(svg, element.shadowRoot.childNodes[0]);
    return element._svgIcon = svg;
  }.bind(iconset);

  iconset.removeIcon = function(element) {
    if(!element._svgIcon) return;
    element.shadowRoot.removeChild(element._svgIcon);
    element._svgIcon = null;
  }.bind(iconset);
}

document.body.appendChild(iconset);
