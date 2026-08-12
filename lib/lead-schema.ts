import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  kindergarten: z.string().trim().min(2, "Укажите название сада").max(120),
  location: z.string().trim().min(2, "Укажите город и страну").max(120),
  openSpots: z.coerce.number().int().min(1, "Минимум одно место").max(300),
  contact: z.string().trim().min(5, "Укажите удобный контакт").max(160),
  consent: z.literal(true, { error: "Нужно согласие на обработку данных" }),
  website: z.string().max(200).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
