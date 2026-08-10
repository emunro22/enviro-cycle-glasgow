// Single source of truth for waste-type categories — used by the booking
// form checkboxes, the admin pricing page, and the quote calculation in
// app/api/bookings/route.ts. Keys are stable and stored in the DB, so don't
// rename them without a migration.

export type WasteCategory = {
  key: string;
  label: string;
};

export const WASTE_CATEGORIES: WasteCategory[] = [
  { key: "household", label: "Household" },
  { key: "garden", label: "Garden" },
  { key: "furniture", label: "Furniture" },
  { key: "rubble_soil", label: "Rubble/Soil" },
  { key: "bathroom", label: "Bathroom" },
  { key: "kitchen", label: "Kitchen" },
  { key: "shed", label: "Shed" },
  { key: "mixed_waste", label: "Mixed Waste" },
  { key: "other", label: "Other" },
];
