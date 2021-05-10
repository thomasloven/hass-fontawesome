import os
import logging

from bs4 import BeautifulSoup

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import callback

from homeassistant.util import raise_if_invalid_path

LOGGER = logging.getLogger(__name__)

DOMAIN = "fontawesome"

DATA_EXTRA_MODULE_URL = 'frontend_extra_module_url'
LOADER_URL = f'/{DOMAIN}/main.js'
LOADER_PATH = f'custom_components/{DOMAIN}/main.js'
ICONS_URL = f'/{DOMAIN}/icons'
ICONS_PATH = f'custom_components/{DOMAIN}/data'

FONTAWESOME_CLASSES = {
    "fa-primary": "primary",
    "fa-secondary": "secondary",
    "primary": "primary",
    "secondary": "secondary",
}


async def async_setup(hass, config):
    hass.http.register_static_path(
            LOADER_URL,
            hass.config.path(LOADER_PATH),
            True
        )
    add_extra_js_url(hass, LOADER_URL)

    hass.http.register_view(FontAwesomeView(hass.config.path(ICONS_PATH)))

    return True


async def async_setup_entry(hass, entry):
    return True


async def async_remove_entry(hass, entry):
    return True


class FontAwesomeView(HomeAssistantView):

    name = "fontawesome:icons"
    url = ICONS_URL + "/{filename:.*}"
    requires_auth = False

    def __init__(self, path):
        self.data_dir = path

    @callback
    async def get(self, request, filename):
        filename = filename + '.svg'

        raise_if_invalid_path(filename)

        path = os.path.join(self.data_dir, filename)

        response = {}

        try:
            with open(path, mode="r", encoding="utf-8", errors="ignore") as fp:
                data = fp.read()

                soup = BeautifulSoup(data, 'html.parser')
                paths = soup.find_all("path")
                svgPath = " ".join([p.get("d", "") for p in paths])
                viewBox = soup.svg.get("viewbox", None) if soup.svg else None

                response["viewBox"] = viewBox
                response["path"] = svgPath
                response["paths"] = {}
                for p in paths:
                    key = FONTAWESOME_CLASSES.get(p.get("class", [])[0], None)
                    if key:
                        response["paths"][key] = p.get("d", "")
        except Exception:
            pass

        return self.json(response)
