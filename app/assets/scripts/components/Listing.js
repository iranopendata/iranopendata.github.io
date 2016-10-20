import {h, Component} from 'preact';
import {categoryMap} from '../utils';
import moment from 'moment-jalaali';
const lang = lang || PAGE_LANG;

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
  let categories = category.map( (item) => categoryMap[lang][item]).join(", ");
  let date = moment(updated_at).format('MMM. D, YYYY');
  if (lang == 'fa') {
   date = moment(updated_at).format('jYYYY/jM/jD');
  }
  return h(
    'li', {class: `${category[0]} list-item-vertical`},
    h('span', {class: 'type-category'}, categories),
    h('h5', {class: 'header-with-description'},
      h('a', {class: 'text-link', href: `/${PAGE_LANG}/datasets/${name}`}, title)
     ),
    h('dl', {class: 'metadata'},
      h('dt', {}, labels['datasets-source']), ': ',
      h('dd', {}, h('a', {href: source_url}), source)
     ),
    h('dl', {class: 'metadata metadata-date'},
      h('dt', {}, labels['datasets-updated']), ': ',
      h('dd', {}, date)
     ),
    h('p', {class: 'width-shortened'}, description),
    h('ul', {class: 'list-type-none'},
      h('li', {class: 'element-file-type'}, format)
     )
  );
}

