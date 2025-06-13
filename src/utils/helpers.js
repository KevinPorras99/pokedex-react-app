function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatPokemonName(name) {
    return name.split('-').map(capitalizeFirstLetter).join(' ');
}

function getPaginationRange(currentPage, totalItems, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    return { start, end };
}

export { capitalizeFirstLetter, formatPokemonName, getPaginationRange };