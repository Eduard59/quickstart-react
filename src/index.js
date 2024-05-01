// Импорт файла стилей для глобального применения
import "./index.css";

// Импорт главного компонента приложения
import App from "./App";
// Импорт библиотеки React
import React from "react";
// Импорт библиотеки ReactDOM для управления DOM в браузере
import ReactDOM from "react-dom/client";

// Создание корневого элемента для приложения
const root = ReactDOM.createRoot(document.getElementById("root"));
// Рендеринг приложения в строгом режиме для выявления потенциальных проблем
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
