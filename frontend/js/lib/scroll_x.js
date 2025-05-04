function scroll_x(id_lista, qt) {
    let lista = document.getElementById(id_lista);
    lista.scrollBy({"left": qt, behavior: "smooth"});
}