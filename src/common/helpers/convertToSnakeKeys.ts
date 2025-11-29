// Import hàm snakeCase từ thư viện change-case
// (đã được kiểm chứng là an toàn khi input là string)
import { snakeCase } from 'change-case';

/**
 * Hàm chuyển đổi keys của một đối tượng từ camelCase sang snake_case một cách đệ quy.
 * Hàm này an toàn và bỏ qua việc xử lý các giá trị không phải là object hoặc array.
 * @param data Đối tượng hoặc mảng cần chuyển đổi keys.
 * @returns Đối tượng/mảng đã được chuyển đổi keys.
 */
export const convertToSnakeKeys = (data: any): any => {
  if (data === null || typeof data !== 'object') {
    // Trả về giá trị nguyên thủy (primitive values) hoặc null
    return data;
  }

  if (Array.isArray(data)) {
    // Nếu là mảng, đệ quy xử lý từng phần tử
    return data.map(convertToSnakeKeys);
  }

  // Nếu là đối tượng, xử lý keys
  const newObj: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // 1. Chuyển đổi tên key
      const newKey = snakeCase(key);

      // 2. Đệ quy xử lý giá trị (để bắt các đối tượng lồng nhau)
      const value = data[key];
      newObj[newKey] = convertToSnakeKeys(value);
    }
  }

  return newObj;
};
