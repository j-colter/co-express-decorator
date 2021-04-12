import { Clazz, Method, Param, Target } from './interface';

export const getClazz = (target: Target): Clazz => {
  return (target.$Meta = target.$Meta || { baseUrl: '', routes: {} })
};

export const getMethod = (target: Target, methodName: string): Method => {
  let meta = getClazz(target);

  return meta.routes[methodName] || (meta.routes[methodName] = {
    subUrl: '',
    httpMethod: '',
    middleWares: [],
    params: []
  });
};

export function Path(baseUrl: string, middleWares?: Function[]) {
  return function (target) {
    let meta = getClazz(target.prototype);
    meta.baseUrl = baseUrl;
    meta.middleWares = middleWares;
  }
}

const MethodFactory = (httpMethod: string) => {
  return (url: string, middleWares?: Function[]) => {
    return (target, methodName: string, descriptor: PropertyDescriptor) => {

      let meta = getMethod(target, methodName);
      meta.subUrl = url;
      meta.httpMethod = httpMethod;
      meta.middleWares = middleWares;

      // Sort parameter by param index
      meta.params.sort((param1: Param, param2: Param) => param1.index - param2.index);
    }
  }
};

/**
 *
 * @GET('/user/:name')
 * list(@DPathParam('name') name:string)
 */
export const GET = MethodFactory('get');
export const POST = MethodFactory('post');
export const DELETE = MethodFactory('delete');
export const PUT = MethodFactory('put');

const ParamFactory = (paramType: string, paramName?: string) => {
  return (target, methodName: string, paramIndex: number) => {
    let meta = getMethod(target, methodName);
    meta.params.push({
      name: paramName ? paramName : paramType,
      index: paramIndex,
      type: paramType
    });
  }
};

const MethodParamFactory = (paramType: string) => {
  return (paramName: string) => {
    return ParamFactory(paramType, paramName)
  }
};

/**
 *
 * list(@DPathParam('name') name:string)
 *
 */
export const DPathParam = MethodParamFactory('path');
export const DQueryParam = MethodParamFactory('query');
export const DFormParam = MethodParamFactory('form');
export const DCookieParam = MethodParamFactory('cookie');
export const DHeaderParam = MethodParamFactory('header');

const ContextParamFactory = (paramType: string) => {
  return ParamFactory(paramType)
};

/**
 *
 * @GET('/get')
 * list(@DRequest request, @DResponse res)
 */
export const DRequest = ContextParamFactory('request');
export const DResponse = ContextParamFactory('response');
