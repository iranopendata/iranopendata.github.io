import {h, Component} from 'preact';
import {categoryMap, transformDatasetFromIndex} from '../utils';

import 'whatwg-fetch';
import moment from 'moment';

import CategoryFilter from './CategoryFilter';
import DateFilter from './DateFilter';
import SortFilter from './SortFilter';
import Listing from './Listing';

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
  document.querySelector('body').classList.remove('filter-overlay');
}

class DatasetList extends Component {
  constructor () {
    super();

    this.transformDatasets = this.transformDatasets.bind(this);
    this.onCheckCategory = this.onCheckCategory.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onSort = this.onSort.bind(this);
    this.mobileFilterOpen = this.mobileFilterOpen.bind(this);
    this.mobileFilterCancel = this.mobileFilterCancel.bind(this);

    this.APIUrl = 'http://iranopendata.org/catalog/index.json';
    if (process.env.NODE_ENV == 'development') {
      this.APIUrl = 'http://localhost:8000/index.json';
    }
  }

  transformDatasets (datasets) {
    return datasets.map ( (dataset) => transformDatasetFromIndex(dataset));
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
        return dataset.category.reduce(function (prevItem, curItem) {
           return checkedSet.has(curItem) || prevItem;
        }, false);
      });
    }

    // Filter datasets by date
    const {min, max}  = component.state.selectedDates;
    newDatasets = newDatasets.filter((dataset) => {
      // only filter if the dataset covers a period
      if (dataset.period.length > 0) {
        return dataset.period[0] <= max && dataset.period[1] >= min;
      } else { return true;}
    });

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
        const datasetsThatHavePeriod = datasets.filter((dataset) => {
          return dataset.period.length > 0;
        })
        let minMaxDates = {min: datasetsThatHavePeriod[0].period[0], max: datasetsThatHavePeriod[0].period[1]};
        datasetsThatHavePeriod.forEach( (dataset) => {
          let min, max;
          [min, max] = dataset.period;
          if (min < minMaxDates.min) { minMaxDates.min = min;}
          if (max > minMaxDates.max) { minMaxDates.max = max;}
        });

        component.setState({
          fromAPI: datasets,
          checked: [],
          selectedDates: minMaxDates,
          minMaxDates: Object.assign({}, minMaxDates),
          sort: 'update'
        });
      })
      .catch(function (err) {
        console.error('Could not fetch data', err);
      })
    ;
  }

  mobileFilterOpen (e) {
    e.preventDefault();
    const component = this;
    component.tempState = Object.assign({}, component.state);

    filterDatasets(e);
  }

  mobileFilterCancel (e) {
    e.preventDefault();
    const component = this;
    component.setState(component.tempState);

    closeDataFilter(e);
  }
  render ({}, {fromAPI, checked, selectedDates, minMaxDates}) {
    const component = this;
    if (fromAPI) {

      // Filter the datasets
      const datasets = component.applyFilters();

      // Turn datasets to listings
      const listings = datasets.map ((dataset) => h(Listing, dataset));

      // Count categories to render category filter
      const categories = fromAPI.map ( (dataset) => dataset.category).reduce((a, b) => {
        // flatten arrays
        return a.concat(b);
      }).sort();

      let categoryCounts = {};
      categories.forEach( (category) => {
        if (!categoryCounts[category]) {
          categoryCounts[category] = 1;
        } else {
          categoryCounts[category] += 1;
        }
      });

      // Render!
      let listing_length = listings.length;
      let sentence = [labels['showing'], listings.length, labels['datasets']];
      let sentenceJoined = sentence.join(' ');
      if (PAGE_LANG === 'fa') {
        sentenceJoined = sentence.reverse().join(' ');
      }
      return  h(
        'div', {class: 'content-internal wrapper-datasets'},
        h('a', {class:'button button-filter', onclick:component.mobileFilterOpen, href: ''}, labels['filter-title']),
        h('div', {class: 'sidebar'},
        	h('div', {class: 'icon-close', onclick:component.mobileFilterCancel}, labels['Close']),
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
          	h('a', {class: 'button button-filter-apply', href:'', onclick:closeDataFilter}, labels['button-apply']),
          	h('a', {class: 'button button-grey button-filter-cancel', href:'', onclick:component.mobileFilterCancel}, labels['button-cancel']),
          ),
         ),
        h('div', {class: 'content-sidebar'},
          h('h6', {class: 'content-sidebar-header'}, sentenceJoined),
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

module.exports = DatasetList;
