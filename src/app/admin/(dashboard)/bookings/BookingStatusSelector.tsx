"use client";
import { StatusSelector } from "@/components/admin/StatusSelector";
import { bookingStatusSchema } from "@/types/domain";
import type { BookingStatus } from "@prisma/client";
export interface BookingStatusSelectorProps { bookingId: string; currentStatus: BookingStatus; }
export function BookingStatusSelector({ bookingId, currentStatus }: BookingStatusSelectorProps) {
  return <StatusSelector resource="bookings" id={bookingId} currentStatus={currentStatus} options={bookingStatusSchema.options} />;
}
