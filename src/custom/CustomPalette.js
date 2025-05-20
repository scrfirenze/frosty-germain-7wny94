export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function _extends() {
      _extends =
        Object.assign ||
        function (target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }

          return target;
        };

      return _extends.apply(this, arguments);
    }

    function assign(target) {
      for (
        var _len = arguments.length,
          others = new Array(_len > 1 ? _len - 1 : 0),
          _key = 1;
        _key < _len;
        _key++
      ) {
        others[_key - 1] = arguments[_key];
      }

      return _extends.apply(void 0, [target].concat(others));
    }

    function createCustomTask() {
      return function (event) {
        const businessObject = bpmnFactory.create("elmi:CustomTask");
        const shape = elementFactory.createShape({
          type: "elmi:CustomTask",
          businessObject: businessObject
        });
        create.start(event, shape);
      };
    }

    var actions = {};

    assign(actions, {
      "create.separato-mattoncini-custom": {
        group: "mattoncini-custom",
        separator: true
      }
    });

    //fare chiamata api che recupera i mattoncini

    //qui creo l'oggetto con i mattoncini da aggiungere all'editor (da mappare con i valori che la chiamata api ritornerà)

    let newActions = {
      "create.customTask": {
        group: "mattoncini-custom",
        className: "fas fa-cogs",
        title: translate("mattoncino custom"),
        action: {
          dragstart: createCustomTask(),
          click: createCustomTask()
        }
      }
    };

    // cicla attraverso ogni proprietà dell'oggetto newActions e aggiungile all'oggetto actions
    for (let key in newActions) {
      if (newActions.hasOwnProperty(key)) {
        actions[key] = newActions[key];
      }
    }

    return actions;
  }
}

CustomPalette.$inject = [
  "bpmnFactory",
  "create",
  "elementFactory",
  "palette",
  "translate"
];
