const inventoryBtnLoadingAnimation = $("#inventoryBtnLoadingAnimation")
const addInventoryBtn = $("#addInventoryBtn")
const iFld = $(".eFld")
const inventoryAlertMessage = $("#alert")
const inventorySuccessMessage = $("#success")
const inventoryTableLoadingAnimation = $("#inventoryTableLoadingAnimation")
let itemsList = []

$("#showInventoryAddForm").click(
    function () {
        if (window.localStorage.getItem("role") === "USER") {
            setCustomerAlertMessage("You do not have permission to add item")
            return
        }

        $("#addInventory").removeClass("hidden");
    }
);

$("#closeInventoryAddForm").click(
    function () {
        $("#addInventory").addClass("hidden");
        iFld.val("");
        $("#inventoryImgPreview").attr("src", "../assets/img/default_employee_avatar.png");
    }
);
$("#inventoryTableRefreshBtn").click(function () {
    loadItemsTable()
})
$("#inventorySearchBtn").click(function () {
    const inventorySearchFld = $("#inventorySearchFld")
    const value = inventorySearchFld.val().toString().trim()

    if (value.trim() === "") {
        setInventoryAlertMessage("Please enter a valid search value")
        return
    }
    inventoryTableLoadingAnimation.removeClass("hidden")
    inventoryTableLoadingAnimation.addClass("flex")

    $.ajax({
        url: BASEURL + "/inventory/items/filter/" + value,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token")
        },
        success: function (response) {
            console.log(response)
            itemsList = response
            setItemsTableContent()
            inventoryTableLoadingAnimation.removeClass("flex")
            inventoryTableLoadingAnimation.addClass("hidden")
        },
        error: function (error) {
            console.log(error)
            let message = "Error loading items!"
            if (error.responseJSON) {
                message = error.responseJSON.message
            }
            inventoryTableLoadingAnimation.removeClass("flex")
            inventoryTableLoadingAnimation.addClass("hidden")
            setInventoryAlertMessage(message)
        }
    })
})
$("#inventoryImg").change(
    function () {
        console.log(this.files)
        if (this.files[0].size > 3 * 1024 * 1024) {
            employeeAlertMessage("File size exceeds the limit of 3MB!");
            this.value = ""
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#employeeImgPreview')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(this.files[0]);
    }
)
$("#addInventoryForm").submit(function (e) {
    e.preventDefault()
    const name = e.target.name.value.toString().trim()
    const bPrice = e.target.bPrice.value.toString().trim()
    const sPrice = e.target.sPrice.value.toString().trim()
    const code = e.target.code.value.toString().trim()
    const image = e.target.image.files[0]
    const gender = e.target.gender.value.toString().trim()
    const occasion = e.target.occasion.value.toString().trim()
    const verity = e.target.verities.value.toString().trim()
    const sId = e.target.sId.value.toString().trim()

    if (!/^[a-zA-Z0-9\s]{1,50}$/.test(name)) {
        $("#inventoryNameFld").addClass("border-2 border-red-500")
    } else {
        $("#inventoryNameFld").removeClass("border-2 border-red-500")
    }

    if (!/^[0-9]{1,10}$/.test(bPrice)) {
        $("#buyingPriceFld").addClass("border-2 border-red-500")
    } else {
        $("#buyingPriceFld").removeClass("border-2 border-red-500")
    }

    if (!/^[0-9]{1,10}$/.test(sPrice)) {
        $("#sellingPriceFld").addClass("border-2 border-red-500")
    } else {
        $("#sellingPriceFld").removeClass("border-2 border-red-500")
    }

    if (!/^[a-zA-Z0-9\s]{1,50}$/.test(name) || !/^[0-9]{1,10}$/.test(bPrice) || !/^[0-9]{1,10}$/.test(sPrice)) {
        return
    }
    let data = {
        description: name,
        buyingPrice: bPrice,
        sellingPrice: sPrice,
        gender: gender,
        occasion: occasion,
        verities: verity,
        supplierId: sId
    }

    data = JSON.stringify(data)

    const formData = new FormData()

    formData.append("dto", data)
    formData.append("image", image)
    console.log(data)

    iFld.prop("disabled", true)
    iFld.removeClass("hover:border-2")
    inventoryBtnLoadingAnimation.removeClass("hidden")
    inventoryBtnLoadingAnimation.addClass("flex")
    addInventoryBtn.addClass("cursor-not-allowed")

    if (code.trim() === "") {
        $.ajax({
            url: BASEURL + "/inventory/items",
            method: "POST",
            contentType: false,
            processData: false,
            headers: {
                "Authorization": "Bearer " + window.localStorage.getItem("token")
            },
            data: formData,
            success: function (response) {
                console.log(response)
                loadItemsTable()
                e.target.reset()
                inventoryBtnLoadingAnimation.removeClass("flex")
                inventoryBtnLoadingAnimation.addClass("hidden")
                iFld.prop("disabled", false)
                iFld.addClass("hover:border-2")
                addInventoryBtn.removeClass("cursor-not-allowed")
                setInventorySuccessMessage("Item added to Inventory successfully")
            },
            error: function (error) {
                console.log(error)
                let message = "Error adding Item to inventory!"
                if (error.responseJSON) {
                    message = error.responseJSON.message
                }
                inventoryBtnLoadingAnimation.removeClass("flex")
                inventoryBtnLoadingAnimation.addClass("hidden")
                iFld.prop("disabled", false)
                iFld.addClass("hover:border-2")
                addInventoryBtn.removeClass("cursor-not-allowed")
                setInventoryAlertMessage(message)
            }
        })

    } else {
        $.ajax({
            url: BASEURL + "/inventory/items/" + code.toLowerCase(),
            method: "PUT",
            contentType: false,
            processData: false,
            headers: {
                "Authorization": "Bearer " + window.localStorage.getItem("token")
            },
            data: formData,
            success: function (response) {
                console.log(response)
                loadItemsTable()
                e.target.reset()
                inventoryBtnLoadingAnimation.removeClass("flex")
                inventoryBtnLoadingAnimation.addClass("hidden")
                iFld.prop("disabled", false)
                iFld.addClass("hover:border-2")
                addInventoryBtn.removeClass("cursor-not-allowed")
                setInventorySuccessMessage("Item updated successfully")
                loadItemsTable()
            },
            error: function (error) {
                console.log(error)
                let message = "Error updating Item!"
                if (error.responseJSON) {
                    message = error.responseJSON.message
                }
                inventoryBtnLoadingAnimation.removeClass("flex")
                inventoryBtnLoadingAnimation.addClass("hidden")
                iFld.prop("disabled", false)
                iFld.addClass("hover:border-2")
                addInventoryBtn.removeClass("cursor-not-allowed")
                setInventoryAlertMessage(message)
            }
        })
    }
})
const loadItemsTable = () => {
    inventoryTableLoadingAnimation.removeClass("hidden")
    inventoryTableLoadingAnimation.addClass("flex")
    $.ajax({
        url: BASEURL + "/inventory/items",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token")
        },
        success: function (response) {
            console.log(response)
            itemsList = response
            setItemsTableContent()
            inventoryTableLoadingAnimation.removeClass("flex")
            inventoryTableLoadingAnimation.addClass("hidden")
        },
        error: function (error) {
            console.log(error)
            let message = "Error loading items!"
            if (error.responseJSON) {
                message = error.responseJSON.message
            }
            inventoryTableLoadingAnimation.removeClass("flex")
            inventoryTableLoadingAnimation.addClass("hidden")
            setInventoryAlertMessage(message)
        }
    })
}
const setItemsTableContent = () => {
    $("#inventoryTableBody").empty()
    itemsList.forEach(item => {
        $("#inventoryTableBody").append(
            `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light" id="${item.itemId}">
                        <td class="m-1 p-2 uppercase">${item.itemId}</td>
                        <td class="m-1 p-2 capitalize">${item.description}</td>
                        <td class="m-1 p-2 capitalize">${item.category}</td>
                        <td class="m-1 p-2 ">${item.buyingPrice}</td>
                        <td class="m-1 p-2 ">${item.sellingPrice}</td>
                        <td class="m-1 p-2 ">${item.expectedProfit}</td>
                        <td class="m-1 p-2 ">${item.profitMargin}</td>
                        <td class="m-1 p-2 ">${item.quantity}</td>
                        <td class="m-1 p-2 uppercase">${item.supplierId}</td>
                        <td class="m-1 p-2 capitalize">${item.supplierName}</td>
                        <td class="m1- p-2">
                            <button value="${item.itemId}" id="itemEditBtn" class="text-blue-600 font-bold m-1 p-1 hover:border-b-2 border-blue-600">Edit</button>
                            <button value="${item.itemId}" id="itemDeleteBtn" class="duration-300 text-red-600 font-bold m-1 p-1 hover:border-b-2 border-red-600">Delete</button>
                        </td>
            </tr>`
        )
        if (item.quantity < 10) {
            $(`#${item.itemId}`).removeClass("odd:bg-white even:bg-gray-50 hover:bg-blue-200")
            $(`#${item.itemId}`).addClass("bg-red-200 hover:bg-red-300")
        }
    })
};

$([document]).on("click", "#itemEditBtn", function (e) {
    if (window.localStorage.getItem("role") === "USER") {
        setCustomerAlertMessage("You do not have permission to edit item")
        return
    }
    const item = itemsList.find(item => item.itemId === e.target.value)
    console.log(item)
    const [occasions, verities, gender] = item.category.split("/")
    $("#addInventory").removeClass("hidden")
    $("#inventoryNameFld").val(item.description)
    $("#buyingPriceFld").val(item.buyingPrice)
    $("#sellingPriceFld").val(item.sellingPrice)
    $("#inventoryImgPreview").attr("src", "data:image/jpeg;base64," + item.image)
    $("#inventoryImg").val("")
    $("#inventoryGenderSelect").val(gender.toUpperCase())
    $("#inventoryOccasionFld").val(occasions.toUpperCase())
    $("#inventoryVeritiesFld").val(verities.toUpperCase())
    $("#inventorySupplierIDFld").val(item.supplierId)
    $("#inventorySupplierNameFld").val(item.supplierName)
    $("#inventoryCodeFld").val(item.itemId)
    $("#expectedProfitFld").val(item.expectedProfit)
    $("#pMarginFld").val(item.profitMargin)


})

$([document]).on("click", "#itemDeleteBtn", function (e) {
    if (window.localStorage.getItem("role") === "USER") {
        setCustomerAlertMessage("You do not have permission to delete item")
        return
    }
    $.ajax({
        url: BASEURL + "/inventory/items/" + e.target.value,
        contentType: false,
        processData: false,
        header: {
            "Authorization": "Bearer " + window.localStorage.getItem("token")

        },
        method: "DELETE",
        success: function (response) {
            console.log(response)
            setInventorySuccessMessage("Item deleted successfully")
            loadItemsTable()
        },
        error: function (error) {
            console.log(error)
            let message = "Error deleting item!"
            if (error.responseJSON) {
                message = error.responseJSON.message
            }
            setInventoryAlertMessage(message)
        }
    })
})

const setInventorySuccessMessage = (message) => {
    $("#successDescription").text(message)
    inventorySuccessMessage.removeClass("right-[-100]")
    inventorySuccessMessage.addClass("right-[0]")
    setTimeout(() => {
        inventorySuccessMessage.addClass("right-[-100]")
        inventorySuccessMessage.removeClass("right-[0]")
    }, 5000)
}

const setInventoryAlertMessage = (message) => {
    $("#alertDescription").text(message)
    inventoryAlertMessage.removeClass("right-[-100]")
    inventoryAlertMessage.addClass("right-[0]")
    setTimeout(() => {
        inventoryAlertMessage.addClass("right-[-100]")
        inventoryAlertMessage.removeClass("right-[0]")
    }, 5000)
}
$("#sellingPriceFld").keyup(function (e) {
    calculateValues()
})
$("#buyingPriceFld").keyup(function (e) {
    calculateValues()
})
const calculateValues = (evt) => {
    console.log("Calculating")
    const bPrice = $("#buyingPriceFld").val()
    const sPrice = $("#sellingPriceFld").val()
    const eProfit = sPrice - bPrice
    const pMargin = (eProfit / bPrice) * 100
    $("#expectedProfitFld").val(eProfit)
    $("#pMarginFld").val(pMargin.toFixed(2))
}

$('#inventorySupplierFindBtn').click(function (e) {

    const value = $("#inventorySupplierIDFld").val().toString().toLowerCase();
    if (!/^sup\d{8}$/.test(value)) {
        setInventoryAlertMessage("Please enter a valid supplier ID")
        return
    }

    $.ajax({
        url: BASEURL + "/suppliers/" + value,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token")
        },
        success: function (response) {
            console.log(response)
            $("#inventorySupplierNameFld").val(response.name)
        },
        error: function (error) {
            console.log(error)
            let message = "Error loading supplier!"
            if (error.responseJSON) {
                message = error.responseJSON.message
            }
            setInventoryAlertMessage(message)
        }
    })
});
loadItemsTable()