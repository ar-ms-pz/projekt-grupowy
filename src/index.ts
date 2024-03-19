import express, { Express, json } from 'express';
import { getPosts } from './api/posts/_GET';
import { createPost } from './api/posts/_POST';
import { getPost } from './api/posts/{id}/_GET';
import { deletePost } from './api/posts/{id}/_DELETE';
import { editPost } from './api/posts/{id}/_PATCH';
import { createPostDtoSchema } from './api/posts/_POST/dto';
import { singleImage } from './middlewares/single-image';
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

const app: Express = express();

app.use(requestLogger);
app.use(json());
app.use(cookieParser());
app.use('/images', express.static('images'));

app.get('/posts', query(getPostsQuerySchema), getPosts);
app.post(
    '/posts',
    auth,
    singleImage,
    dto(createPostDtoSchema, true),
    createPost,
);

app.get('/posts/:postId', params(getPostParamsSchema), getPost);
app.patch(
    '/posts/:postId',
    auth,
    params(editPostParamsSchema),
    dto(editPostDtoSchema),
    editPost,
);
app.delete('/posts/:postId', auth, params(deletePostParamsSchema), deletePost);

app.post(
    '/posts/:postId/set-like',
    auth,
    dto(setLikeDtoSchema),
    params(setLikeParamsSchema),
    setLike,
);

app.post('/auth/register', dto(registerDtoSchema), register);
app.post('/auth/login', dto(loginDtoSchema), login);
app.post('/auth/logout', auth, logout);
app.post('/auth/extend-session', auth, extendSession);

app.get('/who-am-i', auth, whoAmI);
app.get('/users/:userId', params(getUserParamsSchema), getUser);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

createJob(clearExpiredSessions, SESSION_CLEANUP_INTERVAL_MS);
