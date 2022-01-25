import { getData, RenderHTML } from "./get_json.js";

var UpdateQuantity = ()=>{
    console.log('l');
};

function Run(){

    getData( (data) => {
        let cart__items = document.getElementById("cart__items");

        let ls = localStorage.getItem("basket");
        if (ls){
            
            let basket = JSON.parse(ls);

            for (let basketProduct of basket){

                let id = basketProduct.id;
                let qty = basketProduct.quantity;
                let opt = basketProduct.option;

                let currentKanap = data.find( kanap => kanap._id == id );
                
                let cartItem = {

                    elementType : "article",
                    class : "cart__item",
                    "data-id" : id,
                    "data-color" : opt,

                    children : [
                        {
                            elementType : "div",
                            class : "cart__item__img",
                            children : [
                                {
                                    elementType : "img",
                                    src : currentKanap.imageUrl,
                                    alt : currentKanap.altTxt
                                }
                            ]
                        },

                        {
                            elementType : "div",
                            class : "cart__item__content",
                            children : [
                                {
                                    elementType : "div",
                                    class : "cart__item__content__description",
                                    children : [
                                        {
                                            elementType : "h2",
                                            textContent : currentKanap.name
                                        },
                                        {
                                            elementType : "p",
                                            textContent : opt
                                        },
                                        {
                                            elementType : "p",
                                            textContent : currentKanap.price+' €'
                                        }
                                    ]
                                },
                                {
                                    elementType : "div",
                                    class : "cart__item__content__settings",
                                    children : [
                                        {
                                            elementType : "div",
                                            class : "cart__item__content__settings__quantity",
                                            children : [
                                                {
                                                    elementType : "p",
                                                    textContent:"Qté : "
                                                },
                                                {
                                                    elementType : "input",
                                                    class : 'itemQuantity',
                                                    type:"number",
                                                    name:"itemQuantity",
                                                    min:'1',
                                                    max:'100',
                                                    value:qty,
                                                    onchange : "UpdateQuantity()"
                                                }
                                            ]
                                        },
                                        {
                                            elementType : "div",
                                            class : "cart__item__content__settings__delete",
                                            children : [
                                                {
                                                    elementType : "p",
                                                    class : "deleteItem",
                                                    textContent : "Supprimer"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                cart__items.appendChild(RenderHTML(cartItem));
                UpdateQuantity(qty);
            }
        }
    })
}



/*
<span id="totalQuantity"><!-- 2 --></span>
<span id="totalPrice"><!-- 84,00 --></span>
<p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>
*/

Run();