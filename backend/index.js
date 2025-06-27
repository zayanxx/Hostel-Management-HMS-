// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// DB Connected Route
import connectDB from './DB Config/DB.Config.js';

// Importing Routes
import authRoutes from './Routes/authRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import residentRoutes from './Routes/residentRoutes.js';
import staffRoutes from './Routes/staffRoutes.js';
import attendanceRoutes from './Routes/attendanceRoutes.js';
import roomRoutes from './Routes/roomRoutes.js';
import suggestionRutes from './Routes/suggestionRoutes.js';
import complaintRoutes from './Routes/complaintRoutes.js';
import bookingRoutes from './Routes/bookingRoutes.js';
import maintenanceRoutes from './Routes/maintenanceRoutes.js';
import foodRoutes from './Routes/foodRoutes.js';
import foodOrderRoutes from './Routes/foodOrderRoutes.js';
import billingRoutes from './Routes/billingRoutes.js';
import invoiceRoutes from './Routes/invoiceRoutes.js';
import paymentRoutes from './Routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.send('Hostel Management API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resident', residentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/suggestion', suggestionRutes);
app.use('/api/complaint', complaintRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/foodOrder', foodOrderRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/payment', paymentRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
