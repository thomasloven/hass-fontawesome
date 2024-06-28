import logging

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.http.view import HomeAssistantView
from homeassistant.helpers import config_validation as cv

import json
from os import path, scandir

LOGGER = logging.getLogger(__name__)

DOMAIN = "fontawesome"

DATA_EXTRA_MODULE_URL = 'frontend_extra_module_url'
LOADER_URL = f'/{DOMAIN}/main.js'
LOADER_PATH = f'custom_components/{DOMAIN}/main.js'
ICONS_URL = f'/{DOMAIN}/icons'
ICONLIST_URL = f'/{DOMAIN}/list'
ICONS_PATH = f'custom_components/{DOMAIN}/data'
CUSTOM_ICONS_URL = f'/{DOMAIN}/icons/pro'
CUSTOM_ICONS_PATH = 'custom_icons'


CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)


class ListingView(HomeAssistantView):

    requires_auth = False

    def __init__(self, url, iconpath, hass):
        self.url = url
        self.iconpath = iconpath
        self.hass = hass
        self.name = "Icon Listing"

    async def get(self, request):
        icons = []
        scan_result = await self.hass.async_add_executor_job(scandir, self.iconpath)
        for file in scan_result:
            if file.name.endswith(".svg"):
                icons.extend(
                    [
                        {"name": path.join(self.iconpath[len(self.iconpath):], file.name[:-4])}
                    ]
                )
        return json.dumps(icons)


async def async_setup(hass, config):
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                LOADER_URL,
                hass.config.path(LOADER_PATH),
                True
            )
        ]
    )
    add_extra_js_url(hass, LOADER_URL)

    for iset in ["brands", "regular", "solid"]:
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    ICONS_URL + "/" + iset,
                    hass.config.path(ICONS_PATH + "/" + iset),
                    True
                )
            ]
        )
        hass.http.register_view(
                ListingView(
                    ICONLIST_URL + "/" + iset,
                    hass.config.path(ICONS_PATH + "/" + iset),
                    hass
                )
            )
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                CUSTOM_ICONS_URL,
                hass.config.path(CUSTOM_ICONS_PATH),
                True
            )
        ]
    )
    hass.http.register_view(
            ListingView(
                ICONLIST_URL + "/pro",
                hass.config.path(CUSTOM_ICONS_PATH),
                hass
            )
        )

    return True


async def async_setup_entry(hass, entry):
    return True


async def async_remove_entry(hass, entry):
    return True
