import {h, render, Component} from 'preact';
import {transformDatasetFromAPI, categoryMap} from '../utils';

import 'whatwg-fetch';
class Dataset extends Component {
  constructor () {
    super();

    this.id = DATASET_ID;

    this.APIUrl = '/catalog/datasets/' + this.id + '.json';
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = `http://10.1.10.114:8000/datasets/${this.id}.json`;
    }
  }

  componentWillMount () {
    const component = this;
    fetch(component.APIUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        component.setState(transformDatasetFromAPI(json));
      })
      .catch(function (err) {
        console.error('Could not fetch data', err);
      })
    ;
  }

  render ({}, {
    category,
    title,
    description,
    format,
    source,
    updated_at,
    period,
    url,
    name
  }) {
    if (title) {
      return h(
        'div', {class: `${categoryMap[category]} content-dataset`},
        h('span', {class: 'type-category type-category-lg'}, category),
        h('h1', {}, title),
        h('p', {class: 'description-md'}, description),
        h('dl', {class: 'metadata-lg'},
          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-source']),
          h('dd', {class: 'metadata-item'}, source),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-dates']),
          h('dd', {class: 'metadata-item'}, `${period[0]} - ${period[1]}`),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-formats']),
          h('dd', {class: 'metadata-item'},
            h('span', {class: 'element-file-type element-file-type-lg'}, format)
           ),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-id']),
          h('dd', {class: 'metadata-item'}, name)
         ),
        h('a', {class: 'button', href: url, download: url.substring(url.lastIndexOf('/')+1)}, lang['button-download']),
        h('a', {class: 'button button-secondary', href:''}, lang['button-share']),
        h('div', {class: 'subsection'},
          h('h2', {}, lang['dataset-secondary-title']),
          h('span', {}, page['date']),
          h('p', {}, page['notes'])

         )
      );
    }
    return h('div');
  }
}

module.exports = Dataset;
