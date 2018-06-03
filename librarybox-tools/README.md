# Working with a LibraryBox.

```
# Library Box GUI Installer
The notes on this page are not meant for general users. There is a LibraryBox
GUI application for you. More notes to come...

TODO: add a link to the GUI somewhere.
```

For general notes on working with a LibraryBox via the console server
[README-legacy-library-box-notes.md](README-legacy-library-box-notes.md).
Note that some of those notes are kept for reference despite being obsolete.

### Get data in to the dist folder for development.

Let's assume you have some data in a folder called `collections` in your
home directory (the path is ~/collections). The content in that folder needs
to be organised as {collectionId} with a subfolder for each item of that
collection you want transferred to the dist folder; e.g.:

```
YOUR HOME DIRECTORY
 |- collections
    |- NT1
       |- 20003
       |- 2004

    |- NT6
       |- 2004V001

    |- NT7
       |- 0867
       |- 0868
       |- 0869
```

SO in this example with have 3 collections in the collections folder (NT1, NT6
and NT7) and each collection has some items (20003 and 2004 in collection NT1).

Within the item folders there are the item resources (images, documents, media
etc).

IT IS CRUCIAL THAT EACH ITEM HAS A `CAT-PDSC_ADMIN.xml` FILE AS THIS IS HOW
THE SCRIPT DETERMINES THAT IT'S IN AN ITEM FOLDER.

To install the data into the dist folder:

```
> node librarybox-tools/data-loader.js \
    --data-path ~/collections \
    --output-path dist
```

Let's step through this:

* `--data-path` option tells the script where your data is located. In this example it is in the collections folder in the HOME directory.
* `--output-path` option tells the script where the data is to go.

#### What does the script do?

When you run the script it will:

* determine which collections / items you wish to copy to the box;
* extract the required metadata from the CAT XML files;
* verify the contents of the item folder against the metadata
* copy the verified content across to dist folder
* create an index file for the items with all of the metadata.

If there are errors (the script can't find expected files) fix them up
and re-run the script again. You can repeat this step until there are no
further errors.
