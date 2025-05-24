export const COOKIE_NAME = process.env.COOKIE_NAME ?? 'session';
export const PORT = +(process.env.PORT ?? 3000);
export const SESSION_LENGTH_DAYS = +(process.env.SESSION_LENGTH_DAYS ?? '30');
export const SESSION_LENGTH_MS = SESSION_LENGTH_DAYS * 24 * 60 * 60 * 1000;
export const SESSION_CLEANUP_INTERVAL_MS = +(
    (process.env.SESSION_CLEANUP_INTERVAL_MS ?? 1 * 24 * 60 * 60 * 1000) // 1d
);

export const DELETED_POST_TTL = +(
    (process.env.DELETED_POST_TTL ?? 7 * 24 * 60 * 60 * 1000) // 7d
);

export const DELETED_POST_CLEANUP_INTERVAL = +(
    (process.env.DELETED_POST_CLEANUP_INTERVAL ?? 1 * 24 * 60 * 60 * 1000) // 1d
);

export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? 'localhost';
