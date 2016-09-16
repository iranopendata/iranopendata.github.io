import {h, render, Component} from 'preact';
import fetch from 'fetch';

import {categoryMap, invCategoryMap} from './utils';
import CategoryFilter from './components/CategoryFilter';

/* Takes dataset from the API
 * and maps it to an object
 * suitable for rendering
 */
function transformDatasetFromIndex (dataset) {
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
      'updated_at': dataset.updated_at,
      'name': dataset.name
    };
}

function transformDatasetFromAPI (dataset) {
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
    'url': dataset.resources[0].url,
    'description': description[PAGE_LANG],
    'period': dataset.period,
    'source': dataset.resources[0].sources[0].name,
    'format': dataset.resources[0].schema.format,
    'updated_at': dataset.updated_at,
    'name': dataset.name
  };
}

class Listing extends Component {
  render ({
    category,
    title,
    description,
    format,
    source,
    updated_at,
    name
  }, {}) {

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
}

class Dataset extends Component {
  constructor () {
    super();

    this.id = DATASET_ID;

    this.APIUrl = `/catalog/datasets/${this.id}.json`;
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = `http://localhost:8000/datasets/${this.id}.json`;
    }
  }

  componentWillMount () {
    const component = this;
    fetch.fetchUrl(
      component.APIUrl,
      function (err, meta, body) {
        if (err) {
          // Handle error
          console.error('Could not fetch data');
        } else {
          const parsed = JSON.parse(body.toString());
          component.setState(transformDatasetFromAPI(parsed));
        }
      });
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
          h('dt', {class: 'metadata-item metadata-item-header'}, 'Source'),
          h('dd', {class: 'metadata-item'}, source),

          h('dt', {class: 'metadata-item metadata-item-header'}, 'Dates'),
          h('dd', {class: 'metadata-item'}, `${period[0]} - ${period[1]}`),

          h('dt', {class: 'metadata-item metadata-item-header'}, 'Formats'),
          h('dd', {class: 'metadata-item'},
            h('span', {class: 'element-file-type element-file-type-lg'}, format)
           ),

          h('dt', {class: 'metadata-item metadata-item-header'}, 'ID'),
          h('dd', {class: 'metadata-item'}, name)
         ),
        h('a', {class: 'button', href: url}, lang['button-download']),
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



class DatasetList extends Component {

  constructor () {
    super();

    this.transformDatasets = this.transformDatasets.bind(this);
    this.onCheckCategory = this.onCheckCategory.bind(this);

    this.APIUrl = '/catalog/index.json';
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = 'http://localhost:8000/index.json';
    }
  }

  transformDatasets (datasets) {
    return datasets.map (transformDatasetFromAPI);
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
                         checked: []
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
      const categories = fromAPI.map ( (dataset) => dataset.category);
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
          h('div', {class: 'sort-filter'},
            h('span', {class: 'sort-filter-header'}, 'Sort by'),
            h('div', {class: 'dropdown-sm'}, 'Recent Updates')
           ),
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
if (content) {
  render(h(DatasetList), content);
}

const dataset = document.getElementById('wrapper-content-dataset');
if (dataset) {
  render(h(Dataset), dataset);
}
