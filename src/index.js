function catchPokemon(pokemon) {
	const pokemonToCatch = {
		...pokemon,
		teamId: Date.now(),
	};
	team.push(pokemonToCatch);

	localStorage.setItem("team", JSON.stringify(team));

	teamSize.textContent = team.length;
}

const team = JSON.parse(localStorage.getItem("team")) || [];

const teamSize = document.querySelector("#teamSize");
teamSize.textContent = team.length;

function displayPokemons(pokemons) {
	const pokemonDiv = document.querySelector("#pokemons");

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
		pokemonImage.alt = pokemon.name;

		const pokemonName = document.createElement("h1");
		pokemonName.className = "text-2xl font-bold capitalize text-blue-950";
		pokemonName.textContent = pokemon.name;

		const catchButton = document.createElement("button");
		catchButton.className =
			"bg-red-600 text-white font-semibold w-1/2 rounded-md py-1 mt-2 hover:bg-red-500";
		catchButton.textContent = "Catch";

		catchButton.addEventListener("click", event => {
			event.stopPropagation();
			catchPokemon(pokemon);
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
}

const url = "https://pokeapi.co/api/v2/pokemon?limit=1010&offset=0";

const response = await fetch(url);
const data = await response.json();

const pokemons = data.results.map((result, index) => ({
	...result,
	id: index + 1,
	image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
		index + 1
	}.png`,
}));

const query = new URLSearchParams(window.location.search).get("q");

if (query) {
	document.getElementById("searchInput").value = query;

	const filteredPokemons = pokemons.filter(pokemon =>
		pokemon.name.includes(query.toLowerCase())
	);

	displayPokemons(filteredPokemons);
} else {
	displayPokemons(pokemons);
}

document.getElementById("searchForm").addEventListener("submit", event => {
	event.preventDefault();
	const query = document.getElementById("searchInput").value;

	console.log(query);
	window.location.href = `/?q=${query}`;
});
