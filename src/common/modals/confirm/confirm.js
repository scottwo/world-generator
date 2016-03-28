import 'common/modals';

class ConfirmModalController {
  constructor(Modal) {
    this.$modal = Modal.confirm.instance;
    this.data = Modal.confirm.data || {};
    _.defaults(this.data, {
      title: 'Confirm',
      body: 'Are you sure?',
      okText: 'Ok',
      cancelText: 'Cancel',
    });
    this.promise = Modal.confirm.result;
    
  }

  cancel() {
    this.promise.reject('cancel');
    this.$modal.destroy();
  }

  ok() {
    this.promise.resolve(this.data);
    this.$modal.destroy();
  }
}

function ConfirmModalDirective() {
  return {
    restrict: 'E',
    scope: {},
    controller: 'ConfirmModalController',
    controllerAs: 'ConfirmModalCtrl',
    templateUrl: 'common/modals/confirm/confirm.tpl.html'
  };
}

angular.module('modals.confirm', ['modals'])
  .controller('ConfirmModalController', ConfirmModalController)
  .directive('confirmModal', ConfirmModalDirective);
