import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PostsModule } from '../posts.module';
import { configTestDb } from '../../../test/e2e.utils';
import { makeTestToken } from '../../../test/e2e.utils';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { FilesModule } from '../../files/files.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let guestToken: string;
  let moderatorToken: string;

  let adminPostId: string;
  let adminPostCreatedAt: string;

  let moderatorPostId: string;
  let moderatorPostCreatedAt: string;

  const adminCreatedByAndUpdatedBy = {
    _id: expect.any(String),
    firstName: expect.any(String),
    lastName: expect.any(String),
    middleName: expect.any(String),
    email: expect.any(String),
    role: expect.objectContaining({
      _id: expect.any(String),
    }),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  };

  const moderatorCreatedByAndUpdatedBy = {
    _id: expect.any(String),
    firstName: expect.any(String),
    lastName: expect.any(String),
    middleName: expect.any(String),
    email: expect.any(String),
    role: expect.any(Object),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ...configTestDb(),
        AuthModule,
        UsersModule,
        FilesModule,
        PostsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    adminToken = makeTestToken('admin');
    moderatorToken = makeTestToken('moderator');
    guestToken = makeTestToken('guest');
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * #################### TESTS WITH ADMIN TOKEN ###########################
   */
  describe('TESTS WITH ADMIN TOKEN', () => {
    describe('POST /posts', () => {
      it('should create a post', () => {
        return request(app.getHttpServer())
          .post('/posts')
          .auth(adminToken, { type: 'bearer' })
          .send({
            header: 'TEST POST',
            text: 'TEST POST 12345',
            files: ['614b35be15152843941b6f2f'],
          })
          .expect(201)
          .then((response) => {
            adminPostId = response.body._id;
            adminPostCreatedAt = response.body.createdAt;
            expect(response.body).toMatchObject({
              header: expect.stringMatching('TEST POST'),
              text: expect.stringMatching('TEST POST 12345'),
              files: expect.any(Array),
              createdBy: expect.objectContaining(adminCreatedByAndUpdatedBy),
              updatedBy: expect.objectContaining(adminCreatedByAndUpdatedBy),
              _id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });

    describe('GET /posts', () => {
      it('should return array of posts', () => {
        return request(app.getHttpServer())
          .get('/posts')
          .auth(adminToken, { type: 'bearer' })
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  _id: expect.any(String),
                  header: expect.any(String),
                  text: expect.any(String),
                  files: expect.any(Array),
                  createdBy: expect.objectContaining(
                    adminCreatedByAndUpdatedBy,
                  ),
                  updatedBy: expect.objectContaining(
                    adminCreatedByAndUpdatedBy,
                  ),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              ]),
            );
          });
      });
    });

    describe('GET /posts/{ID}', () => {
      it('should get a posts by id', () => {
        return request(app.getHttpServer())
          .get(`/posts/${adminPostId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              header: expect.stringMatching('TEST POST'),
              text: expect.stringMatching('TEST POST 12345'),
              files: expect.any(Array),
              createdBy: expect.objectContaining(adminCreatedByAndUpdatedBy),
              updatedBy: expect.objectContaining(adminCreatedByAndUpdatedBy),
              _id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });

    describe('PATCH /posts/{ID}', () => {
      it('should update a posts', () => {
        return request(app.getHttpServer())
          .patch(`/posts/${adminPostId}`)
          .auth(adminToken, { type: 'bearer' })
          .send({
            header: 'TEST1234',
            text: 'TEST1234',
            files: ['620fbe6e4f4163a38de997ee'],
          })
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              header: expect.stringMatching('TEST1234'),
              text: expect.stringMatching('TEST1234'),
              files: expect.any(Array),
              createdBy: expect.objectContaining(adminCreatedByAndUpdatedBy),
              updatedBy: expect.objectContaining(adminCreatedByAndUpdatedBy),
              _id: expect.stringMatching(adminPostId),
              createdAt: expect.stringMatching(adminPostCreatedAt),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });

    describe('DELETE /posts/{ID}', () => {
      it('should delete a posts and return info about deleted post', () => {
        return request(app.getHttpServer())
          .delete(`/posts/${adminPostId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              header: expect.stringMatching('TEST1234'),
              text: expect.stringMatching('TEST1234'),
              files: expect.any(Array),
              createdBy: expect.any(Object),
              updatedBy: expect.any(Object),
              _id: expect.stringMatching(adminPostId),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });
  });
  /**
   * #################### END TESTS WITH ADMIN TOKEN ###########################
   */

  /**
   * #################### TESTS WITH MODERATOR TOKEN ###########################
   */
  describe('TESTS WITH MODERATOR TOKEN', () => {
    describe('POST /posts', () => {
      it('should create a post', () => {
        return request(app.getHttpServer())
          .post('/posts')
          .auth(moderatorToken, { type: 'bearer' })
          .send({
            header: 'MODERATOR TEST POST',
            text: 'MODERATOR TEST POST 12345',
            files: ['614b35be15152843941b6f2f'],
          })
          .expect(201)
          .then((response) => {
            moderatorPostId = response.body._id;
            moderatorPostCreatedAt = response.body.createdAt;
            expect(response.body).toMatchObject({
              header: expect.stringMatching('MODERATOR TEST POST'),
              text: expect.stringMatching('MODERATOR TEST POST 12345'),
              files: expect.any(Array),
              createdBy: expect.objectContaining(
                moderatorCreatedByAndUpdatedBy,
              ),
              updatedBy: expect.objectContaining(
                moderatorCreatedByAndUpdatedBy,
              ),
              _id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });

    describe('GET /posts', () => {
      it('should return array of posts', () => {
        return request(app.getHttpServer())
          .get('/posts')
          .auth(moderatorToken, { type: 'bearer' })
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  _id: expect.any(String),
                  header: expect.any(String),
                  text: expect.any(String),
                  files: expect.any(Array),
                  createdBy: expect.objectContaining(
                    moderatorCreatedByAndUpdatedBy,
                  ),
                  updatedBy: expect.objectContaining(
                    moderatorCreatedByAndUpdatedBy,
                  ),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              ]),
            );
          });
      });
    });

    describe('GET /posts/{ID}', () => {
      it('should get a posts by id', () => {
        return request(app.getHttpServer())
          .get(`/posts/${moderatorPostId}`)
          .auth(moderatorToken, { type: 'bearer' })
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              header: expect.stringMatching('MODERATOR TEST POST'),
              text: expect.stringMatching('MODERATOR TEST POST 12345'),
              files: expect.any(Array),
              createdBy: expect.objectContaining(
                moderatorCreatedByAndUpdatedBy,
              ),
              updatedBy: expect.objectContaining(
                moderatorCreatedByAndUpdatedBy,
              ),
              _id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });

    describe('PATCH /posts/{ID}', () => {
      it('should update a posts', () => {
        return request(app.getHttpServer())
          .patch(`/posts/${moderatorPostId}`)
          .auth(moderatorToken, { type: 'bearer' })
          .send({
            header: 'MODERATOR TEST1234',
            text: 'MODERATOR TEST1234',
            files: ['620fbe6e4f4163a38de997ee'],
          })
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              header: expect.stringMatching('MODERATOR TEST1234'),
              text: expect.stringMatching('MODERATOR TEST1234'),
              files: expect.any(Array),
              createdBy: expect.objectContaining(
                moderatorCreatedByAndUpdatedBy,
              ),
              updatedBy: expect.objectContaining(
                moderatorCreatedByAndUpdatedBy,
              ),
              _id: expect.stringMatching(moderatorPostId),
              createdAt: expect.stringMatching(moderatorPostCreatedAt),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });

    describe('DELETE /posts/{ID}', () => {
      it('should return 403 and forbidden message', () => {
        return request(app.getHttpServer())
          .delete(`/posts/${adminPostId}`)
          .auth(moderatorToken, { type: 'bearer' })
          .expect(403)
          .then((response) => {
            expect(response.body.statusCode).toBe(403);
            expect(response.body).toMatchObject({
              statusCode: expect.any(Number),
              message: expect.stringMatching('Forbidden resource'),
              error: expect.stringMatching('Forbidden'),
            });
          });
      });
    });
  });
  /**
   * #################### END TESTS WITH MODERATOR TOKEN ###########################
   */

  /**
   * #################### TESTS WITH GUEST TOKEN ###########################
   */
  describe('TESTS WITH GUEST TOKEN', () => {
    describe('POST /posts', () => {
      it('should return 403 and forbidden message', () => {
        return request(app.getHttpServer())
          .post('/posts')
          .auth(guestToken, { type: 'bearer' })
          .expect(403)
          .then((response) => {
            expect(response.body.statusCode).toBe(403);
            expect(response.body).toMatchObject({
              statusCode: expect.any(Number),
              message: expect.stringMatching('Forbidden resource'),
              error: expect.stringMatching('Forbidden'),
            });
          });
      });
    });

    describe('GET /posts', () => {
      it('should return array of posts', () => {
        return request(app.getHttpServer())
          .get('/posts')
          .auth(guestToken, { type: 'bearer' })
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  _id: expect.any(String),
                  header: expect.any(String),
                  text: expect.any(String),
                  files: expect.any(Array),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              ]),
            );
          });
      });
    });

    describe('GET /posts/{ID}', () => {
      it('should get a posts by id', () => {
        return request(app.getHttpServer())
          .get(`/posts/${moderatorPostId}`)
          .auth(guestToken, { type: 'bearer' })
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              _id: expect.any(String),
              header: expect.stringMatching('MODERATOR TEST1234'),
              text: expect.stringMatching('MODERATOR TEST1234'),
              files: expect.any(Array),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            });
          });
      });
    });

    describe('PATCH /posts/{ID}', () => {
      it('should return 403 and forbidden message', () => {
        return request(app.getHttpServer())
          .patch(`/posts/${moderatorPostId}`)
          .auth(guestToken, { type: 'bearer' })
          .expect(403)
          .then((response) => {
            expect(response.body.statusCode).toBe(403);
            expect(response.body).toMatchObject({
              statusCode: expect.any(Number),
              message: expect.stringMatching('Forbidden resource'),
              error: expect.stringMatching('Forbidden'),
            });
          });
      });
    });

    describe('DELETE /posts/{ID}', () => {
      it('should return 403 and forbidden message', () => {
        return request(app.getHttpServer())
          .delete(`/posts/${moderatorPostId}`)
          .auth(guestToken, { type: 'bearer' })
          .expect(403)
          .then((response) => {
            expect(response.body.statusCode).toBe(403);
            expect(response.body).toMatchObject({
              statusCode: expect.any(Number),
              message: expect.stringMatching('Forbidden resource'),
              error: expect.stringMatching('Forbidden'),
            });
          });
      });
    });
  });
  /**
   * #################### END TESTS WITH GUEST TOKEN ###########################
   */
});
