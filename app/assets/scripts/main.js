import {h, render, Component} from 'preact';
import fetch from 'fetch';

import {categoryMap, invCategoryMap} from './utils';
import CategoryFilter from './components/CategoryFilter';

const PAGE_LANG = PAGE_LANG || 'fa';

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

    this.APIUrl = '/catalog/index.json';
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = 'http://10.1.10.114:8000/index.json';
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

  applyFilters () {
    const component = this;

    let newDatasets = component.state.fromAPI;
    console.log('[applyFilters]', component.state.checked);

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
        'div', {class: 'content-internal wrapper-datasets'},
        h('a', {class:'button button-filter', href:'', onclick:filterDatasets}, labels['filter-title']),
        h('div', {class: 'sidebar'}, 
        	h('a', {class: 'icon-close', href:''}, labels['Close']),
          h('h5', {}, labels['filter-title']),
          h('form', {},
            h(CategoryFilter, {
              categories: categoryCounts,
              checked: checked,
              onClick: component.onCheckCategory
            })
          ),
          h('div', {class:'filter-buttons-mobile'},
          	h('a', {class: 'button', href:''}, labels['button-apply']),
          	h('a', {class: 'button button-grey', href:''}, labels['button-cancel']),
          ),
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

function hamburgerClick (e) {
	e.preventDefault()
	var navClassList = document.querySelector('.nav-mobile').classList
	if (!navClassList.contains('open')) {
		e.stopPropagation()
	  navClassList.add('open');
	}
}

function closePrimaryNav () {
  document.querySelector('.nav-mobile').classList.remove('open');
}	


function scrollTo (e) {
	e.preventDefault()
	var resourceClassList = document.querySelector('.dropdown-resources-options').classList
	if (!resourceClassList.contains('open')) {
		e.stopPropagation()
	  resourceClassList.add('open');
	}
}

function closeResourceList () {
  document.querySelector('.dropdown-resources-options').classList.remove('open');
}	


function filterDatasets (e) {
	e.preventDefault()
	var filterClassList = document.querySelector('.sidebar').classList
	if (!filterClassList.contains('open')) {
		e.stopPropagation()
	  filterClassList.add('open');
	}
}

function closeDataFilter () {
  document.querySelector('.sidebar').classList.remove('open');
}	


function onReady () {
	document.querySelector('.menu-hamburger').addEventListener('click', hamburgerClick);
	document.addEventListener('click', closePrimaryNav);

	var dropdown = document.querySelector('.dropdown-sm');
	if (dropdown) {
		dropdown.addEventListener('click', scrollTo);
		document.addEventListener('click', closeResourceList);
	}

	document.addEventListener('click', closeDataFilter);
}


const content = document.getElementById('wrapper-content');
if (content) {
	render(h(DatasetList), content);	
}

if (document.readyState != 'loading'){
  onReady();
} else {
  document.addEventListener('DOMContentLoaded', onReady);
}



