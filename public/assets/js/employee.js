$("#employeeA")
$("#showEmployeeAddForm").click(
    function () {
        $("#addEmployee").removeClass("hidden");
    }
);

$("#closeEmployeeAddForm").click(
    function () {
        $("#addEmployee").addClass("hidden");
        $(".employeeFld").val("");

        $("#employeeImgPreview").attr("src", "/assets/img/default_employee_avatar.png");
    }
);

$("#employeeImg").change(
    function () {
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

    const code = evt.target.code.value.toString();
    const name = evt.target.name.value.toString();
    const email = evt.target.email.value.toString();
    const contact = evt.target.contact.value.toString();
    const lane = evt.target.lane.value.toString();
    const city = evt.target.city.value.toString();
    const state = evt.target.state.value.toString();
    const status = evt.target.status.value.toString();
    const dob = evt.target.dob.value.toString();
    const doj = evt.target.doj.value.toString();
    const designation = evt.target.designation.value.toString();
    const gContact = evt.target.gContact.value.toString();
    const gName = evt.target.gName.value.toString();
    const gender = evt.target.gender.value.toString();
    const role = evt.target.role.value.toString();
    const zip = evt.target.zip.value.toString();
    const branch = evt.target.branch.value.toString();

    if (!/^(?! )[A-Za-z0-9 ]{3,50}$/.test(name)) {
        $("#employeeNameFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeNameFld").removeClass("border-2 border-red-500")
    }

    if (!/(?! )[A-Za-z0-9 ]{3,30}$/.test(lane)) {
        $("#employeeLaneFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeLaneFld").removeClass("border-2 border-red-500")
    }

    if (!/^(?! )[A-Za-z]{3,30}$/.test(city)) {
        $("#employeeCityFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeCityFld").removeClass("border-2 border-red-500")
    }

    if (!/^(?! )[A-Za-z ]{3,30}$/.test(state)) {
        $("#employeeStateFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeStateFld").removeClass("border-2 border-red-500")
    }

    if (!/^(?! )[A-Za-z ]{3,30}$/.test(designation)) {
        $("#employeeDesignationFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeDesignationFld").removeClass("border-2 border-red-500")
    }

    if (!/^(?! )[A-Za-z ]{3,30}$/.test(gName)) {
        $("#employeeGuardianNameFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeGuardianNameFld").removeClass("border-2 border-red-500")
    }

    if (!/^[0-9]{10,12}$/.test(contact)) {
        $("#employeeContactFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeContactFld").removeClass("border-2 border-red-500")
    }

    if (!/^[0-9]{10,12}$/.test(gContact)) {
        $("#employeeGuardianContactFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeGuardianContactFld").removeClass("border-2 border-red-500")
    }

    if (!/^[0-9]{3,30}$/.test(zip)) {
        $("#employeePostalCodeFld").addClass("border-2 border-red-500")
    } else {
        $("#employeePostalCodeFld").removeClass("border-2 border-red-500")
    }

    if (!/^(?! )[A-Za-z0-9]{3,30}$/.test(branch)) {
        $("#employeeBranchFld").addClass("border-2 border-red-500")
    } else {
        $("#employeeBranchFld").removeClass("border-2 border-red-500")
    }

    if (!/^(?! )[A-Za-z ]{3,30}$/.test(name) || !/^(?! )[A-Za-z0-9 ]{3,30}$/.test(lane) || !/^(?! )[A-Za-z]{3,30}$/.test(city) || !/^(?! )[A-Za-z ]{3,30}$/.test(state) || !/^(?! )[A-Za-z ]{3,30}$/.test(designation) || !/^(?! )[A-Za-z ]{3,30}$/.test(gName) || !/^[0-9]{10,12}$/.test(contact) || !/^[0-9]{10,12}$/.test(gContact) || !/^[0-9]{4,10}$/.test(zip) || !/^(?! )[A-Za-z0-9]{3,30}$/.test(branch)) {
        return
    }

    let data = {
        employeeId: code,
        name: name,
        email: email,
        contact: contact,
        lane: lane,
        city: city,
        state: state,
        postalCode: zip,
        status: status,
        dob: dob,
        doj: doj,
        designation: designation,
        guardianContact: gContact,
        guardianName: gName,
        gender: gender,
        role: role,
        attachBranch: branch,
    }

    const file = $("#employeeImg")[0].files[0];
    const formData = new FormData();

    data = JSON.stringify(data);
    console.log(data)

    formData.append('image', file);
    formData.append('dto', data);

    console.log(formData.get('image'))
    console.log(formData.get('dto'))

    $(".employeeFld").prop("disabled", true)
    $(".employeeFld").removeClass("hover:border-2")
    $("#btnLoadingAnimation").removeClass("hidden")
    $("#btnLoadingAnimation").addClass("flex")
    $.ajax({
        url: BASEURL + '/employees',
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            $(".employeeFld").prop("disabled", false)
            $(".employeeFld").addClass("hover:border-2")
            $("#btnLoadingAnimation").removeClass("flex")
            $("#btnLoadingAnimation").addClass("hidden")

            evt.target.reset();
            $("#addEmployee").addClass("hidden");
            $("#successDescription").text("Employee added successfully!");
            $("#success").removeClass("right-[-100%]")
            $("#success").addClass("right-[0]")
            setTimeout(() => {
                $("#success").removeClass("right-[0]")
                $("#success").addClass("right-[-100%]")
            }, 3000)
            console.log(response);
        },
        error: function (error) {
            console.log(error);
            let message = "Error adding employee!"
            if (error.responseJSON.message) {
                message = error.responseJSON.message;
            }
            $(".employeeFld").prop("disabled", false)
            $(".employeeFld").addClass("hover:border-2")
            $("#btnLoadingAnimation").removeClass("flex")
            $("#btnLoadingAnimation").addClass("hidden")

            $("#alertDescription").text(message);
            $("#alert").removeClass("right-[-100%]")
            $("#alert").addClass("right-[0]")
            setTimeout(() => {
                $("#alert").removeClass("right-[0]")
                $("#alert").addClass("right-[-100%]")
            }, 3000)
        }
    });

})
