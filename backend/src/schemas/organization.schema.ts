import { z } from 'zod';
import { OrganizationStatus } from '../interfaces/organization.interface';

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    imageUrl: z.string().url().optional()
  })
});

export const updateOrganizationSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    imageUrl: z.string().url().optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
  })
});

export const updateOrganizationStatusSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    status: z.enum([OrganizationStatus.Active, OrganizationStatus.Inactive])
  })
});

export const addMemberSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    userId: z.string()
  })
}); 