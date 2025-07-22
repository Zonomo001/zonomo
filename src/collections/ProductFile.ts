import { User } from '../payload-types'
import { BeforeChangeHook } from 'payload/dist/collections/config/types'
import { Access, CollectionConfig } from 'payload/types'

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null
  return { ...data, user: user?.id }
}

const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null

  if (user?.role === 'admin') return true
  if (!user) return false

  const { docs: products } = await req.payload.find({
    collection: 'products',
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  const ownProductFileIds = products
    .map((prod) => {
      if (!prod.product_files) return undefined
      if (typeof prod.product_files === 'string') return prod.product_files
      if (typeof prod.product_files === 'object' && 'id' in prod.product_files && prod.product_files.id) return prod.product_files.id
      return undefined
    })
    .filter(Boolean)

  const { docs: orders } = await req.payload.find({
    collection: 'orders',
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  const purchasedProductFileIds = orders
    .map((order) => {
      if (!Array.isArray(order.products)) return []
      return order.products.map((product: any) => {
        if (typeof product === 'string') {
          req.payload.logger.error('Search depth not sufficient to find purchased file IDs')
          return undefined
        }
        if (product.product_files) {
          if (typeof product.product_files === 'string') return product.product_files
          if (typeof product.product_files === 'object' && 'id' in product.product_files && product.product_files.id) return product.product_files.id
        }
        return undefined
      })
    })
    .filter(Boolean)
    .flat()

  return {
    id: {
      in: [
        ...ownProductFileIds,
        ...purchasedProductFileIds,
      ],
    },
  }
}

export const ProductFiles: CollectionConfig = {
  slug: 'product_files',
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
  },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
  },
  upload: {
    staticURL: '/product_files',
    staticDir: 'product_files',
    mimeTypes: [
      'image/*',
      'font/*',
      'application/postscript',
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
}
