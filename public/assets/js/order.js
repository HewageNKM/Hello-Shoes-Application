const orderOptionFld = $("#orderOptionFld");
const orderItemIdFld = $("#orderItemIdFld");
const orderCustomerIdFld = $("#orderCustomerIdFld");
const quantityFld = $("#qtyFld");
const itemBtnLoadingAnimation = $("#itemLoadingAnimation");
const sizeSelect = $("#sizeSelect");
const orderSubTotal = $("#orderTotalFld");

const orderCart = [];
let items = [];
let stocks = [];
let orderTotal = 0;

$('#orderCustomerIdFld').on('keypress', function (e) {
    if (e.which === 13) {
        orderCustomerIdFld.prop("disabled", true)
        if (/^cust\d{8}$/) {
            $.ajax({
                url: BASEURL + "/customers/" + orderCustomerIdFld.val(),
                method: "GET",
                processData: false,
                contentType: false,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (res) {
                    console.log(res);
                },
                error: function (error) {
                    console.log(error);
                    $("#orderCustomerIdFld").prop("disabled", false)
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
        code: itemId,
        description: description,
        quantity: quantity,
        price: item.sellingPrice,
        total: total
    };

    orderCart.push(orderCartItem);

    addToCartTable(orderCartItem);

    orderSubTotal.val(orderTotal);
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
        `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light">
            <td class="m-1 p-2 uppercase">${orderCartItem.code}</td>
            <td class="m-1 p-2 capitalize">${orderCartItem.description}</td>
            <td>${orderCartItem.quantity}</td>
            <td>${orderCartItem.price}</td>
            <td>${orderCartItem.total}</td>
        </tr>`
    );
}