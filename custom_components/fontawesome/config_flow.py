import logging

from homeassistant import config_entries

_LOGGER = logging.getLogger(__name__)

DOMAIN = "fontawesome"


@config_entries.HANDLERS.register(DOMAIN)
class FontawesomeConfigFlow(config_entries.ConfigFlow):

    VERSION = 2

    async def async_step_user(self, user_input=None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return self.async_create_entry(title="Fontawesome Icons", data={})
