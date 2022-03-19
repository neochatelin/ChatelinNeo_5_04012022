import { getData, RenderHTML } from "./get_json.js";

getData( (data) => {

	document.querySelector(".item__img").appendChild(RenderHTML({
		elementType: "img",
		src: data.imageUrl,
		alt: data.altTxt
	}));
	
	document.querySelector("title").textContent = data.name;
	document.getElementById("title").textContent = data.name;
	document.getElementById("price").textContent = data.price;
	document.getElementById("description").textContent = data.description;
	
	let colors = document.getElementById("colors");

	data.colors.map(color => {
		let opt = document.createElement('option');
		opt.value = color;
		opt.textContent = color;
		colors.appendChild(opt);
	});
	
	let quantity = document.getElementById("quantity");
	
	let addToCart = document.getElementById("addToCart");
	
	addToCart.addEventListener("click", ()=>{

		let id = new URLSearchParams(window.location.search).get("id");
		let opt = colors.options[colors.selectedIndex].value;
		let qty = +quantity.value;

		if(qty != 0 && opt != ""){
			let ls = localStorage.getItem("basket");
			let confirmation = confirm("Ajouter "+data.name+" ("+opt+'('+qty+'))');
			if (confirmation){
				if(ls){
					let basket = JSON.parse(ls);
					let product = basket.find( product => product.id==id && product.option==opt);

					if (product)
						product.quantity += +qty;
					else
						basket.push({id : id, option:opt, quantity:qty});
					localStorage.setItem("basket",JSON.stringify(basket));
					window.location = "cart.html";
				}else{
					localStorage.setItem("basket",JSON.stringify([{id:id, option:opt, quantity:qty}]));
				}
			}

		} else {
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