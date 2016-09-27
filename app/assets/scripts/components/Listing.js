import {h, Component} from 'preact';
import {invCategoryMap} from '../utils';
import moment from 'moment';

// Listing
export default ({
  category,
  title,
  description,
  format,
  source,
  source_url,
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
      h('dt', {}, labels['datasets-source']), ': ',
      h('dd', {}, h('a', {href: source_url}))
     ),
    h('dl', {class: 'metadata metadata-date'},
      h('dt', {}, labels['datasets-updated']), ': ',
      h('dd', {}, moment(updated_at).format("MMM. D, YYYY"))
     ),
    h('p', {class: 'width-shortened'}, description),
    h('ul', {class: 'list-type-none'},
      h('li', {class: 'element-file-type'}, format)
     )
  );
}

