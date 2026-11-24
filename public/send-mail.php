<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

function clean_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$offer = trim((string)($_POST['angebot'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'missing_fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'invalid_email']);
    exit;
}

$to = 'alex-scheidegger@tuta.com';
$subject = '=?UTF-8?B?' . base64_encode('Neue Anfrage über die Website – ' . $name) . '?=';

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeOffer = htmlspecialchars($offer !== '' ? $offer : 'Kein bestimmtes Angebot', ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$body = <<<HTML
<!doctype html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f2eee4;font-family:Arial,Helvetica,sans-serif;color:#2a2621;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2eee4;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fbf9f5;border:1px solid #ddd6c4;max-width:100%;">
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #e4dfd3;">
              <div style="font-family:Georgia,serif;font-size:22px;color:#201d19;">Neue Anfrage über die Website</div>
              <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a6a3c;margin-top:4px;">alex scheidegger photography</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#78725f;">Name</td></tr>
                <tr><td style="padding:0 0 20px;font-size:15px;color:#201d19;border-bottom:1px solid #e3ddcc;padding-bottom:14px;">{$safeName}</td></tr>
                <tr><td style="padding:16px 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#78725f;">E-Mail</td></tr>
                <tr><td style="padding:0 0 20px;font-size:15px;color:#201d19;border-bottom:1px solid #e3ddcc;padding-bottom:14px;">{$safeEmail}</td></tr>
                <tr><td style="padding:16px 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#78725f;">Angebot</td></tr>
                <tr><td style="padding:0 0 20px;font-size:15px;color:#8a6a3c;border-bottom:1px solid #e3ddcc;padding-bottom:14px;">{$safeOffer}</td></tr>
                <tr><td style="padding:16px 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#78725f;">Nachricht</td></tr>
                <tr><td style="padding:0;font-size:15px;line-height:1.7;color:#201d19;">{$safeMessage}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#f2eee4;font-size:12px;color:#8a8474;">Gesendet über das Kontaktformular auf der Website.</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Website <no-reply@alexscheidegger-photography.ch>',
    'Reply-To: ' . clean_header_value($name) . ' <' . clean_header_value($email) . '>',
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'mail_failed']);
}
