// utils/index.js

// Экспорт переменной окружения для публичного ключа Vapi
export const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY;

// Экспорт функции для проверки ошибки, связанной с отсутствием публичного ключа
export const isPublicKeyMissingError = ({ vapiError }) => {
  // Возвращаем true, если vapiError существует, имеет статус код 403 и сообщение ошибки "Forbidden"
  return !!vapiError && vapiError.error.statusCode === 403 && vapiError.error.error === "Forbidden";
};
