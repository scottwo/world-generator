const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func){
  /** Creates strings from the arguments from a constructor. These are used as
   * the keys for argPairs below in BaseClass.assignArgs. */
  let fnStr = func.toString().replace(STRIP_COMMENTS, ''),
      result = fnStr
        .slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'))
        .match(ARGUMENT_NAMES);
  if(result === null) {result = []}
  return result;
}

export class BaseClass {
  constructor($rootRouter, auth){
    /*** You'll need to pass in $rootRouter and auth when super is called in
     * any class that extends this one.*/
    Object.assign(this, {$rootRouter, auth});

    // Redirects user to login page if they aren't authorized.
    this.auth.requireLoggedIn().then(res=> {
      this.auth.resolveUser().then(res=> {}, err=> {
        this.$rootRouter.navigate(['Login']);
      })
    }, err=>{
      this.$rootRouter.navigate(['Login']);
    });
  }

  assignArgs(that, args){
    /** Pass in this and arguments in any class that extends this one like so:
     *    this.assignArgs(this, arguments)
     * This method assigns every argument passed into the extending */
    let paramNames = getParamNames(that.constructor),
        argPairs = {};
    for (let i = 0; i < Array.from(args).length; i++) {
      argPairs[`${paramNames[i]}`] = Array.from(args)[i];
    }
    Object.assign(this, argPairs);
  }
}