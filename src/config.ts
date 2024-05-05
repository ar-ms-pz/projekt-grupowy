export const COOKIE_NAME = process.env.COOKIE_NAME ?? 'session';
export const PORT = +(process.env.PORT ?? 3000);
export const SESSION_LENGTH_DAYS = +(process.env.SESSION_LENGTH_DAYS ?? '30');
export const SESSION_LENGTH_MS = SESSION_LENGTH_DAYS * 24 * 60 * 60 * 1000;
export const SESSION_CLEANUP_INTERVAL_MS = +(
    process.env.SESSION_CLEANUP_INTERVAL_MS ?? '60000'
);

export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? 'localhost';
