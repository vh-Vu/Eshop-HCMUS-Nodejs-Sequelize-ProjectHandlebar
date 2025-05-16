async function addCart(id,quantity){
    const response = await fetch("/products/cart",{
        method : "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json",
        },
        body: JSON.stringify({id,quantity})
    })
    const data = await response.json();
    cart_quantity.innerText = `(${data.quantity})`;
}