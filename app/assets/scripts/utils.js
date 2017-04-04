// Map from labels to css identifiers
const categoryMap = {
  'fa': {
    'population': 'جمعیت', 
    'energy': 'منابع طبیعی و انرژی',
    'employment': 'اشتغال و اقتصاد خانوار',
    'women': 'زنان',
    'economics': 'بخش های اقتصادی',
    'banking': 'مالی و بانکی',
    'budget': 'بودجه و هزینه های دولت',
    'housing': 'مسکن',
    'transport': 'حمل و نقل',
    'trade': 'تجارت',
    'health': 'بهداشت',
    'education': 'آموزش',
    'crime': 'جرایم و آسیب های اجتماعی',
    'environment': 'محیط زیست',
    'communications': 'ارتباطات',
    'elections': 'قوانین و انتخابات'
  
  }, 
  'en': {
    'population': 'Population', 
    'energy': 'Natural Resources and Energy',
    'employment': 'Employment and Household Economy',
    'women': 'Women',
    'economics': 'Economic Sectors',
    'banking': 'Banking and Finance',
    'budget': 'Budget and Government Spending',
    'housing': 'Housing',
    'transport': 'Transport',
    'trade': 'Trade',
    'health': 'Health Sector Performance',
    'education': 'Education',
    'crime': 'Crime and Social Pathology',
    'environment': 'Environment',
    'communications': 'Communications',
    'elections': 'Election and Regulations'
  
  }
};


const frequencyMap = {
  'fa': {
    'daily': 'روزانه',
    'weekly': 'هفتگی',
    'monthly': 'ماهانه',
    'quarterly': 'فصلی',
    'yearly': 'سالانه'
  },
  'en': {
    'daily': 'Daily',
    'weekly': 'Weekly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'yearly': 'Yearly'
  }
};

const invCategoryMap = {};
for (var prop in categoryMap) {
  invCategoryMap[categoryMap[prop]] = prop;
}

  /*
   * Takes an array of objects, each object 
   * having a lang and text fields and turns
   * the array into an object where the lang value is 
   * the key and the text value is the value
   */
function invertLangArray(langArray) {
  let retObject = {};

  langArray.forEach( (item) => {
    retObject[ item["lang"] ] = item["text"];
  })

  return retObject;
}

  /*
   * Takes an array of objects, each object 
   * having a lang and link fields and returns
   * a download link according to the page lang.
   * If there is only one item in the array return
   * the item.
   */
function createDownloadURL(langArray) {
  if (langArray.length == 1) {
    return langArray[0].link;
  } else {
    let retObject = {};
    langArray.forEach( (item) => {
      retObject[item["lang"]] = item["link"];
    })
    return retObject[PAGE_LANG];
  }
}

  /* Takes dataset from the API
   * and maps it to an object
   * suitable for rendering
   */
function transformDatasetFromIndex (dataset, lang) {
  lang = lang || PAGE_LANG;

  let title = invertLangArray(dataset.title);
  let description = invertLangArray(dataset.description);
  let source = invertLangArray(dataset.source);

  return {
    'category': dataset.category,
    'title': title[lang],
    'description': description[lang],
    'period': dataset.period || [],
    'source': source[lang],
    'format': dataset.format,
    'updated_at': dataset.updated_at,
    'name': dataset.name
  };
}

function transformDatasetFromAPI (dataset, lang) {
  lang = lang || PAGE_LANG;

  let title = invertLangArray(dataset.title);
  let description = invertLangArray(dataset.description);
  let source = invertLangArray(dataset.author.name);
  let maintainer = invertLangArray(dataset.maintainer);

  let keywords = {};
  dataset.keywords.forEach(function (item) {
    keywords[ [item["lang"]]] = item["wordlist"].join(", ");
  });

  return {
    'category': dataset.category,
    'title': title[lang],
    'url': createDownloadURL(dataset.resources[0].url),
    'description': description[lang],
    'period': dataset.period || [],
    'source': source[lang],
    'format': dataset.resources[0].schema.format,
    'updated_at': dataset.updated_at,
    'indexed_at': dataset.indexed_at,
    'name': dataset.name,
    'source_url': dataset.author.web,
    'maintainer': maintainer[lang],
    'frequency': dataset.frequency ? frequencyMap[lang][dataset.frequency]: "",
    'license': dataset.license,
    'keywords': keywords[lang]
  };
}

module.exports.categoryMap = categoryMap;
module.exports.invCategoryMap = invCategoryMap;
module.exports.transformDatasetFromIndex = transformDatasetFromIndex;
module.exports.transformDatasetFromAPI = transformDatasetFromAPI;
