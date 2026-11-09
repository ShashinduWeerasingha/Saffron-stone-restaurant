import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const body = req.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const date = String(body.date || "").trim();
  const time = String(body.time || "").trim();
  const guests = Number(body.guests);
  const notes = String(body.notes || "").trim().slice(0, 1000);

  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 || !phone || phone.length > 40 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].includes(time) ||
      !Number.isInteger(guests) || guests < 1 || guests > 8) {
    return res.status(400).json({ error: "Please check your details and try again." });
  }

  const requestedDate = new Date(date + "T00:00:00Z");
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (Number.isNaN(requestedDate.getTime()) || requestedDate < todayUTC) {
    return res.status(400).json({ error: "Please choose today or a future date." });
  }

  const { rows } = await db.query(
    "INSERT INTO reservations (name, email, phone, reservation_date, reservation_time, guests, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, status",
    [name, email, phone, date, time, guests, notes]
  );
  return res.status(201).json({ message: "Reservation request received.", reservation_id: rows[0].id, status: rows[0].status });
}