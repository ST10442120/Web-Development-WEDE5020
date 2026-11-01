
document.addEventListener("DOMContentLoaded", function () {

    // Get the contact form and its elements
    const contactForm = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");
    const message = document.getElementById("message");
    const messageCounter = document.getElementById("messageCounter");

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const preference = document.getElementById("preference");
    const consent = document.querySelector(
        'input[name="consent"]'
    );

    // Stop if the form is not present
    if (!contactForm) return;

    // Update message character counter
    message.addEventListener("input", function () {

        const characterCount = message.value.length;

        messageCounter.textContent =
            `${characterCount} / 1000 characters`;

        if (characterCount >= 900) {
            messageCounter.classList.add("counter-warning");
        } else {
            messageCounter.classList.remove("counter-warning");
        }
    });

    // Display feedback messages
    function showFeedback(text, type) {

        feedback.textContent = text;
        feedback.className = `form-feedback ${type}`;
        feedback.hidden = false;
    }

    // Validate South African phone number if supplied
    function isValidPhoneNumber(value) {

        if (value.trim() === "") {
            return true; // Phone number is optional
        }

        const cleanedPhone = value.replace(/[\s()-]/g, "");

        return /^(\+27|0)[1-9]\d{8}$/.test(cleanedPhone);
    }

    // Contact form submission
    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        feedback.hidden = true;

        // Check required fields
        if (!contactForm.checkValidity()) {

            contactForm.reportValidity();

            showFeedback(
                "Please complete all required fields correctly.",
                "error"
            );

            return;
        }

        // Check name
        if (name.value.trim().length < 3) {

            name.focus();

            showFeedback(
                "Please enter a name containing at least 3 characters.",
                "error"
            );

            return;
        }

        // Check subject
        if (subject.value.trim().length < 3) {

            subject.focus();

            showFeedback(
                "Please enter a subject containing at least 3 characters.",
                "error"
            );

            return;
        }

        // Check message
        if (message.value.trim().length < 10) {

            message.focus();

            showFeedback(
                "Your message must contain at least 10 characters.",
                "error"
            );

            return;
        }

        // Check phone number if provided
        if (!isValidPhoneNumber(phone.value)) {

            phone.focus();

            showFeedback(
                "Please enter a valid South African phone number.",
                "error"
            );

            return;
        }

        // Check consent
        if (!consent.checked) {

            consent.focus();

            showFeedback(
                "Please agree to be contacted regarding your enquiry.",
                "error"
            );

            return;
        }

        // Create a demonstration enquiry summary
        const enquirySummary = `
            Contact enquiry demonstration

            Name: ${name.value.trim()}
            Email: ${email.value.trim()}
            Phone: ${phone.value.trim() || "Not provided"}
            Subject: ${subject.value.trim()}
            Preferred contact: ${preference.value}
            Message: ${message.value.trim()}
        `;

        console.log(enquirySummary);

        showFeedback(
            "Your form has passed validation. This is a demonstration only: your message has not been sent. A backend or form service is required to deliver it.",
            "success"
        );

    });

});
