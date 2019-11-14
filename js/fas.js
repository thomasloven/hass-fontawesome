import txt from "@fortawesome/fontawesome-free/sprites/solid.svg"
const iconset = document.createElement("ha-iconset-svg");
iconset.name="fas";
iconset.size="1024";
iconset.innerHTML = txt.replace(/\<symbol/g, '<g').replace(/\<\/symbol\>/g, '</g>');
document.body.appendChild(iconset);