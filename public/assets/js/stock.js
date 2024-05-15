let stocksList = [];
const loadStockTable = () => {

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
                            <button value="${stock.stockId}" id="itemEditBtn" class="text-blue-600 font-bold m-1 p-1 hover:border-b-2 border-blue-600">Update</button>
                        </td>
            </tr>`
        )
    })
}
loadStockTable();