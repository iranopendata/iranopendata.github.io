import {h} from 'preact';
import {invCategoryMap} from '../utils.js';

const CategoryFilter = ({categories, checked, onClick}) => {
  let filterItems = [];
  const checkedSet = new Set(checked);

  for (let category in categories) {
    const selected = checkedSet.has(category);
    let item = h(
      'li', {class: `list-item-filter list-item-filter-${category}`},
      h('label', {}, invCategoryMap[category],
        ' ',
        h('span', {class: 'filter-number'}, `(${categories[category]})`),
        h('input', {
          class: 'checkbox',
          type: 'checkbox',
          checked: selected,
          name: category,
          onClick: () => onClick(category)
        }))
    );

    filterItems.push(item);
  }

  return h('div', {class: 'wrapper-filter-item'},
           h('fieldset', {},
             h('label', {class: 'header-filter'}, labels['category-title']),
             h('ul', {class: 'list-type-none filter-categories'}, filterItems)
            )
          );
}

export default CategoryFilter;
