function getData(cb, id = ""){
    window.onload = fetch("http://localhost:3000/api/products/"+id)
        .then(reponse => reponse.json())
        .then(data => cb(data));
}

const RenderHTML = (e) => {
    let elem = document.createElement(e.elementType || "div");

    // parcours des clés dans le json
    Object.keys(e).map(k=> {

        switch(k) {
            // skip elementType
            case "elementType" : break;

            // cas particuliers :
            // classe(s)
            case "class": e.class.split(' ').map(c => elem.classList.add(c)); break;

            // textContent
            case "textContent" : elem.textContent = e.textContent; break;

            // enfants de l'objet
            case "children" :
                // pour chaque enfant: appel récursif pour créer les enfants
                e.children.map(child => {
                    let childElement = RenderHTML(child);
                    // attache l'enfant créé
                    elem.appendChild(childElement);
                });
                break;

            // attribut par défaut : setAttribute
            default : elem.setAttribute(k, e[k]);
        }
    })

    return elem;
}

export {getData, RenderHTML};