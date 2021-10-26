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
- to get the github logo, use `fab:github`

![image](https://user-images.githubusercontent.com/1299821/118323896-95ef1300-b501-11eb-9ff7-5ca536e65747.png)

The icons are useable anywhere in Home Assistant - not only in lovelace.

## Using with custom icons

If you have other svg icons you want to use (including but not limited to the Fontawesome Pro set), you can do so by placing the `.svg` files in `<Home Assistant Config>/custom_icons/`. You will need to create this directory yourself.

You can then use those icons with the `fapro:` prefix. E.g. `fapro:lamp` will get the icon in the file `<Home Assistant Config>/custom_icons/lamp.svg`. A nested directory structure is supported. `fapro:duotone/lamp` will get `<Home Assistant Config>/custom_icons/duotone/lamp.svg` 

## Customizing size and color

You can set custom primary colors (and secondary for duotones) with a comma separated list with `key:value` pairs in a suffix. It supports any color format supported by CSS. e.g. `#primary-color:red,secondary-color:#bada55`. You can adjust size and color similarly. Be sure to provide a units (e.g. `px`) for the size. The secondary color/opacity is ignored by non-duotone icons and the secondary color will inherit the primary color if a secondary one isn't specified (secondary colors have opacity of 0.4 by default). The secondary opacity is set to 1.0 if you set a secondary color and not a secondary opacity. Here's a full example:

```
icon: fapro:duotone/jack-o-lantern#primary-color=#f7c632,secondary-color=#f75b02,primary-opacity=0.8,secondary-opacity=0.9,size=30px
```

<!-- insert example image? -->

As of Oct 26, 2021, the default size for the icons is 24px, which is smaller than before and should bring them more in line with the default set of icons (Material Design icons).

### Duotone icons

If you have duotone icons, they should contain path elements with the `id`s `fa-primary` and `fa-secondary` or `primary` and `secondary`.

You can adjust how the icons look a bit by using the suffixes `#invert`, `#color` or `#color-invert`. These are ignored if you provide custom colors/opacities.
![image](https://user-images.githubusercontent.com/1299821/118324014-bf0fa380-b501-11eb-890b-126951d67cef.png)

### More advanced icons

You can also use more advanced icons, e.g. with multiple colors if you add the suffix `#fullcolor`.
![ISmIwO2TJN](https://user-images.githubusercontent.com/1299821/118335863-d4d89500-b510-11eb-8d01-2ccf5bbbbba5.gif)

You can find some nice ones over at [flaticons.com](https://www.flaticon.com/).

> Note: SVG files can also contain embedded CSS inside `<style>` tags... <br>
> This gives you some [interesting](https://user-images.githubusercontent.com/1299821/118336065-41539400-b511-11eb-810b-e99f6c089eed.gif)... [posibilities](https://user-images.githubusercontent.com/1299821/118336069-4284c100-b511-11eb-8b62-4d2a860a1b3c.gif)...
>
> Hass-fontawesome will not allow any icons containing embedded javascript, though.

---

**IMPORTANT:** As the note above implies, SVG can contain CSS and Javascript, and thus shall be considered unsafe. Home Assistant normally protects you from this by unly using a very specific part of the SVG file, but using the `#fullcolor` suffix circumvents this protection. I have tried adding another layer instead, but as those things go, you're only safe from the things you _know_.

In short: Only do this with icons you trust (and preferably have inspected the code for).

---

# FAQ

### Can I set this up in configure.yaml instead?

Yes.

```
fontawesome:
```

That's it.

---

<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
