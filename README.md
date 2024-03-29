[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

# Swårmalätørs-3D

[![CC BY 4.0][cc-by-shield]][cc-by]

![](./3d.gif)

This explorable illustrates is an evolution of the explorable of Professor Dirk Brockmann (https://github.com/dirkbrockmann/swarmalators) and shows in a 3D manner collective behavior of phase coupled oscillators that synchronize and swarm at the same time. Both the rules of collective motion and synchronization are entangled in this model and yield beautiful, magical patterns.

The explorable is part of the [**Complexity Exporables Collection**](https://www.complexity-explorables.org). For more information about the system and its behavior consult the explorable
> [**“Swårmalätørs” - Oscillators that sync and swarm - Patterns that emerge when collective motion and synchronization entangle**](https://www.complexity-explorables.org/explorables/swarmalators/)

## Installation & Use

Out of the box you can use the explorable in a basic `index.html` file like this

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<script src="https://cdn.jsdelivr.net/npm/@explorables/swarmalators"></script>
	</head>
	<body class="avenir pa3 pa5-ns tj">
	    <div id="explorable_container"></div>
	</body>
	<script type="text/javascript">
		swarmalators.load("explorable_container")
	</script>
</html>
```
The header `<script>` tag loads the bundle, the `<div>` in the document is the container in which the explorable gets anchored when the function `swarmalators.load()` gets executed at the bottom. The `load` function needs the `<div>` container `id` as an argument.

An example is provided in the file example.svg
![](./example.svg)
## Installing the whole package locally

Clone repository:

```shell
git clone https://github.com/SebastianoMorson/Swarmsim-3d
```


Go to the directory, install, build and show using `npm`:

1. `cd swarmalators`
2. `npm install`
3. `npm run build`
4. `npm run show`


## License

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]


