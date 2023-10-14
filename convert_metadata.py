import json
import yaml


def main():
    with open("./node_modules/@fortawesome/fontawesome-free/metadata/icons.yml", "r", encoding="utf-8") as fp:
        data = yaml.safe_load(fp)

    icons = {}
    for k, v in data.items():
        # icons[k] = k
        for n in v.get("aliases", {}).get("names", []):
            icons[n] = k

    with open("./js/names.json", "w", encoding="utf-8") as fp:
        json.dump(icons, fp)


if __name__ == "__main__":
    main()