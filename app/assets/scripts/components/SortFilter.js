import {h} from 'preact';

export default ({sort, onSort}) => {
  return h(
    'div', {class: 'sort-filter'},
    h('span', {class: 'sort-filter-header'}, labels['sort']),
    h('select', {
      class: '',
      onChange: (e) => onSort(e.target.value),
      value: sort
    },
      h('option', {class: 'dropdown-sm', value: 'update'}, labels['sortby-option1']),
      h('option', {class: 'dropdown-sm', value: 'alphabetic'}, labels['sortby-option2'])
    )
  );
};
