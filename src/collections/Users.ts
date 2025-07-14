import { PrimaryActionEmailHtml } from '../components/emails/PrimaryActionEmail'
import { Access, CollectionConfig } from 'payload/types'

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
        })
      },
    },
  },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
  },
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
    defaultColumns: ['id'],
  },
  fields: [
    {
      name: 'products',
      label: 'Services',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'product_files',
      label: 'Service Documents',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      relationTo: 'product_files',
      hasMany: true,
    },
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Service Provider', value: 'provider' },
        { label: 'User', value: 'user' },
      ],
    },
    {
      name: 'providerDetails',
      label: 'Service Provider Details',
      type: 'group',
      admin: {
        condition: (data) => data.role === 'provider',
      },
      fields: [
        {
          name: 'businessName',
          type: 'text',
          label: 'Business Name',
        },
        {
          name: 'phoneNumber',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Business Address',
        },
        {
          name: 'experience',
          type: 'number',
          label: 'Years of Experience',
          min: 0,
        },
        {
          name: 'certifications',
          type: 'array',
          label: 'Certifications',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Certification Name',
            },
            {
              name: 'issuer',
              type: 'text',
              label: 'Issuing Organization',
            },
            {
              name: 'year',
              type: 'number',
              label: 'Year Obtained',
            },
          ],
        },
        {
          name: 'serviceAreas',
          type: 'array',
          label: 'Service Areas',
          fields: [
            {
              name: 'area',
              type: 'text',
              label: 'Area Name',
            },
            {
              name: 'radius',
              type: 'number',
              label: 'Service Radius (miles)',
            },
          ],
        },
      ],
    },
  ],
}
