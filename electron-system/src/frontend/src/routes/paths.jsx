// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/admin'
const PUBLIC_ROOTS_DASHBOARD = '/dashboard'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
}

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
}

// export const routes = {
//   root: PUBLIC_ROOTS_DASHBOARD,
//   auth: {
//     root: path(PUBLIC_ROOTS_DASHBOARD, ROOTS_AUTH),
//     login: path(PUBLIC_ROOTS_DASHBOARD, path(ROOTS_AUTH, '/login')),
//     register: path(PUBLIC_ROOTS_DASHBOARD, path(ROOTS_AUTH, '/register')),
//     loginUnprotected: path(PUBLIC_ROOTS_DASHBOARD, path(ROOTS_AUTH, '/login-unprotected')),
//     registerUnprotected: path(PUBLIC_ROOTS_DASHBOARD, path(ROOTS_AUTH, '/register-unprotected')),
//     verify: path(PUBLIC_ROOTS_DASHBOARD, path(ROOTS_AUTH, '/verify')),
//     resetPassword: path(PUBLIC_ROOTS_DASHBOARD, path(ROOTS_AUTH, '/reset-password')),
//   },
//   general: {
//     app: path(PUBLIC_ROOTS_DASHBOARD, '/app'),
//     ecommerce: path(PUBLIC_ROOTS_DASHBOARD, '/ecommerce'),
//     analytics: path(PUBLIC_ROOTS_DASHBOARD, '/analytics'),
//     banking: path(PUBLIC_ROOTS_DASHBOARD, '/banking'),
//     booking: path(PUBLIC_ROOTS_DASHBOARD, '/booking'),
//   },
//   omre: {
//     root: path(PUBLIC_ROOTS_DASHBOARD, '/omre'),
//   },
//   tamato: {
//     root: path(PUBLIC_ROOTS_DASHBOARD, '/tamato'),
//   },
//   atabatAliat: {
//     root: path(PUBLIC_ROOTS_DASHBOARD, '/atabat-aliat'),
//   },
//   other: {
//     root: path(PUBLIC_ROOTS_DASHBOARD, '/other'),
//   },

//   form: {
//     root: (type, travel) =>
//       path(PUBLIC_ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/forms`),
//     byId: '/:id',
//   },
//   records: {
//     root: (type) => path(PUBLIC_ROOTS_DASHBOARD, `/${type || ':type'}/records`),
//   },
//   courseName: {
//     root: (type, travel) =>
//       path(PUBLIC_ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/courseName`),
//   },
//   visitorManagement: {
//     root: (type, travel) =>
//       path(PUBLIC_ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/visitor-management`),
//     path: '/:type/:travel/visitor-management',
//     list: '/',
//   },
//   registered: {
//     root: path(PUBLIC_ROOTS_DASHBOARD, `/registered`),
//   },
// }

export const routes = {
  root: ROOTS_DASHBOARD,
  setup: {
    name: 'setup',
    root: "/setup",
  },
  dashboard: {
    name: 'admin',
    root: ROOTS_DASHBOARD,
  },
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },

  usersMenu: {
    root: path(ROOTS_DASHBOARD, `/users`),
  },
  users: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/users`),
    list: '/',
    add: '/add',
    edit: '/edit',
    show: '/show',
    editing: (id) => path(ROOTS_DASHBOARD, `/users/edit/${id}`),
  },

  role: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/role`),
    list: '/',
    add: '/add',
    edit: '/edit',
    show: '/show',
    editing: (id) => path(ROOTS_DASHBOARD, `/role/edit/${id}`),
  },

  media: {
    root: path(ROOTS_DASHBOARD, `/media`),
    all: '/media/*',
    list: '/media/list',
    folder: {
      base: '/media/folder',
      all: '/media/folder/*',
      list: '/media/folder/list',
      add: '/media/folder/add',
      edit: '/media/folder/edit',
    },
    gallery: {
      name: 'files',
      root: path(ROOTS_DASHBOARD, `/media/gallery`),
      base: path(ROOTS_DASHBOARD, `/media/gallery`),
      all: '/media/gallery/*',
      list: '/media/gallery/list',
      add: '/media/gallery/add',
      edit: '/media/gallery/update',
      folderName: '/media/gallery/:folderName',
    },
  },
  store: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store`),
    all: '/store/*',
    list: '/store/list',
  },
  category: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/category`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/category/edit/${id}`),
  },
  attribute: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/attribute`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/attribute/edit/${id}`),
  },
  attributeValue: {
    name: 'USER',
    root: (parent) => path(ROOTS_DASHBOARD, `/store/attribute-value/${parent || ':parent'}`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id, parent) =>
      path(ROOTS_DASHBOARD, `/store/attribute-value/${parent || ':parent'}/edit/${id || ':id'}`),
    adding: (parent) => path(ROOTS_DASHBOARD, `/store/attribute-value/${parent || ':parent'}/add`),
    listing: (parent) => path(ROOTS_DASHBOARD, `/store/attribute-value/${parent || ':parent'}`),
  },
  brand: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/brand`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/brand/edit/${id}`),
  },
  banner: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/banner`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/banner/edit/${id}`),
  },
  order: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/order`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/order/edit/${id}`),
  },
  tag: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/tag`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/tag/edit/${id}`),
  },
  attributes: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/attributes`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/attributes/edit/${id}`),
  },
  product: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/store/product`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/store/product/edit/${id}`),
  },
  shipping: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/shipping`),
  },
  shippingMethod: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/shipping/method`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/shipping/method/edit/${id}`),
  },
  shippingClass: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/shipping/class`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/shipping/class/edit/${id}`),
  },

  payment: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/payment`),
  },
  paymentMethod: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/payment/method`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/payment/method/edit/${id}`),
  },
  paymentClass: {
    name: 'USER',
    root: path(ROOTS_DASHBOARD, `/payment/class`),
    list: '/list',
    add: '/add',
    edit: '/edit',
    editing: (id) => path(ROOTS_DASHBOARD, `/payment/class/edit/${id}`),
  },

  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },

  // agent: {
  //   name: 'Agent',
  //   root: path(ROOTS_DASHBOARD, '/agent'),
  //   list: '/list',
  //   add: '/add',
  //   edit: '/edit',
  // },
  // universitiesSection: {
  //   root: path(ROOTS_DASHBOARD, '/universities-section'),
  // },
  // university: {
  //   name: 'University',
  //   root: path(ROOTS_DASHBOARD, '/universities-section/university'),
  //   list: '/list',
  //   add: '/add',
  //   edit: '/edit',
  // },
  // universityCategory: {
  //   name: 'University',
  //   root: path(ROOTS_DASHBOARD, '/universities-section/category'),
  //   list: '/list',
  //   add: '/add',
  //   edit: '/edit',
  // },
  // omre: {
  //   root: path(ROOTS_DASHBOARD, '/omre'),
  // },
  // tamato: {
  //   root: path(ROOTS_DASHBOARD, '/tamato'),
  // },
  // atabatAliat: {
  //   root: path(ROOTS_DASHBOARD, '/atabat-aliat'),
  // },
  // other: {
  //   root: path(ROOTS_DASHBOARD, '/other'),
  // },

  // form: {
  //   root: (type, travel) =>
  //     path(ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/forms`),
  //   byId: '/:id',
  // },
  // records: {
  //   name: 'Record',
  //   root: (type) => path(ROOTS_DASHBOARD, `/${type || ':type'}/records`),
  // },
  // courseName: {
  //   name: 'University',
  //   root: (type, travel) =>
  //     path(ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/courseName`),
  // },
  // visitorManagement: {
  //   name: 'TravelRegister',
  //   root: (type, travel) =>
  //     path(ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/visitor-management`),
  //   path: '/:type/:travel/visitor-management',
  //   list: '/',
  //   lottery: '/lottery',
  // },

  // conscriptionManagement: {
  //   root: path(ROOTS_DASHBOARD, '/omre/conscription-management'),
  // },
  // caravanManagement: {
  //   root: path(ROOTS_DASHBOARD, '/omre/caravan-management'),
  // },
  // form: {
  //   root: path(ROOTS_DASHBOARD, '/omre/form'),
  //   byId: '/:id',
  // },
  // dutySystemManagement: {
  //   root: (type, travel) =>
  //     path(ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/duty-system-management`),
  //   list: '/',
  // },
  // bankSystemManagement: {
  //   root: (type, travel) =>
  //     path(ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/bank-system-management`),
  //   list: '/',
  // },
  // caravansManagement: {
  //   name: 'Team',
  //   root: (type, travel) =>
  //     path(ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/caravans-management`),
  //   list: '/',
  //   add: '/add',
  //   edit: '/edit',
  //   show: '/show',
  // },
  // forms: {
  //   root: (type, travel) =>
  //     path(ROOTS_DASHBOARD, `/${type || ':type'}/${travel || ':travel'}/forms`),
  //   list: '/',
  //   byId: '/:id',
  // },
  // profile: {
  //   name: 'Profile',
  //   root: path(ROOTS_DASHBOARD, `/profile`),
  //   list: '/',
  //   add: '/add',
  //   edit: '/edit',
  //   show: '/show',
  // },

  // messages: {
  //   root: path(ROOTS_DASHBOARD, `/messages`),
  //   list: '/',
  //   add: '/add',
  //   edit: '/edit',
  //   show: '/show',
  // },
  // records: {
  //   root: path(ROOTS_DASHBOARD, '/omre/records'),
  // },
  // eCommerce: {
  //   root: path(ROOTS_DASHBOARD, '/e-commerce'),
  //   shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
  //   list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
  //   checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
  //   new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
  //   view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
  //   edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
  //   demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
  //   demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  // },
  // invoice: {
  //   root: path(ROOTS_DASHBOARD, '/invoice'),
  //   list: path(ROOTS_DASHBOARD, '/invoice/list'),
  //   new: path(ROOTS_DASHBOARD, '/invoice/new'),
  //   view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
  //   demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
  //   demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  // },
  // news: {
  //   root: path(ROOTS_DASHBOARD, '/news'),
  //   posts: path(ROOTS_DASHBOARD, '/news/posts'),
  //   new: path(ROOTS_DASHBOARD, '/news/new'),
  //   view: (title) => path(ROOTS_DASHBOARD, `/news/post/${title}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/news/edit/${id}`),
  //   demoView: path(ROOTS_DASHBOARD, '/news/post/apply-these-7-secret-techniques-to-improve-event'),

  //   authorsList: path(ROOTS_DASHBOARD, '/news/author/list'),
  //   newAuthor: path(ROOTS_DASHBOARD, '/news/author/new'),
  // },
  // reportage: {
  //   root: path(ROOTS_DASHBOARD, '/reportage'),
  //   list: path(ROOTS_DASHBOARD, '/reportage/list'),
  //   new: path(ROOTS_DASHBOARD, '/reportage/new'),
  //   // view: (name) => path(ROOTS_DASHBOARD, `/reportage/product/${name}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/reportage/edit/${id}`),

  //   publish: {
  //     list: path(ROOTS_DASHBOARD, '/reportage/publish/list'),
  //     edit: (id) => path(ROOTS_DASHBOARD, `/reportage/publish/edit/${id}`),
  //   },
  // },
  // backlink: {
  //   publish: {
  //     list: path(ROOTS_DASHBOARD, '/backlink/publish/list'),
  //     edit: (id) => path(ROOTS_DASHBOARD, `/backlink/publish/edit/${id}`),
  //   },
  // },
  // seller: {
  //   root: path(ROOTS_DASHBOARD, '/seller'),
  //   list: path(ROOTS_DASHBOARD, '/seller/list'),
  //   new: path(ROOTS_DASHBOARD, '/seller/new'),
  //   // view: (name) => path(ROOTS_DASHBOARD, `/seller/product/${name}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/seller/edit/${id}`),
  //   show: (id) => path(ROOTS_DASHBOARD, `/seller/show/${id}`),
  // },
  // systemLog: {
  //   root: path(ROOTS_DASHBOARD, '/admin-log'),
  //   list: path(ROOTS_DASHBOARD, '/admin-log/list'),
  //   // new: path(ROOTS_DASHBOARD, '/admin-log/new'),
  //   // view: (name) => path(ROOTS_DASHBOARD, `/admin-log/product/${name}`),
  //   // edit: (id) => path(ROOTS_DASHBOARD, `/admin-log/edit/${id}`),
  //   // show: (id) => path(ROOTS_DASHBOARD, `/admin-log/show/${id}`),
  // },
  // notification: {
  //   root: path(ROOTS_DASHBOARD, '/notification'),
  //   list: path(ROOTS_DASHBOARD, '/notification/list'),
  //   // new: path(ROOTS_DASHBOARD, '/admin-log/new'),
  //   // view: (name) => path(ROOTS_DASHBOARD, `/admin-log/product/${name}`),
  //   // edit: (id) => path(ROOTS_DASHBOARD, `/admin-log/edit/${id}`),
  //   // show: (id) => path(ROOTS_DASHBOARD, `/admin-log/show/${id}`),
  // },
  // newsAgency: {
  //   root: path(ROOTS_DASHBOARD, '/news_agency'),
  //   list: path(ROOTS_DASHBOARD, '/news_agency/list'),
  //   new: path(ROOTS_DASHBOARD, '/news_agency/new'),
  //   // view: (name) => path(ROOTS_DASHBOARD, `/news_agency/product/${name}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/news_agency/edit/${id}`),
  //   plans: (id) => path(ROOTS_DASHBOARD, `/news_agency/plans/${id}`),
  //   reportage: {
  //     root: path(ROOTS_DASHBOARD, '/news_agency/reportage'),
  //     new: (agencyId) => path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/reportage/new`),
  //     show: (agencyId, reportageId) =>
  //       path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/reportage/show/${reportageId}`),
  //     edit: (agencyId, reportageId) =>
  //       path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/reportage/edit/${reportageId}`),
  //   },
  //   foreign_reportage: {
  //     root: path(ROOTS_DASHBOARD, '/news_agency/foreign_reportage'),
  //     new: (agencyId) => path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/foreign_reportage/new`),
  //     show: (agencyId, reportageId) =>
  //       path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/foreign_reportage/show/${reportageId}`),
  //     edit: (agencyId, reportageId) =>
  //       path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/foreign_reportage/edit/${reportageId}`),
  //   },
  //   backlink: {
  //     root: path(ROOTS_DASHBOARD, '/news_agency/backlink'),
  //     new: (agencyId) => path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/backlink/new`),
  //     show: (agencyId, backlinkId) =>
  //       path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/backlink/show/${backlinkId}`),
  //     edit: (agencyId, backlinkId) =>
  //       path(ROOTS_DASHBOARD, `/news_agency/${agencyId}/backlink/edit/${backlinkId}`),
  //   },
  // },
  // // ticketMenu: {
  // //   root: path(ROOTS_DASHBOARD, '/ticket'),
  // // },
  // // ticket: {
  // //   root: path(ROOTS_DASHBOARD, '/ticket/main'),
  // //   list: path(ROOTS_DASHBOARD, '/ticket/main/list'),
  // //   new: path(ROOTS_DASHBOARD, '/ticket/main/new'),
  // //   edit: (id) => path(ROOTS_DASHBOARD, `/ticket/main/edit/${id}`),
  // // },
  // // ticketDepartment: {
  // //   root: path(ROOTS_DASHBOARD, '/ticket/department'),
  // //   list: path(ROOTS_DASHBOARD, '/ticket/department/list'),
  // //   new: path(ROOTS_DASHBOARD, '/ticket/department/new'),
  // //   edit: (id) => path(ROOTS_DASHBOARD, `/ticket/department/edit/${id}`),
  // // },
  // blog: {
  //   root: path(ROOTS_DASHBOARD, '/blog'),
  //   list: path(ROOTS_DASHBOARD, '/blog/list'),
  //   new: path(ROOTS_DASHBOARD, '/blog/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/blog/edit/${id}`),
  // },
  // admin: {
  //   root: path(ROOTS_DASHBOARD, '/admin'),
  //   list: path(ROOTS_DASHBOARD, '/admin/list'),
  //   new: path(ROOTS_DASHBOARD, '/admin/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/admin/edit/${id}`),
  // },
  // game: {
  //   root: path(ROOTS_DASHBOARD, '/game'),
  //   list: path(ROOTS_DASHBOARD, '/game/list'),
  //   new: path(ROOTS_DASHBOARD, '/game/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/game/edit/${id}`),
  // },
  // record: {
  //   root: path(ROOTS_DASHBOARD, '/record'),
  //   list: path(ROOTS_DASHBOARD, '/record/list'),
  //   new: path(ROOTS_DASHBOARD, '/record/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/record/edit/${id}`),
  // },
  // team: {
  //   root: path(ROOTS_DASHBOARD, '/team'),
  //   list: path(ROOTS_DASHBOARD, '/team/list'),
  //   new: path(ROOTS_DASHBOARD, '/team/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/team/edit/${id}`),
  // },
  // tournament: {
  //   root: path(ROOTS_DASHBOARD, '/tournament'),
  //   list: path(ROOTS_DASHBOARD, '/tournament/list'),
  //   new: path(ROOTS_DASHBOARD, '/tournament/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/tournament/edit/${id}`),
  // },
  // // category: {
  // //   root: path(ROOTS_DASHBOARD, '/category'),
  // //   list: path(ROOTS_DASHBOARD, '/category/list'),
  // //   add: path(ROOTS_DASHBOARD, '/category/new'),
  // //   edit: (id) => path(ROOTS_DASHBOARD, `/category/edit/${id}`),
  // // },
  // // role: {
  // //   root: path(ROOTS_DASHBOARD, '/role'),
  // //   list: path(ROOTS_DASHBOARD, '/role/list'),
  // //   new: path(ROOTS_DASHBOARD, '/role/new'),
  // //   edit: (id) => path(ROOTS_DASHBOARD, `/role/edit/${id}`),
  // // },
  // country: {
  //   root: path(ROOTS_DASHBOARD, '/country'),
  //   list: path(ROOTS_DASHBOARD, '/country/list'),
  //   new: path(ROOTS_DASHBOARD, '/country/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/country/edit/${id}`),
  // },
  // language: {
  //   root: path(ROOTS_DASHBOARD, '/language'),
  //   list: path(ROOTS_DASHBOARD, '/language/list'),
  //   new: path(ROOTS_DASHBOARD, '/language/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/language/edit/${id}`),
  // },
  // financial: {
  //   root: path(ROOTS_DASHBOARD, '/financial'),
  //   list: path(ROOTS_DASHBOARD, '/financial/list'),
  //   new: path(ROOTS_DASHBOARD, '/financial/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/financial/edit/${id}`),
  // },

  // user: {
  //   root: path(ROOTS_DASHBOARD, '/users'),
  //   list: path(ROOTS_DASHBOARD, '/users/list'),
  //   new: path(ROOTS_DASHBOARD, '/users/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/users/edit/${id}`),
  // },
  // clientType: {
  //   root: path(ROOTS_DASHBOARD, '/client-type'),
  //   list: path(ROOTS_DASHBOARD, '/client-type/list'),
  //   new: path(ROOTS_DASHBOARD, '/client-type/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/client-type/edit/${id}`),
  // },
  // managingSite: {
  //   root: path(ROOTS_DASHBOARD, '/managing-site'),
  //   discount: path(ROOTS_DASHBOARD, '/managing-site/general-discount'),
  //   // new: path(ROOTS_DASHBOARD, '/managing-site/new'),
  // },

  // specialContent: {
  //   root: path(ROOTS_DASHBOARD, '/special-content'),
  //   list: path(ROOTS_DASHBOARD, '/special-content/list'),
  //   new: path(ROOTS_DASHBOARD, '/special-content/new'),
  //   new_playlist: path(ROOTS_DASHBOARD, '/special-content/playlist/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/special-content/edit/${id}`),
  // },
}

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction'
