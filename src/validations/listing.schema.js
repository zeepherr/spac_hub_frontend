import { z } from "zod";

export const createListingSchema = z.object({
  categoryId: z.coerce.number().int().positive("Please select a category"),

  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description must not exceed 3000 characters"),

  brand: z
    .string()
    .trim()
    .min(1, "Brand is required")
    .max(100, "Brand must not exceed 100 characters"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(150, "Model must not exceed 150 characters"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(150, "Location must not exceed 150 characters"),
});

// STEP 1
// POST /listings/identify-product
// Optional AI helper

// Input:
// image

// Output:
// title
// category
// brand
// model
// description

//         ↓

// STEP 2
// POST /listings

// Required:
// categoryId
// title
// description
// brand
// model
// price
// location

// Output:
// listingId + DRAFT

//         ↓

// STEP 3
// GET /listings/:listingId/condition-questions

// Output:
// dynamic questions

//         ↓

// STEP 4
// PATCH /listings/:listingId/condition-answers

// Body:
// {
//   answers: [
//     {
//       questionId,
//       answerValue
//     }
//   ]
// }

//         ↓

// STEP 5
// POST /listings/:listingId/images

// form-data:
// images

// 1–5 images

//         ↓

// STEP 6
// POST /listings/:listingId/analyze-condition

// No body

// Output:
// estimatedCondition
// estimatedScore
// summary

//         ↓

// STEP 7
// GET /listings/:listingId

// Preview

//         ↓

// STEP 8
// POST /listings/:listingId/publish

// No body

// DRAFT → ACTIVE
