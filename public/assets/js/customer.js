let customersList = [];

$("#showCustomerAddForm").click(
    function () {
        $("#addCustomer").removeClass("hidden");
    }
);

$("#closeCustomerAddForm").click(
    function () {
        $("#addCustomer").addClass("hidden");

        $("#customerCodeFld").val("");
        $("#customerNameFld").val("");
        $("#customerLaneFld").val("");
        $("#customerCityFld").val("");
        $("#customerStateFld").val("");
        $("#customerPostalCodeFld").val("");
        $("#customerContactFld").val("");
        $("#customerEmailFld").val("");
        $("#customerDojFld").val("");
        $("#customerLevelFld").val("");
        $("#customerPointsFld").val("");

    }
);

$("#alertCloseBtn").click(function () {
    const alert = $("#alert");
    alert.removeClass("right-0")
    alert.addClass("right-[-100%]")
})

$("#successCloseBtn").click(function () {
    const success = $("#success");
    success.removeClass("right-0")
    success.addClass("right-[-100%]")
})

$("#searchCustomerBtn").click(function () {
    const val = $("#customerSearchFld").val();
    const alert = $("#alert");
    if (val.trim() === "") {
        $("#alertDescription").text("Please enter a valid detail to search for customer");
        alert.removeClass("right-[-100%]")
        alert.addClass("right-0")

        setTimeout(() => {
            alert.addClass("right-[-100%]")
            alert.removeClass("right-0")
        }, 3000);

        return;
    }

    /*Ajax call to search for supplier*/
    $("#customerTableLoadingAnimation").removeClass("hidden")
    console.log(val);
    $.ajax({
        url: baseUrl + "/customers?pattern=" + val,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            console.log(response);
            customersList = response;
            $("#customerTableBody").empty();

            response.forEach(customer => {
                $("#customerTableBody").append(
                    `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light">
                        <td class="m-1 p-2">${customer.customerId.toUpperCase()}</td>
                        <td class="m-1 p-2 capitalize">${customer.name}</td>
                        <td class="m-1 p-2 capitalize">${customer.gender}</td>
                        <td class="m-1 p-2 capitalize">${customer.lane}</td>
                        <td class="m-1 p-2 capitalize">${customer.city}</td>
                        <td class="m-1 p-2 capitalize">${customer.state}</td>
                        <td class="m-1 p-2">${customer.postalCode}</td>
                        <td class="m-1 p-2">${customer.contact}</td>
                        <td class="m-1 p-2">${customer.email}</td>
                        <td class="m-1 p-2">${customer.doj}</td>
                        <td class="m-1 p-2">${customer.totalPoints}</td>
                        <td class="m-1 p-2">${customer.level}</td>
                        <td class="m-1 p-2">${customer.recentPurchaseDateAndTime.replace("T", " ").substring(0, 19)}</td>
                        
                        <td class="m-1 p-2">
                            <button value="${customer.id}" id="customerEditBtn" class="text-blue-600 font-bold m-1 p-1 hover:border-b-2 border-blue-600" id="editCustomerBtn">Edit</button>
                            <button value="${customer.id}" id="customerDeleteBtn" class="duration-300 text-red-600 font-bold m-1 p-1 hover:border-b-2 border-red-600" id="deleteCustomerBtn">Delete</button>
                        </td>
                    </tr>`
                );
            })
            $("#customerTableLoadingAnimation").addClass("hidden")
        },
        error: function (response) {
            console.log(response);
            $("#customerTableLoadingAnimation").addClass("hidden")

            const alert = $("#alert");
            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            $("#alertDescription").text("Error loading customers");
            setTimeout(() => {
                alert.addClass("right-[-100%]")
                alert.removeClass("right-0")
            }, 3000);
        }
    });
})

$("#addCustomerForm").submit(function (e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const contact = e.target.contact.value;
    const lane = e.target.lane.value;
    const state = e.target.state.value;
    const city = e.target.city.value;
    const zip = e.target.zip.value;
    const doj = e.target.doj.value;
    const gender = e.target.gender.value;

    const level = e.target.level.value;
    const points = e.target.points.value;

    if (!/^(?! )[A-Za-z0-9 ]{3,50}$/.test(name)) {
        $("#customerNameFld").addClass("border-2 border-red-500");
    } else {
        $("#customerNameFld").removeClass("border-2 border-red-500");
    }

    if (!/^[0-9]{10}$/.test(contact)) {
        $("#customerContactFld").addClass("border-2 border-red-500");
    } else {
        $("#customerContactFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z0-9 ]{3,50}$/.test(lane)) {
        $("#customerLaneFld").addClass("border-2 border-red-500");
    } else {
        $("#customerLaneFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z0-9 ]{3,50}$/.test(city)) {
        $("#customerCityFld").addClass("border-2 border-red-500");
    } else {
        $("#customerCityFld").removeClass("border-2 border-red-500");
    }

    if (!/^[0-9]{4,8}$/.test(zip)) {
        $("#customerPostalCodeFld").addClass("border-2 border-red-500");
    } else {
        $("#customerPostalCodeFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z0-9 ]{3,50}$/.test(state)) {
        $("#customerStateFld").addClass("border-2 border-red-500");
    } else {
        $("#customerStateFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z0-9 ]{3,50}$/.test(name) || !/^[0-9]{10}$/.test(contact) || !/^(?! )[A-Za-z0-9 ]{3,50}$/.test(lane) || !/^(?! )[A-Za-z0-9 ]{3,50}$/.test(city) || !/^[0-9]{4,8}$/.test(zip)) {
        return;
    }

    let data = {
        name: name,
        email: email,
        contact: contact,
        lane: lane,
        city: city,
        zip: zip,
        doj: doj,
        gender: gender,
        level: level,
        totalPoints: points,
        state: state,
        postalCode: zip
    }
    data = JSON.stringify(data);
    console.log(data);
    const successAlert = $("#success");
    const alert = $("#alert");

    $.ajax({
        url: baseUrl + "/customers",
        method: "POST",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        data: data,
        success: function (response) {
            console.log(response);
            e.target.reset();
            $("#addCustomer").addClass("hidden");
            $("#successDescription").text("Customer added successfully");
            successAlert.removeClass("right-[-100%]")
            successAlert.addClass("right-0")
            setTimeout(() => {
                successAlert.addClass("right-[-100%]")
                successAlert.removeClass("right-0")
            }, 3000);
        },
        error: function (response) {
            console.log(response);
            let errorAddingCustomer = "Error adding customer";
            if (response.responseJSON) {
                errorAddingCustomer = response.responseJSON.message;
            }
            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            $("#alertDescription").text(errorAddingCustomer);
            setTimeout(() => {
                alert.addClass("right-[-100%]")
                alert.removeClass("right-0")
            }, 3000);
        }
    });
});

const loadCustomerTable = () => {
    $("#customerTableLoadingAnimation").removeClass("hidden")
    $.ajax({
        url: baseUrl + "/customers",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            console.log(response);
            customersList.push(...response);
            $("#customerTableBody").empty();

            response.forEach(customer => {
                $("#customerTableBody").append(
                    `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light">
                        <td class="m-1 p-2">${customer.customerId.toUpperCase()}</td>
                        <td class="m-1 p-2 capitalize">${customer.name}</td>
                        <td class="m-1 p-2 capitalize">${customer.gender}</td>
                        <td class="m-1 p-2 capitalize">${customer.lane}</td>
                        <td class="m-1 p-2 capitalize">${customer.city}</td>
                        <td class="m-1 p-2 capitalize">${customer.state}</td>
                        <td class="m-1 p-2">${customer.postalCode}</td>
                        <td class="m-1 p-2">${customer.contact}</td>
                        <td class="m-1 p-2">${customer.email}</td>
                        <td class="m-1 p-2">${customer.doj}</td>
                        <td class="m-1 p-2">${customer.totalPoints}</td>
                        <td class="m-1 p-2">${customer.level}</td>
                        <td class="m-1 p-2">${customer.recentPurchaseDateAndTime.replace("T", " ").substring(0, 19)}</td>
                        
                        <td class="m-1 p-2">
                            <button value="${customer.id}" id="customerEditBtn" class="text-blue-600 font-bold m-1 p-1 hover:border-b-2 border-blue-600" id="editCustomerBtn">Edit</button>
                            <button value="${customer.id}" id="customerDeleteBtn" class="duration-300 text-red-600 font-bold m-1 p-1 hover:border-b-2 border-red-600" id="deleteCustomerBtn">Delete</button>
                        </td>
                    </tr>`
                );
            })
            $("#customerTableLoadingAnimation").addClass("hidden")
        },
        error: function (response) {
            console.log(response);
            $("#customerTableLoadingAnimation").addClass("hidden")

            const alert = $("#alert");
            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            $("#alertDescription").text("Error loading customers");
            setTimeout(() => {
                alert.addClass("right-[-100%]")
                alert.removeClass("right-0")
            }, 3000);
        }
    });
}
loadCustomerTable();