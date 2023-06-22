
/**
 * Kiểm tra xem email được cung cấp có hợp lệ không.
 * @param {string} email - Email cần kiểm tra.
 * @returns {boolean} Trả về true nếu email hợp lệ, ngược lại trả về false.
 */
export function isValidEmail(email) {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x21\x23-\x5b\x5d-\x7f]|\\[\x21-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x21-\x5a\x53-\x7f]|\\[\x21-\x7f])+)\])/;
    return emailRegex.test(email);
}