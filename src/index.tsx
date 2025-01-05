import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ana uygulama bileşeninizin yolu
import "./index.css"; // Eğer global CSS kullanıyorsanız, buradan yükleyebilirsiniz

// Uygulamayı render etme
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
