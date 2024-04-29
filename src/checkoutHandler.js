// main checkout handler

const delay = ms => new Promise(res => setTimeout(res, ms));

function formatNumber(x) { // format number with .
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

let cartList = [];
function checkCart(){
    var cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('cartList='));
    if (cookie){
        cartList = JSON.parse(cookie.split('=')[1]);
    };
}
checkCart()

CartToHTML();

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
}
function CartToHTML(){
    let cartlist = document.querySelector(".listCart");
    cartlist.innerHTML = '';

    let totalQty = 0;
    let totalPrice = 0;
    
    if(cartList){
        cartList.forEach(product => {
            if (product){
                totalPrice = totalPrice + (product.price * product.quantity);
                totalQty = totalQty + product.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add("listCartItems");
                newItem.innerHTML = `
                    <img src="${product.image}" alt="img"/>
                    <div class="content">
                        <div class="quantity">${product.quantity}</div>
                        <div class="name">${product.name}</div>
                        <div class="pricecount">IDR ${formatNumber(product.price * product.quantity)},-</div>
                    </div>

                    <div class="Qty">
                        <button onclick="changeQty(${product.id}, '+')">+</button>
                        <button onclick="changeQty(${product.id}, '-')">-</button>
                    </div>
                `;
                cartlist.appendChild(newItem);
            }
        })
    }

    document.getElementsByClassName("totalQuantity")[0].innerHTML = totalQty;
    document.getElementsByClassName("totalPrice")[0].innerHTML = "IDR " + formatNumber(totalPrice) + ",-";

};

function changeQty($productId, $type){
    switch ($type) {
        case '+':
            cartList[$productId].quantity++;
            break;
        case '-':
            if (cartList[$productId].quantity <= 1){
                break;
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