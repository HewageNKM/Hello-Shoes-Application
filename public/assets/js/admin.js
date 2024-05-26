let disabledItemsList = []

const itemTableBody = $("#deactivatedItemTableBody")
const loadTable = () => {
    $("#dItemsTableLoadingAnimation").removeClass("hidden")
    $.ajax({
        url: BASEURL + "/inventory/items?availability=false",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        method: "GET",
        success: function (res) {
            console.log(res)
            disabledItemsList = res
            setItemTableContent(disabledItemsList)
            $("#dItemsTableLoadingAnimation").addClass("hidden")
        },
        error: function (err) {
            $("#dItemsTableLoadingAnimation").addClass("hidden")
            console.log(err)
        }
    })
}
const setItemTableContent = (list) => {
    itemTableBody.empty()
    list.forEach((item,index) => {
        itemTableBody.append(
            `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light" id=${index}>
                <td class="uppercase m-1 p-2 ">${item.itemId}</td>
                <td class="capitalize m-1 p-2 ">${item.description}</td>
                 <td class="capitalize m-1 p-2"><button value="${item.itemId}" class="text-blue-500 font-bold hover:text-blue-600 hover:border-b-2 border-blue-500" id="itemActivateBtn">Activate</button></td>
            </tr>
            `
        )
    })
}
itemTableBody.on("click", "#itemActivateBtn", function (e) {
    const res = confirm("Are you sure you want to activate this item?");
    if (!res) {
        return
    }
    const itemId = e.target.value.toString().toLowerCase()

    console.log(itemId)
    $.ajax({
        url: BASEURL + "/inventory/items/activate/" + itemId,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        method: "PUT",
        success: function (res) {
            console.log(res)
            loadTable()
        },
        error: function (err) {
            console.log(err)
        }
    })
})
const setPopularItem = (res) => {
    $("#popularItemImg").attr("src", "data:image/jpeg;base64,"+res.image)
    $("#popularItemNameFld").val(res.description)
    $("#popularItemIdFld").val(res.itemId)
    $("#popularItemSellingPriceFld").val(res.sellingPrice)
};
const getPopularItem = (range) => {
    $.ajax({
        url: BASEURL + "/inventory/items/popular?range="+range,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        method: "GET",
        success: function (res) {
            console.log(res)
            setPopularItem(res)
        },
        error: function (err) {
            $("#popularItemImg").attr("src", "../assets/img/default_employee_avatar.png")
            $("#popularItemNameFld").val("")
            $("#popularItemIdFld").val("")
            $("#popularItemSellingPriceFld").val("")
            console.log(err)
        }
    })
};
$("#filterSelect").change(function (e) {
    getPopularItem(Number.parseInt(e.target.value))
});
$("#dItemsRefreshBtn").click(function (e) {
    loadTable()
})
getPopularItem(0)
const getDayOverView = () => {
    $.ajax({
        url: BASEURL + "/sales/overview",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        method: "GET",
        success: function (res) {
            console.log(res)
            $("#totalSaleFld").val(res.totalSales)
            $("#billCountFld").val(res.totalBills)
            $("#totalProfitFld").val(res.totalProfit)
        },
        error: function (err) {
            console.log(err)
        }
    })
};
getDayOverView()
loadTable()