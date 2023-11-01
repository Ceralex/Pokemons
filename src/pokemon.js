import { displayGraph } from "./displayGraph.js";
import { typesColors } from "./utils.js";

// Function to fetch type data
async function fetchTypeData({ type }) {
	const url = type.url;
	const typeResponse = await fetch(url);
	const { damage_relations } = await typeResponse.json();

	damage_relations.double_damage_from.forEach(d => doubleDamage.add(d.name));
	damage_relations.half_damage_from.forEach(d => halfDamage.add(d.name));
	damage_relations.no_damage_from.forEach(d => noDamage.add(d.name));
}

async function fetchPokemonData(id) {
	const infoUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

	const [infoResponse, speciesResponse] = await Promise.all([
		fetch(infoUrl),
		fetch(speciesUrl),
	]);

	const infoData = await infoResponse.json();
	const speciesData = await speciesResponse.json();

	return { infoData, speciesData };
}

async function fetchEvolutionData(speciesData) {
	const evolutionUrl = speciesData.evolution_chain.url;
	const evolutionResponse = await fetch(evolutionUrl);
	const evolutionData = await evolutionResponse.json();

	let evolutionChain = evolutionData.chain;
	const evolutions = [];

	while (evolutionChain !== undefined) {
		const pokemonId = evolutionChain.species.url.split("/")[6];

		evolutions.push({
			name: evolutionChain.species.name,
			id: pokemonId,
			image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
		});

		evolutionChain = evolutionChain.evolves_to[0];
	}

	return evolutions;
}

async function displayPokemonInfo(infoData, speciesData, evolutions) {
	displayGraph(infoData.stats);

	document.getElementById("pokemonName").innerText = infoData.name;

	document.getElementById("pokemon").src =
		infoData.sprites.other["official-artwork"].front_default;

	document.getElementById("height").innerText = `${infoData.height / 10} m`;
	document.getElementById("weight").innerText = `${infoData.weight / 10} kg`;

	document.getElementById("abilities").innerText = infoData.abilities
		.map(ability => ability.ability.name)
		.join(", ");

	document.getElementById("category").innerText = speciesData.genera.find(
		item => item.language.name === "en"
	).genus;

	try {
		// Sometimes they don't have a description
		document.getElementById("description").innerHTML =
			speciesData.flavor_text_entries.find(
				item => item.language.name === "en"
			).flavor_text;
	} catch (error) {
		console.error(error);
	}

	infoData.types.forEach(({ type }) => {
		const typeElement = document.createElement("p");
		typeElement.className = `text-2xl bg-[${
			typesColors[type.name]
		}] text-black capitalize w-72 h-10 text-center font-semibold rounded-md`;
		typeElement.innerText = type.name;
		document.getElementById("types").appendChild(typeElement);
	});

	const evolutionContainer = document.getElementById("evolutions");

	evolutions.forEach(ev => {
		const evolutionDiv = document.createElement("div");

		evolutionDiv.className = "flex flex-col items-center ";
		evolutionDiv.addEventListener("click", () => {
			window.location.href = `/pokemon.html?id=${ev.id}`;
		});

		evolutionDiv.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ev.id}.png"
                    class="w-64" style="image-rendering: pixelated;" />
                <h1 class="text-xl capitalize">${ev.name}</h1>
                <p class="text-gray-400">Id: ${ev.id}</p>`;

		evolutionContainer.appendChild(evolutionDiv);
	});
}

async function displayWeaknesses(doubleDamage, halfDamage, noDamage) {
	const weaknesses = new Set(doubleDamage);

	halfDamage.forEach(d => weaknesses.delete(d));
	noDamage.forEach(d => weaknesses.delete(d));

	const weaknessesDiv = document.getElementById("weaknesses");

	let weakDiv = document.createElement("div");
	weakDiv.className = "flex gap-5";

	Array.from(weaknesses).forEach((weakness, i) => {
		const weaknessElement = document.createElement("p");
		weaknessElement.className = `text-2xl bg-[${typesColors[weakness]}] text-black capitalize w-72 h-10 text-center font-semibold rounded-md`;
		weaknessElement.innerText = weakness;

		weakDiv.appendChild(weaknessElement);

		if (i % 2 === 1) {
			weaknessesDiv.appendChild(weakDiv);
			weakDiv = document.createElement("div");
			weakDiv.className = "flex gap-5";
		} else if (i === weaknesses.size - 1) {
			const emptyDiv = document.createElement("div");
			emptyDiv.className = "w-72 h-10";

			weakDiv.appendChild(emptyDiv);
			weaknessesDiv.appendChild(weakDiv);
		}
	});
}

const id = new URLSearchParams(window.location.search).get("id");
const mainDiv = document.querySelector("main");

if (!id || id > 1010) {
	// Not found page
	mainDiv.innerHTML = `
            <h1 class="text-5xl text-white">404 Not found</h1>
        `;

	throw new Error("Pokemon ID is not provided");
}

const { infoData, speciesData } = await fetchPokemonData(id);
const evolutions = await fetchEvolutionData(speciesData);

displayPokemonInfo(infoData, speciesData, evolutions);

const doubleDamage = new Set();
const halfDamage = new Set();
const noDamage = new Set();

await Promise.all(infoData.types.map(fetchTypeData));
await displayWeaknesses(doubleDamage, halfDamage, noDamage);
