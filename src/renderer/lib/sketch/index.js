import Model from './model';
import Layer from './layer';

export { Model, Layer };

let Vue;

export default class Kom extends Model {
  static install(_Vue) {
    if (Vue && Vue === _Vue) return;

    Vue = _Vue;

    Vue.mixin({
      beforeCreate() {
        const options = this.$options;
        const kom = options.kom || (options.parent && options.parent.$kom);

        if (!kom) return;

        const isKOM = kom instanceof Kom;

        if (!isKOM) return console.warn('only kom is accepted.');

        kom.init();

        this.$kom = kom;
        this.$model = kom.vm;
        this.$getVM = kom.getVM.bind(kom);
        this.$dispatch = kom.dispatch.bind(kom);
        this.$broadcast = kom.vm.$emit.bind(kom.vm);
        this.$subscribe = kom.vm.$on.bind(kom.vm);
        this.$unsubscribe = kom.vm.$off.bind(kom.vm);

        const subscribe = options.subscribe;

        if (subscribe) {
          this._subscribe = {};

          Object.keys(subscribe).forEach(name => {
            const fn = this._subscribe[name] = subscribe[name].bind(this);

            this.$subscribe(name, fn);
          });
        }

        const sketch = options.sketch;

        // 对于有三种合理情况
        // const datas = [];
        // const computeds = [];
        // const methods = [];

        if (!sketch) return;
        if (typeof sketch !== 'object') {
          throw new Error(`sketch are not allowed to be type of ${typeof sketch}`);
        }
        addProps(sketch);

        function addProps(sk, type = 'computed') {
          if (Array.isArray(sk)) sk.forEach(s => addProps(s));
          else if (sk.ns && !sk.props) {
            throw new Error(`it is required to provide props for ns: ${sk.ns}`);
          }
          else if (sk.ns) {
            reflect(sk, type);
          }
          else {
            Object.entries(sk).forEach(([ key, value ]) => {
              addProps(value, key);
            });
          }
        }

        function reflect(sk, type = 'computed') {
          const { ns, props = [] } = sk;

          let m = kom.vm;

          if (ns) {
            m = ns.split('.').reduce((acc, val) => acc[val], m);
          }

          if (props.length > 0) {
            options[type] = options[type] || {};
          }

          props.forEach(key => {
            if (options[type][key]) return;
            switch (type) {
              case 'computed':
              case 'data':
                options[type][key] = {
                  get() { return m[key]; },
                  set(val) { m[key] = val; },
                };
                break;
              case 'methods':
                options[type][key] = m[key].bind(m);
                break;
              default: break;
            }
          });
        }
      },
      beforeDestroy() {
        const options = this.$options;
        const kom = options.kom || (options.parent && options.parent.$kom);

        if (!kom) return;
        
        const subscribe = this._subscribe;

        if (subscribe) {
          Object.keys(subscribe).forEach(name => {
            this.$unsubscribe(name, subscribe[name]);
          });
        }
      },
    });
  }

  constructor() {
    super();

    this.d = {};
  }

  get(key) {
    return this.d[key];
  }

  set(key, val) {
    this.d[key] = val;
  }

  createContext(ns) {
    const context = super.createContext(ns);

    context.kom = this;
    context.getVM = this.getVM.bind(this);
    context.isMatch = function() {
      return this.ns === this.model.ns;
    };

    return context;
  }
}
