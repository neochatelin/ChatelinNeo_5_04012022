import { getData } from "./get_json.js";

getData( (data) => {
	// get element will be load
	let page_title = document.querySelector("title");
	let item__img = document.querySelector(".item__img");
	let title = document.getElementById("title");
	let price = document.getElementById("price");
	let description = document.getElementById("description");
	let colors = document.getElementById("colors");
	
	// creation of element who will be load
	let img = document.createElement("img");
	img.src = data.imageUrl;
	img.alt = data.altTxt;
	item__img.appendChild(img);
	
	page_title.textContent = data.name;
	title.textContent = data.name;
	price.textContent = data.price;
	description.textContent = data.description;
	
	// load color option
	data.colors.map(color => {
		let opt = document.createElement('option');
		opt.value = color;
		opt.textContent = color;
		colors.appendChild(opt);
	});
	
	let quantity = document.getElementById("quantity");
	
	let addToCart = document.getElementById("addToCart");
	
	addToCart.addEventListener("click", ()=>{

		// display and basket system
		let id = new URLSearchParams(window.location.search).get("id");
		let opt = colors.options[colors.selectedIndex].value;
		let qty = +quantity.value;

		if(qty != 0 && opt != ""){
			let ls = localStorage.getItem("basket");
			let confirmation = confirm("Ajouter "+data.name+" ("+opt+'('+qty+'))');
			if (ls && confirmation){
				let basket = JSON.parse(ls);
				let product = basket.find( product => product.id==id && product.option==opt);

				if (product)
					product.quantity += +qty;
				else
					basket.push({id : id, option:opt, quantity:qty});
				localStorage.setItem("basket",JSON.stringify(basket));
				window.location("../html/cart.html")

			}else{
				localStorage.setItem("basket",JSON.stringify([{id:id, option:opt, quantity:qty}]));
			}

		} else {
			// error animation
			addToCart.animate([
				{boxShadow: "rgba(200, 0, 0, 0.9) 0 0 22px 6px"},
				{transform: "translateX(0px)"},
				{transform: "translateX(5px)"},
				{transform: "translateX(-5px)"},
				{transform: "translateX(0px)"},
				{boxShadow: "rgba(42, 18, 206, 0.9) 0 0 22px 6px"}
			], {duration: 300});
		}
	});
}, new URLSearchParams(window.location.search).get("id"))