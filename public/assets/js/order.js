const orderOptionFld = $("#orderOptionFld");
const orderItemIdFld = $("#orderItemIdFld");

const orderCart = [];
let item = null;
let orderTotal = 0;

$('#orderCustomerIdFld').on('keypress', function (e) {
    if (e.which === 13) {
        $("#orderCustomerIdFld").prop("disabled", true)
        if (/^cust\d{8}$/) {
            $.ajax({
                url: BASEURL + "/customers/" + $("#orderCustomerIdFld").val(),
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
            orderItemIdFld.prop("disabled", true)
            $.ajax({
                url: BASEURL + "/inventory/items/" + value.toLowerCase(),
                method: "GET",
                processData: false,
                contentType: false,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (res) {
                    item = res;
                    orderOptionFld.removeClass("hidden")
                    orderOptionFld.addClass("flex")
                },
                error: function (error) {
                    console.log(error);
                    orderItemIdFld.prop("disabled", false)
                    setInventoryAlertMessage("Item not found")
                }
            })
        }
    }
});


$("#addOrderBtn").click(function (e) {
    const size = $("#sizeSelectFld").val();
    const quantity = $("#quantityFld").val();
    const itemId = $("#orderItemIdFld").val();
    const description = item.description + ",Size-" + size;

    if (size.trim() === "" || quantity.trim() === "" || itemId.trim() === "") {

        $("#sizeSelectFld").addClass("border-2 border-red-500")
        $("#quantityFld").addClass("border-2 border-red-500")
        $("#orderItemIdFld").addClass("border-2 border-red-500")

        setInventoryAlertMessage("Please fill all fields")

    }
    const total = item.sellingPrice * quantity;
    orderTotal += total;

    const orderCartItem = {
        code: itemId,
        description: description,
        quantity: quantity,
        total: total
    };

    orderCart.push(orderCartItem);

    addToCartTable(orderCartItem);
    $("#orderTotalFld").text(orderTotal)
});

const addToCartTable = (orderCartItem) => {
    const table = $("#orderCartTable");
    table.append
    (
        `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light">
            <td class="m-1 p-2 uppercase">${orderCartItem.code}</td>
            <td class="m-1 p-2 capitalize">${orderCartItem.description}</td>
            <td>${orderCartItem.quantity}</td>
            <td>${orderCartItem.total}</td>
        </tr>`
    );
}