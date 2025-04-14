/* eslint-disable */
export const PERMISSIONS = {
  // -------------------------------
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  USER_BAN: 'USER_BAN',
  // -------------------------------
  PRODUCT_CREATE: 'PRODUCT_CREATE',
  PRODUCT_UPDATE: 'PRODUCT_UPDATE',
  PRODUCT_DELETE: 'PRODUCT_DELETE',
  // -------------------------------
  BLOG_CREATE: 'BLOG_CREATE',
  BLOG_UPDATE: 'BLOG_UPDATE',
  BLOG_DELETE: 'BLOG_DELETE',
  // -------------------------------
  NEWSLETTER_CREATE: 'NEWSLETTER_CREATE',
  NEWSLETTER_UPDATE: 'NEWSLETTER_UPDATE',
  NEWSLETTER_DELETE: 'NEWSLETTER_DELETE',
  // -------------------------------
  MEDIA_CREATE: 'MEDIA_CREATE',
  MEDIA_UPDATE: 'MEDIA_UPDATE',
  MEDIA_DELETE: 'MEDIA_DELETE',
  MEDIA_LIST: 'MEDIA_LIST',
}

export const PERMISSIONS_SECTIONS = {
  // -------------------------------
  USER: {
    CREATE: PERMISSIONS['USER_CREATE'],
    UPDATE: PERMISSIONS['USER_UPDATE'],
    DELETE: PERMISSIONS['USER_DELETE'],
    BAN: PERMISSIONS['USER_BAN'],
  },
  // -------------------------------
  PRODUCT: {
    CREATE: PERMISSIONS['PRODUCT_CREATE'],
    UPDATE: PERMISSIONS['PRODUCT_UPDATE'],
    DELETE: PERMISSIONS['PRODUCT_DELETE'],
  },
  // -------------------------------
  BLOG: {
    CREATE: PERMISSIONS['BLOG_CREATE'],
    UPDATE: PERMISSIONS['BLOG_UPDATE'],
    DELETE: PERMISSIONS['BLOG_DELETE'],
  },
  // -------------------------------
  NEWSLETTER: {
    CREATE: PERMISSIONS['NEWSLETTER_CREATE'],
    UPDATE: PERMISSIONS['NEWSLETTER_UPDATE'],
    DELETE: PERMISSIONS['NEWSLETTER_DELETE'],
  },
  // -------------------------------
  MEDIA: {
    CREATE: PERMISSIONS['MEDIA_CREATE'],
    UPDATE: PERMISSIONS['MEDIA_UPDATE'],
    DELETE: PERMISSIONS['MEDIA_DELETE'],
    LIST: PERMISSIONS['MEDIA_LIST'],
  },
}

export const permissionsObject = {
  USER: {
    label: 'User',
    value: 'USER',
    isDisabled: false,
    items: [
      {
        label: 'create',
        value: PERMISSIONS_SECTIONS.USER.CREATE,
      },
      {
        label: 'update',
        value: PERMISSIONS_SECTIONS.USER.UPDATE,
      },
      {
        label: 'delete',
        value: PERMISSIONS_SECTIONS.USER.DELETE,
      },
      {
        label: 'ban',
        value: PERMISSIONS_SECTIONS.USER.BAN,
      },
    ],
  },
  PRODUCT: {
    label: 'Product',
    value: 'PRODUCT',
    isDisabled: false,
    items: [
      {
        label: 'create',
        value: PERMISSIONS_SECTIONS.PRODUCT.CREATE,
      },
      {
        label: 'update',
        value: PERMISSIONS_SECTIONS.PRODUCT.UPDATE,
      },
      {
        label: 'delete',
        value: PERMISSIONS_SECTIONS.PRODUCT.DELETE,
      },
    ],
  },
  BLOG: {
    label: 'Blog',
    value: 'BLOG',
    isDisabled: false,
    items: [
      {
        label: 'create',
        value: PERMISSIONS_SECTIONS.BLOG.CREATE,
      },
      {
        label: 'update',
        value: PERMISSIONS_SECTIONS.BLOG.UPDATE,
      },
      {
        label: 'delete',
        value: PERMISSIONS_SECTIONS.BLOG.DELETE,
      },
    ],
  },
  NEWSLETTER: {
    label: 'Newsletter',
    value: 'NEWSLETTER',
    isDisabled: false,
    items: [
      {
        label: 'create',
        value: PERMISSIONS_SECTIONS.NEWSLETTER.CREATE,
      },
      {
        label: 'update',
        value: PERMISSIONS_SECTIONS.NEWSLETTER.UPDATE,
      },
      {
        label: 'delete',
        value: PERMISSIONS_SECTIONS.NEWSLETTER.DELETE,
      },
    ],
  },
  MEDIA: {
    label: 'Media',
    value: 'MEDIA',
    isDisabled: false,
    items: [
      {
        label: 'create',
        value: PERMISSIONS_SECTIONS.MEDIA.CREATE,
      },
      {
        label: 'update',
        value: PERMISSIONS_SECTIONS.MEDIA.UPDATE,
      },
      {
        label: 'delete',
        value: PERMISSIONS_SECTIONS.MEDIA.DELETE,
      },
      {
        label: 'list',
        value: PERMISSIONS_SECTIONS.MEDIA.LIST,
      },
    ],
  },
}

export const permissionsArray = []
for (const key in permissionsObject) {
  const data = permissionsObject[key]
  permissionsArray.push(data)
}
