$("#showCustomerAddFormBtn").click(
    function () {
        $("#addCustomer").removeClass("hidden");
    }
);

$("#closeCustomerAddFormBtn").click(
    function () {
        $("#addCustomer").addClass("hidden");
    }
);
$("#alertCloseBtn").click(function () {
    const alert = $("#alert");
    alert.removeClass("right-0")
    alert.addClass("right-[-100%]")
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
    console.log(val);
})

$("#addCustomerForm").submit(function (e) {
    e.preventDefault();

    const name = e.target.name.value.toString();
    const email = e.target.email.value.toString();
    const contact = e.target.contact.value.toString();
    const address = e.target.address.value.toString();
    const dob = e.target.dob.value.toString();
    const nic = e.target.nic.value.toString();
    const points = e.target.points.value

    if (!/^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(name)) {
        $("#customerNameFld").addClass("border-2 border-red-500");
    } else {
        $("#customerNameFld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{10}$/.test(contact)) {
        $("#customerContactFld").addClass("border-2 border-red-500");
    } else {
        $("#customerContactFld").removeClass("border-2 border-red-500");
    }

    if (address.trim().length < 5) {
        $("#customerAddressFld").addClass("border-2 border-red-500");
    } else {
        $("#customerAddressFld").removeClass("border-2 border-red-500");
    }

    if (!/^(?:\d{9}[vVxX]|\d{12})$/.test(nic)) {
        $("#customerNicFld").addClass("border-2 border-red-500");
    } else {
        $("#customerNicFld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{10}$/.test(contact) || address.trim().length < 5 || !/^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(name) || !/^(?:\d{9}[vVxX]|\d{12})$/.test(nic)) {
        return;
    }

    let data = {
        name: name,
        email: email,
        contact: contact,
        address: address,
        dob: dob,
        nic: nic,
        points: points
    }
    data = JSON.stringify(data);

    console.log(data);
});
