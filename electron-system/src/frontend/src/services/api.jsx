const api = {
  auth: {
    login: '/v1/admin/auth/login',
    refresh: '/v1/admin/auth/refresh',
  },
  code: {
    verify: '/v1/admin/code/verify',
  },
  network: '/v1/admin/network',
  province: {
    name: 'province',
    base: '/v1/admin/province',
  },
  city: {
    name: 'city',
    base: '/v1/admin/city',
  },
  users: {
    base: '/v1/admin/user',
    changeStatus: '/v1/admin/user/change-status',
    current: '/v1/admin/user/current',
  },

  shippingMethod: {
    base: '/v1/admin/shipping-method',
    changeStatus: '/v1/admin/shipping-method/change-status',
  },
  shippingClass: {
    base: '/v1/admin/shipping-class',
    changeStatus: '/v1/admin/shipping-class/change-status',
  },
  paymentClass: {
    base: '/v1/admin/payment-class',
    changeStatus: '/v1/admin/payment-class/change-status',
    current: '/v1/admin/payment-class/current',
  },

  paymentMethod: {
    base: '/v1/admin/payment-method',
    changeStatus: '/v1/admin/payment-method/change-status',
  },
  role: {
    base: '/v1/admin/role',
    changeStatus: '/v1/admin/role/change-status',
  },
  newsletter: {
    base: '/v1/admin/newsletter',
    changeStatus: '/v1/admin/newsletter/change-status',
  },
  permission: {
    base: '/v1/admin/permission',
    list: '/v1/admin/permission/list',
  },
  // ------------------------------------------------- blogs
  blog: {
    category: {
      base: '/v1/admin/blog/category',
      changeStatus: '/v1/admin/blog/category/change-status',
    },
    tag: {
      base: '/v1/admin/blog/tag',

      changeStatus: '/v1/admin/blog/tag/change-status',
    },
    post: {
      base: '/v1/admin/blog/post',

      changeStatus: '/v1/admin/blog/post/change-status',
    },
  },
  // ------------------------------------------------- media
  folder: {
    base: '/v1/admin/media/folder',
    getBySlug: '/v1/admin/media/folder/get/slug',
    changeStatus: '/v1/admin/media/folder/change-status',
  },
  gallery: {
    base: '/v1/admin/media/gallery',
    changeStatus: '/v1/admin/media/gallery/change-status',
    changeFolder: '/v1/admin/media/gallery/change-folder',
  },
  // ------------------------------------------------- store
  store: {
    category: {
      base: '/v1/admin/category',

      changeStatus: '/v1/admin/category/change-status',
    },
    banner: {
      base: '/v1/admin/banner',
      changeStatus: '/v1/admin/banner/change-status',
    },
    tag: {
      base: '/v1/admin/tag',
      changeStatus: '/v1/admin/tag/change-status',
    },
    order: {
      base: '/v1/admin/order',
      changeStatus: '/v1/admin/order/change-status',
    },
    attribute: {
      base: '/v1/admin/attribute',
      changeStatus: '/v1/admin/attribute/change-status',
    },
    attributeValue: {
      base: '/v1/admin/attribute-value',
      changeStatus: '/v1/admin/attribute-value/change-status',
    },
    product: {
      base: '/v1/admin/product',

      changeStatus: '/v1/admin/product/change-status',
    },
    brand: {
      base: '/v1/admin/brand',
      changeStatus: '/v1/admin/brand/change-status',
    },
  },
  // omre: {
  //   base: '/v1/',
  // },
  // token: {
  //   refresh: '/v1/admin/auth/refresh',
  // },

  // admin: {
  //   base: '/v1/admin',
  // },
  // users: {
  //   base: '/v1/admin/users',
  // },
  // category: {
  //   base: '/v1/admin/category',
  // },
  // assignedToken: {
  //   base: '/v1/admin/assigned-token',
  // },
  // collections: {
  //   base: '/v1/admin/user-collection',
  // },
  // nft: {
  //   base: '/v1/admin/user-token',
  // },
  // department: {
  //   base: '/v1/admin/department',
  // },
  // managers: {
  //   base: '/v1/admin/list',
  // },
  // auction: {
  //   base: '/v1/admin/auctions',
  // },
  // auctionOffers: {
  //   base: '/v1/admin/auctions-offer',
  // },
  // ticket: {
  //   base: '/v1/admin/ticket',
  // },
  // setting: {
  //   base: '/v1/admin/setting',
  // },

  // caravan: {
  //   base: '/v1/admin/team',
  //   agent: '/v1/admin/team/agent',
  //   client: '/v1/admin/team/client',
  //   social: '/v1/admin/team/social',
  //   message: '/v1/admin/team/message',
  //   bank: '/v1/admin/team/bank',
  // },
  // role: {
  //   base: '/v1/admin/role',
  // },
  // permission: {
  //   base: '/v1/admin/permission',
  // },
  // agent: {
  //   base: '/v1/admin/agent',
  // },
  // university: {
  //   base: '/v1/admin/university',
  // },
  // universityCategory: {
  //   base: '/v1/admin/university_category',
  // },
  // travel: {
  //   base: '/v1/admin/travel',
  // },
  // travelHistory: {base: '/v1/admin/travel/history'},
  // travelRegister: {
  //   base: '/v1/admin/travel_register',
  // },
  // form: {
  //   base: '/v1/admin/form',
  //   input: '/v1/admin/form/input',
  //   sample: '/v1/admin/form/sample',
  //   sampleForm: '/v1/admin/sample/form',
  //   sectionInput: '/v1/admin/form/section_input',
  // },

  // createFormBySample: {
  //   base: '/v1/admin/create_form_by_sample',
  // },
  // social: {
  //   base: '/v1/admin/social',
  // },
  // section: {
  //   base: '/v1/admin/form/section',
  // },
  // input: {
  //   base: '/v1/admin/form/input',
  // },
  // public: {
  //   form: {
  //     base: '/public/form',
  //   },
  //   section: {
  //     base: '/public/form/section',
  //   },
  //   input: {
  //     base: '/public/form/input',
  //   },
  //   travel: {
  //     base: '/public/travel',
  //   },
  //   travelRegister: {
  //     base: '/travel_register',
  //   },
  // },
  // client: {
  //   travel: {
  //     base: '/client/travel',
  //   },
  //   auth: {
  //     login: '/client/login',
  //     verify: '/client/verify_code',
  //   },
  // },
  // province: {
  //   base: '/public/province',
  //   byId: '/province',
  // },
  // city: {
  //   base: '/public/city',
  //   byId: '/city',
  // },
}

export default api
