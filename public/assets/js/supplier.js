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

$("#addSupplierForm").submit(function (e) {
    e.preventDefault();
    let isField = true;
    const name = e.target.name.value.toString();
    const email = e.target.email.value.toString();
    const contact1 = e.target.contact1.value.toString();
    const contact2 = e.target.contact2.value.toString();
    const address = e.target.address.value.toString();
    if (!/^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(name)) {
        $("#supplierNameFld").addClass("border-2 border-red-500");
        isField = true;
    } else {
        $("#supplierNameFld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{10}$/.test(contact1)) {
        $("#supplierContact1Fld").addClass("border-2 border-red-500");
        isField = true;
    } else {
        $("#supplierContact1Fld").removeClass("border-2 border-red-500");
        isField = false;
    }

    if (!/^\d{10}$/.test(contact2)) {
        $("#supplierContact2Fld").addClass("border-2 border-red-500");
        isField = true;
    } else {
        $("#supplierContact2Fld").removeClass("border-2 border-red-500");
        isField = false;
    }

    if (address.trim().length < 5) {
        $("#supplierAddressFld").addClass("border-2 border-red-500");
        isField = true;
    } else {
        $("#supplierAddressFld").removeClass("border-2 border-red-500");
        isField = false;
    }

    if (isField) {
        return;
    }

    $("#supplierNameFld").removeClass("border-2 border-red-500");
    $("#supplierEmailFld").removeClass("border-2 border-red-500");
    $("#supplierContact1Fld").removeClass("border-2 border-red-500");
    $("#supplierContact2Fld").removeClass("border-2 border-red-500");
    $("#supplierAddressFld").removeClass("border-2 border-red-500");


    let supplier = {
        name: name,
        email: email,
        contact1: contact1,
        contact2: contact2,
        address: address
    }
    supplier = JSON.stringify(supplier);
    console.log(supplier);
})