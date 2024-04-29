// add products by json

var products = null;
fetch("/src/products.json")
    .then((response) => response.json())
    .then((data) => {
        products = data;
        convertJSONHTML();
    })

    // show button on hover

    .then(() => {

        buttons[0].style.transform = "translateY(100%)";
        buttons[1].style.transform = "translateY(100%)";

        grids[0].addEventListener("mouseover", function () {
            buttons[0].style.transform = "translateY(0)";
            buttons[0].style.opacity = "0.7";
        });
        grids[0].addEventListener("mouseout", function () {
            buttons[0].style.transform = "translateY(100%)";
            buttons[0].style.opacity = "0";
        });
        grids[1].addEventListener("mouseover", function () {
            buttons[1].style.transform = "translateY(0)";
            buttons[1].style.opacity = "0.7";
        });
        grids[1].addEventListener("mouseout", function () {
            buttons[1].style.transform = "translateY(100%)";
            buttons[1].style.opacity = "0";
        });
    });

var productList = document.querySelector(".grid");

function formatNumber(x) { // format number with .
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

let grids = [];
let buttons = [];

function convertJSONHTML() {
    productList.innerHTML = "";

    if (products != null) {
        products.forEach((product) => {
            var newProduct = document.createElement("div");
            newProduct.classList.add("gridItems");
            newProduct.style.backgroundImage  = `url(${product.backgroundimg})`;
            newProduct.id = "gridHover";
            newProduct.innerHTML = `
            <p class="gridName">${product.name}</p>
            <p class="gridPrice">IDR ${formatNumber(product.price)},-</p>
            <p class="gridDescription">${product.description}</p>
            <button class="gridButton" onclick="addCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(newProduct);
            grids.push(newProduct);
            buttons.push(newProduct.getElementsByClassName("gridButton")[0])
        });
    }
}

// open cart

const cart = document.getElementById("cart");
const cartMain = document.getElementsByClassName("cartMain");

cartMain[0].style.transform = "translateX(110%)"

cart.addEventListener("click", function(){
    if (cartMain[0].style.transform == "translateX(110%)"){
        cartMain[0].style.transform = "translateX(0%)"
    } else {
        cartMain[0].style.transform = "translateX(110%)"
    };

});

// main cart handler

let cartList = [];
let changearray = new Event("changeArray");
function checkCart(){
    var cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('cartList='));
    if (cookie){
        cartList = JSON.parse(cookie.split('=')[1]);
    }else{
        cartList = [];
    };
}
checkCart()



document.addEventListener("changeArray", function(){
    if (cartList[1] != null || cartList[2] != null){
        document.getElementById("cart").children[0].src="src/images/cart2.svg";
    } else {
        document.getElementById("cart").children[0].src="src/images/cart1.svg";
    }
})
document.dispatchEvent(changearray);

const delay = ms => new Promise(res => setTimeout(res, ms));
let checkButton = document.getElementsByClassName("checkout")[0];
checkButton.style.background = "#E58A4C";
checkButton.addEventListener("click", async function(){
    if (checkButton.getAttribute("href") == "#"){
        checkButton.style.background = "rgb(247,78,78)";
        await delay(200);
        checkButton.style.background = "#E58A4C";
    }
});

function addCart($productId){
    let productsCopy = JSON.parse(JSON.stringify(products));

    if (!cartList[$productId]){
        cartList[$productId] = productsCopy.filter(product => product.id == $productId)[0];
        cartList[$productId].quantity = 1;
    } else {
        cartList[$productId].quantity ++;
    };
    let date = new Date(Date.now() + 86400e3);
    date = date.toUTCString(); // 1 day
    document.cookie = "cartList=" + JSON.stringify(cartList) + "; expires=" + date + "; path=/;" 
    CartToHTML();
    if (cartMain[0].style.transform == "translateX(110%)"){
        cartMain[0].style.transform = "translateX(0%)"
    };
    document.dispatchEvent(changearray);
}
CartToHTML();
function CartToHTML(){
    let cartlist = document.querySelector(".cartList");
    cartlist.innerHTML = '';

    let totalQty = 0;
    
    if (cartList[1] == null & cartList[2] == null){
        let emptyCart = document.createElement('div');
        emptyCart.classList.add("emptyCart");
        emptyCart.innerHTML = 'Empty Cart!'
        cartlist.appendChild(emptyCart);
        document.getElementsByClassName("checkout")[0].setAttribute("href", "#");
    } else {
        document.getElementsByClassName("checkout")[0].setAttribute("href", "/checkout.html");
    }
        
    

    if(cartList){
        cartList.forEach(product => {
            if (product){
                let newItem = document.createElement('div');
                newItem.classList.add("cartItems");
                newItem.innerHTML = `
                <img src="${product.image}" alt="img"/>
                <div class="content">
                    <div class="name">${product.name}</div>
                    <div class="price">IDR ${formatNumber(product.price)},-/per</div>
                </div>
                <div class="quantity">
                    <button onclick="changeQty(${product.id}, '-')">-</button>
                    <span class="value">${product.quantity}</span>
                    <button onclick="changeQty(${product.id}, '+')">+</button>
                </div>
                `;
                cartlist.appendChild(newItem);
                totalQty = totalQty + product.quantity;
            }
        })

    }
};

function changeQty($productId, $type){
    switch ($type) {
        case '+':
            cartList[$productId].quantity++;
            break;
        case '-':
            if (cartList[$productId].quantity <= 1){
                delete cartList[$productId];
                document.dispatchEvent(changearray);
            } else {
                cartList[$productId].quantity--;
            }
            break;

        default:
            break;
    }

    let date = new Date(Date.now() + 86400e3);
    date = date.toUTCString(); // 1 day
    document.cookie = "cartList=" + JSON.stringify(cartList) + "; expires=" + date + "; path=/;" 
    CartToHTML();
}
