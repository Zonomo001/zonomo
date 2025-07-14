export const SERVICE_CATEGORIES = [
  {
    label: 'Cleaning Services',
    value: 'cleaning' as const,
    featured: [
      {
        name: 'House Cleaning',
        href: `/services?category=cleaning`,
        imageSrc: '/nav/services/cleaning.jpg',
      },
      {
        name: 'Deep Cleaning',
        href: '/services?category=cleaning&type=deep',
        imageSrc: '/nav/services/deep-cleaning.jpg',
      },
      {
        name: 'Move-in/Move-out Cleaning',
        href: '/services?category=cleaning&type=move',
        imageSrc: '/nav/services/move-cleaning.jpg',
      },
    ],
  },
  {
    label: 'Plumbing',
    value: 'plumbing' as const,
    featured: [
      {
        name: 'Emergency Repairs',
        href: `/services?category=plumbing`,
        imageSrc: '/nav/services/plumbing.jpg',
      },
      {
        name: 'Installation',
        href: '/services?category=plumbing&type=installation',
        imageSrc: '/nav/services/plumbing-install.jpg',
      },
      {
        name: 'Maintenance',
        href: '/services?category=plumbing&type=maintenance',
        imageSrc: '/nav/services/plumbing-maintenance.jpg',
      },
    ],
  },
  {
    label: 'Electrical',
    value: 'electrical' as const,
    featured: [
      {
        name: 'Repairs',
        href: `/services?category=electrical`,
        imageSrc: '/nav/services/electrical.jpg',
      },
      {
        name: 'Installation',
        href: '/services?category=electrical&type=installation',
        imageSrc: '/nav/services/electrical-install.jpg',
      },
      {
        name: 'Safety Inspection',
        href: '/services?category=electrical&type=inspection',
        imageSrc: '/nav/services/electrical-inspection.jpg',
      },
    ],
  },
  {
    label: 'Carpentry',
    value: 'carpentry' as const,
    featured: [
      {
        name: 'Furniture Assembly',
        href: `/services?category=carpentry`,
        imageSrc: '/nav/services/carpentry.jpg',
      },
      {
        name: 'Repairs',
        href: '/services?category=carpentry&type=repairs',
        imageSrc: '/nav/services/carpentry-repairs.jpg',
      },
      {
        name: 'Custom Work',
        href: '/services?category=carpentry&type=custom',
        imageSrc: '/nav/services/carpentry-custom.jpg',
      },
    ],
  },
  {
    label: 'Painting',
    value: 'painting' as const,
    featured: [
      {
        name: 'Interior Painting',
        href: `/services?category=painting`,
        imageSrc: '/nav/services/painting.jpg',
      },
      {
        name: 'Exterior Painting',
        href: '/services?category=painting&type=exterior',
        imageSrc: '/nav/services/painting-exterior.jpg',
      },
      {
        name: 'Wallpaper',
        href: '/services?category=painting&type=wallpaper',
        imageSrc: '/nav/services/wallpaper.jpg',
      },
    ],
  },
  {
    label: 'Gardening',
    value: 'gardening' as const,
    featured: [
      {
        name: 'Lawn Care',
        href: `/services?category=gardening`,
        imageSrc: '/nav/services/gardening.jpg',
      },
      {
        name: 'Landscaping',
        href: '/services?category=gardening&type=landscaping',
        imageSrc: '/nav/services/landscaping.jpg',
      },
      {
        name: 'Plant Care',
        href: '/services?category=gardening&type=plants',
        imageSrc: '/nav/services/plant-care.jpg',
      },
    ],
  },
]

export const PRODUCT_CATEGORIES = [
  {
    label: 'Cleaning Services',
    value: 'cleaning' as const,
    featured: [
      {
        name: 'House Cleaning',
        href: `/products?category=cleaning`,
        imageSrc: '/nav/ui-kits/mixed.jpg',
      },
      {
        name: 'Deep Cleaning',
        href: '/products?category=cleaning&type=deep',
        imageSrc: '/nav/ui-kits/blue.jpg',
      },
      {
        name: 'Move-in/Move-out Cleaning',
        href: '/products?category=cleaning&type=move',
        imageSrc: '/nav/ui-kits/purple.jpg',
      },
    ],
  },
  {
    label: 'Plumbing',
    value: 'plumbing' as const,
    featured: [
      {
        name: 'Emergency Repairs',
        href: `/products?category=plumbing`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'Installation',
        href: '/products?category=plumbing&type=installation',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Maintenance',
        href: '/products?category=plumbing&type=maintenance',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
  {
    label: 'Electrical',
    value: 'electrical' as const,
    featured: [
      {
        name: 'Repairs',
        href: `/products?category=electrical`,
        imageSrc: '/nav/ui-kits/mixed.jpg',
      },
      {
        name: 'Installation',
        href: '/products?category=electrical&type=installation',
        imageSrc: '/nav/ui-kits/blue.jpg',
      },
      {
        name: 'Safety Inspection',
        href: '/products?category=electrical&type=inspection',
        imageSrc: '/nav/ui-kits/purple.jpg',
      },
    ],
  },
  {
    label: 'Carpentry',
    value: 'carpentry' as const,
    featured: [
      {
        name: 'Furniture Assembly',
        href: `/products?category=carpentry`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'Repairs',
        href: '/products?category=carpentry&type=repairs',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Custom Work',
        href: '/products?category=carpentry&type=custom',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
  {
    label: 'Painting',
    value: 'painting' as const,
    featured: [
      {
        name: 'Interior Painting',
        href: `/products?category=painting`,
        imageSrc: '/nav/ui-kits/mixed.jpg',
      },
      {
        name: 'Exterior Painting',
        href: '/products?category=painting&type=exterior',
        imageSrc: '/nav/ui-kits/blue.jpg',
      },
      {
        name: 'Wallpaper',
        href: '/products?category=painting&type=wallpaper',
        imageSrc: '/nav/ui-kits/purple.jpg',
      },
    ],
  },
  {
    label: 'Gardening',
    value: 'gardening' as const,
    featured: [
      {
        name: 'Lawn Care',
        href: `/products?category=gardening`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'Landscaping',
        href: '/products?category=gardening&type=landscaping',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Plant Care',
        href: '/products?category=gardening&type=plants',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
]
