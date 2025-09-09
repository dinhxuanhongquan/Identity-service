// Validation functions
export const validateUsername = (username: string): string | null => {
  if (!username || username.trim().length === 0) {
    return 'Username không được để trống';
  }
  
  if (username.length < 8 || username.length > 24) {
    return 'Username phải có 8-24 ký tự';
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username chỉ được chứa chữ cái, số và dấu gạch dưới';
  }
  
  if (!/[a-zA-Z]/.test(username)) {
    return 'Username phải chứa ít nhất 1 chữ cái';
  }
  
  if (!/[0-9]/.test(username)) {
    return 'Username phải chứa ít nhất 1 số';
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.trim().length === 0) {
    return 'Password không được để trống';
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(password)) {
    return 'Password chỉ được chứa chữ cái và số';
  }
  
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return 'Email không được để trống';
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Email không hợp lệ';
  }
  
  // Kiểm tra email ảo
  const fakeDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'temp-mail.org', 'throwaway.email',
    'getnada.com', 'maildrop.cc', 'sharklasers.com'
  ];
  
  const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
  if (fakeDomains.includes(domain)) {
    return 'Email không được sử dụng dịch vụ email tạm thời';
  }
  
  return null;
};

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name || name.trim().length === 0) {
    return `${fieldName} không được để trống`;
  }
  
  if (name.trim().length < 2) {
    return `${fieldName} phải có ít nhất 2 ký tự`;
  }
  
  return null;
};

export const validateDateOfBirth = (dob: string): string | null => {
  if (!dob) {
    return 'Ngày sinh không được để trống';
  }
  
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  if (age < 13) {
    return 'Bạn phải ít nhất 13 tuổi để đăng ký';
  }
  
  if (age > 120) {
    return 'Ngày sinh không hợp lệ';
  }
  
  return null;
};

export const validateVerificationCode = (code: string): string | null => {
  if (!code || code.trim().length === 0) {
    return 'Mã xác thực không được để trống';
  }
  
  if (!/^\d{6}$/.test(code)) {
    return 'Mã xác thực phải có 6 chữ số';
  }
  
  return null;
};
