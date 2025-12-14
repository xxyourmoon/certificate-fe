import { z } from "zod";

export interface IPricingPackage {
  id: number;
  packageName: string;
  packageDescription: string;
  packagePrice: number;
  packageFeatures: {
    feature: string;
    icon: React.ReactNode;
  }[];
  packageStyle: string;
}

export interface IAdminContact {
  name: string;
  description: string;
  noTelp: number;
  igUsername: string | null;
  adminImage: string;
  cardStyle?: string;
  imageStyle?: string;
}

export interface IProfileCard {
  title: string;
  description: string;
  status: number | string;
  bgColor: string;
  icon?: string;
}

export const signInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const signUpFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const resetPasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
});

export const createEventSchema = z.object({
  eventName: z
    .string()
    .min(3, { message: "Event name must be at least 3 characters" })
    .max(100, { message: "Event name maximum 100 characters" }),
  eventDescription: z
    .string()
    .min(10, { message: "Description at least 10 characters" }),
  eventDate: z.string({
    message: "The event date is invalid",
  }),
  eventCertificatePrefixCode: z
    .string()
    .min(1, { message: "Prefix must be at least 1" })
    .refine((val) => val.endsWith("/") && !val.startsWith("/"), {
      message: "Prefixes must end with ‘/’ and not begin with '/'",
    }),
  eventCertificateSuffixCode: z
    .string()
    .refine((val) => val !== null, {
      message: "Suffix cannot be empty",
    })
    .refine(
      (val) => {
        const parsedNumber = Number(val);
        return !isNaN(parsedNumber) && parsedNumber > 0;
      },
      {
        message: "Suffix must be a positive number",
      },
    ),
  eventOrganizer: z
    .string()
    .min(2, { message: "Organizer Name of at least 2 characters" }),
  eventTheme: z.string().min(1, { message: "Event theme must not be empty" }),
  eventTemplate: z.enum(
    [
      "DEFAULTDESIGN",
      "TECHNOLOGYDESIGN_1",
      "TECHNOLOGYDESIGN_2",
      "TECHNOLOGYDESIGN_3",
      "FORMALDESIGN_1",
      "FORMALDESIGN_2",
      "FORMALDESIGN_3",
      "SEMNASTIDESIGN",
    ],
    {
      errorMap: () => ({ message: "Design template must not be empty" }),
    },
  ),
  eventStakeholderName: z
    .string()
    .min(2, { message: "Stakeholder name at least 2 characters" }),
  eventStakeholderPosition: z
    .string()
    .min(2, { message: "Position name of stakeholder at least 2 characters" }),
});

export const updateEventSchema = z
  .object({
    eventName: z
      .string()
      .min(3, { message: "Event name must be at least 3 characters" })
      .max(100, { message: "Event name maximum 100 characters" })
      .optional(),
    description: z
      .string()
      .min(10, { message: "Description at least 10 characters" })
      .optional(),
    activityAt: z.string({ message: "The event date is invalid" }).optional(),
    prefixCode: z
      .string()
      .min(1, { message: "Prefix must be at least 1" })
      .refine((val) => val.endsWith("/") && !val.startsWith("/"), {
        message: "Prefixes must end with ‘/’ and not begin with '/'",
      })
      .optional(),
    suffixCode: z
      .string()
      .refine((val) => val !== null, {
        message: "Suffix cannot be empty",
      })
      .refine(
        (val) => {
          const parsedNumber = Number(val);
          return !isNaN(parsedNumber) && parsedNumber > 0;
        },
        {
          message: "Suffix must be a positive number",
        },
      ),
    organizer: z
      .string()
      .min(2, { message: "Organizer Name of at least 2 characters" })
      .optional(),
    eventTheme: z
      .string()
      .min(1, { message: "Event theme must not be empty" })
      .optional(),
    eventTemplate: z
      .enum(
        [
          "DEFAULTDESIGN",
          "TECHNOLOGYDESIGN_1",
          "TECHNOLOGYDESIGN_2",
          "TECHNOLOGYDESIGN_3",
          "FORMALDESIGN_1",
          "FORMALDESIGN_2",
          "FORMALDESIGN_3",
          "SEMNASTIDESIGN",
        ],
        {
          errorMap: () => ({ message: "Design template must not be empty" }),
        },
      )
      .optional(),
  })
  .strict();

export const addParticipantSchema = z.object({
  name: z.string().min(1, { message: "Name must not be empty" }),
  email: z.string().email({ message: "Invalid email address" }),
  position: z.string().min(1, { message: "Position must not be empty" }),
});

export const updateParticipantSchema = z.object({
  name: z.string().min(1, { message: "Name must not be empty" }),
  email: z.string().email({ message: "Invalid email address" }),
  position: z.string().min(1, { message: "Position must not be empty" }),
});

export const multipleParticipantSchema = z.array(addParticipantSchema);

export const uploadParticipantByExcelSchema = z.object({
  file: z
    .any()
    .refine((files) => files instanceof FileList && files.length === 1, {
      message: "Please upload exactly one file.",
    })
    .refine(
      (files) =>
        files?.[0]?.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "File must be an Excel (.xlsx)" },
    )
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, {
      message: "File must be smaller than 10MB.",
    }),
});

const MAX_FILE_SIZE = 3 * 1024 * 1024; //FILE SIZE 3 MB ONLY CUY
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const uploadEventLogoFormSchema = z.object({
  firstLogo: z
    .any()
    .optional()
    .transform((val) =>
      val instanceof FileList && val.length > 0 ? val : null,
    )
    .refine(
      (files) => !files || (files instanceof FileList && files.length === 1),
      { message: "Please upload exactly one file." },
    )
    .refine((files) => !files || ACCEPTED_IMAGE_TYPES.includes(files[0].type), {
      message: "File must be an image (JPEG, JPG, PNG, or WEBP).",
    })
    .refine((files) => !files || files[0].size <= MAX_FILE_SIZE, {
      message: "File must be smaller than 3MB.",
    }),

  secondLogo: z
    .any()
    .optional()
    .transform((val) =>
      val instanceof FileList && val.length > 0 ? val : null,
    )
    .refine(
      (files) => !files || (files instanceof FileList && files.length === 1),
      { message: "Please upload exactly one file." },
    )
    .refine((files) => !files || ACCEPTED_IMAGE_TYPES.includes(files[0].type), {
      message: "File must be an image (JPEG, JPG, PNG, or WEBP).",
    })
    .refine((files) => !files || files[0].size <= MAX_FILE_SIZE, {
      message: "File must be smaller than 3MB.",
    }),
});

export const updateStakeholderSchema = z.object({
  eventStakeholderName: z
    .string()
    .min(2, { message: "Stakeholder name at least 2 characters" }),
  eventStakeholderPosition: z
    .string()
    .min(2, { message: "Position name of stakeholder at least 2 characters" }),
});

export const uploadStakeholderImageSchema = z.object({
  file: z
    .any()
    .refine((files) => files instanceof FileList && files.length === 1, {
      message: "Please upload exactly one file.",
    })
    .refine((files) => files?.[0]?.type.startsWith("image/"), {
      message: "File must be an image (e.g., png, jpg, jpeg, webp).",
    })
    .refine((files) => files?.[0]?.size <= 3 * 1024 * 1024, {
      message: "File must be smaller than 5MB.",
    }),
});

export const addAccountFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  roles: z.enum(["USER", "SUPERADMIN"], {
    errorMap: () => ({ message: "Role must not be empty" }),
  }),
  packagePremium: z.enum(["FREEPLAN", "SILVER", "PLATINUM", "GOLD"], {
    errorMap: () => ({ message: "Package must not be empty" }),
  }),
});

export const updownPackageFormSchema = z.object({
  premiumPackage: z.enum(["FREEPLAN", "SILVER", "PLATINUM", "GOLD"], {
    errorMap: () => ({ message: "Package must not be empty" }),
  }),
});
