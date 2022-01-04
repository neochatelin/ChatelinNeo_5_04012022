let elementParent = document.getElementById("items");

let request = new XMLHttpRequest();
request.open("GET", "/api/products");
request.responseType = "json";

request.onload = ()=>{
    let kanap = request.response;
    for(let i = 0; i < 7; i++){
        elementParent.innerHTML += ` <a href="./product.html?id=${JSON.stringify(kanap[i]._id).replace(/\"/g, "")}">
                                        <article>
                                            <img src=${JSON.stringify(kanap[i].imageUrl)} alt=${JSON.stringify(kanap[i].imageUrl)}>
                                            <h3 class="productName">${JSON.stringify(kanap[i].name).replace(/\"/g, "")}</h3>
                                            <p class="productDescription">${JSON.stringify(kanap[i].description).replace(/\"/g, "")}</p>
                                        </article>
                                    </a>`;
    }
}

request.send();