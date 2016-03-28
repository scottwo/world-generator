import 'common/modals/confirm/confirm';

class Modal {
  constructor ($compile, $q, ModalFactory, FoundationApi) {
    this.$compile = $compile;
    this.$q = $q;
    this.ModalFactory = ModalFactory;
    this.FoundationApi = FoundationApi;
  }

  open (name, modalData, options={}) {
    let lower = name.toLowerCase(),
        opened = this.$q.defer(),
        dismissed = this.$q.defer(),
        // rendered = this.$q.defer(),
        result = this.$q.defer(),
        kebab = _.kebabCase(name) + '-modal';
        // el;

    this[lower] = {
      data: modalData,
      result: result
    };

    this[lower].options = this.generateOptions(options, lower, kebab);

    this.modal = new this.ModalFactory(this[lower].options);

    // setTimeout(() => {
    //   el = document.getElementById(lower);
    //   let scope = angular.element(el).scope();
    //   console.log(scope);
    //   scope.$$childHead.$apply();
    // }, 250);
    this[lower].instance = this.modal;
    this.modal.activate();

    this.FoundationApi.subscribe(lower, (res) => {
      if(res === 'show') {
        opened.resolve('opened');
      } else if (res === 'close') {
        dismissed.resolve('dismissed outside click');
        this.modal.destroy();
      }
    });

    return {
      result: result.promise,
      opened: opened.promise,
      dismissed: dismissed.promise,
      // rendered: rendered.promise
    };
  }

  generateOptions(options, lower, kebab) {
    let defaultOptions = {
      overlay: 'true',
      overlayClose: 'true',
      template: `<${kebab}></${kebab}>`,
      class: '',
      id: lower,
      container: '',
      animationIn: '',
      animationOut: '',
      contentScope: {
        kebab: kebab,
      },
    };
    _.forOwn(options, (value, key) => {
      if(defaultOptions[key]) {
        defaultOptions[key] = value;
      }
    });
    return defaultOptions;
  }

}

angular
.module('modals', [
  'modals.confirm'
])
.service('Modal', Modal);
