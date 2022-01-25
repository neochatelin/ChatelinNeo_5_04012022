const getFetch = (callback)=>{
    fetch("http://localhost:3000/api/products")
    .then(reponse => reponse.json())
    .then(data => callback(data));
}


function getData(cb){
    let ls = localStorage.getItem("database");
    let data = null;
    if (ls){
        data = JSON.parse(ls);
        cb(data);
    }else{
        getFetch( (res )=> {
            localStorage.setItem("database", JSON.stringify(res))
            cb(res);
        });
    }
}

const createElement = (type, classlist, id, attributes, parent = null)=>{
    let elem = document.createElement(type);
    if (classlist) classlist.split(' ').map(c=>elem.classList.add(c));
    if (id && typeof id == 'string' && id.length > 0) elem.id = id;

    if (attributes){
        Object.keys(attributes).map(k=>{if(k == "textContent") elem.textContent = attributes[k]; else elem.setAttribute(k, attributes[k])});
    }

    if (parent) parent.appendChild(elem);
    return elem;
}

/** RenderHTML
 * @param {json} e html as json formated element
 */
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