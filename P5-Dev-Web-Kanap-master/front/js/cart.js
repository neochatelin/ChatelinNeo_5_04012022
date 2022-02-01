import { getData, RenderHTML } from "./get_json.js";

function Run(){

    getData( (data) => {

        let Tqty = 0;
        let Tprice = 0;

        let cart__items = document.getElementById("cart__items");

        let ls = localStorage.getItem("basket");
        if (ls){
            
            let basket = JSON.parse(ls);

            for (let basketProduct of basket){

                let id = basketProduct.id;
                let qty = basketProduct.quantity;
                let opt = basketProduct.option;

                let currentKanap = data.find( kanap => kanap._id == id );
                
                Tqty += parseInt(qty);
                Tprice += parseInt(currentKanap.price*qty);

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
                                                    id: "itemQuantity"+id+":"+qty+":"+opt,
                                                    type:"number",
                                                    name:"itemQuantity",
                                                    min:'1',
                                                    max:'100',
                                                    value:qty,
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
                                                    id: "deleteItem"+id+":"+qty+":"+opt,
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
                
                let itemQuantity = document.getElementById("itemQuantity"+id+":"+qty+":"+opt);
                let deleteItem = document.getElementById("deleteItem"+id+":"+qty+":"+opt);

                itemQuantity.onchange = ()=>{
                    basketProduct.quantity = itemQuantity.value;
                    localStorage.setItem("basket", JSON.stringify(basket));
                    window.location.reload();
                }
                deleteItem.onclick = ()=>{
                    let a = basket.find(k => k.id == id && k.option == opt)
                    basket.pop(a);
                    console.log(basket);
                    localStorage.setItem("basket", JSON.stringify(basket));
                    window.location.reload();
                }
            }
            document.getElementById('totalQuantity').textContent = Tqty;
            document.getElementById('totalPrice').textContent = Tprice;
        }
    })
    let order = document.getElementById("order");
    order.onsubmit = ()=>{
        let inputFirstName = document.getElementById("firstName");
        let inputLastName = document.getElementById("lastName");
        let inputAddress = document.getElementById("address");
        let inputCity = document.getElementById("city");
        let inputEmail = document.getElementById("email");
        
        validateName(id, idErrorMsg, cb);

        fetch("http://localhost:3000/order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body:{
                contact:{
                    firstName: inputFirstName.value,
                    lastName: inputLastName.value,
                    address: inputAddress.value,
                    city: inputCity.value,
                    email: inputEmail.value
                },
                products: basket
            }
        });
    }
}

const validateName = (id, idErrorMsg, cb)=>{
    let elem = document.getElementById(id);
    let elemErrorMsg = document.getElementById(idErrorMsg);
}

Run();