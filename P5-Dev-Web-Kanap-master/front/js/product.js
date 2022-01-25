import { getData } from "./get_json.js";

getData( (data) => {

	let id = new URLSearchParams(window.location.search).get("id");

	// get element will be load
	let item__img = document.querySelector(".item__img");
	let title = document.getElementById("title");
	let price = document.getElementById("price");
	let description = document.getElementById("description");
	let colors = document.getElementById("colors");

	// get current kanape by ID (from url search param)
	let currentKanap = data.find( kanap => kanap._id == id );
	
	// creation of element who will be load
	let img = document.createElement("img");
	img.src = currentKanap.imageUrl;
	img.alt = currentKanap.altTxt;
	item__img.appendChild(img);
		
	title.textContent = currentKanap.name;
	price.textContent = currentKanap.price;
	description.textContent = currentKanap.description;
	
	// load color option
	currentKanap.colors.map(color => {
		let opt = document.createElement('option');
		opt.value = color;
		opt.textContent = color;
		colors.appendChild(opt);
	});
	
	let quantity = document.getElementById("quantity");
	
	let addToCart = document.getElementById("addToCart");
	
	addToCart.addEventListener("click", ()=>{

		// display and basket system
		let opt = colors.options[colors.selectedIndex].value;
		let qty = +quantity.value;

		if(qty != 0 && opt != ""){
			let ls = localStorage.getItem("basket");
			if (ls){
				let basket = JSON.parse(ls);
				let product = basket.find( product => product.id==id && product.option==opt);
				if (product)
					product.quantity += +qty;
				else
					basket.push({id : id, option:opt, quantity:qty});

				localStorage.setItem("basket",JSON.stringify(basket));

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
})