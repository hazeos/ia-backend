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
      it('should create a posts', () => {
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
            expect(response.body).toMatchObject({
              header: expect.any(String),
              text: expect.any(String),
              files: expect.any(Array),
              createdBy: expect.any(Object),
              updatedBy: expect.any(Object),
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
                  createdBy: expect.any(Object),
                  updatedBy: expect.any(Object),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              ]),
            );
          });
      });
    });
  });
});
