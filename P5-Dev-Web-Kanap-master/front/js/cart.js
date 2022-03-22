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
                    if(itemQuantity.value <= 0){
                        itemQuantity.value = 1;
                        localStorage.setItem("basket", JSON.stringify(basket));
                        window.location.reload();
                    }
                    basketProduct.quantity = itemQuantity.value;
                    localStorage.setItem("basket", JSON.stringify(basket));
                    window.location.reload();
                }
                deleteItem.onclick = ()=>{
                    let a = basket.find(k => k.id == id && k.option == opt)
                    basket.splice(basket.indexOf(basket.find(k => k.id == id && k.option == opt)), 1);
                    localStorage.setItem("basket", JSON.stringify(basket));
                    window.location.reload();
                }
            }
            document.getElementById('totalQuantity').textContent = Tqty;
            document.getElementById('totalPrice').textContent = Tprice;
        }
    })
}

const validateName = (id, msg)=>{
    let elem = document.getElementById(id);
    let elemErrorMsg = document.getElementById(id+"ErrorMsg");
    elemErrorMsg.textContent = '';
    switch (id) {
        case 'firstName':
        case 'lastName':
        case 'city':
            if(!elem.value.match(/^[a-z ,.'-]+$/i)){
                elemErrorMsg.textContent = msg;
                return 1;
            }
            break;
        case 'address':
            if(!elem.value.match(/^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/i)){
                elemErrorMsg.textContent = msg;
                return 1;
            }
            break;
        case 'email':
            if(!elem.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                elemErrorMsg.textContent = msg;
                return 1;
            }
            break;
        default:
            break;
    }
    return 0;
}

if(window.location.pathname == "/cart.html"){
    Run();

    let order = document.getElementsByClassName("cart__order__form");
    
    let basket = JSON.parse(localStorage.getItem("basket"));
    
    order[0].onchange = ()=>{
        validateName("firstName", "Prénom invalide");
        validateName("lastName", "Nom invalide");
        validateName("address", "Adresse invalide");
        validateName("city", "Ville invalide");
        validateName("email", "Email invalide");
    }
        
    order[0][5].onclick = ()=>{
        if(
            validateName("firstName", "Prénom invalide")+
            validateName("lastName", "Nom invalide")+
            validateName("address", "Adresse invalide")+
            validateName("city", "Ville invalide")+
            validateName("email", "Email invalide") === 0){
            let inputFirstName = document.getElementById("firstName");
            let inputLastName = document.getElementById("lastName");
            let inputAddress = document.getElementById("address");
            let inputCity = document.getElementById("city");
            let inputEmail = document.getElementById("email");

            console.log(basket);

            let orderId;
            
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                body:{
                    contact:{
                        firstName: inputFirstName.value,
                        lastName: inputLastName.value,
                        address: inputAddress.value,
                        city: inputCity.value,
                        email: inputEmail.value
                    },
                    products: basket
                },
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then(response => console.log(response.json()))
            .then((data) => {
                console.log(data);
                orderId = data;
                localStorage.clear();
            })
            .catch((err) => {
                console.log(err);
            });
            window.location.href = `confirmation.html?orderId=${data}`
        }
    }
}else{
    let orderId = new URLSearchParams(window.location.search).get('orderId');
    let orderIdField = document.getElementById("orderId");
    orderIdField.textContent = orderId;
}