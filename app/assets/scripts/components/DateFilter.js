import {h} from 'preact';

export default ({minMaxDates, selectedDates, onSelectDate}) => {
  let mindates = [], maxdates = [];
  let {min, max} = selectedDates;
  let minn = minMaxDates.min;
  let maxx = minMaxDates.max;
  
  for (var i = minn; i <= maxx; i++) {
    if (i < max) {
      mindates.push(
        h('option', {value: i, key: i}, i)
      );
    }

    if (i > min) {
    maxdates.push(
      h('option', {value: i, key: i}, i)
    );
    }
  }

  // Render
  return h(
    'div', {class: 'wrapper-filter-item'},
    h('fieldset', {},
      h('label', {class: 'header-filter'}, labels['date-title']),
      h('div', {class: 'wrapper-dropdown-sort wrapper-dropdown-sort-sm'},
        h('select', { class: 'dropdown-sm dropdown-sm-date',
          onChange: (e) => {
            e.preventDefault();
            return onSelectDate('min', e.target.value);
          },
          value: min
        }, mindates),
      ),
      h('span', {}, labels['to']),
      h('div', {class: 'wrapper-dropdown-sort wrapper-dropdown-sort-sm'},
        h('select', { class: 'dropdown-sm dropdown-sm-date',
          onChange: (e) => {
            e.preventDefault();
            return onSelectDate('max', e.target.value);
          },
          value: max
        }, maxdates)
       )
      )
  );
};
