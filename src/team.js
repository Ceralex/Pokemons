const pokemonDiv = document.querySelector("#pokemons");

const pokemons = JSON.parse(localStorage.getItem("team")) || [];

if (pokemons.length === 0) {
	document.querySelector("main").innerHTML = `
		<h1 class="text-2xl font-bold text-center text-white w-screen p-10"> Your team is empty </h1>
	`;
}

pokemons.forEach(pokemon => {
	const pokemonContainer = document.createElement("div");
	pokemonContainer.className =
		"shadow-xl shadow-black p-3 flex flex-col items-center justify-center rounded border-2 bg-yellow-500 h-80";

	const pokemonId = document.createElement("p");
	pokemonId.className = "text-gray-700";
	pokemonId.textContent = `Id: ${pokemon.id}`;

	const pokemonImage = document.createElement("img");
	pokemonImage.className = "h-48 w-48 aspect-square";
	pokemonImage.style.imageRendering = "pixelated";
	pokemonImage.src = pokemon.image;

	const pokemonName = document.createElement("h1");
	pokemonName.className = "text-2xl font-bold capitalize text-blue-950";
	pokemonName.textContent = pokemon.name;

	const catchButton = document.createElement("button");
	catchButton.className =
		"bg-red-600 text-white font-semibold w-1/2 rounded-md py-1 mt-2 hover:bg-red-500";
	catchButton.textContent = "Release";

	catchButton.addEventListener("click", event => {
		event.stopPropagation();
		releasePokemon(pokemon);
	});

	pokemonContainer.addEventListener("click", () => {
		window.location.href = `/pokemon.html?id=${pokemon.id}`;
	});

	pokemonContainer.appendChild(pokemonId);
	pokemonContainer.appendChild(pokemonImage);
	pokemonContainer.appendChild(pokemonName);
	pokemonContainer.appendChild(catchButton);

	pokemonDiv.appendChild(pokemonContainer);
});

function releasePokemon(pokemon) {
	const newTeam = pokemons.filter(p => p.teamId !== pokemon.teamId);

	localStorage.setItem("team", JSON.stringify(newTeam));

	window.location.reload();
}
