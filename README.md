# hass-fontawesome

Use free icons from the [fontawesome](https://fontawesome.com) set in Home-assistant.

## Install

The icons are divided into three sets.

- Solid
- Regular
- Brands

Copy the html files for the sets you want into `<config>/www/` where `<config>` is your home-assistant config directory (the directory where your `configuration.yaml` resides).

Add the folowing to the `frontend` section of your `configuration.yaml`

```yaml
frontend:
  extra_html_url:
    - /local/hass-fontawesome-solid.html
    - /local/hass-fontawesome-regular.html
    - /local/hass-fontawesome-brands.html
```

> Only add the files you want. They are rather large, and adds to the download size and loading time of your frontend.

Restart home-assistant.

## Using

Find the icon you want in the [gallery](https://fontawesome.com/icons?d=gallery).

The three icon sets have different prefixes: `fas:`, `far:` and `fab:` respectively.

So,

- to get a solid heart, use `fas:heart`
- to get a heart outline, use `far:heart`
- to get the twitter symbo, use `fab:twitter`


