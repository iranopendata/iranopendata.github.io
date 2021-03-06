import {h, render, Component} from 'preact';
import {transformDatasetFromAPI, categoryMap} from '../utils';
import moment from 'moment-jalaali';

import 'whatwg-fetch';
class Dataset extends Component {
  componentWillMount () {
    const component = this;
    component.id = component.props.id;
    component.lang = component.props.lang;

    component.APIUrl = '/catalog/datasets/' + this.id + '.json';
    if (process.env.NODE_ENV == 'development') {
      component.APIUrl = `http://localhost:8000/datasets/${this.id}.json`;
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
      let categories = category.map( (item) => categoryMap[PAGE_LANG][item]).join(", ");
      let updated_at_text = moment(updated_at).format("MMM. D, YYYY");
      let indexed_at_text = moment(indexed_at).format("MMM. D, YYYY");

      if (PAGE_LANG == 'fa') {
        updated_at_text = moment(updated_at).format('jYYYY/jM/jD');
        indexed_at_text = moment(indexed_at).format('jYYYY/jM/jD');
      }

      // Set the document title according to the metadata
      document.title = title;

      let period_div = h('li');
      let frequency_div = h('li');

      if (period.length > 0) {
        period_div = h('li', {},
          h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-dates']),
          h('dd', {class: 'metadata-item'}, `${period[0]} - ${period[1]}`)
        );
      }

      if (frequency.length > 0) {
        frequency_div = h('li', {}, 
          h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-frequency']),
          h('span', {class: 'metadata-item'}, frequency),
        )
      }

      return h(
        'div', {class: `${category[0]} content-dataset`},
        h('span', {class: 'type-category type-category-lg'}, categories),
        h('h1', {}, title),
        h('p', {class: 'description-md'}, description),
        h('ul', {class: 'metadata-lg list-type-none'},
          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-source']),
            h('span', {class: 'metadata-item metadata-descript'},
              h('a', {href: source_url}, source)
            ),
          ),

          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-id']),
            h('span', {class: 'metadata-item metadata-descript'}, name),
          ),

          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-keywords']),
            h('span', {class: 'metadata-item metadata-item-keywords metadata-descript'}, keywords),
          ),

          period_div,

          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-maintainer']),
            h('span', {class: 'metadata-item metadata-descript'}, maintainer),
          ),

          frequency_div,

          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-license']),
            h('span', {class: 'metadata-item metadata-descript'}, license),
          ),

          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-added']),
            h('span', {class: 'metadata-item metadata-descript'}, indexed_at_text),
          ),

          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-formats']),
            h('span', {class: 'metadata-item metadata-descript'},
              h('span', {class: 'element-file-type element-file-type-lg'}, format)
            ),
          ),

          h('li', {},
            h('span', {class: 'metadata-item metadata-item-header'}, lang['dataset-updated']),
            h('span', {class: 'metadata-item metadata-descript'}, updated_at_text)
          ),
        ),
        h('a', {class: 'button', href: url, download: url.substring(url.lastIndexOf('/')+1)}, lang['button-download'])
      );
    }
    return h('div');
  }
}
module.exports = Dataset;
