import {h, Component} from 'preact';
import {invCategoryMap} from '../utils';

// Listing
export default ({
  category,
  title,
  description,
  format,
  source,
  updated_at,
  name
}) => {
  return h(
    'li', {class: `${category} list-item-vertical`},
    h('span', {class: 'type-category'}, `${invCategoryMap[category]}`),
    h('h5', {class: 'header-with-description'},
      h('a', {class: 'text-link', href: `/${PAGE_LANG}/datasets/${name}`}, title)
     ),
    h('dl', {class: 'metadata'},
      h('dt', {}, 'Source:'), ' ',
      h('dd', {}, source)
     ),
    h('dl', {class: 'metadata metadata-date'},
      h('dt', {}, 'Updated:'), ' ',
      h('dd', {}, updated_at)
     ),
    h('p', {class: 'width-shortened'}, description),
    h('ul', {class: 'list-type-none'},
      h('li', {class: 'element-file-type'}, format)
     )
  );
}

