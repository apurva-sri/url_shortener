const verifyEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <body
        style="
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 30px;
        "
      >
        <div
          style="
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
          "
        >
          <h2>Verify Your Email</h2>

          <p>
            Thank you for registering.
          </p>

          <p>Your OTP is</p>

          <h1
            style="
              letter-spacing: 5px;
              color: #2563eb;
            "
          >
            ${otp}
          </h1>

          <p>
            This OTP will expire in
            <strong>5 minutes</strong>.
          </p>

          <hr>

          <small>
            If you didn't request this,
            please ignore this email.
          </small>
        </div>
      </body>
    </html>
  `;
};

module.exports = verifyEmailTemplate;
