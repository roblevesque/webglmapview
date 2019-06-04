# Change Log

**V0.6.6** *(3-25-2019)*
* Preferences option for HTML planet and station labels. It's experimental. Feedback would be nice.
* Improve sprite based labels (5/15/2019)
* Tweak planet hitbox material
* Removed 4-1-19 specific code
* Fix FBC issue reported by T'Seeth (5/30/2019)
* ~~Add Nebulas to display. Requested by T'seeth (6/4/2018)~~
  - Removed fom being drawn for performance reasons, but Intel should report if they intersect a nebula

**V0.6.5** *(3-9-2018)*
* Add new preferences pane. Only preferences so far are: Default Frame and prediction distance

**V0.6.4** *(2-27-2018)*
* Fixes to client window resizing
* Add ship location indicator ( not implemented game side yet. Bug your local Zen )
    * Still need heading field(s) and ship owner faction to draw right ship style
* Fixed improper draw location of sensor net driven ship indicator
* Add TWC to route planning. Might be buggy. Please test.
* If you read this at all, you might be unique.

**V0.6.3** *(2-3-2018)*
* Exciting new features that shall remain secret but could lead to some other exciting things (Narrator: They didn't)
* Assorted tweaks
* Bug fix with floating point math (Reported by Kthor)
* Added border crossing warning to plan mode (Requested by Lustan)
* Unify coordinate & bearing inputs. (As requested by Spro and Kthor)
    * If you paste a space or comma separated bearing into any of the coordinate/bearing boxes it will separate it out for you
    * Additionally, if you want to type it in yourself comma, space, enter, m, and tab (as always) keys will auto advance to the next field
* Added "Dual Point Project" feature that takes two coordinates and plots a line through both of them and lists out potential intersect planets/stations (Requested by Spro)

**V0.6.2** *(1-31-2018)*
* Add Find by coordinate (Requested by Kthor)
* Fixed performance issues relating to above

**V0.6.1** *(1-16-2018)*
* Moved CHANGELOG over to read CHANGELOG.md from project and parse the markdown in Javascript. Is it overkill? Sure. Do I care? No
* Some design tweaks to improve space usage throughout sidebar, and other things
* Adjustable size on client window
* Add Swap button (Crisha)


**V0.6** *(1-9-2018)*
* Simple websocket client.     (Thanks to grapenut@M\*U\*S\*H )
    * Best on tablet or desktop I would guess. Mobile might be iffy

**V0.5** *(6/14/2017)*
* Addition of changelog
* Improve responsiveness of design. Could be better.

**V0.2-0.4**
 * Additional features that I cannot recall

**V0.1**
* Initial Release
