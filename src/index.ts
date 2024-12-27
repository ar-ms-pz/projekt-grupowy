import express, { Express, json } from 'express';
import { getPosts } from './api/posts/_GET';
import { createPost } from './api/posts/_POST';
import { getPost } from './api/posts/{id}/_GET';
import { deletePost } from './api/posts/{id}/_DELETE';
import { editPost } from './api/posts/{id}/_PATCH';
import { createPostDtoSchema } from './api/posts/_POST/dto';
import { dto } from './middlewares/dto';
import { query } from './middlewares/query';
import { getPostsQuerySchema } from './api/posts/_GET/query';
import { params } from './middlewares/params';
import { getPostParamsSchema } from './api/posts/{id}/_GET/params';
import { deletePostParamsSchema } from './api/posts/{id}/_DELETE/params';
import { editPostParamsSchema } from './api/posts/{id}/_PATCH/params';
import { editPostDtoSchema } from './api/posts/{id}/_PATCH/dto';
import { PORT, SESSION_CLEANUP_INTERVAL_MS } from './config';
import { clearExpiredSessions } from './auth/clear-expired-sessions';
import { createJob } from './jobs/create-job';
import { auth } from './middlewares/auth';
import { registerDtoSchema } from './api/auth/register/_POST/dto';
import { login } from './api/auth/login/_POST';
import { loginDtoSchema } from './api/auth/login/_POST/dto';
import { register } from './api/auth/register/_POST';
import { extendSession } from './api/auth/extend-session/_POST';
import { logout } from './api/auth/logout/_POST';
import { errorHandler } from './middlewares/error-handler';
import cookieParser from 'cookie-parser';
import { setLikeDtoSchema } from './api/posts/{id}/set-like/_POST/dto';
import { setLikeParamsSchema } from './api/posts/{id}/set-like/_POST/params';
import { setLike } from './api/posts/{id}/set-like/_POST';
import { getUserParamsSchema } from './api/users/{id}/_GET/params';
import { getUser } from './api/users/{id}/_GET';
import { whoAmI } from './api/who-am-i/_GET';
import { requestLogger } from './middlewares/request-logger';
import { cors } from './middlewares/cors';
import { multiImage } from './middlewares/multi-image';
import { getUsersQuerySchema } from './api/users/_GET/query';
import { getUsers } from './api/users/_GET';
import { editUserDtoSchema } from './api/users/{id}/_PATCH/dto';
import { editUserParamsSchema } from './api/users/{id}/_PATCH/params';
import { createUser } from './api/users/_POST';
import { createUserDtoSchema } from './api/users/_POST/dto';
import { editUser } from './api/users/{id}/_PATCH';
import { deleteUserParamsSchema } from './api/users/{id}/_DELETE/params';
import { deleteUser } from './api/users/{id}/_DELETE';

const app: Express = express();

app.use(requestLogger);
app.use(cors);
app.use(json());
app.use(cookieParser());
app.use('/images', express.static('images'));

app.get('/posts', auth(false), query(getPostsQuerySchema), getPosts);
app.post(
    '/posts',
    auth(),
    multiImage,
    dto(createPostDtoSchema, 'none'),
    createPost,
);

app.get('/posts/:postId', auth(false), params(getPostParamsSchema), getPost);
app.patch(
    '/posts/:postId',
    auth(),
    params(editPostParamsSchema),
    dto(editPostDtoSchema),
    editPost,
);
app.delete(
    '/posts/:postId',
    auth(),
    params(deletePostParamsSchema),
    deletePost,
);

app.post(
    '/posts/:postId/set-like',
    auth(),
    dto(setLikeDtoSchema),
    params(setLikeParamsSchema),
    setLike,
);

app.post('/auth/register', dto(registerDtoSchema), register);
app.post('/auth/login', dto(loginDtoSchema), login);
app.post('/auth/logout', auth(), logout);
app.post('/auth/extend-session', auth(), extendSession);

app.get('/who-am-i', auth(), whoAmI);

app.get('/users', auth(), query(getUsersQuerySchema), getUsers);
app.post('/users', auth(), dto(createUserDtoSchema), createUser);
app.get('/users/:userId', auth(false), params(getUserParamsSchema), getUser);
app.patch(
    '/users/:userId',
    auth(),
    params(editUserParamsSchema),
    dto(editUserDtoSchema),
    editUser,
);
app.delete(
    '/users/:userId',
    auth(),
    params(deleteUserParamsSchema),
    deleteUser,
);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

createJob(clearExpiredSessions, SESSION_CLEANUP_INTERVAL_MS);
