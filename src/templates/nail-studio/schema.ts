import { z } from 'astro/zod';

const requiredText = z.string().refine((value) => value.trim().length > 0, { error: 'Must not be empty.' });
const imagePath = requiredText.refine((value) => value.startsWith('images/'), { error: 'Must start with "images/".' });
const localizedText = z.strictObject({ es: requiredText, en: requiredText });
const whatsappNumber = requiredText.refine((value) => value.replace(/\D/g, '').length >= 10, { error: 'Must contain at least 10 digits.' });

const navItemSchema = z.strictObject({ label: localizedText, href: requiredText });
const serviceSchema = z.strictObject({
    image: imagePath,
    imageAlt: localizedText,
    title: localizedText,
    price: localizedText,
    description: localizedText,
    whatsappText: requiredText,
    buttonLabel: localizedText
});
const galleryFilterSchema = z.strictObject({ key: requiredText, label: localizedText });
const galleryItemSchema = z.strictObject({
    image: imagePath,
    imageAlt: localizedText,
    category: requiredText,
    eyebrow: localizedText,
    title: localizedText,
    description: localizedText
});
const featureSchema = z.strictObject({ icon: requiredText, title: localizedText, description: localizedText });
const faqItemSchema = z.strictObject({ question: localizedText, answer: localizedText });
const reviewSchema = z.strictObject({
    rating: z.number().min(0).max(5),
    quote: localizedText,
    author: localizedText,
    label: localizedText.optional(),
    initials: requiredText.optional()
});

const nailStudioSchema = z.strictObject({
    demo: z.literal(true).optional(),
    studio: z.strictObject({
        name: requiredText,
        shortName: requiredText,
        category: localizedText,
        location: requiredText,
        region: requiredText,
        country: requiredText,
        area: requiredText,
        address: requiredText,
        whatsapp: whatsappNumber,
        phoneDisplay: requiredText,
        instagramHref: requiredText,
        instagramHandle: requiredText,
        mapHref: requiredText
    }),
    seo: z.strictObject({ title: localizedText, description: localizedText }),
    navbar: z.strictObject({
        items: z.array(navItemSchema).min(1),
        locationLabel: localizedText,
        ctaLabel: localizedText,
        whatsappText: requiredText,
        menuLabel: localizedText
    }),
    hero: z.strictObject({
        badge: localizedText,
        title: localizedText,
        description: localizedText,
        image: imagePath,
        imageAlt: localizedText,
        imageEyebrow: localizedText,
        imageTitle: localizedText,
        whatsappLabel: localizedText,
        whatsappText: requiredText,
        secondaryLabel: localizedText,
        secondaryHref: requiredText,
        metas: z.array(z.strictObject({ icon: requiredText, text: localizedText }))
    }),
    services: z.strictObject({
        eyebrow: localizedText,
        title: localizedText,
        description: localizedText,
        items: z.array(serviceSchema).min(1)
    }),
    gallery: z.strictObject({
        eyebrow: localizedText,
        title: localizedText,
        description: localizedText,
        filters: z.array(galleryFilterSchema).min(1),
        items: z.array(galleryItemSchema).min(1),
        instagramLabel: localizedText
    }),
    about: z.strictObject({
        image: imagePath,
        imageAlt: localizedText,
        imageBadge: localizedText,
        eyebrow: localizedText,
        title: localizedText,
        description: localizedText,
        features: z.array(featureSchema).min(1)
    }),
    reviews: z.strictObject({
        eyebrow: localizedText,
        title: localizedText,
        description: localizedText.optional(),
        items: z.array(reviewSchema)
    }).optional(),
    faq: z.strictObject({
        eyebrow: localizedText,
        title: localizedText,
        description: localizedText.optional(),
        items: z.array(faqItemSchema).min(1)
    }),
    contact: z.strictObject({
        eyebrow: localizedText,
        title: localizedText,
        locationLabel: localizedText,
        hoursLabel: localizedText,
        contactLabel: localizedText,
        parkingNote: localizedText,
        directionsLabel: localizedText,
        mapImage: imagePath,
        mapAlt: localizedText,
        mapEyebrow: localizedText,
        mapDescription: localizedText,
        mapBadge: localizedText,
        hours: z.array(z.strictObject({ days: localizedText, time: localizedText })).min(1)
    }),
    cta: z.strictObject({
        eyebrow: localizedText,
        title: localizedText,
        description: localizedText,
        buttonLabel: localizedText,
        whatsappText: requiredText
    }),
    footer: z.strictObject({
        description: localizedText,
        navigationTitle: localizedText,
        hoursTitle: localizedText,
        connectTitle: localizedText,
        whatsappLabel: localizedText,
        copyright: localizedText,
        demoNote: localizedText
    }),
    floatingWhatsapp: z.strictObject({ label: localizedText, ariaLabel: localizedText, whatsappText: requiredText })
});

export default nailStudioSchema;
