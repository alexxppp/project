document.addEventListener("DOMContentLoaded", function () {
    const selectPokemon = document.getElementById("select-pokemon");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchSection = document.getElementById("search-section");


    function getAllPokemon(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(pokemon => {
                    fetch(pokemon.url)
                        .then(response => response.json())
                        .then(pokemonData => {
                            addPokemonButton(pokemonData);
                        });
                });
                if (data.next) {
                    getAllPokemon(data.next);
                }
            });
    }

    function addPokemonButton(pokemonData) {
        const button = document.createElement("button");
        button.className = "pokemon-button";
        const types = pokemonData.types.map(type => type.type.name); // Obtener los tipos del Pokémon
        const gradientColors = types.map(type => getPokemonTypeColor(type)); // Obtener los colores de los tipos

        // Crear un gradiente que incluya ambos colores de los tipos
        button.style.backgroundImage = `linear-gradient(to top, ${gradientColors.join(',')} 20%, transparent 10%)`;

        button.innerHTML = `<img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">`;

        button.addEventListener("click", function () {
            showPokemonStats(pokemonData);
            showPupup();
        });

        selectPokemon.appendChild(button);
    }


    function showPokemonStats(pokemonData) {
        const frontImage = `<img src="${pokemonData.sprites.front_default}" alt="" style="height: 200px; width: 190px;">`;
        const backImage = `<img src="${pokemonData.sprites.back_default}" alt="" style="height: 200px; width: 190px;">`;

        const name = pokemonData.name;
        const type = pokemonData.types[0].type.name;
        const weight = pokemonData.weight;
        const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(", ");

        const maxMovesToShow = 15;
        const moves = pokemonData.moves.slice(0, maxMovesToShow).map(move => move.move.name).join(", ") + (pokemonData.moves.length > maxMovesToShow ? '...' : '');

        const evolutionChainDiv = document.getElementById('evolution-chain');

        function getPokemonImage(pokemonName) {
            return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
                .then(response => response.json())
                .then(pokemon => pokemon.sprites.front_default);
        }

        function displayEvolutionChain(evolution) {
            getPokemonImage(evolution.species.name)
                .then(imageUrl => {
                    const evolutionImage = `<img src="${imageUrl}" alt="${evolution.species.name}" style="height: 100px; width: 100px;">`;
                    evolutionChainDiv.innerHTML += evolutionImage;
                });

            evolution.evolves_to.forEach(displayEvolutionChain);
        }

        fetch(pokemonData.species.url)
            .then(response => response.json())
            .then(speciesData => {
                const evolutionChainUrl = speciesData.evolution_chain.url;
                fetch(evolutionChainUrl)
                    .then(response => response.json())
                    .then(evolutionChainData => {
                        evolutionChainDiv.innerHTML = ``;
                        displayEvolutionChain(evolutionChainData.chain);
                    });
            });

        document.getElementById('name').innerHTML = name;
        document.getElementById('type').innerHTML = type;
        document.getElementById('weight').innerHTML = weight;
        document.getElementById('abilities').innerHTML = abilities;
        document.getElementById('moves').innerHTML = moves;

        document.getElementById('front').innerHTML = frontImage;
        document.getElementById('back').innerHTML = backImage;
    }


    function getPokemonTypeColor(type) {
        switch (type) {
            case "normal":
                return "#e0e0e0"; // Gris claro
            case "fire":
                return "#ffcccc"; // Rojo claro
            case "water":
                return "#cce6ff"; // Azul claro
            case "electric":
                return "#ffffcc"; // Amarillo claro
            case "grass":
                return "#d9f2d9"; // Verde claro
            case "ice":
                return "#e6f7ff"; // Azul claro
            case "fighting":
                return "#ff9999"; // Rojo claro
            case "poison":
                return "#d9b3ff"; // Morado claro
            case "ground":
                return "#e6ccb3"; // Marrón claro
            case "flying":
                return "#b3e6ff"; // Azul claro
            case "psychic":
                return "#ffb3d9"; // Rosa claro
            case "bug":
                return "#b3cc99"; // Verde claro
            case "rock":
                return "#b3b3b3"; // Gris claro
            case "ghost":
                return "#d9ccff"; // Púrpura claro
            case "dragon":
                return "#80b3ff"; // Azul claro
            case "dark":
                return "#666666"; // Gris oscuro
            case "steel":
                return "#cccccc"; // Gris claro
            case "fairy":
                return "#ffb3ff"; // Rosa claro
            default:
                return "#f2f2f2"; // Gris claro por defecto
        }
    }

    function showPupup() {
        const PopUP = document.getElementById('pop-up-stats');
        PopUP.style.display = 'flex';
        selectPokemon.style.pointerEvents = 'none';
        searchSection.style.pointerEvents = 'none';
    }

    function searchPokemon(term) {
        selectPokemon.innerHTML = ``;
        fetch(`https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Pokemon not found");
                }
                return response.json();
            })
            .then(pokemonData => {
                addPokemonButton(pokemonData);
            })
            .catch(error => {
                console.error(error);
                selectPokemon.innerHTML = `
                <p>Pokemon not found</p>`;
            });
    }

    searchButton.addEventListener("click", function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchPokemon(searchTerm);
        }
    });

    getAllPokemon('https://pokeapi.co/api/v2/pokemon');
});

function reloadPage() {
    location.reload();
}

function hidePopup() {
    const PopUP = document.getElementById('pop-up-stats');
    PopUP.style.display = 'none';
    const selectPokemon = document.getElementById("select-pokemon");
    selectPokemon.style.pointerEvents = 'all';
    const searchSection = document.getElementById("search-section");
    searchSection.style.pointerEvents = 'all';
}