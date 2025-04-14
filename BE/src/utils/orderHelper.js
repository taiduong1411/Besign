const generateOrderCode = () => {
  // Tạo số ngẫu nhiên 6 chữ số
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `BS-${randomNumber}`;
};

module.exports = {
  generateOrderCode,
};
