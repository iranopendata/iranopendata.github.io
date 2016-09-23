import {h, render, Component} from 'preact';

import {transformDatasetFromIndex} from '../utils';

class FeaturedList extends Component {
  constructor () {
    super();

    this.APIUrl = '/catalog/index.json';
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = 'http://localhost:8000/index.json';
    }
  }

  componentWillMount () {
    const {featured1, featured2} = featured;
    const component = this;

    fetch(component.APIUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        return json.datasets.map((dataset) => transformDatasetFromIndex(dataset));
      })
      .then(function (datasets) {
        const filtered = datasets.filter(function (dataset) {
          return dataset.name === featured1 || dataset.name === featured2;
        });
        if (filtered.length == 2) {
          component.setState({
            featured1: filtered[0],
            featured2: filtered[1]
          });
        }
      });
  }

  render ({}, {featured1, featured2}) {
    if (featured1 && featured2) {
      return h(
        'ul', {class: 'list-type-none'},
        h('li', {},
          h('span', {class: 'type-category'}, featured1.category),
          h('h5', {class: 'header-with-description'},
            h('a', {class: 'text-link', 'href': `/${PAGE_LANG}/datasets/${featured1.name}`}, featured1.title)
           ),
          h('dl', {class: 'metadata'},
            h('dt', {class: 'metadata-title'}, lang['featured-source']),
            ' ',
            h('dd', {class: 'metadata-description'}, featured1.source)
           ),
          h('p', { }, featured1.description.slice(0, 140) + '...')
         ),

        h('li', {},
          h('span', {class: 'type-category'}, featured2.category),
          h('h5', {class: 'header-with-description'},
            h('a', {class: 'text-link', 'href': `/${PAGE_LANG}/datasets/${featured2.name}`}, featured2.title)
           ),
          h('dl', {class: 'metadata'},
            h('dt', {class: 'metadata-title'}, lang['featured-source']),
            '  ',
            h('dd', {class: 'metadata-description'}, featured2.source)
           ),
          h('p', { }, featured2.description.slice(0, 140) + '...')
         )
      );
    }
    return h('div');
  }
}
module.exports = FeaturedList;
