// mock-shopee-api.ts
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
const app = express();
const port = 3002;
const ORDERS_FILE_PATH = path.join(__dirname, 'orders.json');
const PAGE_SIZE = 20; // Set the number of items per page
const ROUTE_PATH = path.join(__dirname, `./routes-config/orders.json`);
const anyEl = null;

let numberSpe = 0;
app.use(express.json());
// http://localhost:3002/orders?startDate=2024-02-06&endDate=2024-02-21
app.post('/auth/token', (req: Request, res: Response) => {
  // Simulate token retrieval
  res.json({ access_token: 'mock_access_token' });
});

app.get('/orders', (req: Request, res: Response) => {
  // Simulate fetching paginated order IDs
  const page = parseInt(req.query.page as string) || 1;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  if(anyEl) return anyEl;
  numberSpe++;
  fs.readFile(ROUTE_PATH, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading orders file' });
      return;
    }

    const allOrders = JSON.parse(data.toString());
    // Filter orders by date range
    const filteredOrders = allOrders.filter((order: any) => {
      const orderDate = new Date(order.createdDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return orderDate >= start && orderDate <= end;
    });

    const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const anyEl = {
      orders: paginatedOrders.map((order: any) => ({ orderId: order.orderId })),
      has_more: numberSpe == 3 ? false : true
    };
    res.json(anyEl);
  });
});


app.get('/orders/:orderId', (req: Request, res: Response) => {
  // Simulate fetching order details
  const { orderId } = req.params;
  fs.readFile(ROUTE_PATH, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading orders file' });
      return;
    }

    const allOrders = JSON.parse(data.toString());


    const orderDetail = allOrders.filter((order: any) => order.orderId === orderId);


    res.json(orderDetail);
  });
});

app.listen(port, () => {
  console.log(`Mock Shopee API running at http://localhost:${port}`);
});
