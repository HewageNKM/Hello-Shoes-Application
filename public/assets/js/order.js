const orderOptionFld = $("#orderOptionFld");
const orderItemIdFld = $("#orderItemIdFld");
const orderCustomerIdFld = $("#orderCustomerIdFld");
const quantityFld = $("#qtyFld");
const itemBtnLoadingAnimation = $("#itemLoadingAnimation");
const sizeSelect = $("#sizeSelect");
const orderSubTotalFld = $("#orderTotalFld");
const orderCustomerIdFldAnimation = $("#customerIdFldLoadingAnimation")
const cardNumberFld = $("#cardNumberFld");
const customerConfirmMark = $("#customerConfirmMark");

let orderCart = [];
let items = [];
let stocks = [];
let orderTotal = 0;
let customer = null;

$('#orderCustomerIdFld').on('keypress', function (e) {
    const val = orderCustomerIdFld.val().toLowerCase();
    if (e.which === 13) {
        if (val.trim().length > 8) {
            orderCustomerIdFldAnimation.removeClass("hidden")
            orderCustomerIdFldAnimation.addClass("flex")
            $.ajax({
                url: BASEURL + "/customers/" + val,
                method: "GET",
                processData: false,
                contentType: false,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (res) {
                    const confirmMark = $("#customerConfirmMark");
                    orderCustomerIdFld.prop("disabled", true)
                    orderCustomerIdFld.removeClass("hover:border-2")
                    orderCustomerIdFldAnimation.removeClass("flex")
                    orderCustomerIdFldAnimation.addClass("hidden")
                    confirmMark.removeClass("hidden")
                    confirmMark.addClass("flex")
                    console.log(res);
                    customer = res;
                },
                error: function (error) {
                    console.log(error);
                    orderCustomerIdFld.prop("disabled", false)
                    orderCustomerIdFldAnimation.removeClass("flex")
                    orderCustomerIdFldAnimation.addClass("hidden")
                    setInventoryAlertMessage("Customer not found")
                }
            })
        }
    }
});

orderItemIdFld.on('keypress', function (e) {
    const value = orderItemIdFld.val();
    if (e.which === 13) {
        if (value.trim().length > 8) {
            itemBtnLoadingAnimation.removeClass("hidden")
            itemBtnLoadingAnimation.addClass("flex")
            orderItemIdFld.prop("disabled", true)
            orderItemIdFld.removeClass("hover:border-2")
            const find = items.find(item => item.itemId === value.toLowerCase());
            if (find) {
                setAvailableSizes(find.itemId);
                itemBtnLoadingAnimation.removeClass("flex")
                itemBtnLoadingAnimation.addClass("hidden")
            } else {
                $.ajax({
                    url: BASEURL + "/inventory/items/" + value.toLowerCase(),
                    method: "GET",
                    processData: false,
                    contentType: false,
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    success: function (res) {
                        items.push(res);
                        setAvailableSizes(res.itemId);
                        itemBtnLoadingAnimation.removeClass("flex")
                        itemBtnLoadingAnimation.addClass("hidden")
                    },
                    error: function (error) {
                        console.log(error);
                        orderItemIdFld.prop("disabled", false)
                        setInventoryAlertMessage("Item not found")
                    }
                })
            }
        }
    }
});
const setAvailableSizes = (itemId) => {
    const stock = stocks.find(stock => stock.itemId === itemId.toLowerCase());
    if (stock) {
        setSizes(stock)
    } else {
        $.ajax({
            url: BASEURL + "/inventory/items/stocks/" + itemId.toLowerCase(),
            method: "GET",
            processData: false,
            contentType: false,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (res) {
                console.log(res);
                stocks.push(res);
                setSizes(res)
            },
            error: function (error) {
                console.log(error);
            }

        })
    }
}

const setSizes = (stock) => {
    sizeSelect.empty();
    let totalStocks = 0;

    if (stock.size40 > 0) {
        totalStocks += stock.size40
        sizeSelect.append(`<option value="size40">Size 40</option>`)
    }
    if (stock.size41 > 0) {
        totalStocks += stock.size41
        sizeSelect.append(`<option value="size41">Size 41</option>`)
    }
    if (stock.size42 > 0) {
        totalStocks += stock.size42
        sizeSelect.append(`<option value="size42">Size 42</option>`)
    }
    if (stock.size43 > 0) {
        totalStocks += stock.size43
        sizeSelect.append(`<option value="size43">Size 43</option>`)
    }
    if (stock.size44 > 0) {
        totalStocks += stock.size44
        sizeSelect.append(`<option value="size44">Size 44</option>`)
    }
    if (stock.size45 > 0) {
        totalStocks += stock.size45
        sizeSelect.append(`<option value="size45">Size 45</option>`)
    }
    if (totalStocks === 0) {
        setInventoryAlertMessage("Item out of stock")
        orderItemIdFld.prop("disabled", false)
        return;
    }

    orderOptionFld.removeClass("hidden")
    orderOptionFld.addClass("flex")
}
$("#addOrderBtn").click(function (e) {

    const size = sizeSelect.val();
    const quantity = Number.parseInt(quantityFld.val());
    const itemId = orderItemIdFld.val().toLowerCase();
    const item = items.find(item => item.itemId === itemId);
    const stock = stocks.find(stock => stock.itemId === itemId);
    const description = item.description + ", " + size;

    console.log(quantity, itemId, description, size, item, stock)
    console.log(stock[size])


    if (quantity === 0 || quantity == null || itemId.trim() === "") {

        quantityFld.addClass("border-2 border-red-500")
        orderItemIdFld.addClass("border-2 border-red-500")

        setInventoryAlertMessage("Please fill all fields")

    } else {
        quantityFld.removeClass("border-2 border-red-500")
        orderItemIdFld.removeClass("border-2 border-red-500")
    }

    if (quantity <= 0) {
        setInventoryAlertMessage("Quantity must be greater than 0")
        return;
    }

    if (quantity > stock[size]) {
        setInventoryAlertMessage("Not enough stock")
        quantityFld.addClass("border-2 border-red-500")
        return;
    } else {
        quantityFld.removeClass("border-2 border-red-500")
    }

    const total = item.sellingPrice * quantity;
    orderTotal += total;
    stock[size] -= quantity;

    const orderCartItem = {
        itemId: itemId,
        description: description,
        size: size,
        quantity: quantity,
        price: item.sellingPrice,
        total: total,
    };

    orderCart.push(orderCartItem);

    addToCartTable(orderCartItem);

    orderSubTotalFld.val(orderTotal);
    orderItemIdFld.addClass("hover:border-2")
    orderItemIdFld.prop("disabled", false)
    quantityFld.val("");
    orderOptionFld.removeClass("flex")
    orderOptionFld.addClass("hidden")

});

const addToCartTable = (orderCartItem) => {
    const table = $("#orderTableBody");
    table.append
    (
        `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light" id="">
            <td class="m-1 p-2 uppercase">${orderCartItem.itemId}</td>
            <td class="m-1 p-2 capitalize">${orderCartItem.description}</td>
            <td>${orderCartItem.quantity}</td>
            <td>${orderCartItem.price}</td>
            <td>${orderCartItem.total}</td>
            <td><button id="" class="text-red-500 hover:text-red-600 font-medium hover:border-b-2 border-red-500">Remove</button></td>
        </tr>`
    );
}

$("#checkoutBtn").click(function (e) {
    const cashCheckoutForm = $("#cashCheckoutFormDiv");
    const cardCheckoutForm = $("#cardCheckoutFormDiv");
    const payment = $("#paymentTypeSelect").val();

    console.log(payment)
    if (orderCart.length === 0) {
        setInventoryAlertMessage("Cart is empty")
        return;
    }

    if (payment === "CASH") {
        $("#cashCheckoutSubTotalFld").val(orderTotal)
        cashCheckoutForm.removeClass("hidden")
    } else if (payment === "CARD") {
        $("#cardCheckoutSubTotalFld").val(orderTotal)
        cardCheckoutForm.removeClass("hidden")
    }
})

$("#cashCheckoutCloseBtn").click(function (e) {
    $("#cashCheckoutSubTotalFld").val("")
    $("#cashFld").val("")
    $("#balanceFld").val("")
    $("#cashCheckoutFormDiv").addClass("hidden")
})
$("#cardCheckoutCloseBtn").click(function (e) {
    $("#cardCheckoutSubTotalFld").val("")
    $("#cardNumberFld").val("")
    $("#cardCheckoutFormDiv").addClass("hidden")
})

$("#cashFld").keyup(function (e) {
    const cash = Number.parseFloat(e.target.value);
    const balance = cash - orderTotal;
    $("#balanceFld").val(balance)
})

$("#cashCheckoutConfirmBtn").click(function (e) {
    const balance = Number.parseInt($("#balanceFld").val());
    if (balance < 0 || balance == null || isNaN(balance)) {
        setInventoryAlertMessage("Insufficient cash")
        return;
    }

    let order = {
        customerId: customer? customer.customerId :null,
        saleDetailsList: orderCart,
        total: orderTotal,
        paymentDescription: "CASH",
    }
    order = JSON.stringify(order);
    const btnLoadingAnimation = $("#checkoutConfirmBtnLoadingAnimationCash")
    btnLoadingAnimation.removeClass("hidden")
    btnLoadingAnimation.addClass("flex")
    $("#cashFld").prop("disabled", true)
    $.ajax({
        url: BASEURL + "/sales",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: order,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            console.log(res);
            btnLoadingAnimation.removeClass("flex")
            btnLoadingAnimation.addClass("hidden")
            setInventorySuccessMessage("Order placed successfully")
            orderCart = [];
            items = [];
            stocks = [];
            orderTotal = 0;
            $("#orderTableBody").empty();
            $("#orderTotalFld").val("");
            orderCustomerIdFld.val("");
            orderItemIdFld.val("")
            orderItemIdFld.addClass("hover:border-2")
            orderCustomerIdFld.prop("disabled", false)
            orderCustomerIdFld.addClass("hover:border-2")
            $("#cashCheckoutSubTotalFld").val("")
            orderSubTotalFld.val("")
            $("#cashFld").prop("disabled", false)
            $("#cashFld").val("")
            customerConfirmMark.removeClass("flex")
            customerConfirmMark.addClass("hidden")
            $("#balanceFld").val("")
            setInventoryAlertMessage("Order placed successfully")
        },
        error: function (error) {
            $("#cashFld").prop("disabled", false)
            btnLoadingAnimation.removeClass("flex")
            btnLoadingAnimation.addClass("hidden")
            console.log(error);
        }
    })
})

$("#cardCheckoutConfirmBtn").click(function (e) {
    const cardNumber = Number.parseInt(cardNumberFld.val());
    const bank = $("#bankSelectFld").val()
    if (!/^\d{4}$/.test(cardNumber) || isNaN(cardNumber)) {
        setInventoryAlertMessage("Invalid card number")
        return;
    }

    let order = {
        customerId: customer? customer.customerId :null,
        saleDetailsList: orderCart,
        total: orderTotal,
        paymentDescription: bank.toLowerCase()+"/card- "+cardNumber,
    }
    order = JSON.stringify(order);

    cardNumberFld.prop("disabled", true)
    const btnLoadingAnimation  =  $("#checkoutConfirmBtnLoadingAnimationCard")
    btnLoadingAnimation.removeClass("hidden")
    btnLoadingAnimation.addClass("flex")
    $.ajax({
        url: BASEURL + "/sales",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: order,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            console.log(res);
            btnLoadingAnimation.removeClass("flex")
            btnLoadingAnimation.addClass("hidden")
            setInventorySuccessMessage("Order placed successfully")
            orderCart = [];
            items = [];
            stocks = [];
            orderTotal = 0;
            customerConfirmMark.removeClass("flex")
            customerConfirmMark.addClass("hidden")
            $("#orderTableBody").empty();
            $("#orderTotalFld").val("");
            orderCustomerIdFld.val("");
            orderCustomerIdFld.prop("disabled", false)
            orderCustomerIdFld.addClass("hover:border-2")
            orderSubTotalFld.val("")
            $("#cardCheckoutSubTotalFld").val("")
            cardNumberFld.prop("disabled", false)
            cardNumberFld.val("")
            orderItemIdFld.val("")
            orderItemIdFld.prop("disabled", false)
            orderItemIdFld.addClass("hover:border-2")
            setInventoryAlertMessage("Order placed successfully")
        },
        error: function (error) {
            $("#cardNumberFld").prop("disabled", false)
            btnLoadingAnimation.removeClass("flex")
            btnLoadingAnimation.addClass("hidden")
            console.log(error);
        }
    })
})