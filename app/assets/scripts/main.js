import {h, render, Component} from 'preact';

class Listing extends Component {
  render ({category}, {}) {

    return h('li', {class: `${category} list-item-vertical`},
             h('span', {class: 'type-category'}, `${category}`),
             h('h5', {class: 'header-with-description'},
               h('a', {class: 'text-link', href: ''}, 'Name of Dataset')
              ),
             h('dl', {class: 'metadata'},
               h('dt', {}, 'Source:'), ' ',
               h('dd', {}, 'Name of Source')
              ),
             h('dl', {class: 'metadata metadata-date'},
               h('dt', {}, 'Updated:'), ' ',
               h('dd', {}, 'Jul. 28, 2016')
              ),
             h('p', {class: 'width-shortened'}, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut augue aliquet ligula aliquam faucibus a ac mauris. Sed sagittis tempor sapien ac sagittis. Sed sagittis tempor sapien ac sagittis.'),
             h('ul', {class: 'list-type-none'},
               h('li', {class: 'element-file-type'}, 'CSV'), ' ',
               h('li', {class: 'element-file-type'}, 'XML')
              )
            );
  }
}

class DatasetList extends Component {
  render ({items}, {}) {
    const listings = items.map ( (item) => h(Listing, {category: item.category}));
    return h('div', {class: 'content-sidebar'},
             h('h6', {class: 'content-sidebar-header'}, 'Showing 5 Datasets'),
             h('div', {class: 'sort-filter'},
               h('span', {class: 'sort-filter-header'}, 'Sort by'),
               h('div', {class: 'dropdown-sm'}, 'Recent Updates')
              ),
             h('ul', {class: 'list-type-none'}, listings)
            );
  }
}

const content = document.getElementById('content-internal');
render(h(DatasetList, { items: [
  {category: 'population'},
  {category: 'housing'},
  {category: 'women'},
  {category: 'trade'},
  {category: 'housing'},
]}), content);
