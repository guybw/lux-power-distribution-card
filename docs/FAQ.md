# FAQ's

## Card not loading after an update

There are a few reasons why the card can break after an update. Here are some with fixes:

### Config changes

The goal is to avoid changing the config during updates, but it does happen. In these cases, the release will come with a warning on the release and the documentation will be updated.

### Card not loading issue

It has happened many times that the card loads incorrectly because it still uses the cached version of the card in the backend. Fix this by clearing the cache after an update. HACS recommends you clear the front end cache after an update to a frontend card.

#### Android

1. Find *Home Assistant* in the list of apps in settings.
2. This step may differ depending on the Android device. Find anything that indicates data used or storage.
3. When there, find the option to clear all the data (cache and storage). Clearing this will log you out of the app and you'll need to log in again.
4. Card should then show up. If it doesn't, please log a bug.

#### iOS

1. Settings
2. Companion App
3. Debugging
4. Reset frontend cache

#### Web browser

1. With the page open, open the developer console on the browser. Usually it's *F12*.
2. Click on the refresh button.
3. Rick-click on the refresh button to open a menu.
4. Choose the option *Empty Cache and Hard Reload*, or the option closest to this description.
