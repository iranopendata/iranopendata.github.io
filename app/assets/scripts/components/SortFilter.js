import {h} from 'preact';

export default ({sort, onSort}) => {
  return h(
    'div', {class: 'sort-filter'},
    h('span', {class: 'sort-filter-header'}, labels['sort']),
    h('div', {class: 'wrapper-dropdown-sort'},
      h('select', {
        class: 'dropdown-sm',
        onChange: (e) => onSort(e.target.value),
        value: sort
      },
        h('option', {value: 'update'}, labels['sortby-option1']),
        h('option', {value: 'alphabetic'}, labels['sortby-option2'])
      )
    ),
  );
};
