import {h, render, Component} from 'preact';

import Dataset from './components/Dataset';
import DatasetList from './components/DatasetList';

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


function closeDataFilter (e) {
	e.preventDefault();
  document.querySelector('.sidebar').classList.remove('open');
}

function reviseDataFilter () {
  document.querySelector('body').classList.remove('filter-overlay');
}

function onReady () {
  //-------------------//
  // BUTTONS
  //-------------------//
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

  //-------------------//
  // RENDER REACT
  //-------------------//
  const content = document.getElementById('wrapper-content');
  if (content) {
    render(h(DatasetList), content);
  }

  const dataset = document.getElementById('wrapper-content-dataset');
  if (dataset) {
    render(h(Dataset), dataset);
  }

  //---------------//
  // SCROLL HACK
  //---------------//
  window.scrollTo(0, 1);
  window.scrollTo(0, 0);
}



if (document.readyState != 'loading'){
  onReady();
} else {
  document.addEventListener('DOMContentLoaded', onReady);
}
