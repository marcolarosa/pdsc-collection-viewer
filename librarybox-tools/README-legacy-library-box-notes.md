# Working with a LibraryBox.

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [You have a working LibraryBox](#you-have-a-working-librarybox)
	- [One time device configuration](#one-time-device-configuration)
	- [Get the viewer and your data on to the disk](#get-the-viewer-and-your-data-on-to-the-disk)
		- [What does the script do?](#what-does-the-script-do)
	- [Install the disk into the LibraryBox and Test](#install-the-disk-into-the-librarybox-and-test)
- [Re-building a librarybox](#re-building-a-librarybox)
- [Getting in to a LibraryBox](#getting-in-to-a-librarybox)

<!-- /TOC -->

```
# Library Box GUI Installer
The notes on this page are not meant for general users. There is a LibraryBox
GUI application for you. More notes to come...

TODO: add a link to the GUI somewhere.
```

Following are some general notes on working with a LibraryBox.

The notes progress from least complicated to most. That is,
the very next section is what you want to read if you have a working LibraryBox
(regardless of how that happened) whilst the last is what to do if you think
you've [bricked your device](<https://www.wikiwand.com/en/Brick_(electronics)>) or
you just can't get in.

Sadly, the documentation on the LibraryBox website is rather limited so
you might need to read up on [OpenWrt](https://wiki.openwrt.org) (the
firmware that runs the device) and [PirateBox](https://piratebox.cc/)
(the operating system that LibraryBox has been created from).

Let's begin.

## You have a working LibraryBox

You bought one ready made or you created one - either way, when you connect
to the device over wifi and browse to http://192.168.1.1 you see the following
in your browser:

![Alt text](./librarybox-home-page.png?raw=true 'Library Box Home Page')

### One time device configuration

In order to support the viewer you'll need to do some 'tweaking' of the operating
system on the device...

* Is a root password set on the device? Check and set one if not.
    - NB: Setting a root password disables telnet and starts SSH so if you can't get in and you don't know the root password you will probably have to get in to failsafe mode and rebuild the device. [Getting in to a LibraryBox](#getting-in-to-a-librarybox)


```
> telnet 192.168.1.1

If you get in then set a root passwd, viz:
> passwd
Follow the prompts and log out when you're done. Try logging in again with telnet.

> telnet 192.168.1.1
You should get a message saying "Login failed. Connection closed by foreign host." or "Connection refused".

Now try to SSH in to the device using the password you just set:
> ssh -A root@192.168.1.1
You should get in. If you don't, jump to section [Getting in to a LibraryBox](#getting-in-to-a-librarybox)
```

* Change the web server setup.

```
> cd /opt/piratebox
> mv www www.orig
> ln -sf /mnt/usb/LibraryBox/www www
```

* Update configuration files

The following commands need to be run on the device by SSH'ing in OR can directly edit the files
on your computer when you mount the USB disk (these files live on the USB disk and they tell the system how to configure itself).

```
> cd /mnt/usb/LibraryBox/Config
> sed -i 's/librarybox.lan/catalog.paradisec.offline/' hostname.txt
> sed -i 's/librarybox.lan/catalog.paradisec.offline/' system_hostname.txt
> sed -i 's/LibraryBox - Free Content!/PARADISEC Catalog/' ssid.txt
> echo no > librarybox_ftp.txt
> echo no > librarybox_ftpadmin.txt
> echo no > librarybox_ftpanon.txt
> echo no > librarybox_ftpsync.txt
> echo no > librarybox_shoutbox.txt
```

### Get the viewer and your data on to the disk

* Turn off the device and mount the USB in to your computer

* (Assuming you are on a Mac or Linux computer) Open up a terminal and run `df -h`. Identify the disk mountpoint. On my Mac it is `/Volumes/LB`. Depending on the name of the disk it might be called something else. Note it down.

* Get the collection viewer repository, if you don't already have it, and set it up:

```
    > git clone git@github.com:marcolarosa/pdsc-collection-viewer.git
    > cd pdsc-collection-viewer
    > npm install
        - this can take a while - get a coffee :-)
```

* Build a version of the viewer for the LibraryBox

```
You should be in the `pdsc-collection-viewer` folder
> npm run build:deploy-librarybox

This will create a folder `dist` which will contain the viewer code in a form
suitable for distribution (ie installation onto a library box).
```

* Install the viewer and your data onto the LibraryBox

Let's assume you have some data in a folder called `collections` in your
home directory (the path is ~/collections). The content in that folder needs
to be organised as {collectionId} with a subfolder for each item of that
collection you want transferred to the LibraryBox; e.g.:

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

To install the viewer and this data onto the LibraryBox you would run
(from within the `pdsc-collection-viewer` folder) the following command:

```
> node librarybox-tools/data-loader.js \
    --viewer ./dist \
    --data-path ~/collections \
    --library-box-path /Volumes/LB
```

Let's step through this:

* `--viewer` option tells the script where the viewer code is. It will always be in the `dist` folder.
* `--data-path` option tells the script where your data is located. In this example it is in the collections folder in the HOME directory.
* `--library-box-path` option tells the script where the disk is mounted. You noted that earlier.

#### What does the script do?

When you run the script it will:

* ask if you've recently built a version of the viewer - follow the prompts;
* ask you to verify the install locations - follow the prompts;
* install the viewer on the LibraryBox disk;
* determine which collections / items you wish to copy to the box;
* download the required metadata from Nabu for each item;
* verify the contents of the item folder against the metadata
* copy the verified content across to the LibraryBox disk
* create an index file for the items with all of the metadata.

If there are errors (the script can't find expected files) fix them up
and re-run the script again. You can repeat this step until there are no
further errors.

### Install the disk into the LibraryBox and Test

* Unmount the USB disk from your computer.
* Plug it in to the LibraryBox and turn the device on.
* Wait for the device to startup (3 lights on the face of the device should be green).
* Connect to the wireless named `PARADISEC Catalog`.
* Open up `http://catalog.paradisec.offline` in your browser.

If all went well you should see the viewer homepage:

![Alt text](./librarybox-viewer-installed-home-page.png?raw=true 'Library Box Home Page')

## Re-building a LibraryBox

Assuming you can get in (via telnet if you've not set a root password or SSH if you have), run the following commands:
```
> rm -r /overlay/*
> mtd -r erase rootfs_data
```

Once the device reboots, telnet in to the device and do the following:
```
> cd /mnt/usb/install
> mv auto_package_done auto_package
> cd /bin
> ./box_installer.sh
You should see a lot happening - hopefully the LibraryBox is actually installing.

When complete - reboot the device:
> reboot
```

At this point you will need to wait for the device to restart `a couple of times`; then,
follow the notes from ['You have a working LibraryBox'](#you-have-a-working-librarybox).

## Getting in to a LibraryBox

You've bricked it or you forgot the password - whatever; to access failsafe mode
read the instructions at https://wiki.openwrt.org/doc/howto/generic.failsafe

## Troubleshooting

* You can't load the viewer in the browser
    - You've connected to the LibraryBox wifi and your computer has an IP address.
    - You try to load http://catalog.paradisec.offline and nothing happens.
    - You can get in to the device so run `netstat -tnlp`. Does the output look like:
![Alt text](./librarybox-processes.png?raw=true 'Library Box Process list')
    - Notice the line with `0.0.0.0:80`? That's the webserver. If you don't see that try rebooting the device and if it still doesn't come up then start again - see [Re-building a librarybox](#re-building-a-librarybox)
