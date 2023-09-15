const pad = (n) => {
  const width = 11;
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

export const formatOrderNumber = (order) => {
  const converterArray = order.split(/(\d)/);
  let numString = '',
    otherString = '';
  converterArray.forEach((item) => {
    if (item !== '') {
      if (!isNaN(item)) {
        numString += item;
      } else {
        otherString = item;
      }
    }
  });
  const converterToNumber = pad(parseInt(numString) + 1);
  return `${otherString}${converterToNumber}`;
};
