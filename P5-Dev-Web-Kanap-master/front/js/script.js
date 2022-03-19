import { getData, RenderHTML } from "./get_json.js";

let item = document.getElementById("items");

getData( (data) => {
    for(let i = 0; i < data.length; i++){

        let elem = {
            elementType : 'a',
            href : "./product.html?id="+data[i]._id,
            children : [{
                elementType : 'article',
                children : [
                    {
                        elementType : 'img',
                        src : data[i].imageUrl,
                        alt : data[i].altTxt,
                    },
                    {
                        elementType : 'h3',
                        class : 'productName',
                        textContent : data[i].name
                    },
                    {
                        elementType : 'p',
                        class : 'productDescription',
                        textContent : data[i].description
                    }
                ]
            }]
        }
        item.appendChild(RenderHTML(elem));
    }
})


/*
    <a href="./product.html?id=42">
        <article>
            <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
            <h3 class="productName">Kanap name1</h3>
            <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
        </article>
    </a>
*/