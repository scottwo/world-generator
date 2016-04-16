const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func){
  let fnStr = func.toString().replace(STRIP_COMMENTS, ''),
      result = fnStr
        .slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'))
        .match(ARGUMENT_NAMES);
  if(result === null) {result = []}
  return result;
}


export class BaseClass {
  constructor($rootRouter, $rootScope, auth){
    Object.assign(this, {$rootRouter, $rootScope, auth});

    if(this.title){
      this.$rootScope.$title = this.title;
    }
    this.auth.requireLoggedIn().then(res=> {
      this.auth.resolveUser().then(res=> {
        return;
      }, err=> {
        this.$rootRouter.navigate(['Login']);
      })
    }, err=>{
      this.$rootRouter.navigate(['Login']);
    })
  }

  assignArgs(that, args){
    let paramNames = getParamNames(that.constructor),
        argPairs = {};
    for (let i = 0; i < Array.from(args).length; i++) {
      argPairs[`${paramNames[i]}`] = Array.from(args)[i];
    }
    Object.assign(this, argPairs);
  }
}