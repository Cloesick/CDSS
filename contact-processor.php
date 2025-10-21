<?php
// This script processes the contact form submission, saves it to a CSV file, and sends email notifications.

// 1. VERIFY THE SUBMISSION
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 2. RETRIEVE AND SANITIZE FORM DATA
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = filter_var(trim($_POST['subject']), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);
    $getPdf = isset($_POST['get_pdf']) ? 'Yes' : 'No';
    $date = date('Y-m-d H:i:s');

    // --- EMAIL NOTIFICATION TO ADMIN ---
    $to_admin = 'info@costadelsolservices.es';
    $subject_admin = "New Contact Form Submission: " . $subject;
    $body_admin = "You have received a new message from your website contact form.\n\n" .
                  "Here are the details:\n\n" .
                  "Name: $name\n" .
                  "Email: $email\n" .
                  "Subject: $subject\n" .
                  "Message:\n$message\n\n" .
                  "Wants PDF Guide: $getPdf\n";
    $headers_admin = "From: no-reply@costadelsolservices.es\r\n" . "Reply-To: $email\r\n";
    @mail($to_admin, $subject_admin, $body_admin, $headers_admin);
    // --- END ADMIN EMAIL ---


    // --- NEW: EMAIL WITH PDF LINK TO USER ---
    // Check if the user checked the box to receive the PDF.
    if ($getPdf == 'Yes') {
        $to_user = $email;
        $subject_user = "Your Free Guide: The Funnel Technique";
        $pdf_link = "https://costadelsolservices.es/guides/the-funnel-technique.pdf"; // Make sure this URL is correct

        $body_user = "Hello " . $name . ",\n\n" .
                     "Thank you for your interest! As requested, here is the download link for your free guide:\n\n" .
                     $pdf_link . "\n\n" .
                     "If you have any questions, feel free to reply to this email.\n\n" .
                     "Best regards,\n" .
                     "The Costa Del Sol Services Team";

        $headers_user = "From: info@costadelsolservices.es\r\n";

        // Send the email to the user.
        @mail($to_user, $subject_user, $body_user, $headers_user);
    }
    // --- END USER EMAIL ---


    // --- CSV WRITING LOGIC ---
    $csvFilePath = 'output/leads.csv';
    $directory = 'output';
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
    $data = [$date, $name, $email, $subject, $message, $getPdf];
    $file = fopen($csvFilePath, 'a');
    if (filesize($csvFilePath) == 0) {
        $header = ['Submission Date', 'Name', 'Email', 'Subject', 'Message', 'Wants PDF Guide'];
        fputcsv($file, $header);
    }
    fputcsv($file, $data);
    fclose($file);
    // --- END CSV LOGIC ---

    // 8. REDIRECT THE USER
    header('Location: thank-you.html');
    exit();

} else {
    echo "Invalid request method.";
}
?>