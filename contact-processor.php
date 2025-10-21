<?php
// Function to log errors to a file without stopping the script.
function log_error($message) {
    $log_file = 'output/form_errors.log'; // Errors will be saved here.
    $timestamp = date('Y-m-d H:i:s');
    $log_message = "[$timestamp] " . $message . "\n";
    // Use FILE_APPEND to add to the file, and LOCK_EX to prevent issues.
    file_put_contents($log_file, $log_message, FILE_APPEND | LOCK_EX);
}

// 1. VERIFY THE SUBMISSION METHOD
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 2. RETRIEVE AND SANITIZE FORM DATA
    $name = htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject']), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8');
    $getPdf = isset($_POST['get_pdf']) ? 'Yes' : 'No';
    $date = date('Y-m-d H:i:s');

    // --- CSV WRITING LOGIC ---
    $csvFilePath = 'output/leads.csv';
    // Use @ to suppress fopen warnings, we will handle the error manually.
    $file = @fopen($csvFilePath, 'a');
    if ($file === false) {
        log_error("CRITICAL: Failed to open or create CSV file at: " . $csvFilePath);
    } else {
        // Add header if the file is new/empty
        if (filesize($csvFilePath) == 0) {
            $header = ['Submission Date', 'Name', 'Email', 'Subject', 'Message', 'Wants PDF Guide'];
            fputcsv($file, $header);
        }
        $data = [$date, $name, $email, $subject, $message, $getPdf];
        fputcsv($file, $data);
        fclose($file);
    }
    // --- END CSV LOGIC ---

    // --- EMAIL NOTIFICATION TO ADMIN ---
    $to_admin = 'info@costadelsolservices.es';
    $subject_admin = "New Contact Form Submission: " . $subject;
    $body_admin = "You have received a new message from your website contact form.\n\n" .
                  "Details:\n" .
                  "Name: $name\nEmail: $email\nSubject: $subject\nMessage:\n$message\n\n" .
                  "Wants PDF Guide: $getPdf\n";
    $headers_admin = "From: no-reply@costadelsolservices.es\r\n" . "Reply-To: $email\r\n" . "X-Mailer: PHP/" . phpversion();
    
    // Send email and log if it fails.
    if (!mail($to_admin, $subject_admin, $body_admin, $headers_admin)) {
        log_error("Failed to send admin notification email to " . $to_admin);
    }
    // --- END ADMIN EMAIL ---

    // --- EMAIL WITH PDF LINK TO USER ---
    if ($getPdf == 'Yes') {
        $to_user = $email;
        $subject_user = "Your Free Guide: The Funnel Technique";
        $pdf_link = "https://costadelsolservices.es/guides/the-funnel-technique.pdf";

        $body_user = "Hello " . $name . ",\n\n" .
                     "Thank you for your interest! As requested, here is the download link for your free guide:\n\n" .
                     $pdf_link . "\n\n" .
                     "Best regards,\n" .
                     "The Costa Del Sol Services Team";
        $headers_user = "From: info@costadelsolservices.es\r\n" . "X-Mailer: PHP/" . phpversion();

        // Send email and log if it fails.
        if (!mail($to_user, $subject_user, $body_user, $headers_user)) {
            log_error("Failed to send PDF guide email to " . $to_user);
        }
    }
    // --- END USER EMAIL ---

    // --- REDIRECT THE USER ---
    // This redirect will now happen even if the mail() functions fail, because errors are logged instead of halting the script.
    header('Location: thank-you.html');
    exit();

} else {
    // If it's not a POST request, block it.
    header("HTTP/1.1 405 Method Not Allowed");
    echo "Invalid request method.";
    exit();
}
?>

