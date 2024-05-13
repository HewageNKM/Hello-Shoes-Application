const role = window.localStorage.getItem("role");
console.log("Role: " + role)
console.log("Token: " + window.localStorage.getItem("token"))
const setUserAuthorization = () => {
    $("#adminBtn").addClass("hidden")
}

const setAdminAuthorization = () => {

}

if (role === "USER") {
    setUserAuthorization();
} else if (role === "ADMIN") {
    setAdminAuthorization();
} else {
    window.location.replace("/Unauthorized.html");
}
$("#logoutBtn").click(function (evt) {
    window.localStorage.clear();
    let countdown = 1;
    setInterval(() => {
        countdown--;
        if (countdown === 0) {
            window.location.replace("/");
        }
    }, 1000);
});

const navigationOnClick = (value) => {
    switch (value) {
        case "order":
            $("#orderSection").removeClass("hidden");

            $("#inventorySection").addClass("hidden");
            $("#employeeSection").addClass("hidden");
            $("#supplierSection").addClass("hidden");
            $("#customerSection").addClass("hidden");
            break;
        case "inventory":
            $("#inventorySection").removeClass("hidden");

            $("#orderSection").addClass("hidden");
            $("#employeeSection").addClass("hidden");
            $("#supplierSection").addClass("hidden");
            $("#customerSection").addClass("hidden");
            break;
        case "employee":
            $("#employeeSection").removeClass("hidden");

            $("#orderSection").addClass("hidden");
            $("#inventorySection").addClass("hidden");
            $("#supplierSection").addClass("hidden");
            $("#customerSection").addClass("hidden");
            break;
        case "supplier":
            $("#supplierSection").removeClass("hidden");

            $("#orderSection").addClass("hidden");
            $("#inventorySection").addClass("hidden");
            $("#employeeSection").addClass("hidden");
            $("#customerSection").addClass("hidden");
            break;
        case "customer":
            $("#customerSection").removeClass("hidden");

            $("#orderSection").addClass("hidden");
            $("#inventorySection").addClass("hidden");
            $("#employeeSection").addClass("hidden");
            $("#supplierSection").addClass("hidden");
            break;

        default:
            break;
    }
}