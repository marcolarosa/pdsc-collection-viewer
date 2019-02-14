# Paradisec Collection Viewer

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Paradisec Collection Viewer](#paradisec-collection-viewer)
  - [Preamble](#preamble)
    - [Features](#features)
  - [URL structure](#url-structure)
  - [Setup](#setup)
  - [Developing the online version.](#developing-the-online-version)
  - [Developing the LibrayBox Version.](#developing-the-libraybox-version)
  - [Building a distribution](#building-a-distribution)
    - [Deploy to TESTING](#deploy-to-testing)
    - [Deploy to PRODUCTION](#deploy-to-production)
    - [Deploy to LibraryBox](#deploy-to-librarybox)
  - [Items with varying types useful for testing](#items-with-varying-types-useful-for-testing)

<!-- /TOC -->

## Preamble

This repository contains the code for the [PARADISEC Catalog](https://github.com/nabu-catalog/nabu) Viewer. The viewer is
an AngularJS (v1) application that reads the OAI data feed and then contructs
a datasource to drive the application; loading data from the catalog when
the user is logged in.

Read on for information about developing this application and deploying it
to different targets. Bear in mind that this application has two modes of
operation: Online and LibraryBox.

-   Online mode refers to the instance that is deployed on Nabu. This mode assumes the user `has an internet connection` so all data is loaded over
    the network.
-   The second mode refers to an instance that is deployed on a LibraryBox. This mode assume the user `does not have an internet connection` other than the one to the LibraryBox itself. In this mode the datasource needs to be pre-constructed and installed on the LibraryBox with the data it is to serve.
    -   Detailed information on how to install the viewer and data onto a LibraryBox can be found at [LibraryBox Tools](librarybox-tools/README.md).

### Features

-   information, files, image, media, document and transcripts viewers
-   fully responsive
-   deep linking to all resources
-   scrolling transcript support as media playing
-   media jump to segment from transcript
-   the EAF parser supports EAF files with multiple tiers.

## URL structure

As the viewer is designed to display item resources (and given that at the
time of writing Nabu does not provide a data feed for collections) the URL
structure in Online mode is:

```
http://{localhost | vm IP address}:9000/#/{collectionId}/{itemId}
```

If both collectionId and itemId are not provided the viewer will redirect
to Nabu's home page as it does not know what to load.

For LibraryMode the behaviour is slightly different. Navigating to the root
of the viewer does not redirect to Nabu as a datasource describing what is
installed on the LibraryBox is used to render a view of the available
collections.

```
http://{localhost | vm IP address}:9000/#/
```

## Setup

You need nodejs installed (version 8 or greater). See [here](https://nodejs.org/en/download/) for what to do for your
system. Once nodejs is setup run `npm install` to install the packages.

As this application loads data from NABU and given that NABU does not allow requests from outside domains (in
the parlance: NABU does not have CORS enabled) you will also need to set your host to man in the middle requests
to NABU.

Clone the repo @ https://github.com/marcolarosa/nginx-cors-plus and build the docker container then run it with:

```
> docker run -it --rm -p 80:80 -e TARGET="http://catalog.paradisec.org.au" nginx-cors-proxy
```

Then, edit your /etc/hosts file and add `catalog.paradisec.org.au` to the line starting with `127.0.0.1`. It should
look something like this:

```
127.0.0.1	localhost catalog.paradisec.org.au
```

This then results in requests from the viewer to catalog.paradisec.org.au to be sent to the proxy container just started
which adds the relevant CORS headers whilst proxying to the real NABU server.

## Developing the online version.

```
> npm run develop:online
```

This will give you a webpack based build (in dist) with livereload.

OR via a docker container:

```
> TARGET="online" docker-compose up
```

## Developing the LibrayBox Version.

```
> npm run develop:librarybox
```

You will need the [librarybox-installer](https://github.com/marcolarosa/pdsc-librarybox-installer). Set it up and then follow the notes at `Building a catalog for LibraryBox Development`. Ensure you build the
catalog in the `dist` folder in this repository.

OR via a docker container:

```
> TARGET="librarybox" docker-compose up
```

## Building a distribution

### Deploy to TESTING

```
> npm run build:deploy-testing
```

OR via a docker container:

```
> TARGET="testing" docker-compose -f docker-compose-build.yml up
```

### Deploy to PRODUCTION

```
> npm run build:deploy-production
```

OR via a docker container:

```
> TARGET="production" docker-compose -f docker-compose-build.yml up
```

### Deploy to LibraryBox

```
> npm run build:deploy-librarybox
```

OR via a docker container:

```
> TARGET="librarybox" docker-compose -f docker-compose-build.yml up
```

## Items with varying types useful for testing

-   /#/AC2/VUNU105 # one image and one PDF
-   /#/AC2/ETHGS102 # image set
-   /#/AA2/003 # audio
-   /#/NT5/DickLauto # video
-   /#/SN1/MM20130708Museum # multiple: image, audio and multiple PDF documents
-   /#/EAG1/S1 : .eaf XML
-   /#/BN1/001 : .trs XML
-   /#/NT10/W08 : .trs XML
-   /#/NT10/W13 : .eaf XML
-   /#/NT1/98007 : images, audio and eopas data file
-   /#/NT5/TokelauOf : video and eopas data file
