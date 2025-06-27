import Resident from '../Models/Residents.js';
import Room from '../Models/Room.js';
import Billing from '../Models/Billing.js';

export const generateMonthlyBillings = async () => {
  const residents = await Resident.find({ status: 'checked-in' }).populate('room');

  const generated = [];

  for (const res of residents) {
    const { room, _id } = res;
    if (!room) continue;

    const roomFee = room.pricePerMonth;
    const billing = new Billing({
      resident: _id,
      billingPeriodStart: new Date(),
      billingPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      roomFee,
      totalAmount: roomFee,
    });

    await billing.save();
    generated.push(billing);
  }

  return generated;
};
