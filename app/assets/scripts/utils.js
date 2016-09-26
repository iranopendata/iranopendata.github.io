// Map from labels to css identifiers
const categoryMap = {
  'Population': 'population',
  'Natural Resources and Energy': 'energy',
  'Employment and Household Economy': 'employment',
  'Women': 'women',
  'Economic Sectors': 'economics',
  'Banking and Finance': 'banking',
  'Budget and Government Spending': 'budget',
  'Housing': 'housing',
  'Transport': 'transport',
  'Trade': 'trade',
  'Health Sector Performance': 'health',
  'Education' : 'education',
  'Crime and Social Pathology': 'crime',
  'Environment': 'environment',
  'Communications': 'communications'
};

const invCategoryMap = {};
for (var prop in categoryMap) {
  invCategoryMap[categoryMap[prop]] = prop;
}

/* Takes dataset from the API
 * and maps it to an object
 * suitable for rendering
 */
function transformDatasetFromIndex (dataset, lang) {
  lang = lang || PAGE_LANG;

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
    'title': title[lang],
    'description': description[lang],
    'period': dataset.period,
    'source': dataset.source,
    'format': dataset.format,
    'updated_at': dataset.updated_at,
    'name': dataset.name
  };
}

function transformDatasetFromAPI (dataset, lang) {
  lang = lang || PAGE_LANG;
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
    'title': title[lang],
    'url': dataset.resources[0].url,
    'description': description[lang],
    'period': dataset.period,
    'source': dataset.resources[0].sources[0].name,
    'format': dataset.resources[0].schema.format,
    'updated_at': dataset.updated_at,
    'name': dataset.name,
    'source_url': dataset.resources[0].sources[0].web,
    'maintainer': dataset.maintainer,
    'frequency': dataset.frequency,
    'license': dataset.license,
    'keywords': dataset.keywords.join(', ')
  };
}

module.exports.categoryMap = categoryMap;
module.exports.invCategoryMap = invCategoryMap;
module.exports.transformDatasetFromIndex = transformDatasetFromIndex;
module.exports.transformDatasetFromAPI = transformDatasetFromAPI;
