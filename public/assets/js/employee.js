$("#showEmployeeAddForm").click(
    function () {
        $("#addEmployee").removeClass("hidden");
    }
);

$("#closeEmployeeAddForm").click(
    function () {
        $("#addEmployee").addClass("hidden");
    }
);

$("#employeeImg").change(
    function() {
        console.log(this.files)
        if (this.files[0].size > 3 * 1024 * 1024) {
            alert("File size exceeds the limit of 3MB!");
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

$("#addEmployeeForm").submit(function (evt) {
    evt.preventDefault();

    const name = evt.target.name.value.toString();
    const email = evt.target.email.value.toString();
    const contact = evt.target.contact.value.toString();
    const emerContact = evt.target.emergencyContact.value.toString();
    const address = evt.target.address.value.toString();
    const designation = evt.target.designation.value.toString()
    const dob = evt.target.dob.value.toString();
    const doj = evt.target.doj.value.toString();

    if (!/^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(name)) {
        $("#employeeNameFld").addClass("border-2 border-red-500");
    } else {
        $("#employeeNameFld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{10}$/.test(contact)) {
        $("#employeeContactFld").addClass("border-2 border-red-500");
    } else {
        $("#employeeContactFld").removeClass("border-2 border-red-500");
    }

    if (address.trim().length < 5) {
        $("#employeeAddressFld").addClass("border-2 border-red-500");
    } else {
        $("#employeeAddressFld").removeClass("border-2 border-red-500");
    }

    if (!/^[A-Za-z]*$/.test(designation)) {
        $("#designationFld").addClass("border-2 border-red-500");
    } else {
        $("#designationFld").removeClass("border-2 border-red-500");
    }

    if (!/^\d{10}$/.test(emerContact)) {
        $("#employeeEmergencyContactFld").addClass("border-2 border-red-500");
    } else {
        $("#employeeEmergencyContactFld").removeClass("border-2 border-red-500");
    }

    if(!/^\d{10}$/.test(contact) || !/^\d{10}$/.test(emerContact) || address.trim().length < 5 || !/^(?! )[A-Za-z ]*$/.test(designation) || !/^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(name) || !/^\d{10}$/.test(contact)){
        return;
    }

    let data = {
        name: name,
        email: email,
        contact: contact,
        address: address,
        designation: designation,
        dob: dob,
        doj: doj
    }
    data = JSON.stringify(data);
    console.log(data);
    $.ajax({
        url: baseUrl+"/employees",
        type: "POST",
        data: data,
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            if (data.status === "success") {
                location.reload();
            }
        }
    });
})