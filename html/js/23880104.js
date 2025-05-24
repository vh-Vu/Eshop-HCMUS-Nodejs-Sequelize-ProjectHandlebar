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

async function updateCart(id,quantity){
    if(quantity>0){
        const response = await fetch("/products/cart",{
            method : "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept" : "application/json",
            },
            body: JSON.stringify({id,quantity})
        })
        const data = await response.json();
        document.getElementById(["quantity",id].join("")).value = data.items.quantity;
        document.getElementById(["total",id].join("")).innerText = `$${data.items.total}`;
        total.innerText = `$${data.total}`;
        subtotal.innerText = `$${data.subtotal}`;
        cart_quantity.innerText = `(${data.quantity})`;
    }else removeCart(id);

}


async function removeCart(id){
    if(confirm("Do you really remove this product ?")){
        const response = await fetch("/products/cart",{
            method : "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept" : "application/json",
            },
            body: JSON.stringify({id})
        })
        if(response.status === 200){
            const data = await response.json();
            cart_quantity.innerText = `(${data.quantity})`;    
            if(data.quantity>0){    
                document.getElementById(["total",id].join("")).parentNode.remove();
                total.innerText = `$${data.total}`;
                subtotal.innerText = `$${data.subtotal}`;
            }else{
                document.querySelector(".cart-page .container").innerHTML = `<div class="text-center border py-3">
            <h3>Your cart is empty!</h3>
        </div>`;
            }

        }
    }
}

async function clearCart(){
    if(confirm("Do you really remove cart?")){
        const response = await fetch("/products/cartall",{
            method : "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept" : "application/json",
            }
        });
        if(response.status === 200){
            cart_quantity.innerText = "(0)";    
            document.querySelector(".cart-page .container").innerHTML = `<div class="text-center border py-3">
            <h3>Your cart is empty!</h3>
        </div>`;
        }
    }
}


function checkPasswordConfirm(formId){
    const password = document.querySelector(`#${formId} [name=password]`);
    const confirmPassword = document.querySelector(`#${formId} [name=confirmPassword]`);
    if(password.value != confirmPassword.value){
        confirmPassword.setCustomValidity("Password not macth!");
        confirmPassword.reportValidity();
    }else{
        confirmPassword.setCustomValidity("");
    }
}