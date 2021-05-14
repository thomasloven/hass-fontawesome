# hass-fontawesome

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

Use free icons from the [fontawesome](https://fontawesome.com) set in Home-assistant.

# Installation instructions

- Install using [HACS](https://hacs.xyz) (Or copy the contents of `custom_components/fontawesome/` to `<your config dir>/custom_components/fontawesome/`.)

- Restart Home Assistant

- Click this: [![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=fontawesome)

  - Alternatively: Go to your integrations configuration, click Add Integration and find "Fontawesome icons"

# Icon sets

The icons are divided into three sets.

- Solid
- Regular
- Brands

# Usage

Find the icon you want in the [gallery](https://fontawesome.com/icons?d=gallery&m=free).

The three icon sets have different prefixes: `fas:`, `far:` and `fab:` respectively.

So,

- to get a solid heart, use `fas:heart`
- to get a heart outline, use `far:heart`
- to get the twitter symbol, use `fab:twitter`

The icons are useable anywhere in Home Assistant - not only in lovelace.

# FAQ

### Can I use this with my Pro icon set?

Yes.
You need the `.svg` files from the Pro icon set.

Place the icon files in `<Home Assistant config>/custom_icons/`.
You will need to create this directory yourself, and the filenames must end with `.svg`

Then access your icons with the `fapro:` prefix, e.g. `fapro:lightbulb-on`.

### Can I add non-fontawesome icons using this?

Yes, provided you have svg files of the icons which consist one or more `<path>` elements and no transforms or other weird stuff.

Just do the same as for the Pro icon set above. Put svg files in the same directory, and use the same prefix.

### Can I set this up in configure.yaml instead?

Yes.

```
fontawesome:
```

That's it.

---

<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
