const fs = require('fs');
const path = require('path');

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const generateOrder = (index) => {
  const createdDate = randomDate(new Date('2022-01-01'), new Date('2024-12-31'));
  // Ensure updatedDate is after createdDate
  const updatedDate = randomDate(new Date(createdDate), new Date('2024-12-31'));

  return {
    orderId: `order_${index}`,
    createdDate,
    updatedDate,
    orderDetails: {
      price: Math.floor(Math.random() * 1000),
      items: [`item_${Math.floor(Math.random() * 100)}`, `item_${Math.floor(Math.random() * 100)}`],
    },
  };
};

const generateOrders = (count) => {
  return Array.from({ length: count }, (_, index) => generateOrder(index + 1));
};

const saveOrdersToFile = (orders) => {
  const filePath = path.join(__dirname, 'orders.json');
  fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
    if (err) throw err;
    console.log(`Saved ${orders.length} orders to ${filePath}`);
  });
};

const orders = generateOrders(1000000);
saveOrdersToFile(orders);
