import { z } from 'astro/zod';

const requiredText = z.string().refine((value) => value.trim().length > 0, { error: 'Must not be empty.' });
const imagePath = requiredText.refine((value) => value.startsWith('images/'), { error: 'Must start with "images/".' });
const localizedText = z.strictObject({
    es: requiredText,
    en: requiredText
});
const whatsappNumber = requiredText.refine((value) => value.replace(/\D/g, '').length >= 10, { error: 'Must contain at least 10 digits.' });

const featureSchema = z.strictObject({
    icon: requiredText,
    text: localizedText
});

const roomSchema = z.strictObject({
    image: imagePath,
    imageAlt: localizedText,
    label: localizedText.optional(),
    guests: localizedText,
    beds: localizedText,
    title: localizedText,
    description: localizedText,
    whatsappText: requiredText,
    features: z.array(featureSchema),
    buttonLabel: localizedText.optional(),
    guestIcon: requiredText.optional(),
    bedIcon: requiredText.optional()
});

const amenitySchema = z.strictObject({
    icon: requiredText,
    title: localizedText,
    description: localizedText
});

const galleryImageSchema = z.strictObject({
    image: imagePath,
    imageAlt: localizedText,
    caption: localizedText
});

const statSchema = z.strictObject({
    icon: requiredText,
    title: localizedText,
    description: localizedText
});

const hotelSchema = z.strictObject({
    demo: z.literal(true).optional(),
    hotel: z.strictObject({
        name: requiredText,
        location: requiredText,
        region: requiredText,
        address: requiredText,
        roomCount: z.number().int().positive(),
        rnt: requiredText.optional(),
        whatsapp: whatsappNumber
    }),
    seo: z.strictObject({
        title: localizedText,
        description: localizedText
    }).optional(),
    navbar: z.strictObject({
        whatsappText: requiredText.optional()
    }).optional(),
    googleRating: z.strictObject({
        value: z.number().min(0).max(5),
        reviewCount: z.number().int().min(0),
        description: localizedText.optional(),
        eyebrow: localizedText.optional(),
        stats: z.array(statSchema).optional()
    }).optional(),
    hero: z.strictObject({
        title: localizedText,
        description: localizedText,
        image: imagePath,
        imageAlt: localizedText,
        imageEyebrow: localizedText,
        imageTitle: localizedText,
        whatsappText: requiredText,
        whatsappLabel: localizedText.optional(),
        secondaryHref: requiredText.optional(),
        secondaryLabel: localizedText.optional(),
        availabilityLabel: localizedText.optional(),
        metas: z.array(z.strictObject({
            icon: requiredText,
            text: localizedText
        })).optional(),
        floatingCard: z.strictObject({
            icon: requiredText,
            title: localizedText,
            description: localizedText
        }).optional()
    }),
    intro: z.strictObject({
        eyebrow: localizedText,
        eyebrowIcon: requiredText.optional(),
        title: localizedText,
        description: localizedText,
        paragraphs: z.array(localizedText).optional()
    }).optional(),
    rooms: z.strictObject({
        eyebrow: localizedText.optional(),
        title: localizedText.optional(),
        description: localizedText.optional(),
        rooms: z.array(roomSchema)
    }),
    amenities: z.strictObject({
        eyebrow: localizedText.optional(),
        title: localizedText.optional(),
        description: localizedText.optional(),
        amenities: z.array(amenitySchema)
    }),
    gallery: z.strictObject({
        eyebrow: localizedText.optional(),
        title: localizedText.optional(),
        description: localizedText.optional(),
        images: z.array(galleryImageSchema)
    }),
    location: z.strictObject({
        eyebrow: localizedText.optional(),
        title: localizedText.optional(),
        description: localizedText.optional(),
        arrivalTitle: localizedText.optional(),
        arrivalDescription: localizedText.optional(),
        whatsappText: requiredText,
        whatsappLabel: localizedText.optional(),
        mapImage: imagePath,
        mapAlt: localizedText.optional(),
        mapNote: localizedText.optional()
    }),
    contact: z.strictObject({
        whatsappText: requiredText
    })
});

export default hotelSchema;
