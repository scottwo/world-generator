import 'common/modals/confirm/confirm';

class Modal {
  /*@ngInject*/
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
        result = this.$q.defer(),
        kebab = _.kebabCase(name) + '-modal';

    //create space for this modal's data, promises, instance on the service.
    this[lower] = {
      data: modalData,
      result: result
    };

    this[lower].options = this.generateOptions(options, lower, kebab);

    //create new instance of Modal.
    this.modal = new this.ModalFactory(this[lower].options);
    //save instance of modal in service.
    this[lower].instance = this.modal;
    //show the modal.
    this.modal.activate();

    //registers listeners on the foundationApi to know what to resolve
    //opened promise and clicked outside of modal dismissed promise.
    this.FoundationApi.subscribe(lower, (res) => {
      if(res === 'show') {
        opened.resolve('opened');
      } else if (res === 'close') {
        dismissed.resolve('dismissed outside click');
        this.modal.destroy();
      }
    });

    //return the promises so you can .then() in controller based on the user
    //response.
    return {
      result: result.promise,
      opened: opened.promise,
      dismissed: dismissed.promise
    };
  }

  //Synthesize options for ModalFactory based on defaults below and options
  //provided.
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
