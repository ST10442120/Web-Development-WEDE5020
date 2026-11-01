
// KABELO'S SHISANYAMA GRILL HOUSE
// ORDER FORM VALIDATION AND CONFIRMATION

document.addEventListener("DOMContentLoaded", () => {

    const orderForm = document.getElementById("orderForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const orderDetails = document.getElementById("orderDetails");
    const collectionTime = document.getElementById("collectionTime");
    const specialRequests = document.getElementById("specialRequests");

    const feedback = document.getElementById("orderFeedback");

    if (!orderForm || !feedback) {
        console.error("Order form elements could not be found.");
        return;
    }

    // Set the earliest collection time to the current time.
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    collectionTime.min = now.toISOString().slice(0, 16);

    // DISPLAY VALIDATION FEEDBACK
    function showError(input, message) {
        input.setCustomValidity(message);
        input.reportValidity();
    }

    function clearError(input) {
        input.setCustomValidity("");
    }

    // CLEAR ERRORS WHEN THE CUSTOMER EDITS A FIELD
    [nameInput, emailInput, phoneInput, orderDetails,
        collectionTime, specialRequests].forEach(input => {

        input.addEventListener("input", () => {
            clearError(input);
        });

    });

    // VALIDATE SOUTH AFRICAN OR INTERNATIONAL PHONE NUMBERS
    function validPhoneNumber(phone) {

        const cleanedPhone = phone.replace(/[\s()-]/g, "");

        return /^(\+27|0)[1-9]\d{8}$/.test(cleanedPhone);
    }

    // FORM SUBMISSION
    orderForm.addEventListener("submit", event => {

        event.preventDefault();

        feedback.hidden = true;
        feedback.textContent = "";

        // Clear previous validation errors
        [nameInput, emailInput, phoneInput, orderDetails,
            collectionTime].forEach(clearError);

        // Full name validation
        if (nameInput.value.trim().length < 3) {
            showError(nameInput, "Please enter your full name.");
            return;
        }

        // Email validation
        if (!emailInput.validity.valid) {
            showError(emailInput, "Please enter a valid email address.");
            return;
        }

        // Phone validation
        if (!validPhoneNumber(phoneInput.value.trim())) {
            showError(
                phoneInput,
                "Enter a valid South African or international phone number."
            );
            return;
        }

        // Order details validation
        if (orderDetails.value.trim().length < 5) {
            showError(
                orderDetails,
                "Please provide more details about your order."
            );
            return;
        }

        // Collection time validation
        if (collectionTime.value) {

            const selectedTime = new Date(collectionTime.value);

            if (selectedTime < new Date()) {
                showError(
                    collectionTime,
                    "Please select a future collection time."
                );
                return;
            }
        }

        // CREATE ORDER CONFIRMATION
        const orderSummary = `
ORDER DETAILS
------------------------------
Customer: ${nameInput.value.trim()}
Email: ${emailInput.value.trim()}
Phone: ${phoneInput.value.trim()}

Food Order:
${orderDetails.value.trim()}

Collection Time:
${collectionTime.value || "To be confirmed"}

Special Requests:
${specialRequests.value.trim() || "None"}

------------------------------
Kabelo's Shisanyama Grill House
        `.trim();

        // Display confirmation to the customer
        const heading = document.createElement("h3");
        heading.textContent = "Order Details Successfully Validated";

        const message = document.createElement("p");
        message.textContent =
            "Your order information is ready. This website demonstration has not sent your order to the restaurant.";

        const summary = document.createElement("pre");
        summary.textContent = orderSummary;

        feedback.replaceChildren(heading, message, summary);
        feedback.hidden = false;

        feedback.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        console.log("Order information validated:", orderSummary);

    });

    console.log("Order form JavaScript loaded successfully.");

});
