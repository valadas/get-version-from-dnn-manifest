# get-version-from-dnn-manifest

As the name implies this github action gets a version from a .dnn manifest file.

By default it works without any inputs and grabs the version of the first package in the first manifest found.

## inputs
- **manifestPath**: If a path provided will load the version from this specific manifest.
- **packageName**: If manifest AND package is provided, will load the version from taht specific manifest and from that specific package name.

## outputs

- **major** a number representing the major version number. Returns **1** for version 01.02.03
- **minor** a number representing the minor version number. Returns **2** for version 01.02.03
- **patch** a number representing the patch version number. Return **3** for version 01.02.03
- **versionString** a string representing the version number exactly as it is in the manifest.