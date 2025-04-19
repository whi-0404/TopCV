package com.TopCV.ultility;

public class Data {

    public static String getMessageBody(String otp, String name) {
        String htmlTemplate = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your OTP Code</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 30px;
      text-align: center;
    }
    .header {
      background-color: #28a745;
      color: white;
      padding: 20px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      font-size: 24px;
      font-weight: bold;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #28a745;
      margin: 20px 0;
    }
    .footer {
      font-size: 13px;
      color: #555;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Your OTP Code</div>
    <p>Hello, %s</p> <!-- Thêm name vào đây -->
    <p>We have received a request to verify your email address. Your OTP code is:</p>
    <div class="otp">%s</div>
    <p>This OTP code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    <p>Thank you for using our service!</p>
    <div class="footer">
      © 2025 Bao'Entertainment. All rights reserved.
    </div>
  </div>
</body>
</html>
""";

        return String.format(htmlTemplate, name, otp); // Chuyển name trước otp
    }
}
