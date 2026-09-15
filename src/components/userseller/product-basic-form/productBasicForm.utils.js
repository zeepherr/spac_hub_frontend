export const typeEffect = (text, callback, speed = 25) => {
  return new Promise((resolve) => {
    if (!text) return resolve();
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        callback(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
};

export const formatThb = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "-";
  }

  return `฿${amount.toLocaleString("th-TH")}`;
};
