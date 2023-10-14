#!/bin/bash
rm -r "./custom_components/fontawesome/data/brands"
cp -r "./node_modules/@fortawesome/fontawesome-free/svgs/brands" "./custom_components/fontawesome/data/."
rm -r "./custom_components/fontawesome/data/solid"
cp -r "./node_modules/@fortawesome/fontawesome-free/svgs/solid" "./custom_components/fontawesome/data/."
rm -r "./custom_components/fontawesome/data/regular"
cp -r "./node_modules/@fortawesome/fontawesome-free/svgs/regular" "./custom_components/fontawesome/data/."

cp -r "./node_modules/@fortawesome/fontawesome-free/LICENSE.txt" "./custom_components/fontawesome/data/."

python "./convert_metadata.py"