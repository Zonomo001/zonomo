import {
  AfterChangeHook,
  BeforeChangeHook,
} from 'payload/dist/collections/config/types'
import { PRODUCT_CATEGORIES } from '../../config'
import { Access, CollectionConfig } from 'payload/types'
import { Product, User } from '../../payload-types'
import { stripe } from '../../lib/stripe'

const addUser: BeforeChangeHook<Product> = async ({
  req,
  data,
}) => {
  const user = req.user

  return { ...data, user: user.id }
}

const syncUser: AfterChangeHook<Product> = async ({
  req,
  doc,
}) => {
  const fullUser = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
  })

  if (fullUser && typeof fullUser === 'object') {
    const { products } = fullUser

    const allIDs = [
      ...((Array.isArray(products) ? products : []).map((product) =>
        typeof product === 'object' ? product.id : product
      ) || []),
    ]

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    )

    const dataToUpdate = [...createdProductIDs, doc.id]

    await req.payload.update({
      collection: 'users',
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    })
  }
}

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined

    if (!user) return false
    if (user.role === 'admin') return true

    const userProductIDs = (user.products || []).reduce<
      Array<string>
    >((acc, product) => {
      if (!product) return acc
      if (typeof product === 'string') {
        acc.push(product)
      } else {
        acc.push(product.id)
      }

      return acc
    }, [])

    return {
      id: {
        in: userProductIDs,
      },
    }
  }

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === 'create') {
          const data = args.data as Product

          const createdProduct =
            await stripe.products.create({
              name: data.name,
              default_price_data: {
                currency: 'inr',
                unit_amount: Math.round(data.price * 100),
              },
            })

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          }

          return updated
        } else if (args.operation === 'update') {
          const data = args.data as Product

          const updatedProduct =
            await stripe.products.update(data.stripeId!, {
              name: data.name,
              default_price: data.priceId!,
            })

          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          }

          return updated
        }
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'name',
      label: 'Service Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Service details',
      required: true,
    },
    {
      name: 'price',
      label: 'Price per hour (INR)',
      min: 0,
      max: 100000,
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      label: 'Service Category',
      type: 'select',
      options: PRODUCT_CATEGORIES.map(
        ({ label, value }) => ({ label, value })
      ),
      required: true,
    },
    {
      name: 'serviceLocation',
      label: 'Service Location',
      type: 'text',
      required: true, 
    },
    {
      name: 'serviceType',
      label: 'Service Type',
      type: 'select',
      required: true,
      options: [
        { label: 'One-time Service', value: 'one_time' },
        { label: 'Recurring Service', value: 'recurring' },
      ],
    },
    {
      name: 'duration',
      label: 'Service Duration (hours)',
      type: 'number',
      min: 1,
      max: 24,
      required: true,
    },
    {
      name: 'availability',
      label: 'Service Availability',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 7,
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'timeSlots',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'startTime',
              type: 'text',
              required: true,
              admin: {
                description: 'Format: HH:MM (24-hour)',
              },
              validate: (val: string) => {
                const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
                if (!timeRegex.test(val)) {
                  return 'Please enter a valid time in HH:MM (24-hour) format.';
                }
                return true;
              },
            },
            {
              name: 'endTime',
              type: 'text',
              required: true,
              admin: {
                description: 'Format: HH:MM (24-hour)',
              },
              validate: (val: string) => {
                const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
                if (!timeRegex.test(val)) {
                  return 'Please enter a valid time in HH:MM (24-hour) format.';
                }
                return true;
              },
            },
          ],
          validate: (value: any, { siblingData }) => {
            if (siblingData && typeof siblingData.startTime === 'string' && typeof siblingData.endTime === 'string') {
              const startTime = siblingData.startTime;
              const endTime = siblingData.endTime;

              const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
              if (timeRegex.test(startTime) && timeRegex.test(endTime)) {
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);

                const startTotalMinutes = startHour * 60 + startMinute;
                const endTotalMinutes = endHour * 60 + endMinute;

                if (endTotalMinutes <= startTotalMinutes) {
                  return 'End time must be after start time.';
                }
              }
            }
            return true;
          },
        },
      ],
    },
    {
      name: 'product_files',
      label: 'Service Documents',
      type: 'relationship',
      required: false,
      relationTo: 'product_files',
      hasMany: false,
    },
    {
      name: 'approvedForSale',
      label: 'Service Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        {
          label: 'Pending verification',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Denied',
          value: 'denied',
        },
      ],
    },
    {
      name: 'priceId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'stripeId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Service images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
