let disabledItemsList = []

const itemTableBody = $("#deactivatedItemTableBody")
const loadTable = () => {
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
        },
        error: function (err) {
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
    const itemIndex = e.target.value
    const item = disabledItemsList[itemIndex]
    console.log(item)
    $.ajax({
        url: BASEURL + "/inventory/items/activate/" + item.itemId,
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

};
const getPopularItem = (filter) => {
    $.ajax({
        url: BASEURL + "/inventory/items/popular?filter="+filter,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        method: "GET",
        success: function (res) {
            console.log(res)
            setPopularItem(res)
        },
        error: function (err) {
            console.log(err)
        }
    })
};
getPopularItem(0)
loadTable()