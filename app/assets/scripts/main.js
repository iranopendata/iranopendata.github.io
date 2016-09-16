import {h, render, Component} from 'preact';
import fetch from 'fetch';
import moment from 'moment';

import {categoryMap, invCategoryMap} from './utils';
import CategoryFilter from './components/CategoryFilter';
import SortFilter from './components/SortFilter';

const PAGE_LANG = PAGE_LANG || 'fa';
const labels = labels || {};

class Listing extends Component {
  render ({
    category,
    title,
    description,
    format,
    source,
    updated_at
  }, {}) {

    return h(
      'li', {class: `${category} list-item-vertical`},
      h('span', {class: 'type-category'}, `${invCategoryMap[category]}`),
      h('h5', {class: 'header-with-description'},
        h('a', {class: 'text-link', href: ''}, title)
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
}

class DatasetList extends Component {

  constructor () {
    super();

    this.transformDatasets = this.transformDatasets.bind(this);
    this.onCheckCategory = this.onCheckCategory.bind(this);
    this.onSort = this.onSort.bind(this);

    this.APIUrl = '/catalog/index.json';
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = 'http://localhost:8000/index.json';
    }
  }

  transformDatasets (datasets) {
    /* Takes datasets from the API
     * and maps them to an object
     * suitable for rendering
     */

    return datasets.map (function (dataset) {
      const title = {};
      const description = {};

      dataset.title.forEach( (item) => {
        title[item["lang"]] = item["text"];
      });

      dataset.description.forEach( (item) => {
        description[item["lang"]] = item["text"];
      });

      return {
        'category': categoryMap[dataset.category],
        'title': title[PAGE_LANG],
        'description': description[PAGE_LANG],
        'period': dataset.period,
        'source': dataset.source,
        'format': dataset.format,
        'updated_at': dataset.updated_at
      };
    });
  }

  onCheckCategory (category) {
    const component = this;
    let checkedSet = new Set(component.state.checked || []);
    if (checkedSet.has(category)) {
      checkedSet.delete(category);
    } else {
      checkedSet.add(category);
    }

    component.applyFilters();
    component.setState({
      checked: Array.from(checkedSet)
    });
  }

  onSort (value) {
    const component = this;
    component.setState({
      sort: value
    });
  }

  applyFilters () {
    const component = this;

    let newDatasets = component.state.fromAPI;

    // Filter datasets if something is checked
    const checkedSet = new Set(component.state.checked);
    if (checkedSet.size > 0) {
      newDatasets = newDatasets.filter((dataset) => {
        return checkedSet.has(dataset.category);
      });
    }

    // Sort datasets
    newDatasets.sort((a, b) => {
      if (component.state.sort == 'alphabetic') {
        if (a.title < b.title) { return -1;}
        if (a.title > b.title) { return 1;}
        if (a.title == b.title) { return 0;}
      }

      else {
        if (moment(a.updated_at).isAfter(moment(b.updated_at))) { return -1; }
        if (moment(a.updated_at).isBefore(moment(b.updated_at))) { return 1;}
        if (moment(a.updated_at).isSame(moment(b.updated_at))) { return 0;}
      }
      return 0;
    });


    return newDatasets;
  }

  componentWillMount () { 
    let component = this;

    fetch.fetchUrl(component.APIUrl,
      function (err, meta, body) {
        if (err) {
          // Handle error
          console.error('Could not fetch data');
        } else {
          const parsed = JSON.parse(body.toString());
          const datasets = component.transformDatasets(parsed.datasets);
          component.setState({
            fromAPI: datasets,
            checked: [],
            sort: 'update'
          });
        }
      });
  }

  render ({}, {fromAPI, checked}) {
    const component = this;
    if (fromAPI) {

      // Turn datasets to listings
      const listings = component
              .applyFilters()
              .map ((dataset) => h(Listing, dataset));

      // Count categories to render category filter
      const categories = fromAPI.map ( (dataset) => dataset.category).sort();
      let categoryCounts = {};
      categories.forEach( (category) => {
        if (!categoryCounts[category]) {
          categoryCounts[category] = 1;
        } else {
          categoryCounts[category] += 1;
        }
      });

      // Render!
      return  h(
        'div', {class: 'content-internal'},
        h('a', {class:'button button-filter', href:''}, labels['filter-title']),
        h('div', {class: 'sidebar'},
          h('h5', {}, labels['filter-title']),
          h('form', {},
            h(CategoryFilter, {
              categories: categoryCounts,
              checked: checked,
              onClick: component.onCheckCategory
            })
           )
         ),
        h('div', {class: 'content-sidebar'},
          h('h6', {class: 'content-sidebar-header'}, `Showing ${listings.length} Datasets`),
          h(SortFilter, {sort: component.state.sort, onSort: component.onSort}),
          h('ul', {class: 'list-type-none'}, listings)
         )
      );
    }
    else {
      return h('div', {class: 'content=sidebar'});
    }
  }
}

const content = document.getElementById('wrapper-content');
render(h(DatasetList), content);
