import { GetPostsQuery } from './query';

const BASE_DATA_QUERY = `
    SELECT 
    p."id", p."title", p."description", p."price", p."status"::text, p."type"::text, p."area", p."rooms", p."address", p."createdAt", p."updatedAt", p."authorId", ST_X(p.coordinates) as longitude,  ST_Y(p.coordinates) as latitude,
    i."id" as "imageId", i."name" as "imageName", i."postId" as "imagePostId", i."createdAt" as "imageCreatedAt", i."updatedAt" as "imageUpdatedAt",
    u."id" as "authorId", u."name" as "authorName", u."createdAt" as "authorCreatedAt", u."updatedAt" as "authorUpdatedAt",
    f."id" as "favoriteId"
    FROM "Post" p
    LEFT JOIN "Image" i ON i."postId" = p.id
    LEFT JOIN "User" u ON u.id = p."authorId"
`;

const BASE_COUNT_QUERY = `
    SELECT COUNT(*) as "postCount"
    FROM "Post" p
`;

export const buildDbQuery = (
    {
        address,
        limit,
        offset,
        distance,
        latitude,
        longitude,
        maxArea,
        maxPrice,
        maxRooms,
        minArea,
        minPrice,
        minRooms,
        title,
        type,
        userId,
        isFavorite,
    }: GetPostsQuery,
    currentUserId?: number,
    count = false,
    status?: string,
): [string, (string | number | undefined)[]] => {
    let baseQuery = count ? BASE_COUNT_QUERY : BASE_DATA_QUERY;

    let conditions = [];
<<<<<<< HEAD
    let params: (string | number | undefined)[] = [];

    if (currentUserId) {
        baseQuery += `LEFT JOIN "Favorite" f ON f."postId" = p.id AND f."userId" = $1\n`;
        params.push(currentUserId);
    }

    baseQuery += `WHERE 1=1\n`;

    if (isFavorite && currentUserId) {
        conditions.push(`f."userId" = $${params.length + 1}`);
        params.push(currentUserId);
    }
=======
    let params: (string | number | undefined)[] = !count ? [currentUserId] : []; // First parameter for favorites.userId
>>>>>>> parent of aee1ab5 (fix some bugs)

    if (userId) {
        conditions.push(`p."authorId" = $${params.length + 1}`);
        params.push(userId);
    }
    if (address) {
        conditions.push(`p.address ILIKE $${params.length + 1}`);
        params.push(`%${address}%`);
    }
    if (minArea) {
        conditions.push(`p.area >= $${params.length + 1}`);
        params.push(minArea);
    }
    if (maxArea) {
        conditions.push(`p.area <= $${params.length + 1}`);
        params.push(maxArea);
    }
    if (minPrice) {
        conditions.push(`p.price >= $${params.length + 1}`);
        params.push(minPrice);
    }
    if (maxPrice) {
        conditions.push(`p.price <= $${params.length + 1}`);
        params.push(maxPrice);
    }
    if (minRooms) {
        conditions.push(`p.rooms >= $${params.length + 1}`);
        params.push(minRooms);
    }
    if (maxRooms) {
        conditions.push(`p.rooms <= $${params.length + 1}`);
        params.push(maxRooms);
    }
    if (title) {
        conditions.push(`p.title ILIKE $${params.length + 1}`);
        params.push(`%${title}%`);
    }
    if (type && type !== 'ALL') {
        conditions.push(`p.type = $${params.length + 1}::"PostType"`);
        params.push(type);
    }

    if (distance && latitude && longitude) {
        conditions.push(
            `ST_DWithin(p.coordinates, ST_SetSRID(ST_MakePoint($${params.length + 1}::numeric, $${params.length + 2}::numeric)::geography, 4326), $${params.length + 3})`,
        );
        params.push(latitude, longitude, distance);
    }

    if (status) {
        conditions.push(`p.status = $${params.length + 1}::"PostStatus"`);
        params.push(status);
    }

    const finalQuery = `${baseQuery}
    ${conditions.length > 0 ? ' AND ' + conditions.join(' AND ') : ''}
    ${
        !count
            ? `
      ORDER BY p."createdAt" DESC
      OFFSET $${params.length + 1}
      LIMIT $${params.length + 2}
      `
            : ''
    }
`;

    if (!count) params.push(offset, limit);
    console.log(finalQuery, params);

    return [finalQuery, params];
};
