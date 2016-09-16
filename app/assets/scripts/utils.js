
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

module.exports.categoryMap = categoryMap;
module.exports.invCategoryMap = invCategoryMap;
