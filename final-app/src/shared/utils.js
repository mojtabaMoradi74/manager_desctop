// chat-app/
// ├── src/
// │   ├── main/
// │   │   ├── main.js
// │   │   ├── window-manager.js
// │   │   ├── app-state.js
// │   │   └── ipc-handlers.js
// │   ├── server/
// │   │   ├── core.js
// │   │   ├── network/
// │   │   │   ├── mdns-service.js
// │   │   │   └── socket-server.js
// │   │   ├── api/
// │   │   │   ├── rest-api.js
// │   │   │   └── websocket-api.js
// │   │   ├── database/
// │   │   │   ├── models/
// │   │   │   │   ├── User.js
// │   │   │   │   ├── Message.js
// │   │   │   │   └── Room.js
// │   │   │   ├── migrations/
// │   │   │   ├── seeders/
// │   │   │   └── database.js
// │   │   └── services/
// │   │       ├── auth-service.js
// │   │       ├── chat-service.js
// │   │       └── user-service.js
// │   ├── client/
// │   │   ├── core.js
// │   │   ├── network/
// │   │   │   ├── socket-client.js
// │   │   │   └── server-discovery.js
// │   │   ├── cache/
// │   │   │   ├── message-cache.js
// │   │   │   └── user-cache.js
// │   │   └── ui/
// │   │       ├── main-ui.js
// │   │       └── notification-manager.js
// │   └── shared/
// ├       ├ ── network/
// │       │    ├── discovery/
// │       │    │   ├── network-discovery.js    # کلاس اصلی کشف شبکه
// │       │    │   ├── mdns-resolver.js       # پیاده‌سازی mDNS
// │       │    │   ├── ssdp-resolver.js       # پیاده‌سازی SSDP
// │       │    │   └── ping-scanner.js       # اسکنر مبتنی بر Ping
// │       │    ├── protocols/
// │       │    │   ├── chat-protocol.js      # پروتکل چت
// │       │    │   └── service-protocol.js   # پروتکل سرویس‌ها
// │       │    └── utils/
// │       │        ├── network-utils.js      # ابزارهای شبکه
// │       │        └── ip-range.js          # محاسبات محدوده IP
// │       ├── lib/
// │       │   ├── logger.js
// │       │   ├── config-manager.js
// │       │   └── error-handler.js
// │       ├── utils/
// │       │   ├── crypto-utils.js
// │       │   ├── date-utils.js
// │       │   └── validation.js
// │       └── protocols/
// │           ├── chat-protocol.js
// │           └── auth-protocol.js
// ├── migrations/
// ├── seeders/
// ├── resources/
// │   ├── icons/
// │   ├── locales/
// │   └── certificates/
// ├── build/
// ├── .sequelizerc
// ├── package.json
// └── README.md
