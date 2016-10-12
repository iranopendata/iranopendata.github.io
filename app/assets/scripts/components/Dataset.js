import {h, render, Component} from 'preact';
import {transformDatasetFromAPI, categoryMap} from '../utils';
import moment from 'moment'

import 'whatwg-fetch';
class Dataset extends Component {
  componentWillMount () {
    const component = this;
    component.id = component.props.id;
    component.lang = component.props.lang;

    component.APIUrl = '/catalog/datasets/' + this.id + '.json';
    if (process.env.NODE_ENV == 'development') {
      component.APIUrl = `http://10.1.10.114:8000/datasets/${this.id}.json`;
    }
    fetch(component.APIUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        component.setState(transformDatasetFromAPI(json, component.lang));
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
    source_url,
    updated_at,
    period,
    indexed_at,
    license,
    url,
    maintainer,
    frequency,
    keywords,
    name
  }) {
    if (title) {
      // Set the document title according to the metadata
      document.title = title;

      let period = h('div');
      let frequency = h('div');

      if (period.length > 0) {
        period = h('div', {},
          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-dates']),
          h('dd', {class: 'metadata-item'}, `${period[0]} - ${period[1]}`)
        );
      }

      if (frequency.length > 0) {
        frequency = h('div', {}, 
          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-frequency']),
          h('dd', {class: 'metadata-item'}, frequency),
        )
      }

      return h(
        'div', {class: `${category} content-dataset`},
        h('span', {class: 'type-category type-category-lg'}, category),
        h('h1', {}, title),
        h('p', {class: 'description-md'}, description),
        h('dl', {class: 'metadata-lg'},
          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-source']),
          h('dd', {class: 'metadata-item'},
            h('a', {href: source_url}, source)
           ),

          period,

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-added']),
          h('dd', {class: 'metadata-item'}, moment(indexed_at).format("MMM. D, YYYY")),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-updated']),
          h('dd', {class: 'metadata-item'}, moment(indexed_at).format("MMM. D, YYYY")),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-maintainer']),
          h('dd', {class: 'metadata-item'}, maintainer),

          frequency,

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-license']),
          h('dd', {class: 'metadata-item'}, license),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-id']),
          h('dd', {class: 'metadata-item'}, name),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-formats']),
          h('dd', {class: 'metadata-item'},
            h('span', {class: 'element-file-type element-file-type-lg'}, format)
           ),

          h('dt', {class: 'metadata-item metadata-item-header'}, lang['dataset-keywords']),
          h('dd', {class: 'metadata-item metadata-item-keywords'}, keywords)
         ),
        h('a', {class: 'button', href: url, download: url.substring(url.lastIndexOf('/')+1)}, lang['button-download']),
        h('a', {class: 'button button-secondary', href:''}, lang['button-share'])
      );
    }
    return h('div');
  }
}

module.exports = Dataset;
