export function renderAuthFailed(errorMessage?: string): string {
  const message =
    errorMessage || "We couldn't verify your identity. Please try again.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authentication Failed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
      padding: 50px 40px;
      text-align: center;
    }
    
    .error-icon {
      font-size: 5rem;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #e74c3c;
      font-size: 2rem;
      margin-bottom: 15px;
      font-weight: 700;
    }
    
    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .btn {
      display: inline-block;
      padding: 15px 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
    }
    
    .details {
      background: #f8f9fa;
      border-left: 4px solid #e74c3c;
      padding: 15px;
      margin: 30px 0;
      border-radius: 5px;
      text-align: left;
    }
    
    .details h3 {
      color: #333;
      font-size: 0.9rem;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .details ul {
      color: #666;
      font-size: 0.85rem;
      list-style: none;
      padding-left: 0;
    }
    
    .details li {
      margin-bottom: 5px;
      padding-left: 20px;
      position: relative;
    }
    
    .details li:before {
      content: "•";
      position: absolute;
      left: 5px;
      color: #e74c3c;
    }
    
    @media (max-width: 768px) {
      .container { padding: 40px 25px; }
      h1 { font-size: 1.5rem; }
      p { font-size: 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-icon">🔒</div>
    <h1>Authentication Failed</h1>
    <p>${message}</p>
    
    <div class="details">
      <h3>Possible reasons:</h3>
      <ul>
        <li>Your email is not authorized to access this resource</li>
        <li>Authentication was cancelled</li>
        <li>Session expired or network error occurred</li>
      </ul>
    </div>
    
    <a href="/auth/google" class="btn">🔄 Try Again</a>
  </div>
</body>
</html>
  `;
}
