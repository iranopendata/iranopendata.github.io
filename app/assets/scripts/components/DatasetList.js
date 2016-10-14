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

class DatasetList extends Component {
  constructor () {
    super();

    this.transformDatasets = this.transformDatasets.bind(this);
    this.onCheckCategory = this.onCheckCategory.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onSort = this.onSort.bind(this);

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
        return checkedSet.has(dataset.category);
      });
    }

    // Filter datasets by date
    const {min, max}  = component.state.selectedDates;
    newDatasets = newDatasets.filter((dataset) => {
      return dataset.period[0] <= max && dataset.period[1] >= min;
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
        h('a', {class:'button button-filter', href:'', onclick:filterDatasets}, labels['filter-title']),
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

module.exports = DatasetList;
