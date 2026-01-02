import { BoardConfig } from "../types";

interface User {
  displayName?: string;
  email?: string;
}

export function renderDashboard(
  user: User,
  boardConfigs: BoardConfig[],
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bull Board Dashboard</title>
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
      max-width: 800px;
      width: 100%;
      padding: 40px;
      animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .header h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .header .subtitle {
      color: #666;
      font-size: 1.1rem;
    }
    
    .user-info {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-avatar {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
    }
    
    .user-details h3 {
      font-size: 1.2rem;
      margin-bottom: 4px;
    }
    
    .user-details p {
      opacity: 0.9;
      font-size: 0.9rem;
    }
    
    .boards-section {
      margin-bottom: 30px;
    }
    
    .section-title {
      color: #333;
      font-size: 1.3rem;
      margin-bottom: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .boards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .board-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      padding: 25px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }
    
    .board-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      border-color: #667eea;
    }
    
    .board-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .board-name {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }
    
    .board-badge {
      display: inline-block;
      background: #ffd700;
      color: #333;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 8px;
    }
    
    .board-icon {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    
    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }
    
    .btn {
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .btn-secondary {
      background: #f5f7fa;
      color: #333;
      border: 2px solid #ddd;
    }
    
    .btn-secondary:hover {
      background: #e9ecef;
      border-color: #999;
    }
    
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .container { padding: 25px; }
      .header h1 { font-size: 2rem; }
      .boards-grid { grid-template-columns: 1fr; }
      .actions { flex-direction: column; }
      .btn { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Bull Board Dashboard</h1>
      <p class="subtitle">Manage your job queues efficiently</p>
    </div>
    
    <div class="user-info">
      <div class="user-avatar">
        ${user?.displayName?.charAt(0)?.toUpperCase() || "👤"}
      </div>
      <div class="user-details">
        <h3>${user?.displayName || "User"}</h3>
        <p>${user?.email || ""}</p>
      </div>
    </div>
    
    <div class="boards-section">
      <h2 class="section-title">📊 Available Boards</h2>
      <div class="boards-grid">
        ${boardConfigs
          .map(
            (cfg) => `
          <a href="${cfg.router}" class="board-card">
            <div class="board-icon">📈</div>
            <div class="board-name">${cfg.router}</div>
            ${
              cfg.readOnlyMode
                ? '<span class="board-badge">🔒 Read-Only</span>'
                : '<span class="board-badge" style="background: #4ade80;">✓ Full Access</span>'
            }
          </a>
        `,
          )
          .join("")}
      </div>
    </div>
    
    <div class="actions">
      <a href="/logout" class="btn btn-secondary">🚪 Logout</a>
    </div>
    
    <div class="footer">
      <p>Powered by Bull Board • ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
  `;
}
