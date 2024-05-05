let suppliers = [];
$("#showSupplierAddForm").click(
    function () {
        $("#addSupplier").removeClass("hidden");
    }
);

$("#closeSupplierAddForm").click(
    function () {
        $("#addSupplier").addClass("hidden");
    }
);

$("#searchSupplierBtn").click(function () {
    const val = $("#supplierSearchFld").val();
    const alert = $("#alert");
    if (val.trim() === "") {
        $("#alertDescription").text("Please enter a valid detail to search for supplier");
        alert.removeClass("right-[-100%]")
        alert.addClass("right-0")

        setTimeout(() => {
            alert.addClass("right-[-100%]")
            alert.removeClass("right-0")
        }, 3000);

        return;
    }
    /*Ajax call to search for supplier*/
    console.log(val);
})

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

$("#addSupplierForm").submit(function (e) {
    e.preventDefault();

    const id = e.target.code.value.toString();
    const name = e.target.name.value.toString();
    const email = e.target.email.value.toString();
    const contact1 = e.target.contact1.value.toString();
    const contact2 = e.target.contact2.value.toString();
    const lane = e.target.lane.value.toString();
    const city = e.target.city.value.toString();
    const state = e.target.state.value.toString();
    const country = e.target.country.value.toString();
    let zip = e.target.zip.value.toString()

    console.log(id);

    if (!/^(?! )[A-Za-z0-9 ]*$/.test(name)) {
        $("#supplierNameFld").addClass("border-2 border-red-500");
    } else {
        $("#supplierNameFld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{10}$/.test(contact1)) {
        $("#supplierContact1Fld").addClass("border-2 border-red-500");
    } else {
        $("#supplierContact1Fld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{10}$/.test(contact2)) {
        $("#supplierContact2Fld").addClass("border-2 border-red-500");
    } else {
        $("#supplierContact2Fld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z0-9 ]*$/.test(lane)) {
        $("#supplierLaneFld").addClass("border-2 border-red-500");
    } else {
        $("#supplierLaneFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z ]*$/.test(city)) {
        $("#supplierCityFld").addClass("border-2 border-red-500");
    } else {
        $("#supplierCityFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z ]*$/.test(state)) {
        $("#supplierStateFld").addClass("border-2 border-red-500");
    } else {
        $("#supplierStateFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?! )[A-Za-z ]*$/.test(country)) {
        $("#supplierCountryFld").addClass("border-2 border-red-500");
    } else {
        $("#supplierCountryFld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{4,10}$/.test(zip)) {
        $("#supplierPostalCodeFld").addClass("border-2 border-red-500");
    } else {
        $("#supplierZPostalCodeFld").removeClass("border-2 border-red-500");
    }
    if (!/^(?! )[A-Za-z0-9 ]*$/.test(name) || !/^\d{10}$/.test(contact1) || !/^\d{10}$/.test(contact2) || !/^(?! )[A-Za-z0-9 ]*$/.test(lane) || !/^(?! )[A-Za-z ]*$/.test(city) || !/^(?! )[A-Za-z ]*$/.test(state) || !/^(?! )[A-Za-z ]*$/.test(country) || !/^\d{4,10}$/.test(zip)) {
        return;
    }
    let supplier = {
        name: name,
        email: email,
        contactNo1: contact1,
        contactNo2: contact2,
        lane: lane,
        city: city,
        state: state,
        country: country,
        postalCode: zip
    }
    supplier = JSON.stringify(supplier);
    console.log(supplier);
    const alert = $("#alert");
    const successAlert = $("#success");
    if (id === null || id === "" || id === undefined) {
        $.ajax("http://localhost:8080/api/v1/suppliers", {
            method: "POST",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            data: supplier,
            success: function (data) {
                console.log(data);
                e.target.reset();
                loadTable();
                $("#addSupplier").addClass("hidden");
                $("#successDescription").text("Supplier added successfully");
                successAlert.removeClass("right-[-100%]")
                successAlert.addClass("right-0")

                setTimeout(() => {
                    successAlert.addClass("right-[-100%]")
                    successAlert.removeClass("right-0")
                }, 3000);
            },
            error: function (error) {
                console.log(error);
                alert.removeClass("right-[-100%]")
                alert.addClass("right-0")
                document.getElementById("alertDescription").textContent = "An error occurred while adding supplier";

                setTimeout(() => {
                    alert.addClass("right-[-100%]")
                    alert.removeClass("right-0")
                }, 3000);
            }
        });
    } else {
        $.ajax("http://localhost:8080/api/v1/suppliers/" + id.toLowerCase(), {
            method: "PUT",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            data: supplier,
            success: function (data) {
                console.log(data);
                e.target.reset();
                $("#addSupplier").addClass("hidden");
                loadTable();

                $("#successDescription").text("Supplier updated successfully");
                successAlert.removeClass("right-[-100%]")
                successAlert.addClass("right-0")

                setTimeout(() => {
                    successAlert.addClass("right-[-100%]")
                    successAlert.removeClass("right-0")
                }, 3000);
            },
            error: function (error) {
                console.log(error);

                alert.removeClass("right-[-100%]")
                alert.addClass("right-0")
                $("#alertDescription").text("An error occurred while updating supplier");

                setTimeout(() => {
                    alert.addClass("right-[-100%]")
                    alert.removeClass("right-0")
                }, 3000);
            }
        });
    }
})

const loadTable = () => {
    $.ajax("http://localhost:8080/api/v1/suppliers", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (data) {
            console.log(data);
            suppliers = data;
            const table = $("#supplierTableBody");
            table.empty();
            data.forEach(supplier => {
                table.append(
                    `<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-200 font-light""> 
                        <td class="m-1 p-2">${supplier.supplierId.toUpperCase()}</td>
                        <td class="m-1 p-2">${supplier.name}</td>
                        <td class="m-1 p-2">${supplier.lane}</td>
                        <td class="m-1 p-2">${supplier.city}</td>
                        <td class="m-1 p-2">${supplier.state}</td>
                        <td class="m-1 p-2">${supplier.postalCode}</td>
                        <td class="m-1 p-2">${supplier.country}</t>
                        <td class="m-1 p-2">${supplier.contactNo1}</td>
                        <td class="m-1 p-2">${supplier.contactNo2}</td>
                        <td class="m-1 p-2">${supplier.email}</td>
                        <td class="m-1 p-2">
                            <button value="${supplier.supplierId}" id="supplierEditBtn" class="text-blue-600 font-bold m-1 p-1 hover:border-b-2 border-blue-600" id="editSupplierBtn">Edit</button>
                            <button value="${supplier.supplierId}" id="supplierDeleteBtn" class="duration-300 text-red-600 font-bold m-1 p-1 hover:border-b-2 border-red-600" id="deleteSupplierBtn">Delete</button>
                        </td>
                    </tr>`
                )
            });
        },
        error: function (error) {
            const alert = $("#alert")
            console.log(error);
            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            document.getElementById("alertDescription").textContent = "An error occurred while fetching suppliers";

            setTimeout(() => {
                alert.addClass("right-[-100%]")
                alert.removeClass("right-0")
            }, 3000);
        }
    });
};
$([document]).on("click", "#supplierDeleteBtn", function (e) {
    const b = confirm("Are you sure you want to delete supplier");
    if (b) {
        $.ajax("http://localhost:8080/api/v1/suppliers/" + e.target.value, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (data) {
                console.log(data);
                loadTable();
                const success = $("#success");
                $("#successDescription").text("Supplier deleted successfully");
                success.removeClass("right-[-100%]")
                success.addClass("right-0")

                setTimeout(() => {
                    success.addClass("right-[-100%]")
                    success.removeClass("right-0")

                })
            },
            error: function (error) {
                console.log(error);
                const alert = $("#alert");
                alert.removeClass("right-[-100%]")
                alert.addClass("right-0")
                $("#alertDescription").text("An error occurred while deleting supplier");

                setTimeout(() => {
                    alert.addClass("right-[-100%]")
                    alert.removeClass("right-0")

                });
            }
        });
    }
});
$([document]).on("click", "#supplierEditBtn", function (e) {
    if (window.localStorage.getItem("role") === "USER") {
        $("#alert").removeClass("right-[-100%]")
        $("#alert").addClass("right-0")
        $("#alertDescription").text("You do not have permission to edit supplier")
        setTimeout(() => {
            $("#alert").addClass("right-[-100%]")
            $("#alert").removeClass("right-0")
        }, 3000);
        return
    }
    let supplier;
    suppliers.forEach(sup => {
        if (sup.supplierId === e.target.value) {
            console.log(sup.supplierId + " " + e.target.value);
            supplier = sup;
        }
    });
    if (supplier) {
        $("#supplierCodeFld").val(supplier.supplierId);
        $("#supplierNameFld").val(supplier.name);
        $("#supplierEmailFld").val(supplier.email);
        $("#supplierContact1Fld").val(supplier.contactNo1);
        $("#supplierContact2Fld").val(supplier.contactNo2);
        $("#supplierLaneFld").val(supplier.lane);
        $("#supplierCityFld").val(supplier.city);
        $("#supplierStateFld").val(supplier.state);
        $("#supplierCountryFld").val(supplier.country);
        $("#supplierPostalCodeFld").val(supplier.postalCode);
        $("#addSupplier").removeClass("hidden");
    }
})
loadTable()