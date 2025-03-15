import { z } from 'zod';

export const createProfileSchema = z.object({
  body: z.object({
    userId: z.string(),
    name: z.string().min(2).max(100),
    age: z.number().min(0).max(150).optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
    imageUrl: z.string().url().optional(),
    organizationId: z.string().optional()
  })
});

export const updateProfileSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    age: z.number().min(0).max(150).optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
  })
});

export const updateProfileImageSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    imageUrl: z.string().url()
  })
});

export const updateProfilePhoneSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/)
  })
});

export const updateProfileOrganizationSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    organizationId: z.string().nullable()
  })
}); 