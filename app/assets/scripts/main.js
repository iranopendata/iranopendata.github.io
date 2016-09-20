import {h, render, Component} from 'preact';
import 'whatwg-fetch';
import moment from 'moment';

import {categoryMap, invCategoryMap} from './utils';
import CategoryFilter from './components/CategoryFilter';
import DateFilter from './components/DateFilter';
import SortFilter from './components/SortFilter';

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
        return json.datasets.map(transformDatasetFromIndex);
      })
      .then(function (datasets) {
        console.log(datasets);
        const filtered = datasets.filter(function (dataset) {
          return dataset.name === featured1 || dataset.name === featured2;
        });
        console.log(filtered);
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
      console.log(featured1);
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

class DatasetList extends Component {

  constructor () {
    super();

    this.transformDatasets = this.transformDatasets.bind(this);
    this.onCheckCategory = this.onCheckCategory.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onSort = this.onSort.bind(this);

    this.APIUrl = 'https://iranopendata.github.io/catalog/index.json';
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = 'http://10.1.10.114:8000/index.json';
    }
  }

  transformDatasets (datasets) {
    return datasets.map (transformDatasetFromIndex);
  }

  onCheckCategory (category) {
    const component = this;
    let checkedSet = new Set(component.state.checked || []);
    if (checkedSet.has(category)) {
      checkedSet.delete(category);
    } else {
      checkedSet.add(category);
    }

    component.setState({
      checked: Array.from(checkedSet)
    });
  }

  onSelectDate (bound, date) {
    const component = this;
    let newDates = component.state.selectedDates;
    newDates[bound] = date;
    component.setState({
      selectedDates: newDates
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

    // Filter datasets by date
    const {min, max}  = component.state.selectedDates;
    newDatasets = newDatasets.filter((dataset) => {
      console.log(dataset.period, min, max);
      return dataset.period[0] <= max && dataset.period[1] >= min;
    });
    console.log(newDatasets);

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

    fetch(component.APIUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        const datasets = component.transformDatasets(json.datasets);

        // Calculate min/max dates of datasets initially
        let minMaxDates = {min: datasets[0].period[0], max: datasets[0].period[1]};
        datasets.forEach( (dataset) => {
          let min, max;
          [min, max] = dataset.period;
          if (min < minMaxDates.min) { minMaxDates.min = min;}
          if (max > minMaxDates.max) { minMaxDates.max = max;}
        });

        component.setState({
          fromAPI: datasets,
          checked: [],
          selectedDates: minMaxDates,
          sort: 'update'
        });
      })
      .catch(function (err) {
        console.error('Could not fetch data', err);
      })
    ;
  }

  render ({}, {fromAPI, checked, selectedDates}) {
    const component = this;
    if (fromAPI) {

      // Filter the datasets
      const datasets = component.applyFilters();
      console.log(datasets);

      // Turn datasets to listings
      const listings = datasets.map ((dataset) => h(Listing, dataset));

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

      // Calculate min/max dates of datasets
      let minMaxDates = {min: datasets[0].period[0], max: datasets[0].period[1]};
      datasets.forEach( (dataset) => {
        let min, max;
        [min, max] = dataset.period;
        if (min < minMaxDates.min) { minMaxDates.min = min;}
        if (max > minMaxDates.max) { minMaxDates.max = max;}
      });

      // Render!
      return  h(
        'div', {class: 'content-internal wrapper-datasets'},
        h('a', {class:'button button-filter', href:'', onclick:dataFilterBtn}, labels['filter-title']),
        h('div', {class: 'sidebar'},
        	h('a', {class: 'icon-close', href:''}, labels['Close']),
          h('h5', {}, labels['filter-title']),
          h('form', {},
            h(CategoryFilter, {
              categories: categoryCounts,
              checked: checked,
              onClick: component.onCheckCategory
            }),
            h(DateFilter, {
              minMaxDates: minMaxDates,
              selectedDates: selectedDates,
              onSelectDate: component.onSelectDate
            })
          ),
          h('div', {class:'filter-buttons-mobile'},
          	h('a', {class: 'button button-filter-apply', href:''}, labels['button-apply']),
          	h('a', {class: 'button button-grey button-filter-cancel', href:''}, labels['button-cancel']),
          ),
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

function hamburgerClick (e) {
	e.preventDefault();
	var navClassList = document.querySelector('.nav-mobile').classList;
	if (!navClassList.contains('open')) {
		e.stopPropagation();
	  navClassList.add('open');
	}
}

function closePrimaryNav () {
  document.querySelector('.nav-mobile').classList.remove('open');
}


function scrollTo (e) {
	e.preventDefault();
	var resourceClassList = document.querySelector('.dropdown-resources-options').classList;
	if (!resourceClassList.contains('open')) {
		e.stopPropagation();
	  resourceClassList.add('open');
	}
}

function closeResourceList () {
  document.querySelector('.dropdown-resources-options').classList.remove('open');
}


function filterDatasets (e) {
	e.preventDefault();
	var filterClassList = document.querySelector('.sidebar').classList;
	var filterClassListBody = document.querySelector('body').classList;
	if (!filterClassList.contains('open')) {
		e.stopPropagation();
	  filterClassList.add('open');
	}
	if (!filterClassListBody.contains('filter-overlay')) {
		e.stopPropagation();
	  filterClassListBody.add('filter-overlay');
	}
}

function closeDataFilter (e) {
	e.preventDefault();
  document.querySelector('.sidebar').classList.remove('open');
}

function reviseDataFilter () {
  document.querySelector('body').classList.remove('filter-overlay');
}

function dataFilterBtn (e) {
	filterDatasets(e);
}


function onReady () {
	var hamburger = document.querySelector('.menu-hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', hamburgerClick);
  }

	document.addEventListener('click', closePrimaryNav);

	var dropdown = document.querySelector('.dropdown-sm');
	if (dropdown) {
		dropdown.addEventListener('click', scrollTo);
		document.addEventListener('click', closeResourceList);
	}

	var buttonFilterApply = document.querySelector('.button-filter-apply');
  if (buttonFilterApply) {
    buttonFilterApply.addEventListener('click', closeDataFilter);
  }

	var buttonFilterCancel = document.querySelector('.button-filter-cancel');
  if (buttonFilterCancel) {
     buttonFilterCancel.addEventListener('click', closeDataFilter);
  }


	var iconClose = document.querySelector('.icon-close');
  if (iconClose) {
     iconClose.addEventListener('click', closeDataFilter);
  }

	document.addEventListener('click', reviseDataFilter);
  window.scrollTo(0, 1)
  window.scrollTo(0, 0)
}


const content = document.getElementById('wrapper-content');
if (content) {
  render(h(DatasetList), content);
}

const dataset = document.getElementById('wrapper-content-dataset');
if (dataset) {
  render(h(Dataset), dataset);
}

const featuredList = document.getElementById('featured-homepage');
if (featuredList) {
  render(h(FeaturedList), featuredList);
}

if (document.readyState != 'loading'){
  onReady();
} else {
  document.addEventListener('DOMContentLoaded', onReady);
}
