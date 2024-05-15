const stockTableLoadingAnimation = $("#stockTableLoadingAnimation");
const stockSuccessMessage = $("#success");
const stockAlertMessage = $("#alert");

let stocksList = [];

$("#stockSearchBtn").click(function (e) {
    searchStocks()
})
$("#stocksRefreshBtn").click(function (e) {
    loadStockTable()
})
const searchStocks = () => {
    const value = $("#stockSearchFld").val();
    if (value === "") {
        setStockAlertMessage("Please enter a value to search")
        return;
    }
    stockTableLoadingAnimation.removeClass("hidden");
    stockTableLoadingAnimation.addClass("flex");
    $.ajax({
        url: BASEURL + "/inventory/items/stocks/filter/" + value,
        method: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            stocksList = res;
            stockTableLoadingAnimation.removeClass("flex");
            stockTableLoadingAnimation.addClass("hidden");
            setStockTableContent();
        },
        error: function (error) {
            console.log(error);
        }
    })
}
const loadStockTable = () => {
    stockTableLoadingAnimation.removeClass("hidden");
    stockTableLoadingAnimation.addClass("flex");
    $.ajax({
        url: BASEURL + "/inventory/items/stocks",
        method: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            stocksList = res;
            setStockTableContent();
            stockTableLoadingAnimation.removeClass("flex");
            stockTableLoadingAnimation.addClass("hidden");
        },
        error: function (error) {
            console.log(error);
        }
    })

}

const setStockTableContent = () => {
    $("#stockTableBody").empty();
    stocksList.forEach((stock) => {
        $("#stockTableBody").append(
            `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light" id="${stock.stockId}">
                        <td class="m-1 p-2 uppercase">${stock.stockId}</td>
                        <td class="m-1 p-2 uppercase">${stock.supplierId}</td>
                        <td class="m-1 p-2 capitalize">${stock.supplierName}</td>
                        <td class="m-1 p-2 uppercase">${stock.itemId}</td>
                        <td class="m-1 p-2 capitalize">${stock.description}</td>
                        <td class="m-1 p-2 "><input class="w-[5rem] bg-slate-100 p-2 rounded-md" type="number" value="${stock.size40}"></td>
                        <td class="m-1 p-2 "><input class="w-[5rem] bg-slate-100 p-2 rounded-md" type="number" value="${stock.size41}"></td>
                        <td class="m-1 p-2 "><input class="w-[5rem] bg-slate-100 p-2 rounded-md" type="number" value="${stock.size42}"></td>
                        <td class="m-1 p-2 "><input class="w-[5rem] bg-slate-100 p-2 rounded-md" type="number" value="${stock.size43}"></td>
                        <td class="m-1 p-2 "><input class="w-[5rem] bg-slate-100 p-2 rounded-md" type="number" value="${stock.size44}"></td>
                        <td class="m-1 p-2 "><input class="w-[5rem] bg-slate-100 p-2 rounded-md" type="number" value="${stock.size45}"></td>
                        <td class="m1- p-2">
                            <button value="${stock.stockId}" id="stockEditBtn" class="text-blue-600 font-bold m-1 p-1 hover:border-b-2 border-blue-600">Update</button>
                        </td>
            </tr>`
        )
    })
}
const setStockSuccessMessage = (message) => {
    $("#successDescription").text(message)
    stockSuccessMessage.removeClass("right-[-100]")
    stockSuccessMessage.addClass("right-[0]")
    setTimeout(() => {
        stockSuccessMessage.addClass("right-[-100]")
        stockSuccessMessage.removeClass("right-[0]")
    }, 5000)
}

const setStockAlertMessage = (message) => {
    $("#alertDescription").text(message)
    stockAlertMessage.removeClass("right-[-100]")
    stockAlertMessage.addClass("right-[0]")
    setTimeout(() => {
        stockAlertMessage.addClass("right-[-100]")
        stockAlertMessage.removeClass("right-[0]")
    }, 5000)
}
loadStockTable();