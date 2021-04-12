import {
  DCookieParam,
  DELETE,
  DFormParam,
  GET,
  DHeaderParam,
  Path,
  DPathParam,
  POST,
  PUT,
  DQueryParam, DRequest, DResponse
} from '../src';

@Path('/user', [ testMiddleWare2 ])
export class UserController {

  @GET('/:id', [ testMiddleWare1 ])
  list(@DPathParam('id') id: string, @DQueryParam('name') name: string, @DResponse response, @DRequest request) {
    console.log('id-->', id);
    console.log('response', response);
    // console.log('request', request);

    return {id, name}
  }

  @DELETE('/:id')
  delete(@DPathParam('id') id) {
    return [id];
  }

  @POST('')
  create(@DFormParam('user') user) {
    return user;
  }

  @PUT('')
  update(@DFormParam('user') user, @DResponse response, @DRequest request) {
    return user;
  }

  @GET('/test/cookie')
  testCookie(@DCookieParam('name') p1, @DCookieParam('xx') p2) {

    return Promise.resolve([p1, p2]);
  }

  @GET('/test/header')
  testHeader(@DHeaderParam('Cookie') p1, @DHeaderParam('User-Agent') p2) {
    return Promise.resolve([p1, p2]);
  }
}

function testMiddleWare1(req, res, next) {
  if (req.body) req.body.test1 = 'test1';
  next();
}

function testMiddleWare2(req, res, next) {
  if (req.body) req.body.test2 = 'test2';
  next();
}
