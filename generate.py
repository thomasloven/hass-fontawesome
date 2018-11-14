import os

def make_file(directory, name, out):
    out.write('<ha-iconset-svg name="{}" size="512"><svg><defs>\n'.format(name))
    for f in os.listdir(directory):
        with open(os.path.join(directory, f), 'r') as fp:
            name = os.path.splitext(f)[0]
            data = fp.read()
            start = data.find('<path')
            out.write('<g id="{}">'.format(name) + data[start:-6] + '</g>\n')
    out.write('</defs></svg></ha-iconset-svg>')

# Run this in Font-Awesome/advanced-options/raw-svg/

# with open("hass-fontawesome-brands.html", 'w') as out:
#     make_file('brands', 'fab', out)
# with open("hass-fontawesome-regular.html", 'w') as out:
#     make_file('regular', 'far', out)
# with open("hass-fontawesome-solid.html", 'w') as out:
#     make_file('solid', 'fas', out)
