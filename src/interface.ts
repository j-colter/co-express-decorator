
export interface Param {
  name: string;
  type: string;
  index: number;
}

export interface Method {
  subUrl: string;
  httpMethod: string;
  params: Param[];
  middleWares?: Function[];
}

export interface Router {
  [methodName: string]: Method;
}

export interface Target {
  $Meta?: Clazz;
}

export interface Clazz {
  baseUrl: string,
  routes: Router,
  middleWares?: Function[];
}
