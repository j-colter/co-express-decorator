import { Express, Router, Request, Response } from 'express';
// import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser';

import { getClazz } from './decorator'
import { Param } from './interface';

/**
 * Extract parameters from request.
 */
function extractParameters(req: Request, res: Response, params: Param[]) {
  let args: Function[] = [];
  if (!params) return;

  let paramHandlerTpe = {
    'query': (paramName: string) => transformParam(req.query[paramName]),
    'path': (paramName: string) => transformParam(req.params[paramName]),
    'form': (paramName: string) => transformParam(req.body[paramName]),
    'cookie': (paramName: string) => transformParam(req.cookies && req.cookies[paramName]),
    'header': (paramName) => transformParam(req.get(paramName)),
    'request': () => req,
    'response': () => res,
  };

  params.forEach(param => {
    args.push(paramHandlerTpe[param.type](param.name))
  });

  return args;
}

/**
 * 参数类型调整
 * @param value
 */
const transformParam = (value: any) => {
  if (!value) return value;
  if (isNaN(value)) return value;
  return +value;
};

/**
 * 注册controller
 * @param app
 * @param serviceClasses
 * @param args 自定义构造参数
 * @constructor
 */
export function RegisterController(app: Express, serviceClasses: any[], ...args) {

  let router = Router();

  serviceClasses.forEach(ServiceClazz => {
    let meta = getClazz(ServiceClazz.prototype);
    let serviceInstance = new ServiceClazz(...args);
    let routes = meta.routes;

    for (const methodName in routes) {
      let methodMeta = routes[methodName];
      let httpMethod = methodMeta.httpMethod;
      let middleWares = methodMeta.middleWares;

      // express router callback
      let fn = (req, res, next) => {
        let params = extractParameters(req, res, methodMeta['params']);
        let result = ServiceClazz.prototype[methodName].apply(serviceInstance, params);

        if (result instanceof Promise) {
          result.then(value => {
            !res.headersSent && res.send(value);
          }).catch(err => {
            next(err);
          });
        } else if (result !== undefined) {
          !res.headersSent && res.send(result);
        }
      };

      // register sub route
      let params: any[] = [methodMeta.subUrl];
      middleWares && (params = params.concat(middleWares));
      params.push(fn);
      router[httpMethod].apply(router, params);
    }

    // register base router.
    // let params: any[] = [meta.baseUrl, bodyParser.json(), cookieParser()];
    let params: any[] = [meta.baseUrl];
    meta.middleWares && (params = params.concat(meta.middleWares));
    params.push(router);
    // @ts-ignore
    app.use.apply(app, params);
  })
}
