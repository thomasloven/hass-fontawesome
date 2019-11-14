import txt from "@fortawesome/fontawesome-free/sprites/brands.svg"
const iconset = document.createElement("ha-iconset-svg");
iconset.name="fab";
iconset.size="1024";
iconset.innerHTML = txt.replace(/\<symbol/g, '<g').replace(/\<\/symbol\>/g, '</g>');
document.body.appendChild(iconset);