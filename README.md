# This is forked from: https://github.com/DanteWinters/lux-power-distribution-card
It's purpose is purely to link back to Dante's card and not to take any credit as he has done an amazing job on this. 



# LuxPower Distribution Card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/DanteWinters/lux-power-distribution-card?style=flat-square)
![Github stars](https://img.shields.io/github/stars/DanteWinters/lux-power-distribution-card?style=flat-square)
![Github issues](https://img.shields.io/github/issues/DanteWinters/lux-power-distribution-card?style=flat-square)

A simple power distribution card of an inverter and battery system, for [Home Assistant](https://home-assistant.io/). The card is modelled after LuxpowerTek's app and website.

<img src="https://raw.githubusercontent.com/DanteWinters/lux-power-distribution-card/main/docs/images/full-card-allocated-power.png" width="450" />

## Installation

### HACS

This card has been added to the list of default HACS frontend elements. Search for the name on HACS, and download from there to install.

## Adding the card to the dashboard

### Configuration

See https://github.com/DanteWinters/lux-power-distribution-card/blob/main/docs/config/config.md for a list of required configurations


### Example Configuration

Single Inverter Example:  https://github.com/DanteWinters/lux-power-distribution-card/blob/main/docs/config/lux_single_no_sn.yaml
Dual Inverters Example: https://github.com/DanteWinters/lux-power-distribution-card/blob/main/docs/config/lux_dual_no_sn.yaml

## LuxpowerTek integration

The LuxpowerTek integration is hosted in a private repository by [Guy Wells](https://github.com/guybw).

## Known issues

### Card not loading issue

With this card, there has been multiple instances of the card not loading. From my experience, the best way to fix this is to clear the cache and it should load. I can give instructions for both Android mobile devices and the browser.

#### Android

1. Find *Home Assistant* in the list of apps in settings.
2. This step may differ depending on the Android device. Find anything that indicates data used or storage.
3. When there, find the option to clear all the data (cache and storage). Clearing this will log you out of the app and you'll need to log in again.
4. Card should then show up. If it doesn't, please log a bug.

#### Web browser

1. With the page open, open the developer console on the browser. Usually it's *F12*.
2. Click on the refresh button.
3. Rick-click on the refresh button to open a menu.
4. Choose the option *Empty Cache and Hard Reload*, or the option closest to this description.

## Developer's note

Although the card is functional and even has a few nice features, the development of it was done with a lot of inexperience. From my side, I do not have JavaScript or HTML experience other than this card. For this reason, there may be many ways I implemented things that aren't optimal or safe. If you are knowledgeable in and willing to look through the code, and advice and help will be much appreciated.

In addition, I currently only have 1 inverter. So the tests for the parallel inverters were done purely in a testing environment and may have some bugs.
