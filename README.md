# Iran Open Data Website

## Adding a dataset
Adding a dataset on Github can be done through the [Github UI](https://help.github.com/articles/creating-new-files/). Make sure to create a new branch so that contributors can review the proposed change.

### Prerequisite
Add the dataset to the [IOD Catalog](https://github.com/iranopendata/catalog) with a unique identifier such as `gdp` or `writersblock`. This allows us to link the API with issues, notes and use cases in the website.

### File parameters
Add a new Markdown (.md) file to `app/_en_datasets` and `app/_fa_datasets` using the identifier as a filename.

```
---
collection: dataset
title: Title of the dataset
lang: en or fa
id: The unique identifier
layout: dataset
date: Current date
notes: text describing a note
related:
   - Name of Usecase
   - Name of Usecase 2
---
```

The use case names are taken from the title tag of the entries in the `app/_usecases` directory.

## Adding a use case
Add an entry to `app/_usecases`.

```
---
collection: usecases
title: Name of Usecase 
source: Name of source
description: Description of this use case
link: http://developmentseed.org
img: imagename (linked to app/assets/graphics/imagename)
featured: yes or no
lang: en or fa
---
```


## Development
First clone this repository

### Launch locally

    $ npm install
    $ npm run serve
    
