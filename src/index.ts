import express, { Express, json } from 'express';
import { getPosts } from './api/posts/GET';
import { createPost } from './api/posts/POST';
import { getPost } from './api/posts/{id}/GET';
import { deletePost } from './api/posts/{id}/DELETE';
import { editPost } from './api/posts/{id}/PATCH';
import { createPostDtoSchema } from './api/posts/POST/dto';
import { singleImage } from './middlewares/single-image';
import { dto } from './middlewares/dto';
import { query } from './middlewares/query';
import { getPostsQuerySchema } from './api/posts/GET/query';
import { params } from './middlewares/params';
import { getPostParamsSchema } from './api/posts/{id}/GET/params';
import { deletePostParamsSchema } from './api/posts/{id}/DELETE/params';
import { editPostParamsSchema } from './api/posts/{id}/PATCH/params';
import { editPostDtoSchema } from './api/posts/{id}/PATCH/dto';
import { PORT, SESSION_CLEANUP_INTERVAL_MS } from './config';
import { clearExpiredSessions } from './auth/clear-expired-sessions';
import { createJob } from './jobs/create-job';
import { auth } from './middlewares/auth';
import { registerDtoSchema } from './api/auth/register/POST/dto';
import { login } from './api/auth/login/POST';
import { loginDtoSchema } from './api/auth/login/POST/dto';
import { register } from './api/auth/register/POST';
import { extendSession } from './api/auth/extend-session/POST';
import { logout } from './api/auth/logout/POST';
import { errorHandler } from './middlewares/error-handler';
import cookieParser from 'cookie-parser';

const app: Express = express();

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

app.post('/auth/register', dto(registerDtoSchema), register);
app.post('/auth/login', dto(loginDtoSchema), login);
app.post('/auth/logout', auth, logout);
app.post('/auth/extend-session', auth, extendSession);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

createJob(clearExpiredSessions, SESSION_CLEANUP_INTERVAL_MS);
