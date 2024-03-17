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

const app: Express = express();

app.use(json());

const port = process.env.PORT || 3000;

app.use('/images', express.static('images'));

app.get('/posts', query(getPostsQuerySchema), getPosts);
app.post('/posts', singleImage, dto(createPostDtoSchema, true), createPost);

app.get('/posts/:postId', params(getPostParamsSchema), getPost);
app.patch(
    '/posts/:postId',
    params(editPostParamsSchema),
    dto(editPostDtoSchema),
    editPost,
);
app.delete('/posts/:postId', params(deletePostParamsSchema), deletePost);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
