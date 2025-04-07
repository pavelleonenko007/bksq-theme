/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@ksedline/turnjs/index.js":
/*!************************************************!*\
  !*** ./node_modules/@ksedline/turnjs/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! jquery */ "jquery");

var has3d,
  hasRot,
  vendor = "",
  version = "4.1.0",
  PI = Math.PI,
  A90 = PI / 2,
  isTouch = "ontouchstart" in window,
  mouseEvents = isTouch
    ? {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
        over: "touchstart",
        out: "touchend",
      }
    : {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
        over: "mouseover",
        out: "mouseout",
      },
  // Contansts used for each corner
  //   | tl * tr |
  // l | *     * | r
  //   | bl * br |

  corners = {
    backward: ["bl", "tl"],
    forward: ["br", "tr"],
    all: ["tl", "bl", "tr", "br", "l", "r"],
  },
  // Display values

  displays = ["single", "double"],
  // Direction values

  directions = ["ltr", "rtl"],
  // Default options

  turnOptions = {
    // Enables hardware acceleration

    acceleration: true,

    // Display

    display: "double",

    // Duration of transition in milliseconds

    duration: 600,

    // First page

    page: 1,

    // Enables gradients

    gradients: true,

    // Corners used when turning the page

    turnCorners: "bl,br",

    // Events

    when: null,
  },
  flipOptions = {
    // Size of the active zone of each corner

    cornerSize: 100,
  },
  // Number of pages in the DOM, minimum value: 6

  pagesInDOM = 6,
  turnMethods = {
    // Singleton constructor
    // $('#selector').turn([options]);

    init: function (options) {
      // Define constants

      has3d =
        "WebKitCSSMatrix" in window || "MozPerspective" in document.body.style;
      hasRot = rotationAvailable();
      vendor = getPrefix();

      var i,
        that = this,
        pageNum = 0,
        data = this.data(),
        ch = this.children();

      // Set initial configuration

      options = $.extend(
        {
          width: this.width(),
          height: this.height(),
          direction: this.attr("dir") || this.css("direction") || "ltr",
        },
        turnOptions,
        options
      );

      data.opts = options;
      data.pageObjs = {};
      data.pages = {};
      data.pageWrap = {};
      data.pageZoom = {};
      data.pagePlace = {};
      data.pageMv = [];
      data.zoom = 1;
      data.totalPages = options.pages || 0;
      data.eventHandlers = {
        touchStart: $.proxy(turnMethods._touchStart, this),
        touchMove: $.proxy(turnMethods._touchMove, this),
        touchEnd: $.proxy(turnMethods._touchEnd, this),
        start: $.proxy(turnMethods._eventStart, this),
      };

      // Add event listeners

      if (options.when)
        for (i in options.when)
          if (has(i, options.when)) this.bind(i, options.when[i]);

      // Set the css

      this.css({
        position: "relative",
        width: options.width,
        height: options.height,
      });

      // Set the initial display

      this.turn("display", options.display);

      // Set the direction

      if (options.direction !== "") this.turn("direction", options.direction);

      // Prevent blue screen problems of switching to hardware acceleration mode
      // By forcing hardware acceleration for ever

      if (has3d && !isTouch && options.acceleration)
        this.transform(translate(0, 0, true));

      // Add pages from the DOM

      for (i = 0; i < ch.length; i++) {
        if ($(ch[i]).attr("ignore") != "1") {
          this.turn("addPage", ch[i], ++pageNum);
        }
      }

      // Event listeners

      $(this)
        .bind(mouseEvents.down, data.eventHandlers.touchStart)
        .bind("end", turnMethods._eventEnd)
        .bind("pressed", turnMethods._eventPressed)
        .bind("released", turnMethods._eventReleased)
        .bind("flip", turnMethods._flip);

      $(this).parent().bind("start", data.eventHandlers.start);

      $(document)
        .bind(mouseEvents.move, data.eventHandlers.touchMove)
        .bind(mouseEvents.up, data.eventHandlers.touchEnd);

      // Set the initial page

      this.turn("page", options.page);

      // This flipbook is ready

      data.done = true;

      return this;
    },

    // Adds a page from external data

    addPage: function (element, page) {
      var currentPage,
        className,
        incPages = false,
        data = this.data(),
        lastPage = data.totalPages + 1;

      if (data.destroying) return false;

      // Read the page number from the className of `element` - format: p[0-9]+

      if ((currentPage = /\bp([0-9]+)\b/.exec($(element).attr("class"))))
        page = parseInt(currentPage[1], 10);

      if (page) {
        if (page == lastPage) incPages = true;
        else if (page > lastPage)
          throw turnError('Page "' + page + '" cannot be inserted');
      } else {
        page = lastPage;
        incPages = true;
      }

      if (page >= 1 && page <= lastPage) {
        if (data.display == "double") className = page % 2 ? " odd" : " even";
        else className = "";

        // Stop animations
        if (data.done) this.turn("stop");

        // Move pages if it's necessary
        if (page in data.pageObjs) turnMethods._movePages.call(this, page, 1);

        // Increase the number of pages
        if (incPages) data.totalPages = lastPage;

        // Add element
        data.pageObjs[page] = $(element)
          .css({ float: "left" })
          .addClass("page p" + page + className);

        if (!hasHardPage() && data.pageObjs[page].hasClass("hard")) {
          data.pageObjs[page].removeClass("hard");
        }

        // Add page
        turnMethods._addPage.call(this, page);

        // Remove pages out of range
        turnMethods._removeFromDOM.call(this);
      }

      return this;
    },

    // Adds a page

    _addPage: function (page) {
      var data = this.data(),
        element = data.pageObjs[page];

      if (element)
        if (turnMethods._necessPage.call(this, page)) {
          if (!data.pageWrap[page]) {
            // Wrapper
            data.pageWrap[page] = $("<div/>", {
              class: "page-wrapper",
              page: page,
              css: { position: "absolute", overflow: "hidden" },
            });

            // Append to this flipbook
            this.append(data.pageWrap[page]);

            if (!data.pagePlace[page]) {
              data.pagePlace[page] = page;
              // Move `pageObjs[page]` to wrapper
              data.pageObjs[page].appendTo(data.pageWrap[page]);
            }

            // Set the size of the page
            var prop = turnMethods._pageSize.call(this, page, true);
            element.css({ width: prop.width, height: prop.height });
            data.pageWrap[page].css(prop);
          }

          if (data.pagePlace[page] == page) {
            // If the page isn't in another place, create the flip effect
            turnMethods._makeFlip.call(this, page);
          }
        } else {
          // Place
          data.pagePlace[page] = 0;

          // Remove element from the DOM
          if (data.pageObjs[page]) data.pageObjs[page].remove();
        }
    },

    // Checks if a page is in memory

    hasPage: function (page) {
      return has(page, this.data().pageObjs);
    },

    // Centers the flipbook

    center: function (page) {
      var data = this.data(),
        size = $(this).turn("size"),
        left = 0;

      if (!data.noCenter) {
        if (data.display == "double") {
          var view = this.turn("view", page || data.tpage || data.page);

          if (data.direction == "ltr") {
            if (!view[0]) left -= size.width / 4;
            else if (!view[1]) left += size.width / 4;
          } else {
            if (!view[0]) left += size.width / 4;
            else if (!view[1]) left -= size.width / 4;
          }
        }

        $(this).css({ marginLeft: left });
      }

      return this;
    },

    // Destroys the flipbook

    destroy: function () {
      var page,
        flipbook = this,
        data = this.data(),
        events = [
          "end",
          "first",
          "flip",
          "last",
          "pressed",
          "released",
          "start",
          "turning",
          "turned",
          "zooming",
          "missing",
        ];

      if (trigger("destroying", this) == "prevented") return;

      data.destroying = true;

      $.each(events, function (index, eventName) {
        flipbook.unbind(eventName);
      });

      this.parent().unbind("start", data.eventHandlers.start);

      $(document)
        .unbind(mouseEvents.move, data.eventHandlers.touchMove)
        .unbind(mouseEvents.up, data.eventHandlers.touchEnd);

      while (data.totalPages !== 0) {
        this.turn("removePage", data.totalPages);
      }

      if (data.fparent) data.fparent.remove();

      if (data.shadow) data.shadow.remove();

      this.removeData();
      data = null;

      return this;
    },

    // Checks if this element is a flipbook

    is: function () {
      return typeof this.data().pages == "object";
    },

    // Sets and gets the zoom value

    zoom: function (newZoom) {
      var data = this.data();

      if (typeof newZoom == "number") {
        if (newZoom < 0.001 || newZoom > 100)
          throw turnError(newZoom + " is not a value for zoom");

        if (trigger("zooming", this, [newZoom, data.zoom]) == "prevented")
          return this;

        var size = this.turn("size"),
          currentView = this.turn("view"),
          iz = 1 / data.zoom,
          newWidth = Math.round(size.width * iz * newZoom),
          newHeight = Math.round(size.height * iz * newZoom);

        data.zoom = newZoom;

        $(this).turn("stop").turn("size", newWidth, newHeight);
        /*.
        css({marginTop: size.height * iz / 2 - newHeight / 2});*/

        if (data.opts.autoCenter) this.turn("center");
        /*else
        $(this).css({marginLeft: size.width * iz / 2 - newWidth / 2});*/

        turnMethods._updateShadow.call(this);

        for (var i = 0; i < currentView.length; i++) {
          if (currentView[i] && data.pageZoom[currentView[i]] != data.zoom) {
            this.trigger("zoomed", [
              currentView[i],
              currentView,
              data.pageZoom[currentView[i]],
              data.zoom,
            ]);

            data.pageZoom[currentView[i]] = data.zoom;
          }
        }

        return this;
      } else return data.zoom;
    },

    // Gets the size of a page

    _pageSize: function (page, position) {
      var data = this.data(),
        prop = {};

      if (data.display == "single") {
        prop.width = this.width();
        prop.height = this.height();

        if (position) {
          prop.top = 0;
          prop.left = 0;
          prop.right = "auto";
        }
      } else {
        var pageWidth = this.width() / 2,
          pageHeight = this.height();

        if (data.pageObjs[page].hasClass("own-size")) {
          prop.width = data.pageObjs[page].width();
          prop.height = data.pageObjs[page].height();
        } else {
          prop.width = pageWidth;
          prop.height = pageHeight;
        }

        if (position) {
          var odd = page % 2;
          prop.top = (pageHeight - prop.height) / 2;

          if (data.direction == "ltr") {
            prop[odd ? "right" : "left"] = pageWidth - prop.width;
            prop[odd ? "left" : "right"] = "auto";
          } else {
            prop[odd ? "left" : "right"] = pageWidth - prop.width;
            prop[odd ? "right" : "left"] = "auto";
          }
        }
      }

      return prop;
    },

    // Prepares the flip effect for a page

    _makeFlip: function (page) {
      var data = this.data();

      if (!data.pages[page] && data.pagePlace[page] == page) {
        var single = data.display == "single",
          odd = page % 2;

        data.pages[page] = data.pageObjs[page]
          .css(turnMethods._pageSize.call(this, page))
          .flip({
            page: page,
            next: odd || single ? page + 1 : page - 1,
            turn: this,
          })
          .flip("disable", data.disabled);

        // Issue about z-index
        turnMethods._setPageLoc.call(this, page);

        data.pageZoom[page] = data.zoom;
      }

      return data.pages[page];
    },

    // Makes pages within a range

    _makeRange: function () {
      var page,
        range,
        data = this.data();

      if (data.totalPages < 1) return;

      range = this.turn("range");

      for (page = range[0]; page <= range[1]; page++)
        turnMethods._addPage.call(this, page);
    },

    // Returns a range of pages that should be in the DOM
    // Example:
    // - page in the current view, return true
    // * page is in the range, return true
    // Otherwise, return false
    //
    // 1 2-3 4-5 6-7 8-9 10-11 12-13
    //   **  **  --   **  **

    range: function (page) {
      var remainingPages,
        left,
        right,
        view,
        data = this.data();

      page = page || data.tpage || data.page || 1;
      view = turnMethods._view.call(this, page);

      if (page < 1 || page > data.totalPages)
        throw turnError('"' + page + '" is not a valid page');

      view[1] = view[1] || view[0];

      if (view[0] >= 1 && view[1] <= data.totalPages) {
        remainingPages = Math.floor((pagesInDOM - 2) / 2);

        if (data.totalPages - view[1] > view[0]) {
          left = Math.min(view[0] - 1, remainingPages);
          right = 2 * remainingPages - left;
        } else {
          right = Math.min(data.totalPages - view[1], remainingPages);
          left = 2 * remainingPages - right;
        }
      } else {
        left = pagesInDOM - 1;
        right = pagesInDOM - 1;
      }

      return [
        Math.max(1, view[0] - left),
        Math.min(data.totalPages, view[1] + right),
      ];
    },

    // Detects if a page is within the range of `pagesInDOM` from the current view

    _necessPage: function (page) {
      if (page === 0) return true;

      var range = this.turn("range");

      return (
        this.data().pageObjs[page].hasClass("fixed") ||
        (page >= range[0] && page <= range[1])
      );
    },

    // Releases memory by removing pages from the DOM

    _removeFromDOM: function () {
      var page,
        data = this.data();

      for (page in data.pageWrap)
        if (
          has(page, data.pageWrap) &&
          !turnMethods._necessPage.call(this, page)
        )
          turnMethods._removePageFromDOM.call(this, page);
    },

    // Removes a page from DOM and its internal references

    _removePageFromDOM: function (page) {
      var data = this.data();

      if (data.pages[page]) {
        var dd = data.pages[page].data();

        flipMethods._moveFoldingPage.call(data.pages[page], false);

        if (dd.f && dd.f.fwrapper) dd.f.fwrapper.remove();

        data.pages[page].removeData();
        data.pages[page].remove();
        delete data.pages[page];
      }

      if (data.pageObjs[page]) data.pageObjs[page].remove();

      if (data.pageWrap[page]) {
        data.pageWrap[page].remove();
        delete data.pageWrap[page];
      }

      turnMethods._removeMv.call(this, page);

      delete data.pagePlace[page];
      delete data.pageZoom[page];
    },

    // Removes a page

    removePage: function (page) {
      var data = this.data();

      // Delete all the pages
      if (page == "*") {
        while (data.totalPages !== 0) {
          this.turn("removePage", data.totalPages);
        }
      } else {
        if (page < 1 || page > data.totalPages)
          throw turnError("The page " + page + " doesn't exist");

        if (data.pageObjs[page]) {
          // Stop animations
          this.turn("stop");

          // Remove `page`
          turnMethods._removePageFromDOM.call(this, page);

          delete data.pageObjs[page];
        }

        // Move the pages
        turnMethods._movePages.call(this, page, -1);

        // Resize the size of this flipbook
        data.totalPages = data.totalPages - 1;

        // Check the current view

        if (data.page > data.totalPages) {
          data.page = null;
          turnMethods._fitPage.call(this, data.totalPages);
        } else {
          turnMethods._makeRange.call(this);
          this.turn("update");
        }
      }

      return this;
    },

    // Moves pages

    _movePages: function (from, change) {
      var page,
        that = this,
        data = this.data(),
        single = data.display == "single",
        move = function (page) {
          var next = page + change,
            odd = next % 2,
            className = odd ? " odd " : " even ";

          if (data.pageObjs[page])
            data.pageObjs[next] = data.pageObjs[page]
              .removeClass("p" + page + " odd even")
              .addClass("p" + next + className);

          if (data.pagePlace[page] && data.pageWrap[page]) {
            data.pagePlace[next] = next;

            if (data.pageObjs[next].hasClass("fixed"))
              data.pageWrap[next] = data.pageWrap[page].attr("page", next);
            else
              data.pageWrap[next] = data.pageWrap[page]
                .css(turnMethods._pageSize.call(that, next, true))
                .attr("page", next);

            if (data.pages[page])
              data.pages[next] = data.pages[page].flip("options", {
                page: next,
                next: single || odd ? next + 1 : next - 1,
              });

            if (change) {
              delete data.pages[page];
              delete data.pagePlace[page];
              delete data.pageZoom[page];
              delete data.pageObjs[page];
              delete data.pageWrap[page];
            }
          }
        };

      if (change > 0)
        for (page = data.totalPages; page >= from; page--) move(page);
      else for (page = from; page <= data.totalPages; page++) move(page);
    },

    // Sets or Gets the display mode

    display: function (display) {
      var data = this.data(),
        currentDisplay = data.display;

      if (display === undefined) {
        return currentDisplay;
      } else {
        if ($.inArray(display, displays) == -1)
          throw turnError('"' + display + '" is not a value for display');

        switch (display) {
          case "single":
            // Create a temporal page to use as folded page

            if (!data.pageObjs[0]) {
              this.turn("stop").css({ overflow: "hidden" });

              data.pageObjs[0] = $("<div />", { class: "page p-temporal" })
                .css({ width: this.width(), height: this.height() })
                .appendTo(this);
            }

            this.addClass("shadow");

            break;
          case "double":
            // Remove the temporal page

            if (data.pageObjs[0]) {
              this.turn("stop").css({ overflow: "" });
              data.pageObjs[0].remove();
              delete data.pageObjs[0];
            }

            this.removeClass("shadow");

            break;
        }

        data.display = display;

        if (currentDisplay) {
          var size = this.turn("size");
          turnMethods._movePages.call(this, 1, 0);
          this.turn("size", size.width, size.height).turn("update");
        }

        return this;
      }
    },

    // Gets and sets the direction of the flipbook

    direction: function (dir) {
      var data = this.data();

      if (dir === undefined) {
        return data.direction;
      } else {
        dir = dir.toLowerCase();

        if ($.inArray(dir, directions) == -1)
          throw turnError('"' + dir + '" is not a value for direction');

        if (dir == "rtl") {
          $(this).attr("dir", "ltr").css({ direction: "ltr" });
        }

        data.direction = dir;

        if (data.done) this.turn("size", $(this).width(), $(this).height());

        return this;
      }
    },

    // Detects animation

    animating: function () {
      return this.data().pageMv.length > 0;
    },

    // Gets the current activated corner

    corner: function () {
      var corner,
        page,
        data = this.data();

      for (page in data.pages) {
        if (has(page, data.pages))
          if ((corner = data.pages[page].flip("corner"))) {
            return corner;
          }
      }

      return false;
    },

    // Gets the data stored in the flipbook

    data: function () {
      return this.data();
    },

    // Disables and enables the effect

    disable: function (disable) {
      var page,
        data = this.data(),
        view = this.turn("view");

      data.disabled = disable === undefined || disable === true;

      for (page in data.pages) {
        if (has(page, data.pages))
          data.pages[page].flip(
            "disable",
            data.disabled ? true : $.inArray(parseInt(page, 10), view) == -1
          );
      }

      return this;
    },

    // Disables and enables the effect

    disabled: function (disable) {
      if (disable === undefined) {
        return this.data().disabled === true;
      } else {
        return this.turn("disable", disable);
      }
    },

    // Gets and sets the size

    size: function (width, height) {
      if (width === undefined || height === undefined) {
        return { width: this.width(), height: this.height() };
      } else {
        this.turn("stop");

        var page,
          prop,
          data = this.data(),
          pageWidth = data.display == "double" ? width / 2 : width;

        this.css({ width: width, height: height });

        if (data.pageObjs[0])
          data.pageObjs[0].css({ width: pageWidth, height: height });

        for (page in data.pageWrap) {
          if (!has(page, data.pageWrap)) continue;

          prop = turnMethods._pageSize.call(this, page, true);

          data.pageObjs[page].css({ width: prop.width, height: prop.height });
          data.pageWrap[page].css(prop);

          if (data.pages[page])
            data.pages[page].css({ width: prop.width, height: prop.height });
        }

        this.turn("resize");

        return this;
      }
    },

    // Resizes each page

    resize: function () {
      var page,
        data = this.data();

      if (data.pages[0]) {
        data.pageWrap[0].css({ left: -this.width() });
        data.pages[0].flip("resize", true);
      }

      for (page = 1; page <= data.totalPages; page++)
        if (data.pages[page]) data.pages[page].flip("resize", true);

      turnMethods._updateShadow.call(this);

      if (data.opts.autoCenter) this.turn("center");
    },

    // Removes an animation from the cache

    _removeMv: function (page) {
      var i,
        data = this.data();

      for (i = 0; i < data.pageMv.length; i++)
        if (data.pageMv[i] == page) {
          data.pageMv.splice(i, 1);
          return true;
        }

      return false;
    },

    // Adds an animation to the cache

    _addMv: function (page) {
      var data = this.data();

      turnMethods._removeMv.call(this, page);
      data.pageMv.push(page);
    },

    // Gets indexes for a view

    _view: function (page) {
      var data = this.data();

      page = page || data.page;

      if (data.display == "double")
        return page % 2 ? [page - 1, page] : [page, page + 1];
      else return [page];
    },

    // Gets a view

    view: function (page) {
      var data = this.data(),
        view = turnMethods._view.call(this, page);

      if (data.display == "double")
        return [
          view[0] > 0 ? view[0] : 0,
          view[1] <= data.totalPages ? view[1] : 0,
        ];
      else return [view[0] > 0 && view[0] <= data.totalPages ? view[0] : 0];
    },

    // Stops animations

    stop: function (ignore, animate) {
      if (this.turn("animating")) {
        var i,
          opts,
          page,
          data = this.data();

        if (data.tpage) {
          data.page = data.tpage;
          delete data["tpage"];
        }

        for (i = 0; i < data.pageMv.length; i++) {
          if (!data.pageMv[i] || data.pageMv[i] === ignore) continue;

          page = data.pages[data.pageMv[i]];
          opts = page.data().f.opts;

          page.flip("hideFoldedPage", animate);

          if (!animate) flipMethods._moveFoldingPage.call(page, false);

          if (opts.force) {
            opts.next = opts.page % 2 === 0 ? opts.page - 1 : opts.page + 1;
            delete opts["force"];
          }
        }
      }

      this.turn("update");

      return this;
    },

    // Gets and sets the number of pages

    pages: function (pages) {
      var data = this.data();

      if (pages) {
        if (pages < data.totalPages) {
          for (var page = data.totalPages; page > pages; page--)
            this.turn("removePage", page);
        }

        data.totalPages = pages;
        turnMethods._fitPage.call(this, data.page);

        return this;
      } else return data.totalPages;
    },

    // Checks missing pages

    _missing: function (page) {
      var data = this.data();

      if (data.totalPages < 1) return;

      var p,
        range = this.turn("range", page),
        missing = [];

      for (p = range[0]; p <= range[1]; p++) {
        if (!data.pageObjs[p]) missing.push(p);
      }

      if (missing.length > 0) this.trigger("missing", [missing]);
    },

    // Sets a page without effect

    _fitPage: function (page) {
      var data = this.data(),
        newView = this.turn("view", page);

      turnMethods._missing.call(this, page);

      if (!data.pageObjs[page]) return;

      data.page = page;

      this.turn("stop");

      for (var i = 0; i < newView.length; i++) {
        if (newView[i] && data.pageZoom[newView[i]] != data.zoom) {
          this.trigger("zoomed", [
            newView[i],
            newView,
            data.pageZoom[newView[i]],
            data.zoom,
          ]);

          data.pageZoom[newView[i]] = data.zoom;
        }
      }

      turnMethods._removeFromDOM.call(this);
      turnMethods._makeRange.call(this);
      turnMethods._updateShadow.call(this);
      this.trigger("turned", [page, newView]);
      this.turn("update");

      if (data.opts.autoCenter) this.turn("center");
    },

    // Turns the page

    _turnPage: function (page) {
      var current,
        next,
        data = this.data(),
        place = data.pagePlace[page],
        view = this.turn("view"),
        newView = this.turn("view", page);

      if (data.page != page) {
        var currentPage = data.page;

        if (trigger("turning", this, [page, newView]) == "prevented") {
          if (currentPage == data.page && $.inArray(place, data.pageMv) != -1)
            data.pages[place].flip("hideFoldedPage", true);

          return;
        }

        if ($.inArray(1, newView) != -1) this.trigger("first");
        if ($.inArray(data.totalPages, newView) != -1) this.trigger("last");
      }

      if (data.display == "single") {
        current = view[0];
        next = newView[0];
      } else if (view[1] && page > view[1]) {
        current = view[1];
        next = newView[0];
      } else if (view[0] && page < view[0]) {
        current = view[0];
        next = newView[1];
      }

      var optsCorners = data.opts.turnCorners.split(","),
        flipData = data.pages[current].data().f,
        opts = flipData.opts,
        actualPoint = flipData.point;

      turnMethods._missing.call(this, page);

      if (!data.pageObjs[page]) return;

      this.turn("stop");

      data.page = page;

      turnMethods._makeRange.call(this);

      data.tpage = next;

      if (opts.next != next) {
        opts.next = next;
        opts.force = true;
      }

      this.turn("update");

      flipData.point = actualPoint;

      if (flipData.effect == "hard")
        if (data.direction == "ltr")
          data.pages[current].flip("turnPage", page > current ? "r" : "l");
        else data.pages[current].flip("turnPage", page > current ? "l" : "r");
      else {
        if (data.direction == "ltr")
          data.pages[current].flip(
            "turnPage",
            optsCorners[page > current ? 1 : 0]
          );
        else
          data.pages[current].flip(
            "turnPage",
            optsCorners[page > current ? 0 : 1]
          );
      }
    },

    // Gets and sets a page

    page: function (page) {
      var data = this.data();

      if (page === undefined) {
        return data.page;
      } else {
        if (!data.disabled && !data.destroying) {
          page = parseInt(page, 10);

          if (page > 0 && page <= data.totalPages) {
            if (page != data.page) {
              if (!data.done || $.inArray(page, this.turn("view")) != -1)
                turnMethods._fitPage.call(this, page);
              else turnMethods._turnPage.call(this, page);
            }

            return this;
          } else {
            throw turnError("The page " + page + " does not exist");
          }
        }
      }
    },

    // Turns to the next view

    next: function () {
      return this.turn(
        "page",
        Math.min(
          this.data().totalPages,
          turnMethods._view.call(this, this.data().page).pop() + 1
        )
      );
    },

    // Turns to the previous view

    previous: function () {
      return this.turn(
        "page",
        Math.max(1, turnMethods._view.call(this, this.data().page).shift() - 1)
      );
    },

    // Shows a peeling corner

    peel: function (corner, animate) {
      var data = this.data(),
        view = this.turn("view");

      animate = animate === undefined ? true : animate === true;

      if (corner === false) {
        this.turn("stop", null, animate);
      } else {
        if (data.display == "single") {
          data.pages[data.page].flip("peel", corner, animate);
        } else {
          var page;

          if (data.direction == "ltr") {
            page = corner.indexOf("l") != -1 ? view[0] : view[1];
          } else {
            page = corner.indexOf("l") != -1 ? view[1] : view[0];
          }

          if (data.pages[page]) data.pages[page].flip("peel", corner, animate);
        }
      }

      return this;
    },

    // Adds a motion to the internal list
    // This event is called in context of flip

    _addMotionPage: function () {
      var opts = $(this).data().f.opts,
        turn = opts.turn,
        dd = turn.data();

      turnMethods._addMv.call(turn, opts.page);
    },

    // This event is called in context of flip

    _eventStart: function (e, opts, corner) {
      var data = opts.turn.data(),
        actualZoom = data.pageZoom[opts.page];

      if (e.isDefaultPrevented()) {
        turnMethods._updateShadow.call(opts.turn);
        return;
      }

      if (actualZoom && actualZoom != data.zoom) {
        opts.turn.trigger("zoomed", [
          opts.page,
          opts.turn.turn("view", opts.page),
          actualZoom,
          data.zoom,
        ]);

        data.pageZoom[opts.page] = data.zoom;
      }

      if (data.display == "single" && corner) {
        if (
          (corner.charAt(1) == "l" && data.direction == "ltr") ||
          (corner.charAt(1) == "r" && data.direction == "rtl")
        ) {
          opts.next = opts.next < opts.page ? opts.next : opts.page - 1;
          opts.force = true;
        } else {
          opts.next = opts.next > opts.page ? opts.next : opts.page + 1;
        }
      }

      turnMethods._addMotionPage.call(e.target);
      turnMethods._updateShadow.call(opts.turn);
    },

    // This event is called in context of flip

    _eventEnd: function (e, opts, turned) {
      var that = $(e.target),
        data = that.data().f,
        turn = opts.turn,
        dd = turn.data();

      if (turned) {
        var tpage = dd.tpage || dd.page;

        if (tpage == opts.next || tpage == opts.page) {
          delete dd.tpage;

          turnMethods._fitPage.call(turn, tpage || opts.next, true);
        }
      } else {
        turnMethods._removeMv.call(turn, opts.page);
        turnMethods._updateShadow.call(turn);
        turn.turn("update");
      }
    },

    // This event is called in context of flip

    _eventPressed: function (e) {
      var page,
        data = $(e.target).data().f,
        turn = data.opts.turn,
        turnData = turn.data(),
        pages = turnData.pages;

      turnData.mouseAction = true;

      turn.turn("update");

      return (data.time = new Date().getTime());
    },

    // This event is called in context of flip

    _eventReleased: function (e, point) {
      var outArea,
        page = $(e.target),
        data = page.data().f,
        turn = data.opts.turn,
        turnData = turn.data();

      if (turnData.display == "single") {
        outArea =
          point.corner == "br" || point.corner == "tr"
            ? point.x < page.width() / 2
            : point.x > page.width() / 2;
      } else {
        outArea = point.x < 0 || point.x > page.width();
      }

      if (new Date().getTime() - data.time < 200 || outArea) {
        e.preventDefault();
        turnMethods._turnPage.call(turn, data.opts.next);
      }

      turnData.mouseAction = false;
    },

    // This event is called in context of flip

    _flip: function (e) {
      e.stopPropagation();

      var opts = $(e.target).data().f.opts;

      opts.turn.trigger("turn", [opts.next]);

      if (opts.turn.data().opts.autoCenter) {
        opts.turn.turn("center", opts.next);
      }
    },

    //
    _touchStart: function () {
      var data = this.data();
      for (var page in data.pages) {
        if (
          has(page, data.pages) &&
          flipMethods._eventStart.apply(data.pages[page], arguments) === false
        ) {
          return false;
        }
      }
    },

    //
    _touchMove: function () {
      var data = this.data();
      for (var page in data.pages) {
        if (has(page, data.pages)) {
          flipMethods._eventMove.apply(data.pages[page], arguments);
        }
      }
    },

    //
    _touchEnd: function () {
      var data = this.data();
      for (var page in data.pages) {
        if (has(page, data.pages)) {
          flipMethods._eventEnd.apply(data.pages[page], arguments);
        }
      }
    },

    // Calculate the z-index value for pages during the animation

    calculateZ: function (mv) {
      var i,
        page,
        nextPage,
        placePage,
        dpage,
        that = this,
        data = this.data(),
        view = this.turn("view"),
        currentPage = view[0] || view[1],
        total = mv.length - 1,
        r = { pageZ: {}, partZ: {}, pageV: {} },
        addView = function (page) {
          var view = that.turn("view", page);
          if (view[0]) r.pageV[view[0]] = true;
          if (view[1]) r.pageV[view[1]] = true;
        };

      for (i = 0; i <= total; i++) {
        page = mv[i];
        nextPage = data.pages[page].data().f.opts.next;
        placePage = data.pagePlace[page];
        addView(page);
        addView(nextPage);
        dpage = data.pagePlace[nextPage] == nextPage ? nextPage : page;
        r.pageZ[dpage] = data.totalPages - Math.abs(currentPage - dpage);
        r.partZ[placePage] = data.totalPages * 2 - total + i;
      }

      return r;
    },

    // Updates the z-index and display property of every page

    update: function () {
      var page,
        data = this.data();

      if (this.turn("animating") && data.pageMv[0] !== 0) {
        // Update motion

        var p,
          apage,
          fixed,
          pos = this.turn("calculateZ", data.pageMv),
          corner = this.turn("corner"),
          actualView = this.turn("view"),
          newView = this.turn("view", data.tpage);

        for (page in data.pageWrap) {
          if (!has(page, data.pageWrap)) continue;

          fixed = data.pageObjs[page].hasClass("fixed");

          data.pageWrap[page].css({
            display: pos.pageV[page] || fixed ? "" : "none",
            zIndex:
              (data.pageObjs[page].hasClass("hard")
                ? pos.partZ[page]
                : pos.pageZ[page]) || (fixed ? -1 : 0),
          });

          if ((p = data.pages[page])) {
            p.flip("z", pos.partZ[page] || null);

            if (pos.pageV[page]) p.flip("resize");

            if (data.tpage) {
              // Is it turning the page to `tpage`?

              p.flip("hover", false).flip(
                "disable",
                $.inArray(parseInt(page, 10), data.pageMv) == -1 &&
                  page != newView[0] &&
                  page != newView[1]
              );
            } else {
              p.flip("hover", corner === false).flip(
                "disable",
                page != actualView[0] && page != actualView[1]
              );
            }
          }
        }
      } else {
        // Update static pages

        for (page in data.pageWrap) {
          if (!has(page, data.pageWrap)) continue;

          var pageLocation = turnMethods._setPageLoc.call(this, page);

          if (data.pages[page]) {
            data.pages[page]
              .flip("disable", data.disabled || pageLocation != 1)
              .flip("hover", true)
              .flip("z", null);
          }
        }
      }

      return this;
    },

    // Updates the position and size of the flipbook's shadow

    _updateShadow: function () {
      var view,
        view2,
        shadow,
        data = this.data(),
        width = this.width(),
        height = this.height(),
        pageWidth = data.display == "single" ? width : width / 2;

      view = this.turn("view");

      if (!data.shadow) {
        data.shadow = $("<div />", {
          class: "shadow",
          css: divAtt(0, 0, 0).css,
        }).appendTo(this);
      }

      for (var i = 0; i < data.pageMv.length; i++) {
        if (!view[0] || !view[1]) break;

        view = this.turn("view", data.pages[data.pageMv[i]].data().f.opts.next);
        view2 = this.turn("view", data.pageMv[i]);

        view[0] = view[0] && view2[0];
        view[1] = view[1] && view2[1];
      }

      if (!view[0]) shadow = data.direction == "ltr" ? 1 : 2;
      else if (!view[1]) shadow = data.direction == "ltr" ? 2 : 1;
      else shadow = 3;

      switch (shadow) {
        case 1:
          data.shadow.css({
            width: pageWidth,
            height: height,
            top: 0,
            left: pageWidth,
          });
          break;
        case 2:
          data.shadow.css({
            width: pageWidth,
            height: height,
            top: 0,
            left: 0,
          });
          break;
        case 3:
          data.shadow.css({
            width: width,
            height: height,
            top: 0,
            left: 0,
          });
          break;
      }
    },

    // Sets the z-index and display property of a page
    // It depends on the current view

    _setPageLoc: function (page) {
      var data = this.data(),
        view = this.turn("view"),
        loc = 0;

      if (page == view[0] || page == view[1]) loc = 1;
      else if (
        (data.display == "single" && page == view[0] + 1) ||
        (data.display == "double" && page == view[0] - 2) ||
        page == view[1] + 2
      )
        loc = 2;

      if (!this.turn("animating"))
        switch (loc) {
          case 1:
            data.pageWrap[page].css({
              zIndex: data.totalPages,
              display: "",
            });
            break;
          case 2:
            data.pageWrap[page].css({
              zIndex: data.totalPages - 1,
              display: "",
            });
            break;
          case 0:
            data.pageWrap[page].css({
              zIndex: 0,
              display: data.pageObjs[page].hasClass("fixed") ? "" : "none",
            });
            break;
        }

      return loc;
    },

    // Gets and sets the options

    options: function (options) {
      if (options === undefined) {
        return this.data().opts;
      } else {
        var data = this.data();

        // Set new values

        $.extend(data.opts, options);

        // Set pages

        if (options.pages) this.turn("pages", options.pages);

        // Set page

        if (options.page) this.turn("page", options.page);

        // Set display

        if (options.display) this.turn("display", options.display);

        // Set direction

        if (options.direction) this.turn("direction", options.direction);

        // Set size

        if (options.width && options.height)
          this.turn("size", options.width, options.height);

        // Add event listeners

        if (options.when)
          for (var eventName in options.when)
            if (has(eventName, options.when)) {
              this.unbind(eventName).bind(eventName, options.when[eventName]);
            }

        return this;
      }
    },

    // Gets the current version

    version: function () {
      return version;
    },
  },
  // Methods and properties for the flip page effect

  flipMethods = {
    // Constructor

    init: function (opts) {
      this.data({
        f: {
          disabled: false,
          hover: false,
          effect: this.hasClass("hard") ? "hard" : "sheet",
        },
      });

      this.flip("options", opts);

      flipMethods._addPageWrapper.call(this);

      return this;
    },

    setData: function (d) {
      var data = this.data();

      data.f = $.extend(data.f, d);

      return this;
    },

    options: function (opts) {
      var data = this.data().f;

      if (opts) {
        flipMethods.setData.call(this, {
          opts: $.extend({}, data.opts || flipOptions, opts),
        });
        return this;
      } else return data.opts;
    },

    z: function (z) {
      var data = this.data().f;

      data.opts["z-index"] = z;

      if (data.fwrapper)
        data.fwrapper.css({
          zIndex: z || parseInt(data.parent.css("z-index"), 10) || 0,
        });

      return this;
    },

    _cAllowed: function () {
      var data = this.data().f,
        page = data.opts.page,
        turnData = data.opts.turn.data(),
        odd = page % 2;

      if (data.effect == "hard") {
        return turnData.direction == "ltr"
          ? [odd ? "r" : "l"]
          : [odd ? "l" : "r"];
      } else {
        if (turnData.display == "single") {
          if (page == 1)
            return turnData.direction == "ltr"
              ? corners["forward"]
              : corners["backward"];
          else if (page == turnData.totalPages)
            return turnData.direction == "ltr"
              ? corners["backward"]
              : corners["forward"];
          else return corners["all"];
        } else {
          return turnData.direction == "ltr"
            ? corners[odd ? "forward" : "backward"]
            : corners[odd ? "backward" : "forward"];
        }
      }
    },

    _cornerActivated: function (p) {
      var data = this.data().f,
        width = this.width(),
        height = this.height(),
        point = { x: p.x, y: p.y, corner: "" },
        csz = data.opts.cornerSize;

      if (point.x <= 0 || point.y <= 0 || point.x >= width || point.y >= height)
        return false;

      var allowedCorners = flipMethods._cAllowed.call(this);

      switch (data.effect) {
        case "hard":
          if (point.x > width - csz) point.corner = "r";
          else if (point.x < csz) point.corner = "l";
          else return false;

          break;

        case "sheet":
          if (point.y < csz) point.corner += "t";
          else if (point.y >= height - csz) point.corner += "b";
          else return false;

          if (point.x <= csz) point.corner += "l";
          else if (point.x >= width - csz) point.corner += "r";
          else return false;

          break;
      }

      return !point.corner || $.inArray(point.corner, allowedCorners) == -1
        ? false
        : point;
    },

    _isIArea: function (e) {
      var pos = this.data().f.parent.offset();

      e = isTouch && e.originalEvent ? e.originalEvent.touches[0] : e;

      return flipMethods._cornerActivated.call(this, {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top,
      });
    },

    _c: function (corner, opts) {
      opts = opts || 0;

      switch (corner) {
        case "tl":
          return point2D(opts, opts);
        case "tr":
          return point2D(this.width() - opts, opts);
        case "bl":
          return point2D(opts, this.height() - opts);
        case "br":
          return point2D(this.width() - opts, this.height() - opts);
        case "l":
          return point2D(opts, 0);
        case "r":
          return point2D(this.width() - opts, 0);
      }
    },

    _c2: function (corner) {
      switch (corner) {
        case "tl":
          return point2D(this.width() * 2, 0);
        case "tr":
          return point2D(-this.width(), 0);
        case "bl":
          return point2D(this.width() * 2, this.height());
        case "br":
          return point2D(-this.width(), this.height());
        case "l":
          return point2D(this.width() * 2, 0);
        case "r":
          return point2D(-this.width(), 0);
      }
    },

    _foldingPage: function () {
      var data = this.data().f;

      if (!data) return;

      var opts = data.opts;

      if (opts.turn) {
        data = opts.turn.data();
        if (data.display == "single")
          return opts.next > 1 || opts.page > 1 ? data.pageObjs[0] : null;
        else return data.pageObjs[opts.next];
      }
    },

    _backGradient: function () {
      var data = this.data().f,
        turnData = data.opts.turn.data(),
        gradient =
          turnData.opts.gradients &&
          (turnData.display == "single" ||
            (data.opts.page != 2 && data.opts.page != turnData.totalPages - 1));

      if (gradient && !data.bshadow)
        data.bshadow = $("<div/>", divAtt(0, 0, 1))
          .css({ position: "", width: this.width(), height: this.height() })
          .appendTo(data.parent);

      return gradient;
    },

    type: function () {
      return this.data().f.effect;
    },

    resize: function (full) {
      var data = this.data().f,
        turnData = data.opts.turn.data(),
        width = this.width(),
        height = this.height();

      switch (data.effect) {
        case "hard":
          if (full) {
            data.wrapper.css({ width: width, height: height });
            data.fpage.css({ width: width, height: height });
            if (turnData.opts.gradients) {
              data.ashadow.css({ width: width, height: height });
              data.bshadow.css({ width: width, height: height });
            }
          }

          break;
        case "sheet":
          if (full) {
            var size = Math.round(
              Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
            );

            data.wrapper.css({ width: size, height: size });
            data.fwrapper
              .css({ width: size, height: size })
              .children(":first-child")
              .css({ width: width, height: height });

            data.fpage.css({ width: width, height: height });

            if (turnData.opts.gradients)
              data.ashadow.css({ width: width, height: height });

            if (flipMethods._backGradient.call(this))
              data.bshadow.css({ width: width, height: height });
          }

          if (data.parent.is(":visible")) {
            var offset = findPos(data.parent[0]);

            data.fwrapper.css({ top: offset.top, left: offset.left });

            //if (data.opts.turn) {
            offset = findPos(data.opts.turn[0]);
            data.fparent.css({ top: -offset.top, left: -offset.left });
            //}
          }

          this.flip("z", data.opts["z-index"]);

          break;
      }
    },

    // Prepares the page by adding a general wrapper and another objects

    _addPageWrapper: function () {
      var att,
        data = this.data().f,
        turnData = data.opts.turn.data(),
        parent = this.parent();

      data.parent = parent;

      if (!data.wrapper)
        switch (data.effect) {
          case "hard":
            var cssProperties = {};
            cssProperties[vendor + "transform-style"] = "preserve-3d";
            cssProperties[vendor + "backface-visibility"] = "hidden";

            data.wrapper = $("<div/>", divAtt(0, 0, 2))
              .css(cssProperties)
              .appendTo(parent)
              .prepend(this);

            data.fpage = $("<div/>", divAtt(0, 0, 1))
              .css(cssProperties)
              .appendTo(parent);

            if (turnData.opts.gradients) {
              data.ashadow = $("<div/>", divAtt(0, 0, 0))
                .hide()
                .appendTo(parent);

              data.bshadow = $("<div/>", divAtt(0, 0, 0));
            }

            break;
          case "sheet":
            var width = this.width(),
              height = this.height(),
              size = Math.round(
                Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
              );

            data.fparent = data.opts.turn.data().fparent;

            if (!data.fparent) {
              var fparent = $("<div/>", {
                css: { "pointer-events": "none" },
              }).hide();
              fparent.data().flips = 0;
              fparent
                .css(divAtt(0, 0, "auto", "visible").css)
                .appendTo(data.opts.turn);

              data.opts.turn.data().fparent = fparent;
              data.fparent = fparent;
            }

            this.css({
              position: "absolute",
              top: 0,
              left: 0,
              bottom: "auto",
              right: "auto",
            });

            data.wrapper = $("<div/>", divAtt(0, 0, this.css("z-index")))
              .appendTo(parent)
              .prepend(this);

            data.fwrapper = $(
              "<div/>",
              divAtt(parent.offset().top, parent.offset().left)
            )
              .hide()
              .appendTo(data.fparent);

            data.fpage = $("<div/>", divAtt(0, 0, 0, "visible"))
              .css({ cursor: "default" })
              .appendTo(data.fwrapper);

            if (turnData.opts.gradients)
              data.ashadow = $("<div/>", divAtt(0, 0, 1)).appendTo(data.fpage);

            flipMethods.setData.call(this, data);

            break;
        }

      // Set size
      flipMethods.resize.call(this, true);
    },

    // Takes a 2P point from the screen and applies the transformation

    _fold: function (point) {
      var data = this.data().f,
        turnData = data.opts.turn.data(),
        o = flipMethods._c.call(this, point.corner),
        width = this.width(),
        height = this.height();

      switch (data.effect) {
        case "hard":
          if (point.corner == "l")
            point.x = Math.min(Math.max(point.x, 0), width * 2);
          else point.x = Math.max(Math.min(point.x, width), -width);

          var leftPos,
            shadow,
            gradientX,
            fpageOrigin,
            parentOrigin,
            totalPages = turnData.totalPages,
            zIndex = data.opts["z-index"] || totalPages,
            parentCss = { overflow: "visible" },
            relX = o.x ? (o.x - point.x) / width : point.x / width,
            angle = relX * 90,
            half = angle < 90;

          switch (point.corner) {
            case "l":
              fpageOrigin = "0% 50%";
              parentOrigin = "100% 50%";

              if (half) {
                leftPos = 0;
                shadow = data.opts.next - 1 > 0;
                gradientX = 1;
              } else {
                leftPos = "100%";
                shadow = data.opts.page + 1 < totalPages;
                gradientX = 0;
              }

              break;
            case "r":
              fpageOrigin = "100% 50%";
              parentOrigin = "0% 50%";
              angle = -angle;
              width = -width;

              if (half) {
                leftPos = 0;
                shadow = data.opts.next + 1 < totalPages;
                gradientX = 0;
              } else {
                leftPos = "-100%";
                shadow = data.opts.page != 1;
                gradientX = 1;
              }

              break;
          }

          parentCss[vendor + "perspective-origin"] = parentOrigin;

          data.wrapper.transform(
            "rotateY(" +
              angle +
              "deg)" +
              "translate3d(0px, 0px, " +
              (this.attr("depth") || 0) +
              "px)",
            parentOrigin
          );

          data.fpage.transform(
            "translateX(" + width + "px) rotateY(" + (180 + angle) + "deg)",
            fpageOrigin
          );

          data.parent.css(parentCss);

          if (half) {
            relX = -relX + 1;
            data.wrapper.css({ zIndex: zIndex + 1 });
            data.fpage.css({ zIndex: zIndex });
          } else {
            relX = relX - 1;
            data.wrapper.css({ zIndex: zIndex });
            data.fpage.css({ zIndex: zIndex + 1 });
          }

          if (turnData.opts.gradients) {
            if (shadow)
              data.ashadow
                .css({
                  display: "",
                  left: leftPos,
                  backgroundColor: "rgba(0,0,0," + 0.5 * relX + ")",
                })
                .transform("rotateY(0deg)");
            else data.ashadow.hide();

            data.bshadow.css({ opacity: -relX + 1 });

            if (half) {
              if (data.bshadow.parent()[0] != data.wrapper[0]) {
                data.bshadow.appendTo(data.wrapper);
              }
            } else {
              if (data.bshadow.parent()[0] != data.fpage[0]) {
                data.bshadow.appendTo(data.fpage);
              }
            }
            /*data.bshadow.css({
            backgroundColor: 'rgba(0,0,0,'+(0.1)+')'
          })*/
            gradient(
              data.bshadow,
              point2D(gradientX * 100, 0),
              point2D((-gradientX + 1) * 100, 0),
              [
                [0, "rgba(0,0,0,0.3)"],
                [1, "rgba(0,0,0,0)"],
              ],
              2
            );
          }

          break;
        case "sheet":
          var that = this,
            a = 0,
            alpha = 0,
            beta,
            px,
            gradientEndPointA,
            gradientEndPointB,
            gradientStartVal,
            gradientSize,
            gradientOpacity,
            shadowVal,
            mv = point2D(0, 0),
            df = point2D(0, 0),
            tr = point2D(0, 0),
            folding = flipMethods._foldingPage.call(this),
            tan = Math.tan(alpha),
            ac = turnData.opts.acceleration,
            h = data.wrapper.height(),
            top = point.corner.substr(0, 1) == "t",
            left = point.corner.substr(1, 1) == "l",
            compute = function () {
              var rel = point2D(0, 0);
              var middle = point2D(0, 0);

              rel.x = o.x ? o.x - point.x : point.x;

              if (!hasRot) {
                rel.y = 0;
              } else {
                rel.y = o.y ? o.y - point.y : point.y;
              }

              middle.x = left ? width - rel.x / 2 : point.x + rel.x / 2;
              middle.y = rel.y / 2;

              var alpha = A90 - Math.atan2(rel.y, rel.x),
                gamma = alpha - Math.atan2(middle.y, middle.x),
                distance = Math.max(
                  0,
                  Math.sin(gamma) *
                    Math.sqrt(Math.pow(middle.x, 2) + Math.pow(middle.y, 2))
                );

              a = deg(alpha);

              tr = point2D(
                distance * Math.sin(alpha),
                distance * Math.cos(alpha)
              );

              if (alpha > A90) {
                tr.x = tr.x + Math.abs((tr.y * rel.y) / rel.x);
                tr.y = 0;
                if (Math.round(tr.x * Math.tan(PI - alpha)) < height) {
                  point.y = Math.sqrt(
                    Math.pow(height, 2) + 2 * middle.x * rel.x
                  );
                  if (top) point.y = height - point.y;
                  return compute();
                }
              }

              if (alpha > A90) {
                var beta = PI - alpha,
                  dd = h - height / Math.sin(beta);
                mv = point2D(
                  Math.round(dd * Math.cos(beta)),
                  Math.round(dd * Math.sin(beta))
                );
                if (left) mv.x = -mv.x;
                if (top) mv.y = -mv.y;
              }

              px = Math.round(tr.y / Math.tan(alpha) + tr.x);

              var side = width - px,
                sideX = side * Math.cos(alpha * 2),
                sideY = side * Math.sin(alpha * 2);
              df = point2D(
                Math.round(left ? side - sideX : px + sideX),
                Math.round(top ? sideY : height - sideY)
              );

              // Gradients
              if (turnData.opts.gradients) {
                gradientSize = side * Math.sin(alpha);

                var endingPoint = flipMethods._c2.call(that, point.corner),
                  far =
                    Math.sqrt(
                      Math.pow(endingPoint.x - point.x, 2) +
                        Math.pow(endingPoint.y - point.y, 2)
                    ) / width;

                shadowVal = Math.sin(A90 * (far > 1 ? 2 - far : far));

                gradientOpacity = Math.min(far, 1);

                gradientStartVal =
                  gradientSize > 100 ? (gradientSize - 100) / gradientSize : 0;

                gradientEndPointA = point2D(
                  ((gradientSize * Math.sin(alpha)) / width) * 100,
                  ((gradientSize * Math.cos(alpha)) / height) * 100
                );

                if (flipMethods._backGradient.call(that)) {
                  gradientEndPointB = point2D(
                    ((gradientSize * 1.2 * Math.sin(alpha)) / width) * 100,
                    ((gradientSize * 1.2 * Math.cos(alpha)) / height) * 100
                  );

                  if (!left) gradientEndPointB.x = 100 - gradientEndPointB.x;
                  if (!top) gradientEndPointB.y = 100 - gradientEndPointB.y;
                }
              }

              tr.x = Math.round(tr.x);
              tr.y = Math.round(tr.y);

              return true;
            },
            transform = function (tr, c, x, a) {
              var f = ["0", "auto"],
                mvW = ((width - h) * x[0]) / 100,
                mvH = ((height - h) * x[1]) / 100,
                cssA = {
                  left: f[c[0]],
                  top: f[c[1]],
                  right: f[c[2]],
                  bottom: f[c[3]],
                },
                cssB = {},
                aliasingFk = a != 90 && a != -90 ? (left ? -1 : 1) : 0,
                origin = x[0] + "% " + x[1] + "%";

              that
                .css(cssA)
                .transform(
                  rotate(a) + translate(tr.x + aliasingFk, tr.y, ac),
                  origin
                );

              data.fpage
                .css(cssA)
                .transform(
                  rotate(a) +
                    translate(
                      tr.x + df.x - mv.x - (width * x[0]) / 100,
                      tr.y + df.y - mv.y - (height * x[1]) / 100,
                      ac
                    ) +
                    rotate((180 / a - 2) * a),
                  origin
                );

              data.wrapper.transform(
                translate(-tr.x + mvW - aliasingFk, -tr.y + mvH, ac) +
                  rotate(-a),
                origin
              );

              data.fwrapper.transform(
                translate(-tr.x + mv.x + mvW, -tr.y + mv.y + mvH, ac) +
                  rotate(-a),
                origin
              );

              if (turnData.opts.gradients) {
                if (x[0]) gradientEndPointA.x = 100 - gradientEndPointA.x;

                if (x[1]) gradientEndPointA.y = 100 - gradientEndPointA.y;

                cssB["box-shadow"] =
                  "0 0 20px rgba(0,0,0," + 0.5 * shadowVal + ")";
                folding.css(cssB);

                gradient(
                  data.ashadow,
                  point2D(left ? 100 : 0, top ? 0 : 100),
                  point2D(gradientEndPointA.x, gradientEndPointA.y),
                  [
                    [gradientStartVal, "rgba(0,0,0,0)"],
                    [
                      (1 - gradientStartVal) * 0.8 + gradientStartVal,
                      "rgba(0,0,0," + 0.2 * gradientOpacity + ")",
                    ],
                    [1, "rgba(255,255,255," + 0.2 * gradientOpacity + ")"],
                  ],
                  3,
                  alpha
                );

                if (flipMethods._backGradient.call(that))
                  gradient(
                    data.bshadow,
                    point2D(left ? 0 : 100, top ? 0 : 100),
                    point2D(gradientEndPointB.x, gradientEndPointB.y),
                    [
                      [0.6, "rgba(0,0,0,0)"],
                      [0.8, "rgba(0,0,0," + 0.3 * gradientOpacity + ")"],
                      [1, "rgba(0,0,0,0)"],
                    ],
                    3
                  );
              }
            };

          switch (point.corner) {
            case "l":
              break;
            case "r":
              break;
            case "tl":
              point.x = Math.max(point.x, 1);
              compute();
              transform(tr, [1, 0, 0, 1], [100, 0], a);
              break;
            case "tr":
              point.x = Math.min(point.x, width - 1);
              compute();
              transform(point2D(-tr.x, tr.y), [0, 0, 0, 1], [0, 0], -a);
              break;
            case "bl":
              point.x = Math.max(point.x, 1);
              compute();
              transform(point2D(tr.x, -tr.y), [1, 1, 0, 0], [100, 100], -a);
              break;
            case "br":
              point.x = Math.min(point.x, width - 1);
              compute();
              transform(point2D(-tr.x, -tr.y), [0, 1, 1, 0], [0, 100], a);
              break;
          }

          break;
      }

      data.point = point;
    },

    _moveFoldingPage: function (move) {
      var data = this.data().f;

      if (!data) return;

      var turn = data.opts.turn,
        turnData = turn.data(),
        place = turnData.pagePlace;

      if (move) {
        var nextPage = data.opts.next;

        if (place[nextPage] != data.opts.page) {
          if (data.folding) flipMethods._moveFoldingPage.call(this, false);

          var folding = flipMethods._foldingPage.call(this);

          folding.appendTo(data.fpage);
          place[nextPage] = data.opts.page;
          data.folding = nextPage;
        }

        turn.turn("update");
      } else {
        if (data.folding) {
          if (turnData.pages[data.folding]) {
            // If we have flip available

            var flipData = turnData.pages[data.folding].data().f;

            turnData.pageObjs[data.folding].appendTo(flipData.wrapper);
          } else if (turnData.pageWrap[data.folding]) {
            // If we have the pageWrapper

            turnData.pageObjs[data.folding].appendTo(
              turnData.pageWrap[data.folding]
            );
          }

          if (data.folding in place) {
            place[data.folding] = data.folding;
          }

          delete data.folding;
        }
      }
    },

    _showFoldedPage: function (c, animate) {
      var folding = flipMethods._foldingPage.call(this),
        dd = this.data(),
        data = dd.f,
        visible = data.visible;

      if (folding) {
        if (!visible || !data.point || data.point.corner != c.corner) {
          var corner =
            data.status == "hover" ||
            data.status == "peel" ||
            data.opts.turn.data().mouseAction
              ? c.corner
              : null;

          visible = false;

          if (trigger("start", this, [data.opts, corner]) == "prevented")
            return false;
        }

        if (animate) {
          var that = this,
            point =
              data.point && data.point.corner == c.corner
                ? data.point
                : flipMethods._c.call(this, c.corner, 1);

          this.animatef({
            from: [point.x, point.y],
            to: [c.x, c.y],
            duration: 500,
            frame: function (v) {
              c.x = Math.round(v[0]);
              c.y = Math.round(v[1]);
              flipMethods._fold.call(that, c);
            },
          });
        } else {
          flipMethods._fold.call(this, c);

          if (dd.effect && !dd.effect.turning) this.animatef(false);
        }

        if (!visible) {
          switch (data.effect) {
            case "hard":
              data.visible = true;
              flipMethods._moveFoldingPage.call(this, true);
              data.fpage.show();
              if (data.opts.shadows) data.bshadow.show();

              break;
            case "sheet":
              data.visible = true;
              data.fparent.show().data().flips++;
              flipMethods._moveFoldingPage.call(this, true);
              data.fwrapper.show();
              if (data.bshadow) data.bshadow.show();

              break;
          }
        }

        return true;
      }

      return false;
    },

    hide: function () {
      var data = this.data().f,
        turnData = data.opts.turn.data(),
        folding = flipMethods._foldingPage.call(this);

      switch (data.effect) {
        case "hard":
          if (turnData.opts.gradients) {
            data.bshadowLoc = 0;
            data.bshadow.remove();
            data.ashadow.hide();
          }

          data.wrapper.transform("");
          data.fpage.hide();

          break;
        case "sheet":
          if (--data.fparent.data().flips === 0) data.fparent.hide();

          this.css({
            left: 0,
            top: 0,
            right: "auto",
            bottom: "auto",
          }).transform("");

          data.wrapper.transform("");

          data.fwrapper.hide();

          if (data.bshadow) data.bshadow.hide();

          folding.transform("");

          break;
      }

      data.visible = false;

      return this;
    },

    hideFoldedPage: function (animate) {
      var data = this.data().f;

      if (!data.point) return;

      var that = this,
        p1 = data.point,
        hide = function () {
          data.point = null;
          data.status = "";
          that.flip("hide");
          that.trigger("end", [data.opts, false]);
        };

      if (animate) {
        var p4 = flipMethods._c.call(this, p1.corner),
          top = p1.corner.substr(0, 1) == "t",
          delta = top
            ? Math.min(0, p1.y - p4.y) / 2
            : Math.max(0, p1.y - p4.y) / 2,
          p2 = point2D(p1.x, p1.y + delta),
          p3 = point2D(p4.x, p4.y - delta);

        this.animatef({
          from: 0,
          to: 1,
          frame: function (v) {
            var np = bezier(p1, p2, p3, p4, v);
            p1.x = np.x;
            p1.y = np.y;
            flipMethods._fold.call(that, p1);
          },
          complete: hide,
          duration: 800,
          hiding: true,
        });
      } else {
        this.animatef(false);
        hide();
      }
    },

    turnPage: function (corner) {
      var that = this,
        data = this.data().f,
        turnData = data.opts.turn.data();

      corner = {
        corner: data.corner
          ? data.corner.corner
          : corner || flipMethods._cAllowed.call(this)[0],
      };

      var p1 =
          data.point ||
          flipMethods._c.call(
            this,
            corner.corner,
            data.opts.turn ? turnData.opts.elevation : 0
          ),
        p4 = flipMethods._c2.call(this, corner.corner);

      this.trigger("flip").animatef({
        from: 0,
        to: 1,
        frame: function (v) {
          var np = bezier(p1, p1, p4, p4, v);
          corner.x = np.x;
          corner.y = np.y;
          flipMethods._showFoldedPage.call(that, corner);
        },
        complete: function () {
          that.trigger("end", [data.opts, true]);
        },
        duration: turnData.opts.duration,
        turning: true,
      });

      data.corner = null;
    },

    moving: function () {
      return "effect" in this.data();
    },

    isTurning: function () {
      return this.flip("moving") && this.data().effect.turning;
    },

    corner: function () {
      return this.data().f.corner;
    },

    _eventStart: function (e) {
      var data = this.data().f,
        turn = data.opts.turn;

      if (
        !data.corner &&
        !data.disabled &&
        !this.flip("isTurning") &&
        data.opts.page == turn.data().pagePlace[data.opts.page]
      ) {
        data.corner = flipMethods._isIArea.call(this, e);

        if (data.corner && flipMethods._foldingPage.call(this)) {
          this.trigger("pressed", [data.point]);
          flipMethods._showFoldedPage.call(this, data.corner);

          return false;
        } else data.corner = null;
      }
    },

    _eventMove: function (e) {
      var data = this.data().f;

      if (!data.disabled) {
        e = isTouch ? e.originalEvent.touches : [e];

        if (data.corner) {
          var pos = data.parent.offset();
          data.corner.x = e[0].pageX - pos.left;
          data.corner.y = e[0].pageY - pos.top;
          flipMethods._showFoldedPage.call(this, data.corner);
        } else if (data.hover && !this.data().effect && this.is(":visible")) {
          var point = flipMethods._isIArea.call(this, e[0]);

          if (point) {
            if (
              (data.effect == "sheet" && point.corner.length == 2) ||
              data.effect == "hard"
            ) {
              data.status = "hover";
              var origin = flipMethods._c.call(
                this,
                point.corner,
                data.opts.cornerSize / 2
              );
              point.x = origin.x;
              point.y = origin.y;
              flipMethods._showFoldedPage.call(this, point, true);
            }
          } else {
            if (data.status == "hover") {
              data.status = "";
              flipMethods.hideFoldedPage.call(this, true);
            }
          }
        }
      }
    },

    _eventEnd: function () {
      var data = this.data().f,
        corner = data.corner;

      if (!data.disabled && corner) {
        if (trigger("released", this, [data.point || corner]) != "prevented") {
          flipMethods.hideFoldedPage.call(this, true);
        }
      }

      data.corner = null;
    },

    disable: function (disable) {
      flipMethods.setData.call(this, { disabled: disable });
      return this;
    },

    hover: function (hover) {
      flipMethods.setData.call(this, { hover: hover });
      return this;
    },

    peel: function (corner, animate) {
      var data = this.data().f;

      if (corner) {
        if ($.inArray(corner, corners.all) == -1)
          throw turnError("Corner " + corner + " is not permitted");

        if ($.inArray(corner, flipMethods._cAllowed.call(this)) != -1) {
          var point = flipMethods._c.call(
            this,
            corner,
            data.opts.cornerSize / 2
          );

          data.status = "peel";

          flipMethods._showFoldedPage.call(
            this,
            {
              corner: corner,
              x: point.x,
              y: point.y,
            },
            animate
          );
        }
      } else {
        data.status = "";

        flipMethods.hideFoldedPage.call(this, animate);
      }

      return this;
    },
  };

// Processes classes

function dec(that, methods, args) {
  if (!args[0] || typeof args[0] == "object")
    return methods.init.apply(that, args);
  else if (methods[args[0]])
    return methods[args[0]].apply(that, Array.prototype.slice.call(args, 1));
  else throw turnError(args[0] + " is not a method or property");
}

// Attributes for a layer

function divAtt(top, left, zIndex, overf) {
  return {
    css: {
      position: "absolute",
      top: top,
      left: left,
      overflow: overf || "hidden",
      zIndex: zIndex || "auto",
    },
  };
}

// Gets a 2D point from a bezier curve of four points

function bezier(p1, p2, p3, p4, t) {
  var a = 1 - t,
    b = a * a * a,
    c = t * t * t;

  return point2D(
    Math.round(
      b * p1.x + 3 * t * a * a * p2.x + 3 * t * t * a * p3.x + c * p4.x
    ),
    Math.round(
      b * p1.y + 3 * t * a * a * p2.y + 3 * t * t * a * p3.y + c * p4.y
    )
  );
}

// Converts an angle from degrees to radians

function rad(degrees) {
  return (degrees / 180) * PI;
}

// Converts an angle from radians to degrees

function deg(radians) {
  return (radians / PI) * 180;
}

// Gets a 2D point

function point2D(x, y) {
  return { x: x, y: y };
}

// Webkit 534.3 on Android wrongly repaints elements that use overflow:hidden + rotation

function rotationAvailable() {
  var parts;

  if ((parts = /AppleWebkit\/([0-9\.]+)/i.exec(navigator.userAgent))) {
    var webkitVersion = parseFloat(parts[1]);
    return webkitVersion > 534.3;
  } else {
    return true;
  }
}

// Returns the traslate value

function translate(x, y, use3d) {
  return has3d && use3d
    ? " translate3d(" + x + "px," + y + "px, 0px) "
    : " translate(" + x + "px, " + y + "px) ";
}

// Returns the rotation value

function rotate(degrees) {
  return " rotate(" + degrees + "deg) ";
}

// Checks if a property belongs to an object

function has(property, object) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

// Gets the CSS3 vendor prefix

function getPrefix() {
  var vendorPrefixes = ["Moz", "Webkit", "Khtml", "O", "ms"],
    len = vendorPrefixes.length,
    vendor = "";

  while (len--)
    if (vendorPrefixes[len] + "Transform" in document.body.style)
      vendor = "-" + vendorPrefixes[len].toLowerCase() + "-";

  return vendor;
}

// Detects the transitionEnd Event

function getTransitionEnd() {
  var t,
    el = document.createElement("fakeelement"),
    transitions = {
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MSTransition: "transitionend",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd",
    };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

// Gradients

function gradient(obj, p0, p1, colors, numColors) {
  var j,
    cols = [];

  if (vendor == "-webkit-") {
    for (j = 0; j < numColors; j++)
      cols.push("color-stop(" + colors[j][0] + ", " + colors[j][1] + ")");

    obj.css({
      "background-image":
        "-webkit-gradient(linear, " +
        p0.x +
        "% " +
        p0.y +
        "%," +
        p1.x +
        "% " +
        p1.y +
        "%, " +
        cols.join(",") +
        " )",
    });
  } else {
    p0 = { x: (p0.x / 100) * obj.width(), y: (p0.y / 100) * obj.height() };
    p1 = { x: (p1.x / 100) * obj.width(), y: (p1.y / 100) * obj.height() };

    var dx = p1.x - p0.x,
      dy = p1.y - p0.y,
      angle = Math.atan2(dy, dx),
      angle2 = angle - Math.PI / 2,
      diagonal =
        Math.abs(obj.width() * Math.sin(angle2)) +
        Math.abs(obj.height() * Math.cos(angle2)),
      gradientDiagonal = Math.sqrt(dy * dy + dx * dx),
      corner = point2D(
        p1.x < p0.x ? obj.width() : 0,
        p1.y < p0.y ? obj.height() : 0
      ),
      slope = Math.tan(angle),
      inverse = -1 / slope,
      x =
        (inverse * corner.x - corner.y - slope * p0.x + p0.y) /
        (inverse - slope),
      c = { x: x, y: inverse * x - inverse * corner.x + corner.y },
      segA = Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2));

    for (j = 0; j < numColors; j++)
      cols.push(
        " " +
          colors[j][1] +
          " " +
          ((segA + gradientDiagonal * colors[j][0]) * 100) / diagonal +
          "%"
      );

    obj.css({
      "background-image":
        vendor + "linear-gradient(" + -angle + "rad," + cols.join(",") + ")",
    });
  }
}

// Triggers an event

function trigger(eventName, context, args) {
  var event = $.Event(eventName);
  context.trigger(event, args);
  if (event.isDefaultPrevented()) return "prevented";
  else if (event.isPropagationStopped()) return "stopped";
  else return "";
}

// JS Errors

function turnError(message) {
  function TurnJsError(message) {
    this.name = "TurnJsError";
    this.message = message;
  }

  TurnJsError.prototype = new Error();
  TurnJsError.prototype.constructor = TurnJsError;
  return new TurnJsError(message);
}

// Find the offset of an element ignoring its transformation

function findPos(obj) {
  var offset = { top: 0, left: 0 };

  do {
    offset.left += obj.offsetLeft;
    offset.top += obj.offsetTop;
  } while ((obj = obj.offsetParent));

  return offset;
}

// Checks if there's hard page compatibility
// IE9 is the only browser that does not support hard pages

function hasHardPage() {
  return navigator.userAgent.indexOf("MSIE 9.0") == -1;
}

// Request an animation

window.requestAnim = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// Extend $.fn

$.extend($.fn, {
  flip: function () {
    return dec($(this[0]), flipMethods, arguments);
  },

  turn: function () {
    return dec($(this[0]), turnMethods, arguments);
  },

  transform: function (transform, origin) {
    var properties = {};

    if (origin) properties[vendor + "transform-origin"] = origin;

    properties[vendor + "transform"] = transform;

    return this.css(properties);
  },

  animatef: function (point) {
    var data = this.data();

    if (data.effect) data.effect.stop();

    if (point) {
      if (!point.to.length) point.to = [point.to];
      if (!point.from.length) point.from = [point.from];

      var diff = [],
        len = point.to.length,
        animating = true,
        that = this,
        time = new Date().getTime(),
        frame = function () {
          if (!data.effect || !animating) return;

          var v = [],
            timeDiff = Math.min(point.duration, new Date().getTime() - time);

          for (var i = 0; i < len; i++)
            v.push(
              data.effect.easing(
                1,
                timeDiff,
                point.from[i],
                diff[i],
                point.duration
              )
            );

          point.frame(len == 1 ? v[0] : v);

          if (timeDiff == point.duration) {
            delete data["effect"];
            that.data(data);
            if (point.complete) point.complete();
          } else {
            window.requestAnim(frame);
          }
        };

      for (var i = 0; i < len; i++) diff.push(point.to[i] - point.from[i]);

      data.effect = $.extend(
        {
          stop: function () {
            animating = false;
          },
          easing: function (x, t, b, c, data) {
            return c * Math.sqrt(1 - (t = t / data - 1) * t) + b;
          },
        },
        point
      );

      this.data(data);

      frame();
    } else {
      delete data["effect"];
    }
  },
});

// Export some globals

$.isTouch = isTouch;
$.mouseEvents = mouseEvents;
$.cssPrefix = getPrefix;
$.cssTransitionEnd = getTransitionEnd;
$.findPos = findPos;


/***/ }),

/***/ "./node_modules/@splidejs/splide/dist/js/splide.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@splidejs/splide/dist/js/splide.esm.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CLASSES: () => (/* binding */ CLASSES),
/* harmony export */   CLASS_ACTIVE: () => (/* binding */ CLASS_ACTIVE),
/* harmony export */   CLASS_ARROW: () => (/* binding */ CLASS_ARROW),
/* harmony export */   CLASS_ARROWS: () => (/* binding */ CLASS_ARROWS),
/* harmony export */   CLASS_ARROW_NEXT: () => (/* binding */ CLASS_ARROW_NEXT),
/* harmony export */   CLASS_ARROW_PREV: () => (/* binding */ CLASS_ARROW_PREV),
/* harmony export */   CLASS_CLONE: () => (/* binding */ CLASS_CLONE),
/* harmony export */   CLASS_CONTAINER: () => (/* binding */ CLASS_CONTAINER),
/* harmony export */   CLASS_FOCUS_IN: () => (/* binding */ CLASS_FOCUS_IN),
/* harmony export */   CLASS_INITIALIZED: () => (/* binding */ CLASS_INITIALIZED),
/* harmony export */   CLASS_LIST: () => (/* binding */ CLASS_LIST),
/* harmony export */   CLASS_LOADING: () => (/* binding */ CLASS_LOADING),
/* harmony export */   CLASS_NEXT: () => (/* binding */ CLASS_NEXT),
/* harmony export */   CLASS_OVERFLOW: () => (/* binding */ CLASS_OVERFLOW),
/* harmony export */   CLASS_PAGINATION: () => (/* binding */ CLASS_PAGINATION),
/* harmony export */   CLASS_PAGINATION_PAGE: () => (/* binding */ CLASS_PAGINATION_PAGE),
/* harmony export */   CLASS_PREV: () => (/* binding */ CLASS_PREV),
/* harmony export */   CLASS_PROGRESS: () => (/* binding */ CLASS_PROGRESS),
/* harmony export */   CLASS_PROGRESS_BAR: () => (/* binding */ CLASS_PROGRESS_BAR),
/* harmony export */   CLASS_ROOT: () => (/* binding */ CLASS_ROOT),
/* harmony export */   CLASS_SLIDE: () => (/* binding */ CLASS_SLIDE),
/* harmony export */   CLASS_SPINNER: () => (/* binding */ CLASS_SPINNER),
/* harmony export */   CLASS_SR: () => (/* binding */ CLASS_SR),
/* harmony export */   CLASS_TOGGLE: () => (/* binding */ CLASS_TOGGLE),
/* harmony export */   CLASS_TOGGLE_PAUSE: () => (/* binding */ CLASS_TOGGLE_PAUSE),
/* harmony export */   CLASS_TOGGLE_PLAY: () => (/* binding */ CLASS_TOGGLE_PLAY),
/* harmony export */   CLASS_TRACK: () => (/* binding */ CLASS_TRACK),
/* harmony export */   CLASS_VISIBLE: () => (/* binding */ CLASS_VISIBLE),
/* harmony export */   DEFAULTS: () => (/* binding */ DEFAULTS),
/* harmony export */   EVENT_ACTIVE: () => (/* binding */ EVENT_ACTIVE),
/* harmony export */   EVENT_ARROWS_MOUNTED: () => (/* binding */ EVENT_ARROWS_MOUNTED),
/* harmony export */   EVENT_ARROWS_UPDATED: () => (/* binding */ EVENT_ARROWS_UPDATED),
/* harmony export */   EVENT_AUTOPLAY_PAUSE: () => (/* binding */ EVENT_AUTOPLAY_PAUSE),
/* harmony export */   EVENT_AUTOPLAY_PLAY: () => (/* binding */ EVENT_AUTOPLAY_PLAY),
/* harmony export */   EVENT_AUTOPLAY_PLAYING: () => (/* binding */ EVENT_AUTOPLAY_PLAYING),
/* harmony export */   EVENT_CLICK: () => (/* binding */ EVENT_CLICK),
/* harmony export */   EVENT_DESTROY: () => (/* binding */ EVENT_DESTROY),
/* harmony export */   EVENT_DRAG: () => (/* binding */ EVENT_DRAG),
/* harmony export */   EVENT_DRAGGED: () => (/* binding */ EVENT_DRAGGED),
/* harmony export */   EVENT_DRAGGING: () => (/* binding */ EVENT_DRAGGING),
/* harmony export */   EVENT_END_INDEX_CHANGED: () => (/* binding */ EVENT_END_INDEX_CHANGED),
/* harmony export */   EVENT_HIDDEN: () => (/* binding */ EVENT_HIDDEN),
/* harmony export */   EVENT_INACTIVE: () => (/* binding */ EVENT_INACTIVE),
/* harmony export */   EVENT_LAZYLOAD_LOADED: () => (/* binding */ EVENT_LAZYLOAD_LOADED),
/* harmony export */   EVENT_MOUNTED: () => (/* binding */ EVENT_MOUNTED),
/* harmony export */   EVENT_MOVE: () => (/* binding */ EVENT_MOVE),
/* harmony export */   EVENT_MOVED: () => (/* binding */ EVENT_MOVED),
/* harmony export */   EVENT_NAVIGATION_MOUNTED: () => (/* binding */ EVENT_NAVIGATION_MOUNTED),
/* harmony export */   EVENT_OVERFLOW: () => (/* binding */ EVENT_OVERFLOW),
/* harmony export */   EVENT_PAGINATION_MOUNTED: () => (/* binding */ EVENT_PAGINATION_MOUNTED),
/* harmony export */   EVENT_PAGINATION_UPDATED: () => (/* binding */ EVENT_PAGINATION_UPDATED),
/* harmony export */   EVENT_READY: () => (/* binding */ EVENT_READY),
/* harmony export */   EVENT_REFRESH: () => (/* binding */ EVENT_REFRESH),
/* harmony export */   EVENT_RESIZE: () => (/* binding */ EVENT_RESIZE),
/* harmony export */   EVENT_RESIZED: () => (/* binding */ EVENT_RESIZED),
/* harmony export */   EVENT_SCROLL: () => (/* binding */ EVENT_SCROLL),
/* harmony export */   EVENT_SCROLLED: () => (/* binding */ EVENT_SCROLLED),
/* harmony export */   EVENT_SHIFTED: () => (/* binding */ EVENT_SHIFTED),
/* harmony export */   EVENT_SLIDE_KEYDOWN: () => (/* binding */ EVENT_SLIDE_KEYDOWN),
/* harmony export */   EVENT_UPDATED: () => (/* binding */ EVENT_UPDATED),
/* harmony export */   EVENT_VISIBLE: () => (/* binding */ EVENT_VISIBLE),
/* harmony export */   EventBinder: () => (/* binding */ EventBinder),
/* harmony export */   EventInterface: () => (/* binding */ EventInterface),
/* harmony export */   FADE: () => (/* binding */ FADE),
/* harmony export */   LOOP: () => (/* binding */ LOOP),
/* harmony export */   LTR: () => (/* binding */ LTR),
/* harmony export */   RTL: () => (/* binding */ RTL),
/* harmony export */   RequestInterval: () => (/* binding */ RequestInterval),
/* harmony export */   SLIDE: () => (/* binding */ SLIDE),
/* harmony export */   STATUS_CLASSES: () => (/* binding */ STATUS_CLASSES),
/* harmony export */   Splide: () => (/* binding */ Splide),
/* harmony export */   SplideRenderer: () => (/* binding */ SplideRenderer),
/* harmony export */   State: () => (/* binding */ State),
/* harmony export */   TTB: () => (/* binding */ TTB),
/* harmony export */   Throttle: () => (/* binding */ Throttle),
/* harmony export */   "default": () => (/* binding */ Splide)
/* harmony export */ });
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/*!
 * Splide.js
 * Version  : 4.1.4
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
var CREATED = 1;
var MOUNTED = 2;
var IDLE = 3;
var MOVING = 4;
var SCROLLING = 5;
var DRAGGING = 6;
var DESTROYED = 7;
var STATES = {
  CREATED: CREATED,
  MOUNTED: MOUNTED,
  IDLE: IDLE,
  MOVING: MOVING,
  SCROLLING: SCROLLING,
  DRAGGING: DRAGGING,
  DESTROYED: DESTROYED
};

function empty(array) {
  array.length = 0;
}

function slice(arrayLike, start, end) {
  return Array.prototype.slice.call(arrayLike, start, end);
}

function apply(func) {
  return func.bind.apply(func, [null].concat(slice(arguments, 1)));
}

var nextTick = setTimeout;

var noop = function noop() {};

function raf(func) {
  return requestAnimationFrame(func);
}

function typeOf(type, subject) {
  return typeof subject === type;
}

function isObject(subject) {
  return !isNull(subject) && typeOf("object", subject);
}

var isArray = Array.isArray;
var isFunction = apply(typeOf, "function");
var isString = apply(typeOf, "string");
var isUndefined = apply(typeOf, "undefined");

function isNull(subject) {
  return subject === null;
}

function isHTMLElement(subject) {
  try {
    return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
  } catch (e) {
    return false;
  }
}

function toArray(value) {
  return isArray(value) ? value : [value];
}

function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}

function includes(array, value) {
  return array.indexOf(value) > -1;
}

function push(array, items) {
  array.push.apply(array, toArray(items));
  return array;
}

function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, function (name) {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}

function addClass(elm, classes) {
  toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
}

function append(parent, children) {
  forEach(children, parent.appendChild.bind(parent));
}

function before(nodes, ref) {
  forEach(nodes, function (node) {
    var parent = (ref || node).parentNode;

    if (parent) {
      parent.insertBefore(node, ref);
    }
  });
}

function matches(elm, selector) {
  return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
}

function children(parent, selector) {
  var children2 = parent ? slice(parent.children) : [];
  return selector ? children2.filter(function (child) {
    return matches(child, selector);
  }) : children2;
}

function child(parent, selector) {
  return selector ? children(parent, selector)[0] : parent.firstElementChild;
}

var ownKeys = Object.keys;

function forOwn(object, iteratee, right) {
  if (object) {
    (right ? ownKeys(object).reverse() : ownKeys(object)).forEach(function (key) {
      key !== "__proto__" && iteratee(object[key], key);
    });
  }

  return object;
}

function assign(object) {
  slice(arguments, 1).forEach(function (source) {
    forOwn(source, function (value, key) {
      object[key] = source[key];
    });
  });
  return object;
}

function merge(object) {
  slice(arguments, 1).forEach(function (source) {
    forOwn(source, function (value, key) {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject(value)) {
        object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
  });
  return object;
}

function omit(object, keys) {
  forEach(keys || ownKeys(object), function (key) {
    delete object[key];
  });
}

function removeAttribute(elms, attrs) {
  forEach(elms, function (elm) {
    forEach(attrs, function (attr) {
      elm && elm.removeAttribute(attr);
    });
  });
}

function setAttribute(elms, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, function (value2, name) {
      setAttribute(elms, name, value2);
    });
  } else {
    forEach(elms, function (elm) {
      isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    });
  }
}

function create(tag, attrs, parent) {
  var elm = document.createElement(tag);

  if (attrs) {
    isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
  }

  parent && append(parent, elm);
  return elm;
}

function style(elm, prop, value) {
  if (isUndefined(value)) {
    return getComputedStyle(elm)[prop];
  }

  if (!isNull(value)) {
    elm.style[prop] = "" + value;
  }
}

function display(elm, display2) {
  style(elm, "display", display2);
}

function focus(elm) {
  elm["setActive"] && elm["setActive"]() || elm.focus({
    preventScroll: true
  });
}

function getAttribute(elm, attr) {
  return elm.getAttribute(attr);
}

function hasClass(elm, className) {
  return elm && elm.classList.contains(className);
}

function rect(target) {
  return target.getBoundingClientRect();
}

function remove(nodes) {
  forEach(nodes, function (node) {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}

function parseHtml(html) {
  return child(new DOMParser().parseFromString(html, "text/html").body);
}

function prevent(e, stopPropagation) {
  e.preventDefault();

  if (stopPropagation) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}

function query(parent, selector) {
  return parent && parent.querySelector(selector);
}

function queryAll(parent, selector) {
  return selector ? slice(parent.querySelectorAll(selector)) : [];
}

function removeClass(elm, classes) {
  toggleClass(elm, classes, false);
}

function timeOf(e) {
  return e.timeStamp;
}

function unit(value) {
  return isString(value) ? value : value ? value + "px" : "";
}

var PROJECT_CODE = "splide";
var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;

function assert(condition, message) {
  if (!condition) {
    throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
  }
}

var min = Math.min,
    max = Math.max,
    floor = Math.floor,
    ceil = Math.ceil,
    abs = Math.abs;

function approximatelyEqual(x, y, epsilon) {
  return abs(x - y) < epsilon;
}

function between(number, x, y, exclusive) {
  var minimum = min(x, y);
  var maximum = max(x, y);
  return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
}

function clamp(number, x, y) {
  var minimum = min(x, y);
  var maximum = max(x, y);
  return min(max(minimum, number), maximum);
}

function sign(x) {
  return +(x > 0) - +(x < 0);
}

function camelToKebab(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function format(string, replacements) {
  forEach(replacements, function (replacement) {
    string = string.replace("%s", "" + replacement);
  });
  return string;
}

function pad(number) {
  return number < 10 ? "0" + number : "" + number;
}

var ids = {};

function uniqueId(prefix) {
  return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
}

function EventBinder() {
  var listeners = [];

  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, function (target, event, namespace) {
      var isEventTarget = ("addEventListener" in target);
      var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
      isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
      listeners.push([target, event, namespace, callback, remover]);
    });
  }

  function unbind(targets, events, callback) {
    forEachEvent(targets, events, function (target, event, namespace) {
      listeners = listeners.filter(function (listener) {
        if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
          listener[4]();
          return false;
        }

        return true;
      });
    });
  }

  function dispatch(target, type, detail) {
    var e;
    var bubbles = true;

    if (typeof CustomEvent === "function") {
      e = new CustomEvent(type, {
        bubbles: bubbles,
        detail: detail
      });
    } else {
      e = document.createEvent("CustomEvent");
      e.initCustomEvent(type, bubbles, false, detail);
    }

    target.dispatchEvent(e);
    return e;
  }

  function forEachEvent(targets, events, iteratee) {
    forEach(targets, function (target) {
      target && forEach(events, function (events2) {
        events2.split(" ").forEach(function (eventNS) {
          var fragment = eventNS.split(".");
          iteratee(target, fragment[0], fragment[1]);
        });
      });
    });
  }

  function destroy() {
    listeners.forEach(function (data) {
      data[4]();
    });
    empty(listeners);
  }

  return {
    bind: bind,
    unbind: unbind,
    dispatch: dispatch,
    destroy: destroy
  };
}

var EVENT_MOUNTED = "mounted";
var EVENT_READY = "ready";
var EVENT_MOVE = "move";
var EVENT_MOVED = "moved";
var EVENT_CLICK = "click";
var EVENT_ACTIVE = "active";
var EVENT_INACTIVE = "inactive";
var EVENT_VISIBLE = "visible";
var EVENT_HIDDEN = "hidden";
var EVENT_REFRESH = "refresh";
var EVENT_UPDATED = "updated";
var EVENT_RESIZE = "resize";
var EVENT_RESIZED = "resized";
var EVENT_DRAG = "drag";
var EVENT_DRAGGING = "dragging";
var EVENT_DRAGGED = "dragged";
var EVENT_SCROLL = "scroll";
var EVENT_SCROLLED = "scrolled";
var EVENT_OVERFLOW = "overflow";
var EVENT_DESTROY = "destroy";
var EVENT_ARROWS_MOUNTED = "arrows:mounted";
var EVENT_ARROWS_UPDATED = "arrows:updated";
var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
var EVENT_PAGINATION_UPDATED = "pagination:updated";
var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
var EVENT_AUTOPLAY_PLAY = "autoplay:play";
var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
var EVENT_SLIDE_KEYDOWN = "sk";
var EVENT_SHIFTED = "sh";
var EVENT_END_INDEX_CHANGED = "ei";

function EventInterface(Splide2) {
  var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
  var binder = EventBinder();

  function on(events, callback) {
    binder.bind(bus, toArray(events).join(" "), function (e) {
      callback.apply(callback, isArray(e.detail) ? e.detail : []);
    });
  }

  function emit(event) {
    binder.dispatch(bus, event, slice(arguments, 1));
  }

  if (Splide2) {
    Splide2.event.on(EVENT_DESTROY, binder.destroy);
  }

  return assign(binder, {
    bus: bus,
    on: on,
    off: apply(binder.unbind, bus),
    emit: emit
  });
}

function RequestInterval(interval, onInterval, onUpdate, limit) {
  var now = Date.now;
  var startTime;
  var rate = 0;
  var id;
  var paused = true;
  var count = 0;

  function update() {
    if (!paused) {
      rate = interval ? min((now() - startTime) / interval, 1) : 1;
      onUpdate && onUpdate(rate);

      if (rate >= 1) {
        onInterval();
        startTime = now();

        if (limit && ++count >= limit) {
          return pause();
        }
      }

      id = raf(update);
    }
  }

  function start(resume) {
    resume || cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    id = raf(update);
  }

  function pause() {
    paused = true;
  }

  function rewind() {
    startTime = now();
    rate = 0;

    if (onUpdate) {
      onUpdate(rate);
    }
  }

  function cancel() {
    id && cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }

  function set(time) {
    interval = time;
  }

  function isPaused() {
    return paused;
  }

  return {
    start: start,
    rewind: rewind,
    pause: pause,
    cancel: cancel,
    set: set,
    isPaused: isPaused
  };
}

function State(initialState) {
  var state = initialState;

  function set(value) {
    state = value;
  }

  function is(states) {
    return includes(toArray(states), state);
  }

  return {
    set: set,
    is: is
  };
}

function Throttle(func, duration) {
  var interval = RequestInterval(duration || 0, func, null, 1);
  return function () {
    interval.isPaused() && interval.start();
  };
}

function Media(Splide2, Components2, options) {
  var state = Splide2.state;
  var breakpoints = options.breakpoints || {};
  var reducedMotion = options.reducedMotion || {};
  var binder = EventBinder();
  var queries = [];

  function setup() {
    var isMin = options.mediaQuery === "min";
    ownKeys(breakpoints).sort(function (n, m) {
      return isMin ? +n - +m : +m - +n;
    }).forEach(function (key) {
      register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
    });
    register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
    update();
  }

  function destroy(completely) {
    if (completely) {
      binder.destroy();
    }
  }

  function register(options2, query) {
    var queryList = matchMedia(query);
    binder.bind(queryList, "change", update);
    queries.push([options2, queryList]);
  }

  function update() {
    var destroyed = state.is(DESTROYED);
    var direction = options.direction;
    var merged = queries.reduce(function (merged2, entry) {
      return merge(merged2, entry[1].matches ? entry[0] : {});
    }, {});
    omit(options);
    set(merged);

    if (options.destroy) {
      Splide2.destroy(options.destroy === "completely");
    } else if (destroyed) {
      destroy(true);
      Splide2.mount();
    } else {
      direction !== options.direction && Splide2.refresh();
    }
  }

  function reduce(enable) {
    if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) {
      enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
    }
  }

  function set(opts, base, notify) {
    merge(options, opts);
    base && merge(Object.getPrototypeOf(options), opts);

    if (notify || !state.is(CREATED)) {
      Splide2.emit(EVENT_UPDATED, options);
    }
  }

  return {
    setup: setup,
    destroy: destroy,
    reduce: reduce,
    set: set
  };
}

var ARROW = "Arrow";
var ARROW_LEFT = ARROW + "Left";
var ARROW_RIGHT = ARROW + "Right";
var ARROW_UP = ARROW + "Up";
var ARROW_DOWN = ARROW + "Down";
var LTR = "ltr";
var RTL = "rtl";
var TTB = "ttb";
var ORIENTATION_MAP = {
  width: ["height"],
  left: ["top", "right"],
  right: ["bottom", "left"],
  x: ["y"],
  X: ["Y"],
  Y: ["X"],
  ArrowLeft: [ARROW_UP, ARROW_RIGHT],
  ArrowRight: [ARROW_DOWN, ARROW_LEFT]
};

function Direction(Splide2, Components2, options) {
  function resolve(prop, axisOnly, direction) {
    direction = direction || options.direction;
    var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
    return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, function (match, offset) {
      var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
      return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
    });
  }

  function orient(value) {
    return value * (options.direction === RTL ? 1 : -1);
  }

  return {
    resolve: resolve,
    orient: orient
  };
}

var ROLE = "role";
var TAB_INDEX = "tabindex";
var DISABLED = "disabled";
var ARIA_PREFIX = "aria-";
var ARIA_CONTROLS = ARIA_PREFIX + "controls";
var ARIA_CURRENT = ARIA_PREFIX + "current";
var ARIA_SELECTED = ARIA_PREFIX + "selected";
var ARIA_LABEL = ARIA_PREFIX + "label";
var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
var ARIA_LIVE = ARIA_PREFIX + "live";
var ARIA_BUSY = ARIA_PREFIX + "busy";
var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
var ALL_ATTRIBUTES = [ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION];
var CLASS_PREFIX = PROJECT_CODE + "__";
var STATUS_CLASS_PREFIX = "is-";
var CLASS_ROOT = PROJECT_CODE;
var CLASS_TRACK = CLASS_PREFIX + "track";
var CLASS_LIST = CLASS_PREFIX + "list";
var CLASS_SLIDE = CLASS_PREFIX + "slide";
var CLASS_CLONE = CLASS_SLIDE + "--clone";
var CLASS_CONTAINER = CLASS_SLIDE + "__container";
var CLASS_ARROWS = CLASS_PREFIX + "arrows";
var CLASS_ARROW = CLASS_PREFIX + "arrow";
var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
var CLASS_PROGRESS = CLASS_PREFIX + "progress";
var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
var CLASS_TOGGLE_PLAY = CLASS_TOGGLE + "__play";
var CLASS_TOGGLE_PAUSE = CLASS_TOGGLE + "__pause";
var CLASS_SPINNER = CLASS_PREFIX + "spinner";
var CLASS_SR = CLASS_PREFIX + "sr";
var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
var CLASS_ACTIVE = STATUS_CLASS_PREFIX + "active";
var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN, CLASS_OVERFLOW];
var CLASSES = {
  slide: CLASS_SLIDE,
  clone: CLASS_CLONE,
  arrows: CLASS_ARROWS,
  arrow: CLASS_ARROW,
  prev: CLASS_ARROW_PREV,
  next: CLASS_ARROW_NEXT,
  pagination: CLASS_PAGINATION,
  page: CLASS_PAGINATION_PAGE,
  spinner: CLASS_SPINNER
};

function closest(from, selector) {
  if (isFunction(from.closest)) {
    return from.closest(selector);
  }

  var elm = from;

  while (elm && elm.nodeType === 1) {
    if (matches(elm, selector)) {
      break;
    }

    elm = elm.parentElement;
  }

  return elm;
}

var FRICTION = 5;
var LOG_INTERVAL = 200;
var POINTER_DOWN_EVENTS = "touchstart mousedown";
var POINTER_MOVE_EVENTS = "touchmove mousemove";
var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";

function Elements(Splide2, Components2, options) {
  var _EventInterface = EventInterface(Splide2),
      on = _EventInterface.on,
      bind = _EventInterface.bind;

  var root = Splide2.root;
  var i18n = options.i18n;
  var elements = {};
  var slides = [];
  var rootClasses = [];
  var trackClasses = [];
  var track;
  var list;
  var isUsingKey;

  function setup() {
    collect();
    init();
    update();
  }

  function mount() {
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, setup);
    on(EVENT_UPDATED, update);
    bind(document, POINTER_DOWN_EVENTS + " keydown", function (e) {
      isUsingKey = e.type === "keydown";
    }, {
      capture: true
    });
    bind(root, "focusin", function () {
      toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
    });
  }

  function destroy(completely) {
    var attrs = ALL_ATTRIBUTES.concat("style");
    empty(slides);
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    removeAttribute([track, list], attrs);
    removeAttribute(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
  }

  function update() {
    removeClass(root, rootClasses);
    removeClass(track, trackClasses);
    rootClasses = getClasses(CLASS_ROOT);
    trackClasses = getClasses(CLASS_TRACK);
    addClass(root, rootClasses);
    addClass(track, trackClasses);
    setAttribute(root, ARIA_LABEL, options.label);
    setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
  }

  function collect() {
    track = find("." + CLASS_TRACK);
    list = child(track, "." + CLASS_LIST);
    assert(track && list, "A track/list element is missing.");
    push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
    forOwn({
      arrows: CLASS_ARROWS,
      pagination: CLASS_PAGINATION,
      prev: CLASS_ARROW_PREV,
      next: CLASS_ARROW_NEXT,
      bar: CLASS_PROGRESS_BAR,
      toggle: CLASS_TOGGLE
    }, function (className, key) {
      elements[key] = find("." + className);
    });
    assign(elements, {
      root: root,
      track: track,
      list: list,
      slides: slides
    });
  }

  function init() {
    var id = root.id || uniqueId(PROJECT_CODE);
    var role = options.role;
    root.id = id;
    track.id = track.id || id + "-track";
    list.id = list.id || id + "-list";

    if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) {
      setAttribute(root, ROLE, role);
    }

    setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
    setAttribute(list, ROLE, "presentation");
  }

  function find(selector) {
    var elm = query(root, selector);
    return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
  }

  function getClasses(base) {
    return [base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE];
  }

  return assign(elements, {
    setup: setup,
    mount: mount,
    destroy: destroy
  });
}

var SLIDE = "slide";
var LOOP = "loop";
var FADE = "fade";

function Slide$1(Splide2, index, slideIndex, slide) {
  var event = EventInterface(Splide2);
  var on = event.on,
      emit = event.emit,
      bind = event.bind;
  var Components = Splide2.Components,
      root = Splide2.root,
      options = Splide2.options;
  var isNavigation = options.isNavigation,
      updateOnMove = options.updateOnMove,
      i18n = options.i18n,
      pagination = options.pagination,
      slideFocus = options.slideFocus;
  var resolve = Components.Direction.resolve;
  var styles = getAttribute(slide, "style");
  var label = getAttribute(slide, ARIA_LABEL);
  var isClone = slideIndex > -1;
  var container = child(slide, "." + CLASS_CONTAINER);
  var destroyed;

  function mount() {
    if (!isClone) {
      slide.id = root.id + "-slide" + pad(index + 1);
      setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
      setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
      setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [index + 1, Splide2.length]));
    }

    listen();
  }

  function listen() {
    bind(slide, "click", apply(emit, EVENT_CLICK, self));
    bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self));
    on([EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED], update);
    on(EVENT_NAVIGATION_MOUNTED, initNavigation);

    if (updateOnMove) {
      on(EVENT_MOVE, onMove);
    }
  }

  function destroy() {
    destroyed = true;
    event.destroy();
    removeClass(slide, STATUS_CLASSES);
    removeAttribute(slide, ALL_ATTRIBUTES);
    setAttribute(slide, "style", styles);
    setAttribute(slide, ARIA_LABEL, label || "");
  }

  function initNavigation() {
    var controls = Splide2.splides.map(function (target) {
      var Slide2 = target.splide.Components.Slides.getAt(index);
      return Slide2 ? Slide2.slide.id : "";
    }).join(" ");
    setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
    setAttribute(slide, ARIA_CONTROLS, controls);
    setAttribute(slide, ROLE, slideFocus ? "button" : "");
    slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
  }

  function onMove() {
    if (!destroyed) {
      update();
    }
  }

  function update() {
    if (!destroyed) {
      var curr = Splide2.index;
      updateActivity();
      updateVisibility();
      toggleClass(slide, CLASS_PREV, index === curr - 1);
      toggleClass(slide, CLASS_NEXT, index === curr + 1);
    }
  }

  function updateActivity() {
    var active = isActive();

    if (active !== hasClass(slide, CLASS_ACTIVE)) {
      toggleClass(slide, CLASS_ACTIVE, active);
      setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
      emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
    }
  }

  function updateVisibility() {
    var visible = isVisible();
    var hidden = !visible && (!isActive() || isClone);

    if (!Splide2.state.is([MOVING, SCROLLING])) {
      setAttribute(slide, ARIA_HIDDEN, hidden || "");
    }

    setAttribute(queryAll(slide, options.focusableNodes || ""), TAB_INDEX, hidden ? -1 : "");

    if (slideFocus) {
      setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
    }

    if (visible !== hasClass(slide, CLASS_VISIBLE)) {
      toggleClass(slide, CLASS_VISIBLE, visible);
      emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
    }

    if (!visible && document.activeElement === slide) {
      var Slide2 = Components.Slides.getAt(Splide2.index);
      Slide2 && focus(Slide2.slide);
    }
  }

  function style$1(prop, value, useContainer) {
    style(useContainer && container || slide, prop, value);
  }

  function isActive() {
    var curr = Splide2.index;
    return curr === index || options.cloneStatus && curr === slideIndex;
  }

  function isVisible() {
    if (Splide2.is(FADE)) {
      return isActive();
    }

    var trackRect = rect(Components.Elements.track);
    var slideRect = rect(slide);
    var left = resolve("left", true);
    var right = resolve("right", true);
    return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
  }

  function isWithin(from, distance) {
    var diff = abs(from - index);

    if (!isClone && (options.rewind || Splide2.is(LOOP))) {
      diff = min(diff, Splide2.length - diff);
    }

    return diff <= distance;
  }

  var self = {
    index: index,
    slideIndex: slideIndex,
    slide: slide,
    container: container,
    isClone: isClone,
    mount: mount,
    destroy: destroy,
    update: update,
    style: style$1,
    isWithin: isWithin
  };
  return self;
}

function Slides(Splide2, Components2, options) {
  var _EventInterface2 = EventInterface(Splide2),
      on = _EventInterface2.on,
      emit = _EventInterface2.emit,
      bind = _EventInterface2.bind;

  var _Components2$Elements = Components2.Elements,
      slides = _Components2$Elements.slides,
      list = _Components2$Elements.list;
  var Slides2 = [];

  function mount() {
    init();
    on(EVENT_REFRESH, destroy);
    on(EVENT_REFRESH, init);
  }

  function init() {
    slides.forEach(function (slide, index) {
      register(slide, index, -1);
    });
  }

  function destroy() {
    forEach$1(function (Slide2) {
      Slide2.destroy();
    });
    empty(Slides2);
  }

  function update() {
    forEach$1(function (Slide2) {
      Slide2.update();
    });
  }

  function register(slide, index, slideIndex) {
    var object = Slide$1(Splide2, index, slideIndex, slide);
    object.mount();
    Slides2.push(object);
    Slides2.sort(function (Slide1, Slide2) {
      return Slide1.index - Slide2.index;
    });
  }

  function get(excludeClones) {
    return excludeClones ? filter(function (Slide2) {
      return !Slide2.isClone;
    }) : Slides2;
  }

  function getIn(page) {
    var Controller = Components2.Controller;
    var index = Controller.toIndex(page);
    var max = Controller.hasFocus() ? 1 : options.perPage;
    return filter(function (Slide2) {
      return between(Slide2.index, index, index + max - 1);
    });
  }

  function getAt(index) {
    return filter(index)[0];
  }

  function add(items, index) {
    forEach(items, function (slide) {
      if (isString(slide)) {
        slide = parseHtml(slide);
      }

      if (isHTMLElement(slide)) {
        var ref = slides[index];
        ref ? before(slide, ref) : append(list, slide);
        addClass(slide, options.classes.slide);
        observeImages(slide, apply(emit, EVENT_RESIZE));
      }
    });
    emit(EVENT_REFRESH);
  }

  function remove$1(matcher) {
    remove(filter(matcher).map(function (Slide2) {
      return Slide2.slide;
    }));
    emit(EVENT_REFRESH);
  }

  function forEach$1(iteratee, excludeClones) {
    get(excludeClones).forEach(iteratee);
  }

  function filter(matcher) {
    return Slides2.filter(isFunction(matcher) ? matcher : function (Slide2) {
      return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
    });
  }

  function style(prop, value, useContainer) {
    forEach$1(function (Slide2) {
      Slide2.style(prop, value, useContainer);
    });
  }

  function observeImages(elm, callback) {
    var images = queryAll(elm, "img");
    var length = images.length;

    if (length) {
      images.forEach(function (img) {
        bind(img, "load error", function () {
          if (! --length) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  }

  function getLength(excludeClones) {
    return excludeClones ? slides.length : Slides2.length;
  }

  function isEnough() {
    return Slides2.length > options.perPage;
  }

  return {
    mount: mount,
    destroy: destroy,
    update: update,
    register: register,
    get: get,
    getIn: getIn,
    getAt: getAt,
    add: add,
    remove: remove$1,
    forEach: forEach$1,
    filter: filter,
    style: style,
    getLength: getLength,
    isEnough: isEnough
  };
}

function Layout(Splide2, Components2, options) {
  var _EventInterface3 = EventInterface(Splide2),
      on = _EventInterface3.on,
      bind = _EventInterface3.bind,
      emit = _EventInterface3.emit;

  var Slides = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var _Components2$Elements2 = Components2.Elements,
      root = _Components2$Elements2.root,
      track = _Components2$Elements2.track,
      list = _Components2$Elements2.list;
  var getAt = Slides.getAt,
      styleSlides = Slides.style;
  var vertical;
  var rootRect;
  var overflow;

  function mount() {
    init();
    bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on(EVENT_RESIZE, resize);
  }

  function init() {
    vertical = options.direction === TTB;
    style(root, "maxWidth", unit(options.width));
    style(track, resolve("paddingLeft"), cssPadding(false));
    style(track, resolve("paddingRight"), cssPadding(true));
    resize(true);
  }

  function resize(force) {
    var newRect = rect(root);

    if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
      style(track, "height", cssTrackHeight());
      styleSlides(resolve("marginRight"), unit(options.gap));
      styleSlides("width", cssSlideWidth());
      styleSlides("height", cssSlideHeight(), true);
      rootRect = newRect;
      emit(EVENT_RESIZED);

      if (overflow !== (overflow = isOverflow())) {
        toggleClass(root, CLASS_OVERFLOW, overflow);
        emit(EVENT_OVERFLOW, overflow);
      }
    }
  }

  function cssPadding(right) {
    var padding = options.padding;
    var prop = resolve(right ? "right" : "left");
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }

  function cssTrackHeight() {
    var height = "";

    if (vertical) {
      height = cssHeight();
      assert(height, "height or heightRatio is missing.");
      height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
    }

    return height;
  }

  function cssHeight() {
    return unit(options.height || rect(list).width * options.heightRatio);
  }

  function cssSlideWidth() {
    return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
  }

  function cssSlideHeight() {
    return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
  }

  function cssSlideSize() {
    var gap = unit(options.gap);
    return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
  }

  function listSize() {
    return rect(list)[resolve("width")];
  }

  function slideSize(index, withoutGap) {
    var Slide = getAt(index || 0);
    return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
  }

  function totalSize(index, withoutGap) {
    var Slide = getAt(index);

    if (Slide) {
      var right = rect(Slide.slide)[resolve("right")];
      var left = rect(list)[resolve("left")];
      return abs(right - left) + (withoutGap ? 0 : getGap());
    }

    return 0;
  }

  function sliderSize(withoutGap) {
    return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
  }

  function getGap() {
    var Slide = getAt(0);
    return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
  }

  function getPadding(right) {
    return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
  }

  function isOverflow() {
    return Splide2.is(FADE) || sliderSize(true) > listSize();
  }

  return {
    mount: mount,
    resize: resize,
    listSize: listSize,
    slideSize: slideSize,
    sliderSize: sliderSize,
    totalSize: totalSize,
    getPadding: getPadding,
    isOverflow: isOverflow
  };
}

var MULTIPLIER = 2;

function Clones(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on;
  var Elements = Components2.Elements,
      Slides = Components2.Slides;
  var resolve = Components2.Direction.resolve;
  var clones = [];
  var cloneCount;

  function mount() {
    on(EVENT_REFRESH, remount);
    on([EVENT_UPDATED, EVENT_RESIZE], observe);

    if (cloneCount = computeCloneCount()) {
      generate(cloneCount);
      Components2.Layout.resize(true);
    }
  }

  function remount() {
    destroy();
    mount();
  }

  function destroy() {
    remove(clones);
    empty(clones);
    event.destroy();
  }

  function observe() {
    var count = computeCloneCount();

    if (cloneCount !== count) {
      if (cloneCount < count || !count) {
        event.emit(EVENT_REFRESH);
      }
    }
  }

  function generate(count) {
    var slides = Slides.get().slice();
    var length = slides.length;

    if (length) {
      while (slides.length < count) {
        push(slides, slides);
      }

      push(slides.slice(-count), slides.slice(0, count)).forEach(function (Slide, index) {
        var isHead = index < count;
        var clone = cloneDeep(Slide.slide, index);
        isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
        push(clones, clone);
        Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
      });
    }
  }

  function cloneDeep(elm, index) {
    var clone = elm.cloneNode(true);
    addClass(clone, options.classes.clone);
    clone.id = Splide2.root.id + "-clone" + pad(index + 1);
    return clone;
  }

  function computeCloneCount() {
    var clones2 = options.clones;

    if (!Splide2.is(LOOP)) {
      clones2 = 0;
    } else if (isUndefined(clones2)) {
      var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
      var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
      clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
    }

    return clones2;
  }

  return {
    mount: mount,
    destroy: destroy
  };
}

function Move(Splide2, Components2, options) {
  var _EventInterface4 = EventInterface(Splide2),
      on = _EventInterface4.on,
      emit = _EventInterface4.emit;

  var set = Splide2.state.set;
  var _Components2$Layout = Components2.Layout,
      slideSize = _Components2$Layout.slideSize,
      getPadding = _Components2$Layout.getPadding,
      totalSize = _Components2$Layout.totalSize,
      listSize = _Components2$Layout.listSize,
      sliderSize = _Components2$Layout.sliderSize;
  var _Components2$Directio = Components2.Direction,
      resolve = _Components2$Directio.resolve,
      orient = _Components2$Directio.orient;
  var _Components2$Elements3 = Components2.Elements,
      list = _Components2$Elements3.list,
      track = _Components2$Elements3.track;
  var Transition;

  function mount() {
    Transition = Components2.Transition;
    on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
  }

  function reposition() {
    if (!Components2.Controller.isBusy()) {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      Components2.Slides.update();
    }
  }

  function move(dest, index, prev, callback) {
    if (dest !== index && canShift(dest > prev)) {
      cancel();
      translate(shift(getPosition(), dest > prev), true);
    }

    set(MOVING);
    emit(EVENT_MOVE, index, prev, dest);
    Transition.start(index, function () {
      set(IDLE);
      emit(EVENT_MOVED, index, prev, dest);
      callback && callback();
    });
  }

  function jump(index) {
    translate(toPosition(index, true));
  }

  function translate(position, preventLoop) {
    if (!Splide2.is(FADE)) {
      var destination = preventLoop ? position : loop(position);
      style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
      position !== destination && emit(EVENT_SHIFTED);
    }
  }

  function loop(position) {
    if (Splide2.is(LOOP)) {
      var index = toIndex(position);
      var exceededMax = index > Components2.Controller.getEnd();
      var exceededMin = index < 0;

      if (exceededMin || exceededMax) {
        position = shift(position, exceededMax);
      }
    }

    return position;
  }

  function shift(position, backwards) {
    var excess = position - getLimit(backwards);
    var size = sliderSize();
    position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
    return position;
  }

  function cancel() {
    translate(getPosition(), true);
    Transition.cancel();
  }

  function toIndex(position) {
    var Slides = Components2.Slides.get();
    var index = 0;
    var minDistance = Infinity;

    for (var i = 0; i < Slides.length; i++) {
      var slideIndex = Slides[i].index;
      var distance = abs(toPosition(slideIndex, true) - position);

      if (distance <= minDistance) {
        minDistance = distance;
        index = slideIndex;
      } else {
        break;
      }
    }

    return index;
  }

  function toPosition(index, trimming) {
    var position = orient(totalSize(index - 1) - offset(index));
    return trimming ? trim(position) : position;
  }

  function getPosition() {
    var left = resolve("left");
    return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
  }

  function trim(position) {
    if (options.trimSpace && Splide2.is(SLIDE)) {
      position = clamp(position, 0, orient(sliderSize(true) - listSize()));
    }

    return position;
  }

  function offset(index) {
    var focus = options.focus;
    return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
  }

  function getLimit(max) {
    return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
  }

  function canShift(backwards) {
    var shifted = orient(shift(getPosition(), backwards));
    return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
  }

  function exceededLimit(max, position) {
    position = isUndefined(position) ? getPosition() : position;
    var exceededMin = max !== true && orient(position) < orient(getLimit(false));
    var exceededMax = max !== false && orient(position) > orient(getLimit(true));
    return exceededMin || exceededMax;
  }

  return {
    mount: mount,
    move: move,
    jump: jump,
    translate: translate,
    shift: shift,
    cancel: cancel,
    toIndex: toIndex,
    toPosition: toPosition,
    getPosition: getPosition,
    getLimit: getLimit,
    exceededLimit: exceededLimit,
    reposition: reposition
  };
}

function Controller(Splide2, Components2, options) {
  var _EventInterface5 = EventInterface(Splide2),
      on = _EventInterface5.on,
      emit = _EventInterface5.emit;

  var Move = Components2.Move;
  var getPosition = Move.getPosition,
      getLimit = Move.getLimit,
      toPosition = Move.toPosition;
  var _Components2$Slides = Components2.Slides,
      isEnough = _Components2$Slides.isEnough,
      getLength = _Components2$Slides.getLength;
  var omitEnd = options.omitEnd;
  var isLoop = Splide2.is(LOOP);
  var isSlide = Splide2.is(SLIDE);
  var getNext = apply(getAdjacent, false);
  var getPrev = apply(getAdjacent, true);
  var currIndex = options.start || 0;
  var endIndex;
  var prevIndex = currIndex;
  var slideCount;
  var perMove;
  var perPage;

  function mount() {
    init();
    on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], init);
    on(EVENT_RESIZED, onResized);
  }

  function init() {
    slideCount = getLength(true);
    perMove = options.perMove;
    perPage = options.perPage;
    endIndex = getEnd();
    var index = clamp(currIndex, 0, omitEnd ? endIndex : slideCount - 1);

    if (index !== currIndex) {
      currIndex = index;
      Move.reposition();
    }
  }

  function onResized() {
    if (endIndex !== getEnd()) {
      emit(EVENT_END_INDEX_CHANGED);
    }
  }

  function go(control, allowSameIndex, callback) {
    if (!isBusy()) {
      var dest = parse(control);
      var index = loop(dest);

      if (index > -1 && (allowSameIndex || index !== currIndex)) {
        setIndex(index);
        Move.move(dest, index, prevIndex, callback);
      }
    }
  }

  function scroll(destination, duration, snap, callback) {
    Components2.Scroll.scroll(destination, duration, snap, function () {
      var index = loop(Move.toIndex(getPosition()));
      setIndex(omitEnd ? min(index, endIndex) : index);
      callback && callback();
    });
  }

  function parse(control) {
    var index = currIndex;

    if (isString(control)) {
      var _ref = control.match(/([+\-<>])(\d+)?/) || [],
          indicator = _ref[1],
          number = _ref[2];

      if (indicator === "+" || indicator === "-") {
        index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
      } else if (indicator === ">") {
        index = number ? toIndex(+number) : getNext(true);
      } else if (indicator === "<") {
        index = getPrev(true);
      }
    } else {
      index = isLoop ? control : clamp(control, 0, endIndex);
    }

    return index;
  }

  function getAdjacent(prev, destination) {
    var number = perMove || (hasFocus() ? 1 : perPage);
    var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));

    if (dest === -1 && isSlide) {
      if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
        return prev ? 0 : endIndex;
      }
    }

    return destination ? dest : loop(dest);
  }

  function computeDestIndex(dest, from, snapPage) {
    if (isEnough() || hasFocus()) {
      var index = computeMovableDestIndex(dest);

      if (index !== dest) {
        from = dest;
        dest = index;
        snapPage = false;
      }

      if (dest < 0 || dest > endIndex) {
        if (!perMove && (between(0, dest, from, true) || between(endIndex, from, dest, true))) {
          dest = toIndex(toPage(dest));
        } else {
          if (isLoop) {
            dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest;
          } else if (options.rewind) {
            dest = dest < 0 ? endIndex : 0;
          } else {
            dest = -1;
          }
        }
      } else {
        if (snapPage && dest !== from) {
          dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
        }
      }
    } else {
      dest = -1;
    }

    return dest;
  }

  function computeMovableDestIndex(dest) {
    if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
      var position = getPosition();

      while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) {
        dest < currIndex ? --dest : ++dest;
      }
    }

    return dest;
  }

  function loop(index) {
    return isLoop ? (index + slideCount) % slideCount || 0 : index;
  }

  function getEnd() {
    var end = slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage);

    while (omitEnd && end-- > 0) {
      if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
        end++;
        break;
      }
    }

    return clamp(end, 0, slideCount - 1);
  }

  function toIndex(page) {
    return clamp(hasFocus() ? page : perPage * page, 0, endIndex);
  }

  function toPage(index) {
    return hasFocus() ? min(index, endIndex) : floor((index >= endIndex ? slideCount - 1 : index) / perPage);
  }

  function toDest(destination) {
    var closest = Move.toIndex(destination);
    return isSlide ? clamp(closest, 0, endIndex) : closest;
  }

  function setIndex(index) {
    if (index !== currIndex) {
      prevIndex = currIndex;
      currIndex = index;
    }
  }

  function getIndex(prev) {
    return prev ? prevIndex : currIndex;
  }

  function hasFocus() {
    return !isUndefined(options.focus) || options.isNavigation;
  }

  function isBusy() {
    return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
  }

  return {
    mount: mount,
    go: go,
    scroll: scroll,
    getNext: getNext,
    getPrev: getPrev,
    getAdjacent: getAdjacent,
    getEnd: getEnd,
    setIndex: setIndex,
    getIndex: getIndex,
    toIndex: toIndex,
    toPage: toPage,
    toDest: toDest,
    hasFocus: hasFocus,
    isBusy: isBusy
  };
}

var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
var SIZE = 40;

function Arrows(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on,
      bind = event.bind,
      emit = event.emit;
  var classes = options.classes,
      i18n = options.i18n;
  var Elements = Components2.Elements,
      Controller = Components2.Controller;
  var placeholder = Elements.arrows,
      track = Elements.track;
  var wrapper = placeholder;
  var prev = Elements.prev;
  var next = Elements.next;
  var created;
  var wrapperClasses;
  var arrows = {};

  function mount() {
    init();
    on(EVENT_UPDATED, remount);
  }

  function remount() {
    destroy();
    mount();
  }

  function init() {
    var enabled = options.arrows;

    if (enabled && !(prev && next)) {
      createArrows();
    }

    if (prev && next) {
      assign(arrows, {
        prev: prev,
        next: next
      });
      display(wrapper, enabled ? "" : "none");
      addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);

      if (enabled) {
        listen();
        update();
        setAttribute([prev, next], ARIA_CONTROLS, track.id);
        emit(EVENT_ARROWS_MOUNTED, prev, next);
      }
    }
  }

  function destroy() {
    event.destroy();
    removeClass(wrapper, wrapperClasses);

    if (created) {
      remove(placeholder ? [prev, next] : wrapper);
      prev = next = null;
    } else {
      removeAttribute([prev, next], ALL_ATTRIBUTES);
    }
  }

  function listen() {
    on([EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED], update);
    bind(next, "click", apply(go, ">"));
    bind(prev, "click", apply(go, "<"));
  }

  function go(control) {
    Controller.go(control, true);
  }

  function createArrows() {
    wrapper = placeholder || create("div", classes.arrows);
    prev = createArrow(true);
    next = createArrow(false);
    created = true;
    append(wrapper, [prev, next]);
    !placeholder && before(wrapper, track);
  }

  function createArrow(prev2) {
    var arrow = "<button class=\"" + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + "\" type=\"button\"><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\" focusable=\"false\"><path d=\"" + (options.arrowPath || PATH) + "\" />";
    return parseHtml(arrow);
  }

  function update() {
    if (prev && next) {
      var index = Splide2.index;
      var prevIndex = Controller.getPrev();
      var nextIndex = Controller.getNext();
      var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
    }
  }

  return {
    arrows: arrows,
    mount: mount,
    destroy: destroy,
    update: update
  };
}

var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";

function Autoplay(Splide2, Components2, options) {
  var _EventInterface6 = EventInterface(Splide2),
      on = _EventInterface6.on,
      bind = _EventInterface6.bind,
      emit = _EventInterface6.emit;

  var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
  var isPaused = interval.isPaused;
  var Elements = Components2.Elements,
      _Components2$Elements4 = Components2.Elements,
      root = _Components2$Elements4.root,
      toggle = _Components2$Elements4.toggle;
  var autoplay = options.autoplay;
  var hovered;
  var focused;
  var stopped = autoplay === "pause";

  function mount() {
    if (autoplay) {
      listen();
      toggle && setAttribute(toggle, ARIA_CONTROLS, Elements.track.id);
      stopped || play();
      update();
    }
  }

  function listen() {
    if (options.pauseOnHover) {
      bind(root, "mouseenter mouseleave", function (e) {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }

    if (options.pauseOnFocus) {
      bind(root, "focusin focusout", function (e) {
        focused = e.type === "focusin";
        autoToggle();
      });
    }

    if (toggle) {
      bind(toggle, "click", function () {
        stopped ? play() : pause(true);
      });
    }

    on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    on(EVENT_MOVE, onMove);
  }

  function play() {
    if (isPaused() && Components2.Slides.isEnough()) {
      interval.start(!options.resetProgress);
      focused = hovered = stopped = false;
      update();
      emit(EVENT_AUTOPLAY_PLAY);
    }
  }

  function pause(stop) {
    if (stop === void 0) {
      stop = true;
    }

    stopped = !!stop;
    update();

    if (!isPaused()) {
      interval.pause();
      emit(EVENT_AUTOPLAY_PAUSE);
    }
  }

  function autoToggle() {
    if (!stopped) {
      hovered || focused ? pause(false) : play();
    }
  }

  function update() {
    if (toggle) {
      toggleClass(toggle, CLASS_ACTIVE, !stopped);
      setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
    }
  }

  function onAnimationFrame(rate) {
    var bar = Elements.bar;
    bar && style(bar, "width", rate * 100 + "%");
    emit(EVENT_AUTOPLAY_PLAYING, rate);
  }

  function onMove(index) {
    var Slide = Components2.Slides.getAt(index);
    interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
  }

  return {
    mount: mount,
    destroy: interval.cancel,
    play: play,
    pause: pause,
    isPaused: isPaused
  };
}

function Cover(Splide2, Components2, options) {
  var _EventInterface7 = EventInterface(Splide2),
      on = _EventInterface7.on;

  function mount() {
    if (options.cover) {
      on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
      on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply(cover, true));
    }
  }

  function cover(cover2) {
    Components2.Slides.forEach(function (Slide) {
      var img = child(Slide.container || Slide.slide, "img");

      if (img && img.src) {
        toggle(cover2, img, Slide);
      }
    });
  }

  function toggle(cover2, img, Slide) {
    Slide.style("background", cover2 ? "center/cover no-repeat url(\"" + img.src + "\")" : "", true);
    display(img, cover2 ? "none" : "");
  }

  return {
    mount: mount,
    destroy: apply(cover, false)
  };
}

var BOUNCE_DIFF_THRESHOLD = 10;
var BOUNCE_DURATION = 600;
var FRICTION_FACTOR = 0.6;
var BASE_VELOCITY = 1.5;
var MIN_DURATION = 800;

function Scroll(Splide2, Components2, options) {
  var _EventInterface8 = EventInterface(Splide2),
      on = _EventInterface8.on,
      emit = _EventInterface8.emit;

  var set = Splide2.state.set;
  var Move = Components2.Move;
  var getPosition = Move.getPosition,
      getLimit = Move.getLimit,
      exceededLimit = Move.exceededLimit,
      translate = Move.translate;
  var isSlide = Splide2.is(SLIDE);
  var interval;
  var callback;
  var friction = 1;

  function mount() {
    on(EVENT_MOVE, clear);
    on([EVENT_UPDATED, EVENT_REFRESH], cancel);
  }

  function scroll(destination, duration, snap, onScrolled, noConstrain) {
    var from = getPosition();
    clear();

    if (snap && (!isSlide || !exceededLimit())) {
      var size = Components2.Layout.sliderSize();
      var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
      destination = Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
    }

    var noDistance = approximatelyEqual(from, destination, 1);
    friction = 1;
    duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
    callback = onScrolled;
    interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
    set(SCROLLING);
    emit(EVENT_SCROLL);
    interval.start();
  }

  function onEnd() {
    set(IDLE);
    callback && callback();
    emit(EVENT_SCROLLED);
  }

  function update(from, to, noConstrain, rate) {
    var position = getPosition();
    var target = from + (to - from) * easing(rate);
    var diff = (target - position) * friction;
    translate(position + diff);

    if (isSlide && !noConstrain && exceededLimit()) {
      friction *= FRICTION_FACTOR;

      if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
        scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
      }
    }
  }

  function clear() {
    if (interval) {
      interval.cancel();
    }
  }

  function cancel() {
    if (interval && !interval.isPaused()) {
      clear();
      onEnd();
    }
  }

  function easing(t) {
    var easingFunc = options.easingFunc;
    return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
  }

  return {
    mount: mount,
    destroy: clear,
    scroll: scroll,
    cancel: cancel
  };
}

var SCROLL_LISTENER_OPTIONS = {
  passive: false,
  capture: true
};

function Drag(Splide2, Components2, options) {
  var _EventInterface9 = EventInterface(Splide2),
      on = _EventInterface9.on,
      emit = _EventInterface9.emit,
      bind = _EventInterface9.bind,
      unbind = _EventInterface9.unbind;

  var state = Splide2.state;
  var Move = Components2.Move,
      Scroll = Components2.Scroll,
      Controller = Components2.Controller,
      track = Components2.Elements.track,
      reduce = Components2.Media.reduce;
  var _Components2$Directio2 = Components2.Direction,
      resolve = _Components2$Directio2.resolve,
      orient = _Components2$Directio2.orient;
  var getPosition = Move.getPosition,
      exceededLimit = Move.exceededLimit;
  var basePosition;
  var baseEvent;
  var prevBaseEvent;
  var isFree;
  var dragging;
  var exceeded = false;
  var clickPrevented;
  var disabled;
  var target;

  function mount() {
    bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
    bind(track, "click", onClick, {
      capture: true
    });
    bind(track, "dragstart", prevent);
    on([EVENT_MOUNTED, EVENT_UPDATED], init);
  }

  function init() {
    var drag = options.drag;
    disable(!drag);
    isFree = drag === "free";
  }

  function onPointerDown(e) {
    clickPrevented = false;

    if (!disabled) {
      var isTouch = isTouchEvent(e);

      if (isDraggable(e.target) && (isTouch || !e.button)) {
        if (!Controller.isBusy()) {
          target = isTouch ? track : window;
          dragging = state.is([MOVING, SCROLLING]);
          prevBaseEvent = null;
          bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
          bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
          Move.cancel();
          Scroll.cancel();
          save(e);
        } else {
          prevent(e, true);
        }
      }
    }
  }

  function onPointerMove(e) {
    if (!state.is(DRAGGING)) {
      state.set(DRAGGING);
      emit(EVENT_DRAG);
    }

    if (e.cancelable) {
      if (dragging) {
        Move.translate(basePosition + constrain(diffCoord(e)));
        var expired = diffTime(e) > LOG_INTERVAL;
        var hasExceeded = exceeded !== (exceeded = exceededLimit());

        if (expired || hasExceeded) {
          save(e);
        }

        clickPrevented = true;
        emit(EVENT_DRAGGING);
        prevent(e);
      } else if (isSliderDirection(e)) {
        dragging = shouldStart(e);
        prevent(e);
      }
    }
  }

  function onPointerUp(e) {
    if (state.is(DRAGGING)) {
      state.set(IDLE);
      emit(EVENT_DRAGGED);
    }

    if (dragging) {
      move(e);
      prevent(e);
    }

    unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
    unbind(target, POINTER_UP_EVENTS, onPointerUp);
    dragging = false;
  }

  function onClick(e) {
    if (!disabled && clickPrevented) {
      prevent(e, true);
    }
  }

  function save(e) {
    prevBaseEvent = baseEvent;
    baseEvent = e;
    basePosition = getPosition();
  }

  function move(e) {
    var velocity = computeVelocity(e);
    var destination = computeDestination(velocity);
    var rewind = options.rewind && options.rewindByDrag;
    reduce(false);

    if (isFree) {
      Controller.scroll(destination, 0, options.snap);
    } else if (Splide2.is(FADE)) {
      Controller.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+");
    } else if (Splide2.is(SLIDE) && exceeded && rewind) {
      Controller.go(exceededLimit(true) ? ">" : "<");
    } else {
      Controller.go(Controller.toDest(destination), true);
    }

    reduce(true);
  }

  function shouldStart(e) {
    var thresholds = options.dragMinThreshold;
    var isObj = isObject(thresholds);
    var mouse = isObj && thresholds.mouse || 0;
    var touch = (isObj ? thresholds.touch : +thresholds) || 10;
    return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
  }

  function isSliderDirection(e) {
    return abs(diffCoord(e)) > abs(diffCoord(e, true));
  }

  function computeVelocity(e) {
    if (Splide2.is(LOOP) || !exceeded) {
      var time = diffTime(e);

      if (time && time < LOG_INTERVAL) {
        return diffCoord(e) / time;
      }
    }

    return 0;
  }

  function computeDestination(velocity) {
    return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
  }

  function diffCoord(e, orthogonal) {
    return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
  }

  function diffTime(e) {
    return timeOf(e) - timeOf(getBaseEvent(e));
  }

  function getBaseEvent(e) {
    return baseEvent === e && prevBaseEvent || baseEvent;
  }

  function coordOf(e, orthogonal) {
    return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
  }

  function constrain(diff) {
    return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
  }

  function isDraggable(target2) {
    var noDrag = options.noDrag;
    return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
  }

  function isTouchEvent(e) {
    return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
  }

  function isDragging() {
    return dragging;
  }

  function disable(value) {
    disabled = value;
  }

  return {
    mount: mount,
    disable: disable,
    isDragging: isDragging
  };
}

var NORMALIZATION_MAP = {
  Spacebar: " ",
  Right: ARROW_RIGHT,
  Left: ARROW_LEFT,
  Up: ARROW_UP,
  Down: ARROW_DOWN
};

function normalizeKey(key) {
  key = isString(key) ? key : key.key;
  return NORMALIZATION_MAP[key] || key;
}

var KEYBOARD_EVENT = "keydown";

function Keyboard(Splide2, Components2, options) {
  var _EventInterface10 = EventInterface(Splide2),
      on = _EventInterface10.on,
      bind = _EventInterface10.bind,
      unbind = _EventInterface10.unbind;

  var root = Splide2.root;
  var resolve = Components2.Direction.resolve;
  var target;
  var disabled;

  function mount() {
    init();
    on(EVENT_UPDATED, destroy);
    on(EVENT_UPDATED, init);
    on(EVENT_MOVE, onMove);
  }

  function init() {
    var keyboard = options.keyboard;

    if (keyboard) {
      target = keyboard === "global" ? window : root;
      bind(target, KEYBOARD_EVENT, onKeydown);
    }
  }

  function destroy() {
    unbind(target, KEYBOARD_EVENT);
  }

  function disable(value) {
    disabled = value;
  }

  function onMove() {
    var _disabled = disabled;
    disabled = true;
    nextTick(function () {
      disabled = _disabled;
    });
  }

  function onKeydown(e) {
    if (!disabled) {
      var key = normalizeKey(e);

      if (key === resolve(ARROW_LEFT)) {
        Splide2.go("<");
      } else if (key === resolve(ARROW_RIGHT)) {
        Splide2.go(">");
      }
    }
  }

  return {
    mount: mount,
    destroy: destroy,
    disable: disable
  };
}

var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";

function LazyLoad(Splide2, Components2, options) {
  var _EventInterface11 = EventInterface(Splide2),
      on = _EventInterface11.on,
      off = _EventInterface11.off,
      bind = _EventInterface11.bind,
      emit = _EventInterface11.emit;

  var isSequential = options.lazyLoad === "sequential";
  var events = [EVENT_MOVED, EVENT_SCROLLED];
  var entries = [];

  function mount() {
    if (options.lazyLoad) {
      init();
      on(EVENT_REFRESH, init);
    }
  }

  function init() {
    empty(entries);
    register();

    if (isSequential) {
      loadNext();
    } else {
      off(events);
      on(events, check);
      check();
    }
  }

  function register() {
    Components2.Slides.forEach(function (Slide) {
      queryAll(Slide.slide, IMAGE_SELECTOR).forEach(function (img) {
        var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
        var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);

        if (src !== img.src || srcset !== img.srcset) {
          var className = options.classes.spinner;
          var parent = img.parentElement;
          var spinner = child(parent, "." + className) || create("span", className, parent);
          entries.push([img, Slide, spinner]);
          img.src || display(img, "none");
        }
      });
    });
  }

  function check() {
    entries = entries.filter(function (data) {
      var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
      return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
    });
    entries.length || off(events);
  }

  function load(data) {
    var img = data[0];
    addClass(data[1].slide, CLASS_LOADING);
    bind(img, "load error", apply(onLoad, data));
    setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
    setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
    removeAttribute(img, SRC_DATA_ATTRIBUTE);
    removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
  }

  function onLoad(data, e) {
    var img = data[0],
        Slide = data[1];
    removeClass(Slide.slide, CLASS_LOADING);

    if (e.type !== "error") {
      remove(data[2]);
      display(img, "");
      emit(EVENT_LAZYLOAD_LOADED, img, Slide);
      emit(EVENT_RESIZE);
    }

    isSequential && loadNext();
  }

  function loadNext() {
    entries.length && load(entries.shift());
  }

  return {
    mount: mount,
    destroy: apply(empty, entries),
    check: check
  };
}

function Pagination(Splide2, Components2, options) {
  var event = EventInterface(Splide2);
  var on = event.on,
      emit = event.emit,
      bind = event.bind;
  var Slides = Components2.Slides,
      Elements = Components2.Elements,
      Controller = Components2.Controller;
  var hasFocus = Controller.hasFocus,
      getIndex = Controller.getIndex,
      go = Controller.go;
  var resolve = Components2.Direction.resolve;
  var placeholder = Elements.pagination;
  var items = [];
  var list;
  var paginationClasses;

  function mount() {
    destroy();
    on([EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED], mount);
    var enabled = options.pagination;
    placeholder && display(placeholder, enabled ? "" : "none");

    if (enabled) {
      on([EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED], update);
      createPagination();
      update();
      emit(EVENT_PAGINATION_MOUNTED, {
        list: list,
        items: items
      }, getAt(Splide2.index));
    }
  }

  function destroy() {
    if (list) {
      remove(placeholder ? slice(list.children) : list);
      removeClass(list, paginationClasses);
      empty(items);
      list = null;
    }

    event.destroy();
  }

  function createPagination() {
    var length = Splide2.length;
    var classes = options.classes,
        i18n = options.i18n,
        perPage = options.perPage;
    var max = hasFocus() ? Controller.getEnd() + 1 : ceil(length / perPage);
    list = placeholder || create("ul", classes.pagination, Elements.track.parentElement);
    addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
    setAttribute(list, ROLE, "tablist");
    setAttribute(list, ARIA_LABEL, i18n.select);
    setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");

    for (var i = 0; i < max; i++) {
      var li = create("li", null, list);
      var button = create("button", {
        class: classes.page,
        type: "button"
      }, li);
      var controls = Slides.getIn(i).map(function (Slide) {
        return Slide.slide.id;
      });
      var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
      bind(button, "click", apply(onClick, i));

      if (options.paginationKeyboard) {
        bind(button, "keydown", apply(onKeydown, i));
      }

      setAttribute(li, ROLE, "presentation");
      setAttribute(button, ROLE, "tab");
      setAttribute(button, ARIA_CONTROLS, controls.join(" "));
      setAttribute(button, ARIA_LABEL, format(text, i + 1));
      setAttribute(button, TAB_INDEX, -1);
      items.push({
        li: li,
        button: button,
        page: i
      });
    }
  }

  function onClick(page) {
    go(">" + page, true);
  }

  function onKeydown(page, e) {
    var length = items.length;
    var key = normalizeKey(e);
    var dir = getDirection();
    var nextPage = -1;

    if (key === resolve(ARROW_RIGHT, false, dir)) {
      nextPage = ++page % length;
    } else if (key === resolve(ARROW_LEFT, false, dir)) {
      nextPage = (--page + length) % length;
    } else if (key === "Home") {
      nextPage = 0;
    } else if (key === "End") {
      nextPage = length - 1;
    }

    var item = items[nextPage];

    if (item) {
      focus(item.button);
      go(">" + nextPage);
      prevent(e, true);
    }
  }

  function getDirection() {
    return options.paginationDirection || options.direction;
  }

  function getAt(index) {
    return items[Controller.toPage(index)];
  }

  function update() {
    var prev = getAt(getIndex(true));
    var curr = getAt(getIndex());

    if (prev) {
      var button = prev.button;
      removeClass(button, CLASS_ACTIVE);
      removeAttribute(button, ARIA_SELECTED);
      setAttribute(button, TAB_INDEX, -1);
    }

    if (curr) {
      var _button = curr.button;
      addClass(_button, CLASS_ACTIVE);
      setAttribute(_button, ARIA_SELECTED, true);
      setAttribute(_button, TAB_INDEX, "");
    }

    emit(EVENT_PAGINATION_UPDATED, {
      list: list,
      items: items
    }, prev, curr);
  }

  return {
    items: items,
    mount: mount,
    destroy: destroy,
    getAt: getAt,
    update: update
  };
}

var TRIGGER_KEYS = [" ", "Enter"];

function Sync(Splide2, Components2, options) {
  var isNavigation = options.isNavigation,
      slideFocus = options.slideFocus;
  var events = [];

  function mount() {
    Splide2.splides.forEach(function (target) {
      if (!target.isParent) {
        sync(Splide2, target.splide);
        sync(target.splide, Splide2);
      }
    });

    if (isNavigation) {
      navigate();
    }
  }

  function destroy() {
    events.forEach(function (event) {
      event.destroy();
    });
    empty(events);
  }

  function remount() {
    destroy();
    mount();
  }

  function sync(splide, target) {
    var event = EventInterface(splide);
    event.on(EVENT_MOVE, function (index, prev, dest) {
      target.go(target.is(LOOP) ? dest : index);
    });
    events.push(event);
  }

  function navigate() {
    var event = EventInterface(Splide2);
    var on = event.on;
    on(EVENT_CLICK, onClick);
    on(EVENT_SLIDE_KEYDOWN, onKeydown);
    on([EVENT_MOUNTED, EVENT_UPDATED], update);
    events.push(event);
    event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
  }

  function update() {
    setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
  }

  function onClick(Slide) {
    Splide2.go(Slide.index);
  }

  function onKeydown(Slide, e) {
    if (includes(TRIGGER_KEYS, normalizeKey(e))) {
      onClick(Slide);
      prevent(e);
    }
  }

  return {
    setup: apply(Components2.Media.set, {
      slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
    }, true),
    mount: mount,
    destroy: destroy,
    remount: remount
  };
}

function Wheel(Splide2, Components2, options) {
  var _EventInterface12 = EventInterface(Splide2),
      bind = _EventInterface12.bind;

  var lastTime = 0;

  function mount() {
    if (options.wheel) {
      bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
    }
  }

  function onWheel(e) {
    if (e.cancelable) {
      var deltaY = e.deltaY;
      var backwards = deltaY < 0;
      var timeStamp = timeOf(e);

      var _min = options.wheelMinThreshold || 0;

      var sleep = options.wheelSleep || 0;

      if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
        Splide2.go(backwards ? "<" : ">");
        lastTime = timeStamp;
      }

      shouldPrevent(backwards) && prevent(e);
    }
  }

  function shouldPrevent(backwards) {
    return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
  }

  return {
    mount: mount
  };
}

var SR_REMOVAL_DELAY = 90;

function Live(Splide2, Components2, options) {
  var _EventInterface13 = EventInterface(Splide2),
      on = _EventInterface13.on;

  var track = Components2.Elements.track;
  var enabled = options.live && !options.isNavigation;
  var sr = create("span", CLASS_SR);
  var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));

  function mount() {
    if (enabled) {
      disable(!Components2.Autoplay.isPaused());
      setAttribute(track, ARIA_ATOMIC, true);
      sr.textContent = "\u2026";
      on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
      on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
      on([EVENT_MOVED, EVENT_SCROLLED], apply(toggle, true));
    }
  }

  function toggle(active) {
    setAttribute(track, ARIA_BUSY, active);

    if (active) {
      append(track, sr);
      interval.start();
    } else {
      remove(sr);
      interval.cancel();
    }
  }

  function destroy() {
    removeAttribute(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
    remove(sr);
  }

  function disable(disabled) {
    if (enabled) {
      setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
    }
  }

  return {
    mount: mount,
    disable: disable,
    destroy: destroy
  };
}

var ComponentConstructors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Media: Media,
  Direction: Direction,
  Elements: Elements,
  Slides: Slides,
  Layout: Layout,
  Clones: Clones,
  Move: Move,
  Controller: Controller,
  Arrows: Arrows,
  Autoplay: Autoplay,
  Cover: Cover,
  Scroll: Scroll,
  Drag: Drag,
  Keyboard: Keyboard,
  LazyLoad: LazyLoad,
  Pagination: Pagination,
  Sync: Sync,
  Wheel: Wheel,
  Live: Live
});
var I18N = {
  prev: "Previous slide",
  next: "Next slide",
  first: "Go to first slide",
  last: "Go to last slide",
  slideX: "Go to slide %s",
  pageX: "Go to page %s",
  play: "Start autoplay",
  pause: "Pause autoplay",
  carousel: "carousel",
  slide: "slide",
  select: "Select a slide to show",
  slideLabel: "%s of %s"
};
var DEFAULTS = {
  type: "slide",
  role: "region",
  speed: 400,
  perPage: 1,
  cloneStatus: true,
  arrows: true,
  pagination: true,
  paginationKeyboard: true,
  interval: 5e3,
  pauseOnHover: true,
  pauseOnFocus: true,
  resetProgress: true,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  drag: true,
  direction: "ltr",
  trimSpace: true,
  focusableNodes: "a, button, textarea, input, select, iframe",
  live: true,
  classes: CLASSES,
  i18n: I18N,
  reducedMotion: {
    speed: 0,
    rewindSpeed: 0,
    autoplay: "pause"
  }
};

function Fade(Splide2, Components2, options) {
  var Slides = Components2.Slides;

  function mount() {
    EventInterface(Splide2).on([EVENT_MOUNTED, EVENT_REFRESH], init);
  }

  function init() {
    Slides.forEach(function (Slide) {
      Slide.style("transform", "translateX(-" + 100 * Slide.index + "%)");
    });
  }

  function start(index, done) {
    Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
    nextTick(done);
  }

  return {
    mount: mount,
    start: start,
    cancel: noop
  };
}

function Slide(Splide2, Components2, options) {
  var Move = Components2.Move,
      Controller = Components2.Controller,
      Scroll = Components2.Scroll;
  var list = Components2.Elements.list;
  var transition = apply(style, list, "transition");
  var endCallback;

  function mount() {
    EventInterface(Splide2).bind(list, "transitionend", function (e) {
      if (e.target === list && endCallback) {
        cancel();
        endCallback();
      }
    });
  }

  function start(index, done) {
    var destination = Move.toPosition(index, true);
    var position = Move.getPosition();
    var speed = getSpeed(index);

    if (abs(destination - position) >= 1 && speed >= 1) {
      if (options.useScroll) {
        Scroll.scroll(destination, speed, false, done);
      } else {
        transition("transform " + speed + "ms " + options.easing);
        Move.translate(destination, true);
        endCallback = done;
      }
    } else {
      Move.jump(index);
      done();
    }
  }

  function cancel() {
    transition("");
    Scroll.cancel();
  }

  function getSpeed(index) {
    var rewindSpeed = options.rewindSpeed;

    if (Splide2.is(SLIDE) && rewindSpeed) {
      var prev = Controller.getIndex(true);
      var end = Controller.getEnd();

      if (prev === 0 && index >= end || prev >= end && index === 0) {
        return rewindSpeed;
      }
    }

    return options.speed;
  }

  return {
    mount: mount,
    start: start,
    cancel: cancel
  };
}

var _Splide = /*#__PURE__*/function () {
  function _Splide(target, options) {
    this.event = EventInterface();
    this.Components = {};
    this.state = State(CREATED);
    this.splides = [];
    this._o = {};
    this._E = {};
    var root = isString(target) ? query(document, target) : target;
    assert(root, root + " is invalid.");
    this.root = root;
    options = merge({
      label: getAttribute(root, ARIA_LABEL) || "",
      labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
    }, DEFAULTS, _Splide.defaults, options || {});

    try {
      merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
    } catch (e) {
      assert(false, "Invalid JSON");
    }

    this._o = Object.create(merge({}, options));
  }

  var _proto = _Splide.prototype;

  _proto.mount = function mount(Extensions, Transition) {
    var _this = this;

    var state = this.state,
        Components2 = this.Components;
    assert(state.is([CREATED, DESTROYED]), "Already mounted!");
    state.set(CREATED);
    this._C = Components2;
    this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
    this._E = Extensions || this._E;
    var Constructors = assign({}, ComponentConstructors, this._E, {
      Transition: this._T
    });
    forOwn(Constructors, function (Component, key) {
      var component = Component(_this, Components2, _this._o);
      Components2[key] = component;
      component.setup && component.setup();
    });
    forOwn(Components2, function (component) {
      component.mount && component.mount();
    });
    this.emit(EVENT_MOUNTED);
    addClass(this.root, CLASS_INITIALIZED);
    state.set(IDLE);
    this.emit(EVENT_READY);
    return this;
  };

  _proto.sync = function sync(splide) {
    this.splides.push({
      splide: splide
    });
    splide.splides.push({
      splide: this,
      isParent: true
    });

    if (this.state.is(IDLE)) {
      this._C.Sync.remount();

      splide.Components.Sync.remount();
    }

    return this;
  };

  _proto.go = function go(control) {
    this._C.Controller.go(control);

    return this;
  };

  _proto.on = function on(events, callback) {
    this.event.on(events, callback);
    return this;
  };

  _proto.off = function off(events) {
    this.event.off(events);
    return this;
  };

  _proto.emit = function emit(event) {
    var _this$event;

    (_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));

    return this;
  };

  _proto.add = function add(slides, index) {
    this._C.Slides.add(slides, index);

    return this;
  };

  _proto.remove = function remove(matcher) {
    this._C.Slides.remove(matcher);

    return this;
  };

  _proto.is = function is(type) {
    return this._o.type === type;
  };

  _proto.refresh = function refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  };

  _proto.destroy = function destroy(completely) {
    if (completely === void 0) {
      completely = true;
    }

    var event = this.event,
        state = this.state;

    if (state.is(CREATED)) {
      EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
    } else {
      forOwn(this._C, function (component) {
        component.destroy && component.destroy(completely);
      }, true);
      event.emit(EVENT_DESTROY);
      event.destroy();
      completely && empty(this.splides);
      state.set(DESTROYED);
    }

    return this;
  };

  _createClass(_Splide, [{
    key: "options",
    get: function get() {
      return this._o;
    },
    set: function set(options) {
      this._C.Media.set(options, true, true);
    }
  }, {
    key: "length",
    get: function get() {
      return this._C.Slides.getLength(true);
    }
  }, {
    key: "index",
    get: function get() {
      return this._C.Controller.getIndex();
    }
  }]);

  return _Splide;
}();

var Splide = _Splide;
Splide.defaults = {};
Splide.STATES = STATES;
var CLASS_RENDERED = "is-rendered";
var RENDERER_DEFAULT_CONFIG = {
  listTag: "ul",
  slideTag: "li"
};

var Style = /*#__PURE__*/function () {
  function Style(id, options) {
    this.styles = {};
    this.id = id;
    this.options = options;
  }

  var _proto2 = Style.prototype;

  _proto2.rule = function rule(selector, prop, value, breakpoint) {
    breakpoint = breakpoint || "default";
    var selectors = this.styles[breakpoint] = this.styles[breakpoint] || {};
    var styles = selectors[selector] = selectors[selector] || {};
    styles[prop] = value;
  };

  _proto2.build = function build() {
    var _this2 = this;

    var css = "";

    if (this.styles.default) {
      css += this.buildSelectors(this.styles.default);
    }

    Object.keys(this.styles).sort(function (n, m) {
      return _this2.options.mediaQuery === "min" ? +n - +m : +m - +n;
    }).forEach(function (breakpoint) {
      if (breakpoint !== "default") {
        css += "@media screen and (max-width: " + breakpoint + "px) {";
        css += _this2.buildSelectors(_this2.styles[breakpoint]);
        css += "}";
      }
    });
    return css;
  };

  _proto2.buildSelectors = function buildSelectors(selectors) {
    var _this3 = this;

    var css = "";
    forOwn(selectors, function (styles, selector) {
      selector = ("#" + _this3.id + " " + selector).trim();
      css += selector + " {";
      forOwn(styles, function (value, prop) {
        if (value || value === 0) {
          css += prop + ": " + value + ";";
        }
      });
      css += "}";
    });
    return css;
  };

  return Style;
}();

var SplideRenderer = /*#__PURE__*/function () {
  function SplideRenderer(contents, options, config, defaults) {
    this.slides = [];
    this.options = {};
    this.breakpoints = [];
    merge(DEFAULTS, defaults || {});
    merge(merge(this.options, DEFAULTS), options || {});
    this.contents = contents;
    this.config = assign({}, RENDERER_DEFAULT_CONFIG, config || {});
    this.id = this.config.id || uniqueId("splide");
    this.Style = new Style(this.id, this.options);
    this.Direction = Direction(null, null, this.options);
    assert(this.contents.length, "Provide at least 1 content.");
    this.init();
  }

  SplideRenderer.clean = function clean(splide) {
    var _EventInterface14 = EventInterface(splide),
        on = _EventInterface14.on;

    var root = splide.root;
    var clones = queryAll(root, "." + CLASS_CLONE);
    on(EVENT_MOUNTED, function () {
      remove(child(root, "style"));
    });
    remove(clones);
  };

  var _proto3 = SplideRenderer.prototype;

  _proto3.init = function init() {
    this.parseBreakpoints();
    this.initSlides();
    this.registerRootStyles();
    this.registerTrackStyles();
    this.registerSlideStyles();
    this.registerListStyles();
  };

  _proto3.initSlides = function initSlides() {
    var _this4 = this;

    push(this.slides, this.contents.map(function (content, index) {
      content = isString(content) ? {
        html: content
      } : content;
      content.styles = content.styles || {};
      content.attrs = content.attrs || {};

      _this4.cover(content);

      var classes = _this4.options.classes.slide + " " + (index === 0 ? CLASS_ACTIVE : "");
      assign(content.attrs, {
        class: (classes + " " + (content.attrs.class || "")).trim(),
        style: _this4.buildStyles(content.styles)
      });
      return content;
    }));

    if (this.isLoop()) {
      this.generateClones(this.slides);
    }
  };

  _proto3.registerRootStyles = function registerRootStyles() {
    var _this5 = this;

    this.breakpoints.forEach(function (_ref2) {
      var width = _ref2[0],
          options = _ref2[1];

      _this5.Style.rule(" ", "max-width", unit(options.width), width);
    });
  };

  _proto3.registerTrackStyles = function registerTrackStyles() {
    var _this6 = this;

    var Style2 = this.Style;
    var selector = "." + CLASS_TRACK;
    this.breakpoints.forEach(function (_ref3) {
      var width = _ref3[0],
          options = _ref3[1];
      Style2.rule(selector, _this6.resolve("paddingLeft"), _this6.cssPadding(options, false), width);
      Style2.rule(selector, _this6.resolve("paddingRight"), _this6.cssPadding(options, true), width);
      Style2.rule(selector, "height", _this6.cssTrackHeight(options), width);
    });
  };

  _proto3.registerListStyles = function registerListStyles() {
    var _this7 = this;

    var Style2 = this.Style;
    var selector = "." + CLASS_LIST;
    this.breakpoints.forEach(function (_ref4) {
      var width = _ref4[0],
          options = _ref4[1];
      Style2.rule(selector, "transform", _this7.buildTranslate(options), width);

      if (!_this7.cssSlideHeight(options)) {
        Style2.rule(selector, "aspect-ratio", _this7.cssAspectRatio(options), width);
      }
    });
  };

  _proto3.registerSlideStyles = function registerSlideStyles() {
    var _this8 = this;

    var Style2 = this.Style;
    var selector = "." + CLASS_SLIDE;
    this.breakpoints.forEach(function (_ref5) {
      var width = _ref5[0],
          options = _ref5[1];
      Style2.rule(selector, "width", _this8.cssSlideWidth(options), width);
      Style2.rule(selector, "height", _this8.cssSlideHeight(options) || "100%", width);
      Style2.rule(selector, _this8.resolve("marginRight"), unit(options.gap) || "0px", width);
      Style2.rule(selector + " > img", "display", options.cover ? "none" : "inline", width);
    });
  };

  _proto3.buildTranslate = function buildTranslate(options) {
    var _this$Direction = this.Direction,
        resolve = _this$Direction.resolve,
        orient = _this$Direction.orient;
    var values = [];
    values.push(this.cssOffsetClones(options));
    values.push(this.cssOffsetGaps(options));

    if (this.isCenter(options)) {
      values.push(this.buildCssValue(orient(-50), "%"));
      values.push.apply(values, this.cssOffsetCenter(options));
    }

    return values.filter(Boolean).map(function (value) {
      return "translate" + resolve("X") + "(" + value + ")";
    }).join(" ");
  };

  _proto3.cssOffsetClones = function cssOffsetClones(options) {
    var _this$Direction2 = this.Direction,
        resolve = _this$Direction2.resolve,
        orient = _this$Direction2.orient;
    var cloneCount = this.getCloneCount();

    if (this.isFixedWidth(options)) {
      var _this$parseCssValue = this.parseCssValue(options[resolve("fixedWidth")]),
          value = _this$parseCssValue.value,
          unit2 = _this$parseCssValue.unit;

      return this.buildCssValue(orient(value) * cloneCount, unit2);
    }

    var percent = 100 * cloneCount / options.perPage;
    return orient(percent) + "%";
  };

  _proto3.cssOffsetCenter = function cssOffsetCenter(options) {
    var _this$Direction3 = this.Direction,
        resolve = _this$Direction3.resolve,
        orient = _this$Direction3.orient;

    if (this.isFixedWidth(options)) {
      var _this$parseCssValue2 = this.parseCssValue(options[resolve("fixedWidth")]),
          value = _this$parseCssValue2.value,
          unit2 = _this$parseCssValue2.unit;

      return [this.buildCssValue(orient(value / 2), unit2)];
    }

    var values = [];
    var perPage = options.perPage,
        gap = options.gap;
    values.push(orient(50 / perPage) + "%");

    if (gap) {
      var _this$parseCssValue3 = this.parseCssValue(gap),
          _value = _this$parseCssValue3.value,
          _unit = _this$parseCssValue3.unit;

      var gapOffset = (_value / perPage - _value) / 2;
      values.push(this.buildCssValue(orient(gapOffset), _unit));
    }

    return values;
  };

  _proto3.cssOffsetGaps = function cssOffsetGaps(options) {
    var cloneCount = this.getCloneCount();

    if (cloneCount && options.gap) {
      var orient = this.Direction.orient;

      var _this$parseCssValue4 = this.parseCssValue(options.gap),
          value = _this$parseCssValue4.value,
          unit2 = _this$parseCssValue4.unit;

      if (this.isFixedWidth(options)) {
        return this.buildCssValue(orient(value * cloneCount), unit2);
      }

      var perPage = options.perPage;
      var gaps = cloneCount / perPage;
      return this.buildCssValue(orient(gaps * value), unit2);
    }

    return "";
  };

  _proto3.resolve = function resolve(prop) {
    return camelToKebab(this.Direction.resolve(prop));
  };

  _proto3.cssPadding = function cssPadding(options, right) {
    var padding = options.padding;
    var prop = this.Direction.resolve(right ? "right" : "left", true);
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  };

  _proto3.cssTrackHeight = function cssTrackHeight(options) {
    var height = "";

    if (this.isVertical()) {
      height = this.cssHeight(options);
      assert(height, '"height" is missing.');
      height = "calc(" + height + " - " + this.cssPadding(options, false) + " - " + this.cssPadding(options, true) + ")";
    }

    return height;
  };

  _proto3.cssHeight = function cssHeight(options) {
    return unit(options.height);
  };

  _proto3.cssSlideWidth = function cssSlideWidth(options) {
    return options.autoWidth ? "" : unit(options.fixedWidth) || (this.isVertical() ? "" : this.cssSlideSize(options));
  };

  _proto3.cssSlideHeight = function cssSlideHeight(options) {
    return unit(options.fixedHeight) || (this.isVertical() ? options.autoHeight ? "" : this.cssSlideSize(options) : this.cssHeight(options));
  };

  _proto3.cssSlideSize = function cssSlideSize(options) {
    var gap = unit(options.gap);
    return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
  };

  _proto3.cssAspectRatio = function cssAspectRatio(options) {
    var heightRatio = options.heightRatio;
    return heightRatio ? "" + 1 / heightRatio : "";
  };

  _proto3.buildCssValue = function buildCssValue(value, unit2) {
    return "" + value + unit2;
  };

  _proto3.parseCssValue = function parseCssValue(value) {
    if (isString(value)) {
      var number = parseFloat(value) || 0;
      var unit2 = value.replace(/\d*(\.\d*)?/, "") || "px";
      return {
        value: number,
        unit: unit2
      };
    }

    return {
      value: value,
      unit: "px"
    };
  };

  _proto3.parseBreakpoints = function parseBreakpoints() {
    var _this9 = this;

    var breakpoints = this.options.breakpoints;
    this.breakpoints.push(["default", this.options]);

    if (breakpoints) {
      forOwn(breakpoints, function (options, width) {
        _this9.breakpoints.push([width, merge(merge({}, _this9.options), options)]);
      });
    }
  };

  _proto3.isFixedWidth = function isFixedWidth(options) {
    return !!options[this.Direction.resolve("fixedWidth")];
  };

  _proto3.isLoop = function isLoop() {
    return this.options.type === LOOP;
  };

  _proto3.isCenter = function isCenter(options) {
    if (options.focus === "center") {
      if (this.isLoop()) {
        return true;
      }

      if (this.options.type === SLIDE) {
        return !this.options.trimSpace;
      }
    }

    return false;
  };

  _proto3.isVertical = function isVertical() {
    return this.options.direction === TTB;
  };

  _proto3.buildClasses = function buildClasses() {
    var options = this.options;
    return [CLASS_ROOT, CLASS_ROOT + "--" + options.type, CLASS_ROOT + "--" + options.direction, options.drag && CLASS_ROOT + "--draggable", options.isNavigation && CLASS_ROOT + "--nav", CLASS_ACTIVE, !this.config.hidden && CLASS_RENDERED].filter(Boolean).join(" ");
  };

  _proto3.buildAttrs = function buildAttrs(attrs) {
    var attr = "";
    forOwn(attrs, function (value, key) {
      attr += value ? " " + camelToKebab(key) + "=\"" + value + "\"" : "";
    });
    return attr.trim();
  };

  _proto3.buildStyles = function buildStyles(styles) {
    var style = "";
    forOwn(styles, function (value, key) {
      style += " " + camelToKebab(key) + ":" + value + ";";
    });
    return style.trim();
  };

  _proto3.renderSlides = function renderSlides() {
    var _this10 = this;

    var tag = this.config.slideTag;
    return this.slides.map(function (content) {
      return "<" + tag + " " + _this10.buildAttrs(content.attrs) + ">" + (content.html || "") + "</" + tag + ">";
    }).join("");
  };

  _proto3.cover = function cover(content) {
    var styles = content.styles,
        _content$html = content.html,
        html = _content$html === void 0 ? "" : _content$html;

    if (this.options.cover && !this.options.lazyLoad) {
      var src = html.match(/<img.*?src\s*=\s*(['"])(.+?)\1.*?>/);

      if (src && src[2]) {
        styles.background = "center/cover no-repeat url('" + src[2] + "')";
      }
    }
  };

  _proto3.generateClones = function generateClones(contents) {
    var classes = this.options.classes;
    var count = this.getCloneCount();
    var slides = contents.slice();

    while (slides.length < count) {
      push(slides, slides);
    }

    push(slides.slice(-count).reverse(), slides.slice(0, count)).forEach(function (content, index) {
      var attrs = assign({}, content.attrs, {
        class: content.attrs.class + " " + classes.clone
      });
      var clone = assign({}, content, {
        attrs: attrs
      });
      index < count ? contents.unshift(clone) : contents.push(clone);
    });
  };

  _proto3.getCloneCount = function getCloneCount() {
    if (this.isLoop()) {
      var options = this.options;

      if (options.clones) {
        return options.clones;
      }

      var perPage = max.apply(void 0, this.breakpoints.map(function (_ref6) {
        var options2 = _ref6[1];
        return options2.perPage;
      }));
      return perPage * ((options.flickMaxPages || 1) + 1);
    }

    return 0;
  };

  _proto3.renderArrows = function renderArrows() {
    var html = "";
    html += "<div class=\"" + this.options.classes.arrows + "\">";
    html += this.renderArrow(true);
    html += this.renderArrow(false);
    html += "</div>";
    return html;
  };

  _proto3.renderArrow = function renderArrow(prev) {
    var _this$options = this.options,
        classes = _this$options.classes,
        i18n = _this$options.i18n;
    var attrs = {
      class: classes.arrow + " " + (prev ? classes.prev : classes.next),
      type: "button",
      ariaLabel: prev ? i18n.prev : i18n.next
    };
    return "<button " + this.buildAttrs(attrs) + "><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\"><path d=\"" + (this.options.arrowPath || PATH) + "\" /></svg></button>";
  };

  _proto3.html = function html() {
    var _this$config = this.config,
        rootClass = _this$config.rootClass,
        listTag = _this$config.listTag,
        arrows = _this$config.arrows,
        beforeTrack = _this$config.beforeTrack,
        afterTrack = _this$config.afterTrack,
        slider = _this$config.slider,
        beforeSlider = _this$config.beforeSlider,
        afterSlider = _this$config.afterSlider;
    var html = "";
    html += "<div id=\"" + this.id + "\" class=\"" + this.buildClasses() + " " + (rootClass || "") + "\">";
    html += "<style>" + this.Style.build() + "</style>";

    if (slider) {
      html += beforeSlider || "";
      html += "<div class=\"splide__slider\">";
    }

    html += beforeTrack || "";

    if (arrows) {
      html += this.renderArrows();
    }

    html += "<div class=\"splide__track\">";
    html += "<" + listTag + " class=\"splide__list\">";
    html += this.renderSlides();
    html += "</" + listTag + ">";
    html += "</div>";
    html += afterTrack || "";

    if (slider) {
      html += "</div>";
      html += afterSlider || "";
    }

    html += "</div>";
    return html;
  };

  return SplideRenderer;
}();




/***/ }),

/***/ "./node_modules/barba.js/dist/barba.js":
/*!*********************************************!*\
  !*** ./node_modules/barba.js/dist/barba.js ***!
  \*********************************************/
/***/ (function(module) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_542__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_542__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_542__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_542__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_542__.p = "http://localhost:8080/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_542__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __nested_webpack_require_1848__) {

	//Promise polyfill https://github.com/taylorhakes/promise-polyfill
	
	if (typeof Promise !== 'function') {
	 window.Promise = __nested_webpack_require_1848__(1);
	}
	
	var Barba = {
	  version: '1.0.0',
	  BaseTransition: __nested_webpack_require_1848__(4),
	  BaseView: __nested_webpack_require_1848__(6),
	  BaseCache: __nested_webpack_require_1848__(8),
	  Dispatcher: __nested_webpack_require_1848__(7),
	  HistoryManager: __nested_webpack_require_1848__(9),
	  Pjax: __nested_webpack_require_1848__(10),
	  Prefetch: __nested_webpack_require_1848__(13),
	  Utils: __nested_webpack_require_1848__(5)
	};
	
	module.exports = Barba;


/***/ },
/* 1 */
/***/ function(module, exports, __nested_webpack_require_2451__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {
	
	  // Store setTimeout reference so promise-polyfill will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var setTimeoutFunc = setTimeout;
	
	  function noop() {
	  }
	
	  // Use polyfill for setImmediate for performance gains
	  var asap = (typeof setImmediate === 'function' && setImmediate) ||
	    function (fn) {
	      setTimeoutFunc(fn, 0);
	    };
	
	  var onUnhandledRejection = function onUnhandledRejection(err) {
	    if (typeof console !== 'undefined' && console) {
	      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
	    }
	  };
	
	  // Polyfill for Function.prototype.bind
	  function bind(fn, thisArg) {
	    return function () {
	      fn.apply(thisArg, arguments);
	    };
	  }
	
	  function Promise(fn) {
	    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
	    if (typeof fn !== 'function') throw new TypeError('not a function');
	    this._state = 0;
	    this._handled = false;
	    this._value = undefined;
	    this._deferreds = [];
	
	    doResolve(fn, this);
	  }
	
	  function handle(self, deferred) {
	    while (self._state === 3) {
	      self = self._value;
	    }
	    if (self._state === 0) {
	      self._deferreds.push(deferred);
	      return;
	    }
	    self._handled = true;
	    asap(function () {
	      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
	      if (cb === null) {
	        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
	        return;
	      }
	      var ret;
	      try {
	        ret = cb(self._value);
	      } catch (e) {
	        reject(deferred.promise, e);
	        return;
	      }
	      resolve(deferred.promise, ret);
	    });
	  }
	
	  function resolve(self, newValue) {
	    try {
	      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
	      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
	        var then = newValue.then;
	        if (newValue instanceof Promise) {
	          self._state = 3;
	          self._value = newValue;
	          finale(self);
	          return;
	        } else if (typeof then === 'function') {
	          doResolve(bind(then, newValue), self);
	          return;
	        }
	      }
	      self._state = 1;
	      self._value = newValue;
	      finale(self);
	    } catch (e) {
	      reject(self, e);
	    }
	  }
	
	  function reject(self, newValue) {
	    self._state = 2;
	    self._value = newValue;
	    finale(self);
	  }
	
	  function finale(self) {
	    if (self._state === 2 && self._deferreds.length === 0) {
	      asap(function() {
	        if (!self._handled) {
	          onUnhandledRejection(self._value);
	        }
	      });
	    }
	
	    for (var i = 0, len = self._deferreds.length; i < len; i++) {
	      handle(self, self._deferreds[i]);
	    }
	    self._deferreds = null;
	  }
	
	  function Handler(onFulfilled, onRejected, promise) {
	    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	    this.promise = promise;
	  }
	
	  /**
	   * Take a potentially misbehaving resolver function and make sure
	   * onFulfilled and onRejected are only called once.
	   *
	   * Makes no guarantees about asynchrony.
	   */
	  function doResolve(fn, self) {
	    var done = false;
	    try {
	      fn(function (value) {
	        if (done) return;
	        done = true;
	        resolve(self, value);
	      }, function (reason) {
	        if (done) return;
	        done = true;
	        reject(self, reason);
	      });
	    } catch (ex) {
	      if (done) return;
	      done = true;
	      reject(self, ex);
	    }
	  }
	
	  Promise.prototype['catch'] = function (onRejected) {
	    return this.then(null, onRejected);
	  };
	
	  Promise.prototype.then = function (onFulfilled, onRejected) {
	    var prom = new (this.constructor)(noop);
	
	    handle(this, new Handler(onFulfilled, onRejected, prom));
	    return prom;
	  };
	
	  Promise.all = function (arr) {
	    var args = Array.prototype.slice.call(arr);
	
	    return new Promise(function (resolve, reject) {
	      if (args.length === 0) return resolve([]);
	      var remaining = args.length;
	
	      function res(i, val) {
	        try {
	          if (val && (typeof val === 'object' || typeof val === 'function')) {
	            var then = val.then;
	            if (typeof then === 'function') {
	              then.call(val, function (val) {
	                res(i, val);
	              }, reject);
	              return;
	            }
	          }
	          args[i] = val;
	          if (--remaining === 0) {
	            resolve(args);
	          }
	        } catch (ex) {
	          reject(ex);
	        }
	      }
	
	      for (var i = 0; i < args.length; i++) {
	        res(i, args[i]);
	      }
	    });
	  };
	
	  Promise.resolve = function (value) {
	    if (value && typeof value === 'object' && value.constructor === Promise) {
	      return value;
	    }
	
	    return new Promise(function (resolve) {
	      resolve(value);
	    });
	  };
	
	  Promise.reject = function (value) {
	    return new Promise(function (resolve, reject) {
	      reject(value);
	    });
	  };
	
	  Promise.race = function (values) {
	    return new Promise(function (resolve, reject) {
	      for (var i = 0, len = values.length; i < len; i++) {
	        values[i].then(resolve, reject);
	      }
	    });
	  };
	
	  /**
	   * Set the immediate function to execute callbacks
	   * @param fn {function} Function to execute
	   * @private
	   */
	  Promise._setImmediateFn = function _setImmediateFn(fn) {
	    asap = fn;
	  };
	
	  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
	    onUnhandledRejection = fn;
	  };
	
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Promise;
	  } else if (!root.Promise) {
	    root.Promise = Promise;
	  }
	
	})(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __nested_webpack_require_2451__(2).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports, __nested_webpack_require_8857__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __nested_webpack_require_8857__(3).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __nested_webpack_require_8857__(2).setImmediate, __nested_webpack_require_8857__(2).clearImmediate))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __nested_webpack_require_14291__) {

	var Utils = __nested_webpack_require_14291__(5);
	
	/**
	 * BaseTransition to extend
	 *
	 * @namespace Barba.BaseTransition
	 * @type {Object}
	 */
	var BaseTransition = {
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {HTMLElement}
	   */
	  oldContainer: undefined,
	
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {HTMLElement}
	   */
	  newContainer: undefined,
	
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {Promise}
	   */
	  newContainerLoading: undefined,
	
	  /**
	   * Helper to extend the object
	   *
	   * @memberOf Barba.BaseTransition
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj){
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * This function is called from Pjax module to initialize
	   * the transition.
	   *
	   * @memberOf Barba.BaseTransition
	   * @private
	   * @param  {HTMLElement} oldContainer
	   * @param  {Promise} newContainer
	   * @return {Promise}
	   */
	  init: function(oldContainer, newContainer) {
	    var _this = this;
	
	    this.oldContainer = oldContainer;
	    this._newContainerPromise = newContainer;
	
	    this.deferred = Utils.deferred();
	    this.newContainerReady = Utils.deferred();
	    this.newContainerLoading = this.newContainerReady.promise;
	
	    this.start();
	
	    this._newContainerPromise.then(function(newContainer) {
	      _this.newContainer = newContainer;
	      _this.newContainerReady.resolve();
	    });
	
	    return this.deferred.promise;
	  },
	
	  /**
	   * This function needs to be called as soon the Transition is finished
	   *
	   * @memberOf Barba.BaseTransition
	   */
	  done: function() {
	    this.oldContainer.parentNode.removeChild(this.oldContainer);
	    this.newContainer.style.visibility = 'visible';
	    this.deferred.resolve();
	  },
	
	  /**
	   * Constructor for your Transition
	   *
	   * @memberOf Barba.BaseTransition
	   * @abstract
	   */
	  start: function() {},
	};
	
	module.exports = BaseTransition;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Just an object with some helpful functions
	 *
	 * @type {Object}
	 * @namespace Barba.Utils
	 */
	var Utils = {
	  /**
	   * Return the current url
	   *
	   * @memberOf Barba.Utils
	   * @return {String} currentUrl
	   */
	  getCurrentUrl: function() {
	    return window.location.protocol + '//' +
	           window.location.host +
	           window.location.pathname +
	           window.location.search;
	  },
	
	  /**
	   * Given an url, return it without the hash
	   *
	   * @memberOf Barba.Utils
	   * @private
	   * @param  {String} url
	   * @return {String} newCleanUrl
	   */
	  cleanLink: function(url) {
	    return url.replace(/#.*/, '');
	  },
	
	  /**
	   * Time in millisecond after the xhr request goes in timeout
	   *
	   * @memberOf Barba.Utils
	   * @type {Number}
	   * @default
	   */
	  xhrTimeout: 5000,
	
	  /**
	   * Start an XMLHttpRequest() and return a Promise
	   *
	   * @memberOf Barba.Utils
	   * @param  {String} url
	   * @return {Promise}
	   */
	  xhr: function(url) {
	    var deferred = this.deferred();
	    var req = new XMLHttpRequest();
	
	    req.onreadystatechange = function() {
	      if (req.readyState === 4) {
	        if (req.status === 200) {
	          return deferred.resolve(req.responseText);
	        } else {
	          return deferred.reject(new Error('xhr: HTTP code is not 200'));
	        }
	      }
	    };
	
	    req.ontimeout = function() {
	      return deferred.reject(new Error('xhr: Timeout exceeded'));
	    };
	
	    req.open('GET', url);
	    req.timeout = this.xhrTimeout;
	    req.setRequestHeader('x-barba', 'yes');
	    req.send();
	
	    return deferred.promise;
	  },
	
	  /**
	   * Get obj and props and return a new object with the property merged
	   *
	   * @memberOf Barba.Utils
	   * @param  {object} obj
	   * @param  {object} props
	   * @return {object}
	   */
	  extend: function(obj, props) {
	    var newObj = Object.create(obj);
	
	    for(var prop in props) {
	      if(props.hasOwnProperty(prop)) {
	        newObj[prop] = props[prop];
	      }
	    }
	
	    return newObj;
	  },
	
	  /**
	   * Return a new "Deferred" object
	   * https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
	   *
	   * @memberOf Barba.Utils
	   * @return {Deferred}
	   */
	  deferred: function() {
	    return new function() {
	      this.resolve = null;
	      this.reject = null;
	
	      this.promise = new Promise(function(resolve, reject) {
	        this.resolve = resolve;
	        this.reject = reject;
	      }.bind(this));
	    };
	  },
	
	  /**
	   * Return the port number normalized, eventually you can pass a string to be normalized.
	   *
	   * @memberOf Barba.Utils
	   * @private
	   * @param  {String} p
	   * @return {Int} port
	   */
	  getPort: function(p) {
	    var port = typeof p !== 'undefined' ? p : window.location.port;
	    var protocol = window.location.protocol;
	
	    if (port != '')
	      return parseInt(port);
	
	    if (protocol === 'http:')
	      return 80;
	
	    if (protocol === 'https:')
	      return 443;
	  }
	};
	
	module.exports = Utils;


/***/ },
/* 6 */
/***/ function(module, exports, __nested_webpack_require_19532__) {

	var Dispatcher = __nested_webpack_require_19532__(7);
	var Utils = __nested_webpack_require_19532__(5);
	
	/**
	 * BaseView to be extended
	 *
	 * @namespace Barba.BaseView
	 * @type {Object}
	 */
	var BaseView  = {
	  /**
	   * Namespace of the view.
	   * (need to be associated with the data-namespace of the container)
	   *
	   * @memberOf Barba.BaseView
	   * @type {String}
	   */
	  namespace: null,
	
	  /**
	   * Helper to extend the object
	   *
	   * @memberOf Barba.BaseView
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj){
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * Init the view.
	   * P.S. Is suggested to init the view before starting Barba.Pjax.start(),
	   * in this way .onEnter() and .onEnterCompleted() will be fired for the current
	   * container when the page is loaded.
	   *
	   * @memberOf Barba.BaseView
	   */
	  init: function() {
	    var _this = this;
	
	    Dispatcher.on('initStateChange',
	      function(newStatus, oldStatus) {
	        if (oldStatus && oldStatus.namespace === _this.namespace)
	          _this.onLeave();
	      }
	    );
	
	    Dispatcher.on('newPageReady',
	      function(newStatus, oldStatus, container) {
	        _this.container = container;
	
	        if (newStatus.namespace === _this.namespace)
	          _this.onEnter();
	      }
	    );
	
	    Dispatcher.on('transitionCompleted',
	      function(newStatus, oldStatus) {
	        if (newStatus.namespace === _this.namespace)
	          _this.onEnterCompleted();
	
	        if (oldStatus && oldStatus.namespace === _this.namespace)
	          _this.onLeaveCompleted();
	      }
	    );
	  },
	
	 /**
	  * This function will be fired when the container
	  * is ready and attached to the DOM.
	  *
	  * @memberOf Barba.BaseView
	  * @abstract
	  */
	  onEnter: function() {},
	
	  /**
	   * This function will be fired when the transition
	   * to this container has just finished.
	   *
	   * @memberOf Barba.BaseView
	   * @abstract
	   */
	  onEnterCompleted: function() {},
	
	  /**
	   * This function will be fired when the transition
	   * to a new container has just started.
	   *
	   * @memberOf Barba.BaseView
	   * @abstract
	   */
	  onLeave: function() {},
	
	  /**
	   * This function will be fired when the container
	   * has just been removed from the DOM.
	   *
	   * @memberOf Barba.BaseView
	   * @abstract
	   */
	  onLeaveCompleted: function() {}
	}
	
	module.exports = BaseView;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Little Dispatcher inspired by MicroEvent.js
	 *
	 * @namespace Barba.Dispatcher
	 * @type {Object}
	 */
	var Dispatcher = {
	  /**
	   * Object that keeps all the events
	   *
	   * @memberOf Barba.Dispatcher
	   * @readOnly
	   * @type {Object}
	   */
	  events: {},
	
	  /**
	   * Bind a callback to an event
	   *
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {Function} function
	   */
	  on: function(e, f) {
	    this.events[e] = this.events[e] || [];
	    this.events[e].push(f);
	  },
	
	  /**
	   * Unbind event
	   *
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {Function} function
	   */
	  off: function(e, f) {
	    if(e in this.events === false)
	      return;
	
	    this.events[e].splice(this.events[e].indexOf(f), 1);
	  },
	
	  /**
	   * Fire the event running all the event associated to it
	   *
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {...*} args
	   */
	  trigger: function(e) {//e, ...args
	    if (e in this.events === false)
	      return;
	
	    for(var i = 0; i < this.events[e].length; i++){
	      this.events[e][i].apply(this, Array.prototype.slice.call(arguments, 1));
	    }
	  }
	};
	
	module.exports = Dispatcher;


/***/ },
/* 8 */
/***/ function(module, exports, __nested_webpack_require_23391__) {

	var Utils = __nested_webpack_require_23391__(5);
	
	/**
	 * BaseCache it's a simple static cache
	 *
	 * @namespace Barba.BaseCache
	 * @type {Object}
	 */
	var BaseCache = {
	  /**
	   * The Object that keeps all the key value information
	   *
	   * @memberOf Barba.BaseCache
	   * @type {Object}
	   */
	  data: {},
	
	  /**
	   * Helper to extend this object
	   *
	   * @memberOf Barba.BaseCache
	   * @private
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj) {
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * Set a key and value data, mainly Barba is going to save promises
	   *
	   * @memberOf Barba.BaseCache
	   * @param {String} key
	   * @param {*} value
	   */
	  set: function(key, val) {
	    this.data[key] = val;
	  },
	
	  /**
	   * Retrieve the data using the key
	   *
	   * @memberOf Barba.BaseCache
	   * @param  {String} key
	   * @return {*}
	   */
	  get: function(key) {
	    return this.data[key];
	  },
	
	  /**
	   * Flush the cache
	   *
	   * @memberOf Barba.BaseCache
	   */
	  reset: function() {
	    this.data = {};
	  }
	};
	
	module.exports = BaseCache;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * HistoryManager helps to keep track of the navigation
	 *
	 * @namespace Barba.HistoryManager
	 * @type {Object}
	 */
	var HistoryManager = {
	  /**
	   * Keep track of the status in historic order
	   *
	   * @memberOf Barba.HistoryManager
	   * @readOnly
	   * @type {Array}
	   */
	  history: [],
	
	  /**
	   * Add a new set of url and namespace
	   *
	   * @memberOf Barba.HistoryManager
	   * @param {String} url
	   * @param {String} namespace
	   * @private
	   */
	  add: function(url, namespace) {
	    if (!namespace)
	      namespace = undefined;
	
	    this.history.push({
	      url: url,
	      namespace: namespace
	    });
	  },
	
	  /**
	   * Return information about the current status
	   *
	   * @memberOf Barba.HistoryManager
	   * @return {Object}
	   */
	  currentStatus: function() {
	    return this.history[this.history.length - 1];
	  },
	
	  /**
	   * Return information about the previous status
	   *
	   * @memberOf Barba.HistoryManager
	   * @return {Object}
	   */
	  prevStatus: function() {
	    var history = this.history;
	
	    if (history.length < 2)
	      return null;
	
	    return history[history.length - 2];
	  }
	};
	
	module.exports = HistoryManager;


/***/ },
/* 10 */
/***/ function(module, exports, __nested_webpack_require_25873__) {

	var Utils = __nested_webpack_require_25873__(5);
	var Dispatcher = __nested_webpack_require_25873__(7);
	var HideShowTransition = __nested_webpack_require_25873__(11);
	var BaseCache = __nested_webpack_require_25873__(8);
	
	var HistoryManager = __nested_webpack_require_25873__(9);
	var Dom = __nested_webpack_require_25873__(12);
	
	/**
	 * Pjax is a static object with main function
	 *
	 * @namespace Barba.Pjax
	 * @borrows Dom as Dom
	 * @type {Object}
	 */
	var Pjax = {
	  Dom: Dom,
	  History: HistoryManager,
	  Cache: BaseCache,
	
	  /**
	   * Indicate wether or not use the cache
	   *
	   * @memberOf Barba.Pjax
	   * @type {Boolean}
	   * @default
	   */
	  cacheEnabled: true,
	
	  /**
	   * Indicate if there is an animation in progress
	   *
	   * @memberOf Barba.Pjax
	   * @readOnly
	   * @type {Boolean}
	   */
	  transitionProgress: false,
	
	  /**
	   * Class name used to ignore links
	   *
	   * @memberOf Barba.Pjax
	   * @type {String}
	   * @default
	   */
	  ignoreClassLink: 'no-barba',
	
	  /**
	   * Function to be called to start Pjax
	   *
	   * @memberOf Barba.Pjax
	   */
	  start: function() {
	    this.init();
	  },
	
	  /**
	   * Init the events
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  init: function() {
	    var container = this.Dom.getContainer();
	    var wrapper = this.Dom.getWrapper();
	
	    wrapper.setAttribute('aria-live', 'polite');
	
	    this.History.add(
	      this.getCurrentUrl(),
	      this.Dom.getNamespace(container)
	    );
	
	    //Fire for the current view.
	    Dispatcher.trigger('initStateChange', this.History.currentStatus());
	    Dispatcher.trigger('newPageReady',
	      this.History.currentStatus(),
	      {},
	      container,
	      this.Dom.currentHTML
	    );
	    Dispatcher.trigger('transitionCompleted', this.History.currentStatus());
	
	    this.bindEvents();
	  },
	
	  /**
	   * Attach the eventlisteners
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  bindEvents: function() {
	    document.addEventListener('click',
	      this.onLinkClick.bind(this)
	    );
	
	    window.addEventListener('popstate',
	      this.onStateChange.bind(this)
	    );
	  },
	
	  /**
	   * Return the currentURL cleaned
	   *
	   * @memberOf Barba.Pjax
	   * @return {String} currentUrl
	   */
	  getCurrentUrl: function() {
	    return Utils.cleanLink(
	      Utils.getCurrentUrl()
	    );
	  },
	
	  /**
	   * Change the URL with pushstate and trigger the state change
	   *
	   * @memberOf Barba.Pjax
	   * @param {String} newUrl
	   */
	  goTo: function(url) {
	    window.history.pushState(null, null, url);
	    this.onStateChange();
	  },
	
	  /**
	   * Force the browser to go to a certain url
	   *
	   * @memberOf Barba.Pjax
	   * @param {String} url
	   * @private
	   */
	  forceGoTo: function(url) {
	    window.location = url;
	  },
	
	  /**
	   * Load an url, will start an xhr request or load from the cache
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   * @param  {String} url
	   * @return {Promise}
	   */
	  load: function(url) {
	    var deferred = Utils.deferred();
	    var _this = this;
	    var xhr;
	
	    xhr = this.Cache.get(url);
	
	    if (!xhr) {
	      xhr = Utils.xhr(url);
	      this.Cache.set(url, xhr);
	    }
	
	    xhr.then(
	      function(data) {
	        var container = _this.Dom.parseResponse(data);
	
	        _this.Dom.putContainer(container);
	
	        if (!_this.cacheEnabled)
	          _this.Cache.reset();
	
	        deferred.resolve(container);
	      },
	      function() {
	        //Something went wrong (timeout, 404, 505...)
	        _this.forceGoTo(url);
	
	        deferred.reject();
	      }
	    );
	
	    return deferred.promise;
	  },
	
	  /**
	   * Get the .href parameter out of an element
	   * and handle special cases (like xlink:href)
	   *
	   * @private
	   * @memberOf Barba.Pjax
	   * @param  {HTMLElement} el
	   * @return {String} href
	   */
	  getHref: function(el) {
	    if (!el) {
	      return undefined;
	    }
	
	    if (el.getAttribute && typeof el.getAttribute('xlink:href') === 'string') {
	      return el.getAttribute('xlink:href');
	    }
	
	    if (typeof el.href === 'string') {
	      return el.href;
	    }
	
	    return undefined;
	  },
	
	  /**
	   * Callback called from click event
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   * @param {MouseEvent} evt
	   */
	  onLinkClick: function(evt) {
	    var el = evt.target;
	
	    //Go up in the nodelist until we
	    //find something with an href
	    while (el && !this.getHref(el)) {
	      el = el.parentNode;
	    }
	
	    if (this.preventCheck(evt, el)) {
	      evt.stopPropagation();
	      evt.preventDefault();
	
	      Dispatcher.trigger('linkClicked', el, evt);
	
	      var href = this.getHref(el);
	      this.goTo(href);
	    }
	  },
	
	  /**
	   * Determine if the link should be followed
	   *
	   * @memberOf Barba.Pjax
	   * @param  {MouseEvent} evt
	   * @param  {HTMLElement} element
	   * @return {Boolean}
	   */
	  preventCheck: function(evt, element) {
	    if (!window.history.pushState)
	      return false;
	
	    var href = this.getHref(element);
	
	    //User
	    if (!element || !href)
	      return false;
	
	    //Middle click, cmd click, and ctrl click
	    if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey)
	      return false;
	
	    //Ignore target with _blank target
	    if (element.target && element.target === '_blank')
	      return false;
	
	    //Check if it's the same domain
	    if (window.location.protocol !== element.protocol || window.location.hostname !== element.hostname)
	      return false;
	
	    //Check if the port is the same
	    if (Utils.getPort() !== Utils.getPort(element.port))
	      return false;
	
	    //Ignore case when a hash is being tacked on the current URL
	    if (href.indexOf('#') > -1)
	      return false;
	
	    //Ignore case where there is download attribute
	    if (element.getAttribute && typeof element.getAttribute('download') === 'string')
	      return false;
	
	    //In case you're trying to load the same page
	    if (Utils.cleanLink(href) == Utils.cleanLink(location.href))
	      return false;
	
	    if (element.classList.contains(this.ignoreClassLink))
	      return false;
	
	    return true;
	  },
	
	  /**
	   * Return a transition object
	   *
	   * @memberOf Barba.Pjax
	   * @return {Barba.Transition} Transition object
	   */
	  getTransition: function() {
	    //User customizable
	    return HideShowTransition;
	  },
	
	  /**
	   * Method called after a 'popstate' or from .goTo()
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  onStateChange: function() {
	    var newUrl = this.getCurrentUrl();
	
	    if (this.transitionProgress)
	      this.forceGoTo(newUrl);
	
	    if (this.History.currentStatus().url === newUrl)
	      return false;
	
	    this.History.add(newUrl);
	
	    var newContainer = this.load(newUrl);
	    var transition = Object.create(this.getTransition());
	
	    this.transitionProgress = true;
	
	    Dispatcher.trigger('initStateChange',
	      this.History.currentStatus(),
	      this.History.prevStatus()
	    );
	
	    var transitionInstance = transition.init(
	      this.Dom.getContainer(),
	      newContainer
	    );
	
	    newContainer.then(
	      this.onNewContainerLoaded.bind(this)
	    );
	
	    transitionInstance.then(
	      this.onTransitionEnd.bind(this)
	    );
	  },
	
	  /**
	   * Function called as soon the new container is ready
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   * @param {HTMLElement} container
	   */
	  onNewContainerLoaded: function(container) {
	    var currentStatus = this.History.currentStatus();
	    currentStatus.namespace = this.Dom.getNamespace(container);
	
	    Dispatcher.trigger('newPageReady',
	      this.History.currentStatus(),
	      this.History.prevStatus(),
	      container,
	      this.Dom.currentHTML
	    );
	  },
	
	  /**
	   * Function called as soon the transition is finished
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  onTransitionEnd: function() {
	    this.transitionProgress = false;
	
	    Dispatcher.trigger('transitionCompleted',
	      this.History.currentStatus(),
	      this.History.prevStatus()
	    );
	  }
	};
	
	module.exports = Pjax;


/***/ },
/* 11 */
/***/ function(module, exports, __nested_webpack_require_34131__) {

	var BaseTransition = __nested_webpack_require_34131__(4);
	
	/**
	 * Basic Transition object, wait for the new Container to be ready,
	 * scroll top, and finish the transition (removing the old container and displaying the new one)
	 *
	 * @private
	 * @namespace Barba.HideShowTransition
	 * @augments Barba.BaseTransition
	 */
	var HideShowTransition = BaseTransition.extend({
	  start: function() {
	    this.newContainerLoading.then(this.finish.bind(this));
	  },
	
	  finish: function() {
	    document.body.scrollTop = 0;
	    this.done();
	  }
	});
	
	module.exports = HideShowTransition;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Object that is going to deal with DOM parsing/manipulation
	 *
	 * @namespace Barba.Pjax.Dom
	 * @type {Object}
	 */
	var Dom = {
	  /**
	   * The name of the data attribute on the container
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   * @default
	   */
	  dataNamespace: 'namespace',
	
	  /**
	   * Id of the main wrapper
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   * @default
	   */
	  wrapperId: 'barba-wrapper',
	
	  /**
	   * Class name used to identify the containers
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   * @default
	   */
	  containerClass: 'barba-container',
	
	  /**
	   * Full HTML String of the current page.
	   * By default is the innerHTML of the initial loaded page.
	   *
	   * Each time a new page is loaded, the value is the response of the xhr call.
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   */
	  currentHTML: document.documentElement.innerHTML,
	
	  /**
	   * Parse the responseText obtained from the xhr call
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {String} responseText
	   * @return {HTMLElement}
	   */
	  parseResponse: function(responseText) {
	    this.currentHTML = responseText;
	
	    var wrapper = document.createElement('div');
	    wrapper.innerHTML = responseText;
	
	    var titleEl = wrapper.querySelector('title');
	
	    if (titleEl)
	      document.title = titleEl.textContent;
	
	    return this.getContainer(wrapper);
	  },
	
	  /**
	   * Get the main barba wrapper by the ID `wrapperId`
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @return {HTMLElement} element
	   */
	  getWrapper: function() {
	    var wrapper = document.getElementById(this.wrapperId);
	
	    if (!wrapper)
	      throw new Error('Barba.js: wrapper not found!');
	
	    return wrapper;
	  },
	
	  /**
	   * Get the container on the current DOM,
	   * or from an HTMLElement passed via argument
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   * @return {HTMLElement}
	   */
	  getContainer: function(element) {
	    if (!element)
	      element = document.body;
	
	    if (!element)
	      throw new Error('Barba.js: DOM not ready!');
	
	    var container = this.parseContainer(element);
	
	    if (container && container.jquery)
	      container = container[0];
	
	    if (!container)
	      throw new Error('Barba.js: no container found');
	
	    return container;
	  },
	
	  /**
	   * Get the namespace of the container
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   * @return {String}
	   */
	  getNamespace: function(element) {
	    if (element && element.dataset) {
	      return element.dataset[this.dataNamespace];
	    } else if (element) {
	      return element.getAttribute('data-' + this.dataNamespace);
	    }
	
	    return null;
	  },
	
	  /**
	   * Put the container on the page
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   */
	  putContainer: function(element) {
	    element.style.visibility = 'hidden';
	
	    var wrapper = this.getWrapper();
	    wrapper.appendChild(element);
	  },
	
	  /**
	   * Get container selector
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   * @return {HTMLElement} element
	   */
	  parseContainer: function(element) {
	    return element.querySelector('.' + this.containerClass);
	  }
	};
	
	module.exports = Dom;


/***/ },
/* 13 */
/***/ function(module, exports, __nested_webpack_require_38314__) {

	var Utils = __nested_webpack_require_38314__(5);
	var Pjax = __nested_webpack_require_38314__(10);
	
	/**
	 * Prefetch
	 *
	 * @namespace Barba.Prefetch
	 * @type {Object}
	 */
	var Prefetch = {
	  /**
	   * Class name used to ignore prefetch on links
	   *
	   * @memberOf Barba.Prefetch
	   * @type {String}
	   * @default
	   */
	  ignoreClassLink: 'no-barba-prefetch',
	
	  /**
	   * Init the event listener on mouseover and touchstart
	   * for the prefetch
	   *
	   * @memberOf Barba.Prefetch
	   */
	  init: function() {
	    if (!window.history.pushState) {
	      return false;
	    }
	
	    document.body.addEventListener('mouseover', this.onLinkEnter.bind(this));
	    document.body.addEventListener('touchstart', this.onLinkEnter.bind(this));
	  },
	
	  /**
	   * Callback for the mousehover/touchstart
	   *
	   * @memberOf Barba.Prefetch
	   * @private
	   * @param  {Object} evt
	   */
	  onLinkEnter: function(evt) {
	    var el = evt.target;
	
	    while (el && !Pjax.getHref(el)) {
	      el = el.parentNode;
	    }
	
	    if (!el || el.classList.contains(this.ignoreClassLink)) {
	      return;
	    }
	
	    var url = Pjax.getHref(el);
	
	    //Check if the link is elegible for Pjax
	    if (Pjax.preventCheck(evt, el) && !Pjax.Cache.get(url)) {
	      var xhr = Utils.xhr(url);
	      Pjax.Cache.set(url, xhr);
	    }
	  }
	};
	
	module.exports = Prefetch;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=barba.js.map

/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/index.js":
/*!**************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types_options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/options */ "./node_modules/flatpickr/dist/esm/types/options.js");
/* harmony import */ var _l10n_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./l10n/default */ "./node_modules/flatpickr/dist/esm/l10n/default.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/flatpickr/dist/esm/utils/index.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/dom */ "./node_modules/flatpickr/dist/esm/utils/dom.js");
/* harmony import */ var _utils_dates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/dates */ "./node_modules/flatpickr/dist/esm/utils/dates.js");
/* harmony import */ var _utils_formatting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/formatting */ "./node_modules/flatpickr/dist/esm/utils/formatting.js");
/* harmony import */ var _utils_polyfills__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/polyfills */ "./node_modules/flatpickr/dist/esm/utils/polyfills.js");
/* harmony import */ var _utils_polyfills__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_utils_polyfills__WEBPACK_IMPORTED_MODULE_6__);
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};







var DEBOUNCED_CHANGE_MS = 300;
function FlatpickrInstance(element, instanceConfig) {
    var self = {
        config: __assign(__assign({}, _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults), flatpickr.defaultConfig),
        l10n: _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"],
    };
    self.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({ config: self.config, l10n: self.l10n });
    self._handlers = [];
    self.pluginElements = [];
    self.loadedPlugins = [];
    self._bind = bind;
    self._setHoursFromDate = setHoursFromDate;
    self._positionCalendar = positionCalendar;
    self.changeMonth = changeMonth;
    self.changeYear = changeYear;
    self.clear = clear;
    self.close = close;
    self.onMouseOver = onMouseOver;
    self._createElement = _utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement;
    self.createDay = createDay;
    self.destroy = destroy;
    self.isEnabled = isEnabled;
    self.jumpToDate = jumpToDate;
    self.updateValue = updateValue;
    self.open = open;
    self.redraw = redraw;
    self.set = set;
    self.setDate = setDate;
    self.toggle = toggle;
    function setupHelperFunctions() {
        self.utils = {
            getDaysInMonth: function (month, yr) {
                if (month === void 0) { month = self.currentMonth; }
                if (yr === void 0) { yr = self.currentYear; }
                if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
                    return 29;
                return self.l10n.daysInMonth[month];
            },
        };
    }
    function init() {
        self.element = self.input = element;
        self.isOpen = false;
        parseConfig();
        setupLocale();
        setupInputs();
        setupDates();
        setupHelperFunctions();
        if (!self.isMobile)
            build();
        bindEvents();
        if (self.selectedDates.length || self.config.noCalendar) {
            if (self.config.enableTime) {
                setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj : undefined);
            }
            updateValue(false);
        }
        setCalendarWidth();
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!self.isMobile && isSafari) {
            positionCalendar();
        }
        triggerEvent("onReady");
    }
    function getClosestActiveElement() {
        var _a;
        return (((_a = self.calendarContainer) === null || _a === void 0 ? void 0 : _a.getRootNode())
            .activeElement || document.activeElement);
    }
    function bindToInstance(fn) {
        return fn.bind(self);
    }
    function setCalendarWidth() {
        var config = self.config;
        if (config.weekNumbers === false && config.showMonths === 1) {
            return;
        }
        else if (config.noCalendar !== true) {
            window.requestAnimationFrame(function () {
                if (self.calendarContainer !== undefined) {
                    self.calendarContainer.style.visibility = "hidden";
                    self.calendarContainer.style.display = "block";
                }
                if (self.daysContainer !== undefined) {
                    var daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                    self.daysContainer.style.width = daysWidth + "px";
                    self.calendarContainer.style.width =
                        daysWidth +
                            (self.weekWrapper !== undefined
                                ? self.weekWrapper.offsetWidth
                                : 0) +
                            "px";
                    self.calendarContainer.style.removeProperty("visibility");
                    self.calendarContainer.style.removeProperty("display");
                }
            });
        }
    }
    function updateTime(e) {
        if (self.selectedDates.length === 0) {
            var defaultDate = self.config.minDate === undefined ||
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(new Date(), self.config.minDate) >= 0
                ? new Date()
                : new Date(self.config.minDate.getTime());
            var defaults = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config);
            defaultDate.setHours(defaults.hours, defaults.minutes, defaults.seconds, defaultDate.getMilliseconds());
            self.selectedDates = [defaultDate];
            self.latestSelectedDateObj = defaultDate;
        }
        if (e !== undefined && e.type !== "blur") {
            timeWrapper(e);
        }
        var prevValue = self._input.value;
        setHoursFromInputs();
        updateValue();
        if (self._input.value !== prevValue) {
            self._debouncedChange();
        }
    }
    function ampm2military(hour, amPM) {
        return (hour % 12) + 12 * (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(amPM === self.l10n.amPM[1]);
    }
    function military2ampm(hour) {
        switch (hour % 24) {
            case 0:
            case 12:
                return 12;
            default:
                return hour % 12;
        }
    }
    function setHoursFromInputs() {
        if (self.hourElement === undefined || self.minuteElement === undefined)
            return;
        var hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== undefined
            ? (parseInt(self.secondElement.value, 10) || 0) % 60
            : 0;
        if (self.amPM !== undefined) {
            hours = ampm2military(hours, self.amPM.textContent);
        }
        var limitMinHours = self.config.minTime !== undefined ||
            (self.config.minDate &&
                self.minDateHasTime &&
                self.latestSelectedDateObj &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(self.latestSelectedDateObj, self.config.minDate, true) ===
                    0);
        var limitMaxHours = self.config.maxTime !== undefined ||
            (self.config.maxDate &&
                self.maxDateHasTime &&
                self.latestSelectedDateObj &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(self.latestSelectedDateObj, self.config.maxDate, true) ===
                    0);
        if (self.config.maxTime !== undefined &&
            self.config.minTime !== undefined &&
            self.config.minTime > self.config.maxTime) {
            var minBound = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(self.config.minTime.getHours(), self.config.minTime.getMinutes(), self.config.minTime.getSeconds());
            var maxBound = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(self.config.maxTime.getHours(), self.config.maxTime.getMinutes(), self.config.maxTime.getSeconds());
            var currentTime = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(hours, minutes, seconds);
            if (currentTime > maxBound && currentTime < minBound) {
                var result = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.parseSeconds)(minBound);
                hours = result[0];
                minutes = result[1];
                seconds = result[2];
            }
        }
        else {
            if (limitMaxHours) {
                var maxTime = self.config.maxTime !== undefined
                    ? self.config.maxTime
                    : self.config.maxDate;
                hours = Math.min(hours, maxTime.getHours());
                if (hours === maxTime.getHours())
                    minutes = Math.min(minutes, maxTime.getMinutes());
                if (minutes === maxTime.getMinutes())
                    seconds = Math.min(seconds, maxTime.getSeconds());
            }
            if (limitMinHours) {
                var minTime = self.config.minTime !== undefined
                    ? self.config.minTime
                    : self.config.minDate;
                hours = Math.max(hours, minTime.getHours());
                if (hours === minTime.getHours() && minutes < minTime.getMinutes())
                    minutes = minTime.getMinutes();
                if (minutes === minTime.getMinutes())
                    seconds = Math.max(seconds, minTime.getSeconds());
            }
        }
        setHours(hours, minutes, seconds);
    }
    function setHoursFromDate(dateObj) {
        var date = dateObj || self.latestSelectedDateObj;
        if (date && date instanceof Date) {
            setHours(date.getHours(), date.getMinutes(), date.getSeconds());
        }
    }
    function setHours(hours, minutes, seconds) {
        if (self.latestSelectedDateObj !== undefined) {
            self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
        }
        if (!self.hourElement || !self.minuteElement || self.isMobile)
            return;
        self.hourElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(!self.config.time_24hr
            ? ((12 + hours) % 12) + 12 * (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(hours % 12 === 0)
            : hours);
        self.minuteElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(minutes);
        if (self.amPM !== undefined)
            self.amPM.textContent = self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(hours >= 12)];
        if (self.secondElement !== undefined)
            self.secondElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(seconds);
    }
    function onYearInput(event) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(event);
        var year = parseInt(eventTarget.value) + (event.delta || 0);
        if (year / 1000 > 1 ||
            (event.key === "Enter" && !/[^\d]/.test(year.toString()))) {
            changeYear(year);
        }
    }
    function bind(element, event, handler, options) {
        if (event instanceof Array)
            return event.forEach(function (ev) { return bind(element, ev, handler, options); });
        if (element instanceof Array)
            return element.forEach(function (el) { return bind(el, event, handler, options); });
        element.addEventListener(event, handler, options);
        self._handlers.push({
            remove: function () { return element.removeEventListener(event, handler, options); },
        });
    }
    function triggerChange() {
        triggerEvent("onChange");
    }
    function bindEvents() {
        if (self.config.wrap) {
            ["open", "close", "toggle", "clear"].forEach(function (evt) {
                Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
                    return bind(el, "click", self[evt]);
                });
            });
        }
        if (self.isMobile) {
            setupMobile();
            return;
        }
        var debouncedResize = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)(onResize, 50);
        self._debouncedChange = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)(triggerChange, DEBOUNCED_CHANGE_MS);
        if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
            bind(self.daysContainer, "mouseover", function (e) {
                if (self.config.mode === "range")
                    onMouseOver((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e));
            });
        bind(self._input, "keydown", onKeyDown);
        if (self.calendarContainer !== undefined) {
            bind(self.calendarContainer, "keydown", onKeyDown);
        }
        if (!self.config.inline && !self.config.static)
            bind(window, "resize", debouncedResize);
        if (window.ontouchstart !== undefined)
            bind(window.document, "touchstart", documentClick);
        else
            bind(window.document, "mousedown", documentClick);
        bind(window.document, "focus", documentClick, { capture: true });
        if (self.config.clickOpens === true) {
            bind(self._input, "focus", self.open);
            bind(self._input, "click", self.open);
        }
        if (self.daysContainer !== undefined) {
            bind(self.monthNav, "click", onMonthNavClick);
            bind(self.monthNav, ["keyup", "increment"], onYearInput);
            bind(self.daysContainer, "click", selectDate);
        }
        if (self.timeContainer !== undefined &&
            self.minuteElement !== undefined &&
            self.hourElement !== undefined) {
            var selText = function (e) {
                return (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e).select();
            };
            bind(self.timeContainer, ["increment"], updateTime);
            bind(self.timeContainer, "blur", updateTime, { capture: true });
            bind(self.timeContainer, "click", timeIncrement);
            bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
            if (self.secondElement !== undefined)
                bind(self.secondElement, "focus", function () { return self.secondElement && self.secondElement.select(); });
            if (self.amPM !== undefined) {
                bind(self.amPM, "click", function (e) {
                    updateTime(e);
                });
            }
        }
        if (self.config.allowInput) {
            bind(self._input, "blur", onBlur);
        }
    }
    function jumpToDate(jumpDate, triggerChange) {
        var jumpTo = jumpDate !== undefined
            ? self.parseDate(jumpDate)
            : self.latestSelectedDateObj ||
                (self.config.minDate && self.config.minDate > self.now
                    ? self.config.minDate
                    : self.config.maxDate && self.config.maxDate < self.now
                        ? self.config.maxDate
                        : self.now);
        var oldYear = self.currentYear;
        var oldMonth = self.currentMonth;
        try {
            if (jumpTo !== undefined) {
                self.currentYear = jumpTo.getFullYear();
                self.currentMonth = jumpTo.getMonth();
            }
        }
        catch (e) {
            e.message = "Invalid date supplied: " + jumpTo;
            self.config.errorHandler(e);
        }
        if (triggerChange && self.currentYear !== oldYear) {
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
        if (triggerChange &&
            (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
            triggerEvent("onMonthChange");
        }
        self.redraw();
    }
    function timeIncrement(e) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        if (~eventTarget.className.indexOf("arrow"))
            incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
    }
    function incrementNumInput(e, delta, inputElem) {
        var target = e && (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        var input = inputElem ||
            (target && target.parentNode && target.parentNode.firstChild);
        var event = createEvent("increment");
        event.delta = delta;
        input && input.dispatchEvent(event);
    }
    function build() {
        var fragment = window.document.createDocumentFragment();
        self.calendarContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-calendar");
        self.calendarContainer.tabIndex = -1;
        if (!self.config.noCalendar) {
            fragment.appendChild(buildMonthNav());
            self.innerContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-innerContainer");
            if (self.config.weekNumbers) {
                var _a = buildWeeks(), weekWrapper = _a.weekWrapper, weekNumbers = _a.weekNumbers;
                self.innerContainer.appendChild(weekWrapper);
                self.weekNumbers = weekNumbers;
                self.weekWrapper = weekWrapper;
            }
            self.rContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-rContainer");
            self.rContainer.appendChild(buildWeekdays());
            if (!self.daysContainer) {
                self.daysContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-days");
                self.daysContainer.tabIndex = -1;
            }
            buildDays();
            self.rContainer.appendChild(self.daysContainer);
            self.innerContainer.appendChild(self.rContainer);
            fragment.appendChild(self.innerContainer);
        }
        if (self.config.enableTime) {
            fragment.appendChild(buildTime());
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rangeMode", self.config.mode === "range");
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "animate", self.config.animate === true);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
        self.calendarContainer.appendChild(fragment);
        var customAppend = self.config.appendTo !== undefined &&
            self.config.appendTo.nodeType !== undefined;
        if (self.config.inline || self.config.static) {
            self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
            if (self.config.inline) {
                if (!customAppend && self.element.parentNode)
                    self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
                else if (self.config.appendTo !== undefined)
                    self.config.appendTo.appendChild(self.calendarContainer);
            }
            if (self.config.static) {
                var wrapper = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-wrapper");
                if (self.element.parentNode)
                    self.element.parentNode.insertBefore(wrapper, self.element);
                wrapper.appendChild(self.element);
                if (self.altInput)
                    wrapper.appendChild(self.altInput);
                wrapper.appendChild(self.calendarContainer);
            }
        }
        if (!self.config.static && !self.config.inline)
            (self.config.appendTo !== undefined
                ? self.config.appendTo
                : window.document.body).appendChild(self.calendarContainer);
    }
    function createDay(className, date, _dayNumber, i) {
        var dateIsEnabled = isEnabled(date, true), dayElement = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", className, date.getDate().toString());
        dayElement.dateObj = date;
        dayElement.$i = i;
        dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
        if (className.indexOf("hidden") === -1 &&
            (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.now) === 0) {
            self.todayDateElem = dayElement;
            dayElement.classList.add("today");
            dayElement.setAttribute("aria-current", "date");
        }
        if (dateIsEnabled) {
            dayElement.tabIndex = -1;
            if (isDateSelected(date)) {
                dayElement.classList.add("selected");
                self.selectedDateElem = dayElement;
                if (self.config.mode === "range") {
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(dayElement, "startRange", self.selectedDates[0] &&
                        (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[0], true) === 0);
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(dayElement, "endRange", self.selectedDates[1] &&
                        (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[1], true) === 0);
                    if (className === "nextMonthDay")
                        dayElement.classList.add("inRange");
                }
            }
        }
        else {
            dayElement.classList.add("flatpickr-disabled");
        }
        if (self.config.mode === "range") {
            if (isDateInRange(date) && !isDateSelected(date))
                dayElement.classList.add("inRange");
        }
        if (self.weekNumbers &&
            self.config.showMonths === 1 &&
            className !== "prevMonthDay" &&
            i % 7 === 6) {
            self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
        }
        triggerEvent("onDayCreate", dayElement);
        return dayElement;
    }
    function focusOnDayElem(targetNode) {
        targetNode.focus();
        if (self.config.mode === "range")
            onMouseOver(targetNode);
    }
    function getFirstAvailableDay(delta) {
        var startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
        var endMonth = delta > 0 ? self.config.showMonths : -1;
        for (var m = startMonth; m != endMonth; m += delta) {
            var month = self.daysContainer.children[m];
            var startIndex = delta > 0 ? 0 : month.children.length - 1;
            var endIndex = delta > 0 ? month.children.length : -1;
            for (var i = startIndex; i != endIndex; i += delta) {
                var c = month.children[i];
                if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
                    return c;
            }
        }
        return undefined;
    }
    function getNextAvailableDay(current, delta) {
        var givenMonth = current.className.indexOf("Month") === -1
            ? current.dateObj.getMonth()
            : self.currentMonth;
        var endMonth = delta > 0 ? self.config.showMonths : -1;
        var loopDelta = delta > 0 ? 1 : -1;
        for (var m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
            var month = self.daysContainer.children[m];
            var startIndex = givenMonth - self.currentMonth === m
                ? current.$i + delta
                : delta < 0
                    ? month.children.length - 1
                    : 0;
            var numMonthDays = month.children.length;
            for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
                var c = month.children[i];
                if (c.className.indexOf("hidden") === -1 &&
                    isEnabled(c.dateObj) &&
                    Math.abs(current.$i - i) >= Math.abs(delta))
                    return focusOnDayElem(c);
            }
        }
        self.changeMonth(loopDelta);
        focusOnDay(getFirstAvailableDay(loopDelta), 0);
        return undefined;
    }
    function focusOnDay(current, offset) {
        var activeElement = getClosestActiveElement();
        var dayFocused = isInView(activeElement || document.body);
        var startElem = current !== undefined
            ? current
            : dayFocused
                ? activeElement
                : self.selectedDateElem !== undefined && isInView(self.selectedDateElem)
                    ? self.selectedDateElem
                    : self.todayDateElem !== undefined && isInView(self.todayDateElem)
                        ? self.todayDateElem
                        : getFirstAvailableDay(offset > 0 ? 1 : -1);
        if (startElem === undefined) {
            self._input.focus();
        }
        else if (!dayFocused) {
            focusOnDayElem(startElem);
        }
        else {
            getNextAvailableDay(startElem, offset);
        }
    }
    function buildMonthDays(year, month) {
        var firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
        var prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
        var daysInMonth = self.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
        var dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
        for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
            days.appendChild(createDay("flatpickr-day " + prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
        }
        for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
            days.appendChild(createDay("flatpickr-day", new Date(year, month, dayNumber), dayNumber, dayIndex));
        }
        for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth &&
            (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
            days.appendChild(createDay("flatpickr-day " + nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
        }
        var dayContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "dayContainer");
        dayContainer.appendChild(days);
        return dayContainer;
    }
    function buildDays() {
        if (self.daysContainer === undefined) {
            return;
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.daysContainer);
        if (self.weekNumbers)
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.weekNumbers);
        var frag = document.createDocumentFragment();
        for (var i = 0; i < self.config.showMonths; i++) {
            var d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i);
            frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
        }
        self.daysContainer.appendChild(frag);
        self.days = self.daysContainer.firstChild;
        if (self.config.mode === "range" && self.selectedDates.length === 1) {
            onMouseOver();
        }
    }
    function buildMonthSwitch() {
        if (self.config.showMonths > 1 ||
            self.config.monthSelectorType !== "dropdown")
            return;
        var shouldBuildMonth = function (month) {
            if (self.config.minDate !== undefined &&
                self.currentYear === self.config.minDate.getFullYear() &&
                month < self.config.minDate.getMonth()) {
                return false;
            }
            return !(self.config.maxDate !== undefined &&
                self.currentYear === self.config.maxDate.getFullYear() &&
                month > self.config.maxDate.getMonth());
        };
        self.monthsDropdownContainer.tabIndex = -1;
        self.monthsDropdownContainer.innerHTML = "";
        for (var i = 0; i < 12; i++) {
            if (!shouldBuildMonth(i))
                continue;
            var month = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("option", "flatpickr-monthDropdown-month");
            month.value = new Date(self.currentYear, i).getMonth().toString();
            month.textContent = (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_5__.monthToStr)(i, self.config.shorthandCurrentMonth, self.l10n);
            month.tabIndex = -1;
            if (self.currentMonth === i) {
                month.selected = true;
            }
            self.monthsDropdownContainer.appendChild(month);
        }
    }
    function buildMonth() {
        var container = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-month");
        var monthNavFragment = window.document.createDocumentFragment();
        var monthElement;
        if (self.config.showMonths > 1 ||
            self.config.monthSelectorType === "static") {
            monthElement = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "cur-month");
        }
        else {
            self.monthsDropdownContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("select", "flatpickr-monthDropdown-months");
            self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
            bind(self.monthsDropdownContainer, "change", function (e) {
                var target = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
                var selectedMonth = parseInt(target.value, 10);
                self.changeMonth(selectedMonth - self.currentMonth);
                triggerEvent("onMonthChange");
            });
            buildMonthSwitch();
            monthElement = self.monthsDropdownContainer;
        }
        var yearInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("cur-year", { tabindex: "-1" });
        var yearElement = yearInput.getElementsByTagName("input")[0];
        yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
        if (self.config.minDate) {
            yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
        }
        if (self.config.maxDate) {
            yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
            yearElement.disabled =
                !!self.config.minDate &&
                    self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
        }
        var currentMonth = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-current-month");
        currentMonth.appendChild(monthElement);
        currentMonth.appendChild(yearInput);
        monthNavFragment.appendChild(currentMonth);
        container.appendChild(monthNavFragment);
        return {
            container: container,
            yearElement: yearElement,
            monthElement: monthElement,
        };
    }
    function buildMonths() {
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.monthNav);
        self.monthNav.appendChild(self.prevMonthNav);
        if (self.config.showMonths) {
            self.yearElements = [];
            self.monthElements = [];
        }
        for (var m = self.config.showMonths; m--;) {
            var month = buildMonth();
            self.yearElements.push(month.yearElement);
            self.monthElements.push(month.monthElement);
            self.monthNav.appendChild(month.container);
        }
        self.monthNav.appendChild(self.nextMonthNav);
    }
    function buildMonthNav() {
        self.monthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-months");
        self.yearElements = [];
        self.monthElements = [];
        self.prevMonthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-prev-month");
        self.prevMonthNav.innerHTML = self.config.prevArrow;
        self.nextMonthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-next-month");
        self.nextMonthNav.innerHTML = self.config.nextArrow;
        buildMonths();
        Object.defineProperty(self, "_hidePrevMonthArrow", {
            get: function () { return self.__hidePrevMonthArrow; },
            set: function (bool) {
                if (self.__hidePrevMonthArrow !== bool) {
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.prevMonthNav, "flatpickr-disabled", bool);
                    self.__hidePrevMonthArrow = bool;
                }
            },
        });
        Object.defineProperty(self, "_hideNextMonthArrow", {
            get: function () { return self.__hideNextMonthArrow; },
            set: function (bool) {
                if (self.__hideNextMonthArrow !== bool) {
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.nextMonthNav, "flatpickr-disabled", bool);
                    self.__hideNextMonthArrow = bool;
                }
            },
        });
        self.currentYearElement = self.yearElements[0];
        updateNavigationCurrentMonth();
        return self.monthNav;
    }
    function buildTime() {
        self.calendarContainer.classList.add("hasTime");
        if (self.config.noCalendar)
            self.calendarContainer.classList.add("noCalendar");
        var defaults = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config);
        self.timeContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-time");
        self.timeContainer.tabIndex = -1;
        var separator = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-time-separator", ":");
        var hourInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-hour", {
            "aria-label": self.l10n.hourAriaLabel,
        });
        self.hourElement = hourInput.getElementsByTagName("input")[0];
        var minuteInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-minute", {
            "aria-label": self.l10n.minuteAriaLabel,
        });
        self.minuteElement = minuteInput.getElementsByTagName("input")[0];
        self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
        self.hourElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj
            ? self.latestSelectedDateObj.getHours()
            : self.config.time_24hr
                ? defaults.hours
                : military2ampm(defaults.hours));
        self.minuteElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj
            ? self.latestSelectedDateObj.getMinutes()
            : defaults.minutes);
        self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
        self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
        self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
        self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
        self.hourElement.setAttribute("maxlength", "2");
        self.minuteElement.setAttribute("min", "0");
        self.minuteElement.setAttribute("max", "59");
        self.minuteElement.setAttribute("maxlength", "2");
        self.timeContainer.appendChild(hourInput);
        self.timeContainer.appendChild(separator);
        self.timeContainer.appendChild(minuteInput);
        if (self.config.time_24hr)
            self.timeContainer.classList.add("time24hr");
        if (self.config.enableSeconds) {
            self.timeContainer.classList.add("hasSeconds");
            var secondInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-second");
            self.secondElement = secondInput.getElementsByTagName("input")[0];
            self.secondElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getSeconds()
                : defaults.seconds);
            self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
            self.secondElement.setAttribute("min", "0");
            self.secondElement.setAttribute("max", "59");
            self.secondElement.setAttribute("maxlength", "2");
            self.timeContainer.appendChild((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-time-separator", ":"));
            self.timeContainer.appendChild(secondInput);
        }
        if (!self.config.time_24hr) {
            self.amPM = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-am-pm", self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)((self.latestSelectedDateObj
                ? self.hourElement.value
                : self.config.defaultHour) > 11)]);
            self.amPM.title = self.l10n.toggleTitle;
            self.amPM.tabIndex = -1;
            self.timeContainer.appendChild(self.amPM);
        }
        return self.timeContainer;
    }
    function buildWeekdays() {
        if (!self.weekdayContainer)
            self.weekdayContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekdays");
        else
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.weekdayContainer);
        for (var i = self.config.showMonths; i--;) {
            var container = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekdaycontainer");
            self.weekdayContainer.appendChild(container);
        }
        updateWeekdays();
        return self.weekdayContainer;
    }
    function updateWeekdays() {
        if (!self.weekdayContainer) {
            return;
        }
        var firstDayOfWeek = self.l10n.firstDayOfWeek;
        var weekdays = __spreadArrays(self.l10n.weekdays.shorthand);
        if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
            weekdays = __spreadArrays(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
        }
        for (var i = self.config.showMonths; i--;) {
            self.weekdayContainer.children[i].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
        }
    }
    function buildWeeks() {
        self.calendarContainer.classList.add("hasWeeks");
        var weekWrapper = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekwrapper");
        weekWrapper.appendChild((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
        var weekNumbers = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weeks");
        weekWrapper.appendChild(weekNumbers);
        return {
            weekWrapper: weekWrapper,
            weekNumbers: weekNumbers,
        };
    }
    function changeMonth(value, isOffset) {
        if (isOffset === void 0) { isOffset = true; }
        var delta = isOffset ? value : value - self.currentMonth;
        if ((delta < 0 && self._hidePrevMonthArrow === true) ||
            (delta > 0 && self._hideNextMonthArrow === true))
            return;
        self.currentMonth += delta;
        if (self.currentMonth < 0 || self.currentMonth > 11) {
            self.currentYear += self.currentMonth > 11 ? 1 : -1;
            self.currentMonth = (self.currentMonth + 12) % 12;
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
        buildDays();
        triggerEvent("onMonthChange");
        updateNavigationCurrentMonth();
    }
    function clear(triggerChangeEvent, toInitial) {
        if (triggerChangeEvent === void 0) { triggerChangeEvent = true; }
        if (toInitial === void 0) { toInitial = true; }
        self.input.value = "";
        if (self.altInput !== undefined)
            self.altInput.value = "";
        if (self.mobileInput !== undefined)
            self.mobileInput.value = "";
        self.selectedDates = [];
        self.latestSelectedDateObj = undefined;
        if (toInitial === true) {
            self.currentYear = self._initialDate.getFullYear();
            self.currentMonth = self._initialDate.getMonth();
        }
        if (self.config.enableTime === true) {
            var _a = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
            setHours(hours, minutes, seconds);
        }
        self.redraw();
        if (triggerChangeEvent)
            triggerEvent("onChange");
    }
    function close() {
        self.isOpen = false;
        if (!self.isMobile) {
            if (self.calendarContainer !== undefined) {
                self.calendarContainer.classList.remove("open");
            }
            if (self._input !== undefined) {
                self._input.classList.remove("active");
            }
        }
        triggerEvent("onClose");
    }
    function destroy() {
        if (self.config !== undefined)
            triggerEvent("onDestroy");
        for (var i = self._handlers.length; i--;) {
            self._handlers[i].remove();
        }
        self._handlers = [];
        if (self.mobileInput) {
            if (self.mobileInput.parentNode)
                self.mobileInput.parentNode.removeChild(self.mobileInput);
            self.mobileInput = undefined;
        }
        else if (self.calendarContainer && self.calendarContainer.parentNode) {
            if (self.config.static && self.calendarContainer.parentNode) {
                var wrapper = self.calendarContainer.parentNode;
                wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
                if (wrapper.parentNode) {
                    while (wrapper.firstChild)
                        wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                    wrapper.parentNode.removeChild(wrapper);
                }
            }
            else
                self.calendarContainer.parentNode.removeChild(self.calendarContainer);
        }
        if (self.altInput) {
            self.input.type = "text";
            if (self.altInput.parentNode)
                self.altInput.parentNode.removeChild(self.altInput);
            delete self.altInput;
        }
        if (self.input) {
            self.input.type = self.input._type;
            self.input.classList.remove("flatpickr-input");
            self.input.removeAttribute("readonly");
        }
        [
            "_showTimeInput",
            "latestSelectedDateObj",
            "_hideNextMonthArrow",
            "_hidePrevMonthArrow",
            "__hideNextMonthArrow",
            "__hidePrevMonthArrow",
            "isMobile",
            "isOpen",
            "selectedDateElem",
            "minDateHasTime",
            "maxDateHasTime",
            "days",
            "daysContainer",
            "_input",
            "_positionElement",
            "innerContainer",
            "rContainer",
            "monthNav",
            "todayDateElem",
            "calendarContainer",
            "weekdayContainer",
            "prevMonthNav",
            "nextMonthNav",
            "monthsDropdownContainer",
            "currentMonthElement",
            "currentYearElement",
            "navigationCurrentMonth",
            "selectedDateElem",
            "config",
        ].forEach(function (k) {
            try {
                delete self[k];
            }
            catch (_) { }
        });
    }
    function isCalendarElem(elem) {
        return self.calendarContainer.contains(elem);
    }
    function documentClick(e) {
        if (self.isOpen && !self.config.inline) {
            var eventTarget_1 = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
            var isCalendarElement = isCalendarElem(eventTarget_1);
            var isInput = eventTarget_1 === self.input ||
                eventTarget_1 === self.altInput ||
                self.element.contains(eventTarget_1) ||
                (e.path &&
                    e.path.indexOf &&
                    (~e.path.indexOf(self.input) ||
                        ~e.path.indexOf(self.altInput)));
            var lostFocus = !isInput &&
                !isCalendarElement &&
                !isCalendarElem(e.relatedTarget);
            var isIgnored = !self.config.ignoredFocusElements.some(function (elem) {
                return elem.contains(eventTarget_1);
            });
            if (lostFocus && isIgnored) {
                if (self.config.allowInput) {
                    self.setDate(self._input.value, false, self.config.altInput
                        ? self.config.altFormat
                        : self.config.dateFormat);
                }
                if (self.timeContainer !== undefined &&
                    self.minuteElement !== undefined &&
                    self.hourElement !== undefined &&
                    self.input.value !== "" &&
                    self.input.value !== undefined) {
                    updateTime();
                }
                self.close();
                if (self.config &&
                    self.config.mode === "range" &&
                    self.selectedDates.length === 1)
                    self.clear(false);
            }
        }
    }
    function changeYear(newYear) {
        if (!newYear ||
            (self.config.minDate && newYear < self.config.minDate.getFullYear()) ||
            (self.config.maxDate && newYear > self.config.maxDate.getFullYear()))
            return;
        var newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
        self.currentYear = newYearNum || self.currentYear;
        if (self.config.maxDate &&
            self.currentYear === self.config.maxDate.getFullYear()) {
            self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
        }
        else if (self.config.minDate &&
            self.currentYear === self.config.minDate.getFullYear()) {
            self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
        }
        if (isNewYear) {
            self.redraw();
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
    }
    function isEnabled(date, timeless) {
        var _a;
        if (timeless === void 0) { timeless = true; }
        var dateToCheck = self.parseDate(date, undefined, timeless);
        if ((self.config.minDate &&
            dateToCheck &&
            (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0) ||
            (self.config.maxDate &&
                dateToCheck &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0))
            return false;
        if (!self.config.enable && self.config.disable.length === 0)
            return true;
        if (dateToCheck === undefined)
            return false;
        var bool = !!self.config.enable, array = (_a = self.config.enable) !== null && _a !== void 0 ? _a : self.config.disable;
        for (var i = 0, d = void 0; i < array.length; i++) {
            d = array[i];
            if (typeof d === "function" &&
                d(dateToCheck))
                return bool;
            else if (d instanceof Date &&
                dateToCheck !== undefined &&
                d.getTime() === dateToCheck.getTime())
                return bool;
            else if (typeof d === "string") {
                var parsed = self.parseDate(d, undefined, true);
                return parsed && parsed.getTime() === dateToCheck.getTime()
                    ? bool
                    : !bool;
            }
            else if (typeof d === "object" &&
                dateToCheck !== undefined &&
                d.from &&
                d.to &&
                dateToCheck.getTime() >= d.from.getTime() &&
                dateToCheck.getTime() <= d.to.getTime())
                return bool;
        }
        return !bool;
    }
    function isInView(elem) {
        if (self.daysContainer !== undefined)
            return (elem.className.indexOf("hidden") === -1 &&
                elem.className.indexOf("flatpickr-disabled") === -1 &&
                self.daysContainer.contains(elem));
        return false;
    }
    function onBlur(e) {
        var isInput = e.target === self._input;
        var valueChanged = self._input.value.trimEnd() !== getDateStr();
        if (isInput &&
            valueChanged &&
            !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
            self.setDate(self._input.value, true, e.target === self.altInput
                ? self.config.altFormat
                : self.config.dateFormat);
        }
    }
    function onKeyDown(e) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        var isInput = self.config.wrap
            ? element.contains(eventTarget)
            : eventTarget === self._input;
        var allowInput = self.config.allowInput;
        var allowKeydown = self.isOpen && (!allowInput || !isInput);
        var allowInlineKeydown = self.config.inline && isInput && !allowInput;
        if (e.keyCode === 13 && isInput) {
            if (allowInput) {
                self.setDate(self._input.value, true, eventTarget === self.altInput
                    ? self.config.altFormat
                    : self.config.dateFormat);
                self.close();
                return eventTarget.blur();
            }
            else {
                self.open();
            }
        }
        else if (isCalendarElem(eventTarget) ||
            allowKeydown ||
            allowInlineKeydown) {
            var isTimeObj = !!self.timeContainer &&
                self.timeContainer.contains(eventTarget);
            switch (e.keyCode) {
                case 13:
                    if (isTimeObj) {
                        e.preventDefault();
                        updateTime();
                        focusAndClose();
                    }
                    else
                        selectDate(e);
                    break;
                case 27:
                    e.preventDefault();
                    focusAndClose();
                    break;
                case 8:
                case 46:
                    if (isInput && !self.config.allowInput) {
                        e.preventDefault();
                        self.clear();
                    }
                    break;
                case 37:
                case 39:
                    if (!isTimeObj && !isInput) {
                        e.preventDefault();
                        var activeElement = getClosestActiveElement();
                        if (self.daysContainer !== undefined &&
                            (allowInput === false ||
                                (activeElement && isInView(activeElement)))) {
                            var delta_1 = e.keyCode === 39 ? 1 : -1;
                            if (!e.ctrlKey)
                                focusOnDay(undefined, delta_1);
                            else {
                                e.stopPropagation();
                                changeMonth(delta_1);
                                focusOnDay(getFirstAvailableDay(1), 0);
                            }
                        }
                    }
                    else if (self.hourElement)
                        self.hourElement.focus();
                    break;
                case 38:
                case 40:
                    e.preventDefault();
                    var delta = e.keyCode === 40 ? 1 : -1;
                    if ((self.daysContainer &&
                        eventTarget.$i !== undefined) ||
                        eventTarget === self.input ||
                        eventTarget === self.altInput) {
                        if (e.ctrlKey) {
                            e.stopPropagation();
                            changeYear(self.currentYear - delta);
                            focusOnDay(getFirstAvailableDay(1), 0);
                        }
                        else if (!isTimeObj)
                            focusOnDay(undefined, delta * 7);
                    }
                    else if (eventTarget === self.currentYearElement) {
                        changeYear(self.currentYear - delta);
                    }
                    else if (self.config.enableTime) {
                        if (!isTimeObj && self.hourElement)
                            self.hourElement.focus();
                        updateTime(e);
                        self._debouncedChange();
                    }
                    break;
                case 9:
                    if (isTimeObj) {
                        var elems = [
                            self.hourElement,
                            self.minuteElement,
                            self.secondElement,
                            self.amPM,
                        ]
                            .concat(self.pluginElements)
                            .filter(function (x) { return x; });
                        var i = elems.indexOf(eventTarget);
                        if (i !== -1) {
                            var target = elems[i + (e.shiftKey ? -1 : 1)];
                            e.preventDefault();
                            (target || self._input).focus();
                        }
                    }
                    else if (!self.config.noCalendar &&
                        self.daysContainer &&
                        self.daysContainer.contains(eventTarget) &&
                        e.shiftKey) {
                        e.preventDefault();
                        self._input.focus();
                    }
                    break;
                default:
                    break;
            }
        }
        if (self.amPM !== undefined && eventTarget === self.amPM) {
            switch (e.key) {
                case self.l10n.amPM[0].charAt(0):
                case self.l10n.amPM[0].charAt(0).toLowerCase():
                    self.amPM.textContent = self.l10n.amPM[0];
                    setHoursFromInputs();
                    updateValue();
                    break;
                case self.l10n.amPM[1].charAt(0):
                case self.l10n.amPM[1].charAt(0).toLowerCase():
                    self.amPM.textContent = self.l10n.amPM[1];
                    setHoursFromInputs();
                    updateValue();
                    break;
            }
        }
        if (isInput || isCalendarElem(eventTarget)) {
            triggerEvent("onKeyDown", e);
        }
    }
    function onMouseOver(elem, cellClass) {
        if (cellClass === void 0) { cellClass = "flatpickr-day"; }
        if (self.selectedDates.length !== 1 ||
            (elem &&
                (!elem.classList.contains(cellClass) ||
                    elem.classList.contains("flatpickr-disabled"))))
            return;
        var hoverDate = elem
            ? elem.dateObj.getTime()
            : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
        var containsDisabled = false;
        var minRange = 0, maxRange = 0;
        for (var t = rangeStartDate; t < rangeEndDate; t += _utils_dates__WEBPACK_IMPORTED_MODULE_4__.duration.DAY) {
            if (!isEnabled(new Date(t), true)) {
                containsDisabled =
                    containsDisabled || (t > rangeStartDate && t < rangeEndDate);
                if (t < initialDate && (!minRange || t > minRange))
                    minRange = t;
                else if (t > initialDate && (!maxRange || t < maxRange))
                    maxRange = t;
            }
        }
        var hoverableCells = Array.from(self.rContainer.querySelectorAll("*:nth-child(-n+" + self.config.showMonths + ") > ." + cellClass));
        hoverableCells.forEach(function (dayElem) {
            var date = dayElem.dateObj;
            var timestamp = date.getTime();
            var outOfRange = (minRange > 0 && timestamp < minRange) ||
                (maxRange > 0 && timestamp > maxRange);
            if (outOfRange) {
                dayElem.classList.add("notAllowed");
                ["inRange", "startRange", "endRange"].forEach(function (c) {
                    dayElem.classList.remove(c);
                });
                return;
            }
            else if (containsDisabled && !outOfRange)
                return;
            ["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
                dayElem.classList.remove(c);
            });
            if (elem !== undefined) {
                elem.classList.add(hoverDate <= self.selectedDates[0].getTime()
                    ? "startRange"
                    : "endRange");
                if (initialDate < hoverDate && timestamp === initialDate)
                    dayElem.classList.add("startRange");
                else if (initialDate > hoverDate && timestamp === initialDate)
                    dayElem.classList.add("endRange");
                if (timestamp >= minRange &&
                    (maxRange === 0 || timestamp <= maxRange) &&
                    (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.isBetween)(timestamp, initialDate, hoverDate))
                    dayElem.classList.add("inRange");
            }
        });
    }
    function onResize() {
        if (self.isOpen && !self.config.static && !self.config.inline)
            positionCalendar();
    }
    function open(e, positionElement) {
        if (positionElement === void 0) { positionElement = self._positionElement; }
        if (self.isMobile === true) {
            if (e) {
                e.preventDefault();
                var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
                if (eventTarget) {
                    eventTarget.blur();
                }
            }
            if (self.mobileInput !== undefined) {
                self.mobileInput.focus();
                self.mobileInput.click();
            }
            triggerEvent("onOpen");
            return;
        }
        else if (self._input.disabled || self.config.inline) {
            return;
        }
        var wasOpen = self.isOpen;
        self.isOpen = true;
        if (!wasOpen) {
            self.calendarContainer.classList.add("open");
            self._input.classList.add("active");
            triggerEvent("onOpen");
            positionCalendar(positionElement);
        }
        if (self.config.enableTime === true && self.config.noCalendar === true) {
            if (self.config.allowInput === false &&
                (e === undefined ||
                    !self.timeContainer.contains(e.relatedTarget))) {
                setTimeout(function () { return self.hourElement.select(); }, 50);
            }
        }
    }
    function minMaxDateSetter(type) {
        return function (date) {
            var dateObj = (self.config["_" + type + "Date"] = self.parseDate(date, self.config.dateFormat));
            var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];
            if (dateObj !== undefined) {
                self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
                    dateObj.getHours() > 0 ||
                        dateObj.getMinutes() > 0 ||
                        dateObj.getSeconds() > 0;
            }
            if (self.selectedDates) {
                self.selectedDates = self.selectedDates.filter(function (d) { return isEnabled(d); });
                if (!self.selectedDates.length && type === "min")
                    setHoursFromDate(dateObj);
                updateValue();
            }
            if (self.daysContainer) {
                redraw();
                if (dateObj !== undefined)
                    self.currentYearElement[type] = dateObj.getFullYear().toString();
                else
                    self.currentYearElement.removeAttribute(type);
                self.currentYearElement.disabled =
                    !!inverseDateObj &&
                        dateObj !== undefined &&
                        inverseDateObj.getFullYear() === dateObj.getFullYear();
            }
        };
    }
    function parseConfig() {
        var boolOpts = [
            "wrap",
            "weekNumbers",
            "allowInput",
            "allowInvalidPreload",
            "clickOpens",
            "time_24hr",
            "enableTime",
            "noCalendar",
            "altInput",
            "shorthandCurrentMonth",
            "inline",
            "static",
            "enableSeconds",
            "disableMobile",
        ];
        var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
        var formats = {};
        self.config.parseDate = userConfig.parseDate;
        self.config.formatDate = userConfig.formatDate;
        Object.defineProperty(self.config, "enable", {
            get: function () { return self.config._enable; },
            set: function (dates) {
                self.config._enable = parseDateRules(dates);
            },
        });
        Object.defineProperty(self.config, "disable", {
            get: function () { return self.config._disable; },
            set: function (dates) {
                self.config._disable = parseDateRules(dates);
            },
        });
        var timeMode = userConfig.mode === "time";
        if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
            var defaultDateFormat = flatpickr.defaultConfig.dateFormat || _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults.dateFormat;
            formats.dateFormat =
                userConfig.noCalendar || timeMode
                    ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                    : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
        }
        if (userConfig.altInput &&
            (userConfig.enableTime || timeMode) &&
            !userConfig.altFormat) {
            var defaultAltFormat = flatpickr.defaultConfig.altFormat || _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults.altFormat;
            formats.altFormat =
                userConfig.noCalendar || timeMode
                    ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                    : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
        }
        Object.defineProperty(self.config, "minDate", {
            get: function () { return self.config._minDate; },
            set: minMaxDateSetter("min"),
        });
        Object.defineProperty(self.config, "maxDate", {
            get: function () { return self.config._maxDate; },
            set: minMaxDateSetter("max"),
        });
        var minMaxTimeSetter = function (type) { return function (val) {
            self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
        }; };
        Object.defineProperty(self.config, "minTime", {
            get: function () { return self.config._minTime; },
            set: minMaxTimeSetter("min"),
        });
        Object.defineProperty(self.config, "maxTime", {
            get: function () { return self.config._maxTime; },
            set: minMaxTimeSetter("max"),
        });
        if (userConfig.mode === "time") {
            self.config.noCalendar = true;
            self.config.enableTime = true;
        }
        Object.assign(self.config, formats, userConfig);
        for (var i = 0; i < boolOpts.length; i++)
            self.config[boolOpts[i]] =
                self.config[boolOpts[i]] === true ||
                    self.config[boolOpts[i]] === "true";
        _types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.filter(function (hook) { return self.config[hook] !== undefined; }).forEach(function (hook) {
            self.config[hook] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(self.config[hook] || []).map(bindToInstance);
        });
        self.isMobile =
            !self.config.disableMobile &&
                !self.config.inline &&
                self.config.mode === "single" &&
                !self.config.disable.length &&
                !self.config.enable &&
                !self.config.weekNumbers &&
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        for (var i = 0; i < self.config.plugins.length; i++) {
            var pluginConf = self.config.plugins[i](self) || {};
            for (var key in pluginConf) {
                if (_types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.indexOf(key) > -1) {
                    self.config[key] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(pluginConf[key])
                        .map(bindToInstance)
                        .concat(self.config[key]);
                }
                else if (typeof userConfig[key] === "undefined")
                    self.config[key] = pluginConf[key];
            }
        }
        if (!userConfig.altInputClass) {
            self.config.altInputClass =
                getInputElem().className + " " + self.config.altInputClass;
        }
        triggerEvent("onParseConfig");
    }
    function getInputElem() {
        return self.config.wrap
            ? element.querySelector("[data-input]")
            : element;
    }
    function setupLocale() {
        if (typeof self.config.locale !== "object" &&
            typeof flatpickr.l10ns[self.config.locale] === "undefined")
            self.config.errorHandler(new Error("flatpickr: invalid locale " + self.config.locale));
        self.l10n = __assign(__assign({}, flatpickr.l10ns.default), (typeof self.config.locale === "object"
            ? self.config.locale
            : self.config.locale !== "default"
                ? flatpickr.l10ns[self.config.locale]
                : undefined));
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.D = "(" + self.l10n.weekdays.shorthand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.l = "(" + self.l10n.weekdays.longhand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.M = "(" + self.l10n.months.shorthand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.F = "(" + self.l10n.months.longhand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.K = "(" + self.l10n.amPM[0] + "|" + self.l10n.amPM[1] + "|" + self.l10n.amPM[0].toLowerCase() + "|" + self.l10n.amPM[1].toLowerCase() + ")";
        var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
        if (userConfig.time_24hr === undefined &&
            flatpickr.defaultConfig.time_24hr === undefined) {
            self.config.time_24hr = self.l10n.time_24hr;
        }
        self.formatDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateFormatter)(self);
        self.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({ config: self.config, l10n: self.l10n });
    }
    function positionCalendar(customPositionElement) {
        if (typeof self.config.position === "function") {
            return void self.config.position(self, customPositionElement);
        }
        if (self.calendarContainer === undefined)
            return;
        triggerEvent("onPreCalendarPosition");
        var positionElement = customPositionElement || self._positionElement;
        var calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, (function (acc, child) { return acc + child.offsetHeight; }), 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" ||
            (configPosVertical !== "below" &&
                distanceFromBottom < calendarHeight &&
                inputBounds.top > calendarHeight);
        var top = window.pageYOffset +
            inputBounds.top +
            (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowTop", !showOnTop);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowBottom", showOnTop);
        if (self.config.inline)
            return;
        var left = window.pageXOffset + inputBounds.left;
        var isCenter = false;
        var isRight = false;
        if (configPosHorizontal === "center") {
            left -= (calendarWidth - inputBounds.width) / 2;
            isCenter = true;
        }
        else if (configPosHorizontal === "right") {
            left -= calendarWidth - inputBounds.width;
            isRight = true;
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowCenter", isCenter);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowRight", isRight);
        var right = window.document.body.offsetWidth -
            (window.pageXOffset + inputBounds.right);
        var rightMost = left + calendarWidth > window.document.body.offsetWidth;
        var centerMost = right + calendarWidth > window.document.body.offsetWidth;
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rightMost", rightMost);
        if (self.config.static)
            return;
        self.calendarContainer.style.top = top + "px";
        if (!rightMost) {
            self.calendarContainer.style.left = left + "px";
            self.calendarContainer.style.right = "auto";
        }
        else if (!centerMost) {
            self.calendarContainer.style.left = "auto";
            self.calendarContainer.style.right = right + "px";
        }
        else {
            var doc = getDocumentStyleSheet();
            if (doc === undefined)
                return;
            var bodyWidth = window.document.body.offsetWidth;
            var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
            var centerBefore = ".flatpickr-calendar.centerMost:before";
            var centerAfter = ".flatpickr-calendar.centerMost:after";
            var centerIndex = doc.cssRules.length;
            var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rightMost", false);
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "centerMost", true);
            doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
            self.calendarContainer.style.left = centerLeft + "px";
            self.calendarContainer.style.right = "auto";
        }
    }
    function getDocumentStyleSheet() {
        var editableSheet = null;
        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (!sheet.cssRules)
                continue;
            try {
                sheet.cssRules;
            }
            catch (err) {
                continue;
            }
            editableSheet = sheet;
            break;
        }
        return editableSheet != null ? editableSheet : createStyleSheet();
    }
    function createStyleSheet() {
        var style = document.createElement("style");
        document.head.appendChild(style);
        return style.sheet;
    }
    function redraw() {
        if (self.config.noCalendar || self.isMobile)
            return;
        buildMonthSwitch();
        updateNavigationCurrentMonth();
        buildDays();
    }
    function focusAndClose() {
        self._input.focus();
        if (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
            navigator.msMaxTouchPoints !== undefined) {
            setTimeout(self.close, 0);
        }
        else {
            self.close();
        }
    }
    function selectDate(e) {
        e.preventDefault();
        e.stopPropagation();
        var isSelectable = function (day) {
            return day.classList &&
                day.classList.contains("flatpickr-day") &&
                !day.classList.contains("flatpickr-disabled") &&
                !day.classList.contains("notAllowed");
        };
        var t = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.findParent)((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e), isSelectable);
        if (t === undefined)
            return;
        var target = t;
        var selectedDate = (self.latestSelectedDateObj = new Date(target.dateObj.getTime()));
        var shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth ||
            selectedDate.getMonth() >
                self.currentMonth + self.config.showMonths - 1) &&
            self.config.mode !== "range";
        self.selectedDateElem = target;
        if (self.config.mode === "single")
            self.selectedDates = [selectedDate];
        else if (self.config.mode === "multiple") {
            var selectedIndex = isDateSelected(selectedDate);
            if (selectedIndex)
                self.selectedDates.splice(parseInt(selectedIndex), 1);
            else
                self.selectedDates.push(selectedDate);
        }
        else if (self.config.mode === "range") {
            if (self.selectedDates.length === 2) {
                self.clear(false, false);
            }
            self.latestSelectedDateObj = selectedDate;
            self.selectedDates.push(selectedDate);
            if ((0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(selectedDate, self.selectedDates[0], true) !== 0)
                self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
        }
        setHoursFromInputs();
        if (shouldChangeMonth) {
            var isNewYear = self.currentYear !== selectedDate.getFullYear();
            self.currentYear = selectedDate.getFullYear();
            self.currentMonth = selectedDate.getMonth();
            if (isNewYear) {
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            triggerEvent("onMonthChange");
        }
        updateNavigationCurrentMonth();
        buildDays();
        updateValue();
        if (!shouldChangeMonth &&
            self.config.mode !== "range" &&
            self.config.showMonths === 1)
            focusOnDayElem(target);
        else if (self.selectedDateElem !== undefined &&
            self.hourElement === undefined) {
            self.selectedDateElem && self.selectedDateElem.focus();
        }
        if (self.hourElement !== undefined)
            self.hourElement !== undefined && self.hourElement.focus();
        if (self.config.closeOnSelect) {
            var single = self.config.mode === "single" && !self.config.enableTime;
            var range = self.config.mode === "range" &&
                self.selectedDates.length === 2 &&
                !self.config.enableTime;
            if (single || range) {
                focusAndClose();
            }
        }
        triggerChange();
    }
    var CALLBACKS = {
        locale: [setupLocale, updateWeekdays],
        showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
        minDate: [jumpToDate],
        maxDate: [jumpToDate],
        positionElement: [updatePositionElement],
        clickOpens: [
            function () {
                if (self.config.clickOpens === true) {
                    bind(self._input, "focus", self.open);
                    bind(self._input, "click", self.open);
                }
                else {
                    self._input.removeEventListener("focus", self.open);
                    self._input.removeEventListener("click", self.open);
                }
            },
        ],
    };
    function set(option, value) {
        if (option !== null && typeof option === "object") {
            Object.assign(self.config, option);
            for (var key in option) {
                if (CALLBACKS[key] !== undefined)
                    CALLBACKS[key].forEach(function (x) { return x(); });
            }
        }
        else {
            self.config[option] = value;
            if (CALLBACKS[option] !== undefined)
                CALLBACKS[option].forEach(function (x) { return x(); });
            else if (_types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.indexOf(option) > -1)
                self.config[option] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(value);
        }
        self.redraw();
        updateValue(true);
    }
    function setSelectedDate(inputDate, format) {
        var dates = [];
        if (inputDate instanceof Array)
            dates = inputDate.map(function (d) { return self.parseDate(d, format); });
        else if (inputDate instanceof Date || typeof inputDate === "number")
            dates = [self.parseDate(inputDate, format)];
        else if (typeof inputDate === "string") {
            switch (self.config.mode) {
                case "single":
                case "time":
                    dates = [self.parseDate(inputDate, format)];
                    break;
                case "multiple":
                    dates = inputDate
                        .split(self.config.conjunction)
                        .map(function (date) { return self.parseDate(date, format); });
                    break;
                case "range":
                    dates = inputDate
                        .split(self.l10n.rangeSeparator)
                        .map(function (date) { return self.parseDate(date, format); });
                    break;
                default:
                    break;
            }
        }
        else
            self.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
        self.selectedDates = (self.config.allowInvalidPreload
            ? dates
            : dates.filter(function (d) { return d instanceof Date && isEnabled(d, false); }));
        if (self.config.mode === "range")
            self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
    }
    function setDate(date, triggerChange, format) {
        if (triggerChange === void 0) { triggerChange = false; }
        if (format === void 0) { format = self.config.dateFormat; }
        if ((date !== 0 && !date) || (date instanceof Array && date.length === 0))
            return self.clear(triggerChange);
        setSelectedDate(date, format);
        self.latestSelectedDateObj =
            self.selectedDates[self.selectedDates.length - 1];
        self.redraw();
        jumpToDate(undefined, triggerChange);
        setHoursFromDate();
        if (self.selectedDates.length === 0) {
            self.clear(false);
        }
        updateValue(triggerChange);
        if (triggerChange)
            triggerEvent("onChange");
    }
    function parseDateRules(arr) {
        return arr
            .slice()
            .map(function (rule) {
            if (typeof rule === "string" ||
                typeof rule === "number" ||
                rule instanceof Date) {
                return self.parseDate(rule, undefined, true);
            }
            else if (rule &&
                typeof rule === "object" &&
                rule.from &&
                rule.to)
                return {
                    from: self.parseDate(rule.from, undefined),
                    to: self.parseDate(rule.to, undefined),
                };
            return rule;
        })
            .filter(function (x) { return x; });
    }
    function setupDates() {
        self.selectedDates = [];
        self.now = self.parseDate(self.config.now) || new Date();
        var preloadedDate = self.config.defaultDate ||
            ((self.input.nodeName === "INPUT" ||
                self.input.nodeName === "TEXTAREA") &&
                self.input.placeholder &&
                self.input.value === self.input.placeholder
                ? null
                : self.input.value);
        if (preloadedDate)
            setSelectedDate(preloadedDate, self.config.dateFormat);
        self._initialDate =
            self.selectedDates.length > 0
                ? self.selectedDates[0]
                : self.config.minDate &&
                    self.config.minDate.getTime() > self.now.getTime()
                    ? self.config.minDate
                    : self.config.maxDate &&
                        self.config.maxDate.getTime() < self.now.getTime()
                        ? self.config.maxDate
                        : self.now;
        self.currentYear = self._initialDate.getFullYear();
        self.currentMonth = self._initialDate.getMonth();
        if (self.selectedDates.length > 0)
            self.latestSelectedDateObj = self.selectedDates[0];
        if (self.config.minTime !== undefined)
            self.config.minTime = self.parseDate(self.config.minTime, "H:i");
        if (self.config.maxTime !== undefined)
            self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
        self.minDateHasTime =
            !!self.config.minDate &&
                (self.config.minDate.getHours() > 0 ||
                    self.config.minDate.getMinutes() > 0 ||
                    self.config.minDate.getSeconds() > 0);
        self.maxDateHasTime =
            !!self.config.maxDate &&
                (self.config.maxDate.getHours() > 0 ||
                    self.config.maxDate.getMinutes() > 0 ||
                    self.config.maxDate.getSeconds() > 0);
    }
    function setupInputs() {
        self.input = getInputElem();
        if (!self.input) {
            self.config.errorHandler(new Error("Invalid input element specified"));
            return;
        }
        self.input._type = self.input.type;
        self.input.type = "text";
        self.input.classList.add("flatpickr-input");
        self._input = self.input;
        if (self.config.altInput) {
            self.altInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)(self.input.nodeName, self.config.altInputClass);
            self._input = self.altInput;
            self.altInput.placeholder = self.input.placeholder;
            self.altInput.disabled = self.input.disabled;
            self.altInput.required = self.input.required;
            self.altInput.tabIndex = self.input.tabIndex;
            self.altInput.type = "text";
            self.input.setAttribute("type", "hidden");
            if (!self.config.static && self.input.parentNode)
                self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
        }
        if (!self.config.allowInput)
            self._input.setAttribute("readonly", "readonly");
        updatePositionElement();
    }
    function updatePositionElement() {
        self._positionElement = self.config.positionElement || self._input;
    }
    function setupMobile() {
        var inputType = self.config.enableTime
            ? self.config.noCalendar
                ? "time"
                : "datetime-local"
            : "date";
        self.mobileInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("input", self.input.className + " flatpickr-mobile");
        self.mobileInput.tabIndex = 1;
        self.mobileInput.type = inputType;
        self.mobileInput.disabled = self.input.disabled;
        self.mobileInput.required = self.input.required;
        self.mobileInput.placeholder = self.input.placeholder;
        self.mobileFormatStr =
            inputType === "datetime-local"
                ? "Y-m-d\\TH:i:S"
                : inputType === "date"
                    ? "Y-m-d"
                    : "H:i:S";
        if (self.selectedDates.length > 0) {
            self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
        }
        if (self.config.minDate)
            self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
        if (self.config.maxDate)
            self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
        if (self.input.getAttribute("step"))
            self.mobileInput.step = String(self.input.getAttribute("step"));
        self.input.type = "hidden";
        if (self.altInput !== undefined)
            self.altInput.type = "hidden";
        try {
            if (self.input.parentNode)
                self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
        }
        catch (_a) { }
        bind(self.mobileInput, "change", function (e) {
            self.setDate((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e).value, false, self.mobileFormatStr);
            triggerEvent("onChange");
            triggerEvent("onClose");
        });
    }
    function toggle(e) {
        if (self.isOpen === true)
            return self.close();
        self.open(e);
    }
    function triggerEvent(event, data) {
        if (self.config === undefined)
            return;
        var hooks = self.config[event];
        if (hooks !== undefined && hooks.length > 0) {
            for (var i = 0; hooks[i] && i < hooks.length; i++)
                hooks[i](self.selectedDates, self.input.value, self, data);
        }
        if (event === "onChange") {
            self.input.dispatchEvent(createEvent("change"));
            self.input.dispatchEvent(createEvent("input"));
        }
    }
    function createEvent(name) {
        var e = document.createEvent("Event");
        e.initEvent(name, true, true);
        return e;
    }
    function isDateSelected(date) {
        for (var i = 0; i < self.selectedDates.length; i++) {
            var selectedDate = self.selectedDates[i];
            if (selectedDate instanceof Date &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(selectedDate, date) === 0)
                return "" + i;
        }
        return false;
    }
    function isDateInRange(date) {
        if (self.config.mode !== "range" || self.selectedDates.length < 2)
            return false;
        return ((0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[0]) >= 0 &&
            (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[1]) <= 0);
    }
    function updateNavigationCurrentMonth() {
        if (self.config.noCalendar || self.isMobile || !self.monthNav)
            return;
        self.yearElements.forEach(function (yearElement, i) {
            var d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i);
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType === "static") {
                self.monthElements[i].textContent =
                    (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_5__.monthToStr)(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
            }
            else {
                self.monthsDropdownContainer.value = d.getMonth().toString();
            }
            yearElement.value = d.getFullYear().toString();
        });
        self._hidePrevMonthArrow =
            self.config.minDate !== undefined &&
                (self.currentYear === self.config.minDate.getFullYear()
                    ? self.currentMonth <= self.config.minDate.getMonth()
                    : self.currentYear < self.config.minDate.getFullYear());
        self._hideNextMonthArrow =
            self.config.maxDate !== undefined &&
                (self.currentYear === self.config.maxDate.getFullYear()
                    ? self.currentMonth + 1 > self.config.maxDate.getMonth()
                    : self.currentYear > self.config.maxDate.getFullYear());
    }
    function getDateStr(specificFormat) {
        var format = specificFormat ||
            (self.config.altInput ? self.config.altFormat : self.config.dateFormat);
        return self.selectedDates
            .map(function (dObj) { return self.formatDate(dObj, format); })
            .filter(function (d, i, arr) {
            return self.config.mode !== "range" ||
                self.config.enableTime ||
                arr.indexOf(d) === i;
        })
            .join(self.config.mode !== "range"
            ? self.config.conjunction
            : self.l10n.rangeSeparator);
    }
    function updateValue(triggerChange) {
        if (triggerChange === void 0) { triggerChange = true; }
        if (self.mobileInput !== undefined && self.mobileFormatStr) {
            self.mobileInput.value =
                self.latestSelectedDateObj !== undefined
                    ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
                    : "";
        }
        self.input.value = getDateStr(self.config.dateFormat);
        if (self.altInput !== undefined) {
            self.altInput.value = getDateStr(self.config.altFormat);
        }
        if (triggerChange !== false)
            triggerEvent("onValueUpdate");
    }
    function onMonthNavClick(e) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        var isPrevMonth = self.prevMonthNav.contains(eventTarget);
        var isNextMonth = self.nextMonthNav.contains(eventTarget);
        if (isPrevMonth || isNextMonth) {
            changeMonth(isPrevMonth ? -1 : 1);
        }
        else if (self.yearElements.indexOf(eventTarget) >= 0) {
            eventTarget.select();
        }
        else if (eventTarget.classList.contains("arrowUp")) {
            self.changeYear(self.currentYear + 1);
        }
        else if (eventTarget.classList.contains("arrowDown")) {
            self.changeYear(self.currentYear - 1);
        }
    }
    function timeWrapper(e) {
        e.preventDefault();
        var isKeyDown = e.type === "keydown", eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e), input = eventTarget;
        if (self.amPM !== undefined && eventTarget === self.amPM) {
            self.amPM.textContent =
                self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(self.amPM.textContent === self.l10n.amPM[0])];
        }
        var min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta ||
            (isKeyDown ? (e.which === 38 ? 1 : -1) : 0);
        var newValue = curValue + step * delta;
        if (typeof input.value !== "undefined" && input.value.length === 2) {
            var isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
            if (newValue < min) {
                newValue =
                    max +
                        newValue +
                        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!isHourElem) +
                        ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(isHourElem) && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!self.amPM));
                if (isMinuteElem)
                    incrementNumInput(undefined, -1, self.hourElement);
            }
            else if (newValue > max) {
                newValue =
                    input === self.hourElement ? newValue - max - (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!self.amPM) : min;
                if (isMinuteElem)
                    incrementNumInput(undefined, 1, self.hourElement);
            }
            if (self.amPM &&
                isHourElem &&
                (step === 1
                    ? newValue + curValue === 23
                    : Math.abs(newValue - curValue) > step)) {
                self.amPM.textContent =
                    self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(self.amPM.textContent === self.l10n.amPM[0])];
            }
            input.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(newValue);
        }
    }
    init();
    return self;
}
function _flatpickr(nodeList, config) {
    var nodes = Array.prototype.slice
        .call(nodeList)
        .filter(function (x) { return x instanceof HTMLElement; });
    var instances = [];
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        try {
            if (node.getAttribute("data-fp-omit") !== null)
                continue;
            if (node._flatpickr !== undefined) {
                node._flatpickr.destroy();
                node._flatpickr = undefined;
            }
            node._flatpickr = FlatpickrInstance(node, config || {});
            instances.push(node._flatpickr);
        }
        catch (e) {
            console.error(e);
        }
    }
    return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined" &&
    typeof HTMLCollection !== "undefined" &&
    typeof NodeList !== "undefined") {
    HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
        return _flatpickr(this, config);
    };
    HTMLElement.prototype.flatpickr = function (config) {
        return _flatpickr([this], config);
    };
}
var flatpickr = function (selector, config) {
    if (typeof selector === "string") {
        return _flatpickr(window.document.querySelectorAll(selector), config);
    }
    else if (selector instanceof Node) {
        return _flatpickr([selector], config);
    }
    else {
        return _flatpickr(selector, config);
    }
};
flatpickr.defaultConfig = {};
flatpickr.l10ns = {
    en: __assign({}, _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"]),
    default: __assign({}, _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"]),
};
flatpickr.localize = function (l10n) {
    flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
};
flatpickr.setDefaults = function (config) {
    flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
};
flatpickr.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({});
flatpickr.formatDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateFormatter)({});
flatpickr.compareDates = _utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates;
if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
    jQuery.fn.flatpickr = function (config) {
        return _flatpickr(this, config);
    };
}
Date.prototype.fp_incr = function (days) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
};
if (typeof window !== "undefined") {
    window.flatpickr = flatpickr;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (flatpickr);


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/l10n/default.js":
/*!*********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/l10n/default.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   english: () => (/* binding */ english)
/* harmony export */ });
var english = {
    weekdays: {
        shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        longhand: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        longhand: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
    },
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    firstDayOfWeek: 0,
    ordinal: function (nth) {
        var s = nth % 100;
        if (s > 3 && s < 21)
            return "th";
        switch (s % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    },
    rangeSeparator: " to ",
    weekAbbreviation: "Wk",
    scrollTitle: "Scroll to increment",
    toggleTitle: "Click to toggle",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Year",
    monthAriaLabel: "Month",
    hourAriaLabel: "Hour",
    minuteAriaLabel: "Minute",
    time_24hr: false,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (english);


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/types/options.js":
/*!**********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/types/options.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HOOKS: () => (/* binding */ HOOKS),
/* harmony export */   defaults: () => (/* binding */ defaults)
/* harmony export */ });
var HOOKS = [
    "onChange",
    "onClose",
    "onDayCreate",
    "onDestroy",
    "onKeyDown",
    "onMonthChange",
    "onOpen",
    "onParseConfig",
    "onReady",
    "onValueUpdate",
    "onYearChange",
    "onPreCalendarPosition",
];
var defaults = {
    _disable: [],
    allowInput: false,
    allowInvalidPreload: false,
    altFormat: "F j, Y",
    altInput: false,
    altInputClass: "form-control input",
    animate: typeof window === "object" &&
        window.navigator.userAgent.indexOf("MSIE") === -1,
    ariaDateFormat: "F j, Y",
    autoFillDefaultTime: true,
    clickOpens: true,
    closeOnSelect: true,
    conjunction: ", ",
    dateFormat: "Y-m-d",
    defaultHour: 12,
    defaultMinute: 0,
    defaultSeconds: 0,
    disable: [],
    disableMobile: false,
    enableSeconds: false,
    enableTime: false,
    errorHandler: function (err) {
        return typeof console !== "undefined" && console.warn(err);
    },
    getWeek: function (givenDate) {
        var date = new Date(givenDate.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        var week1 = new Date(date.getFullYear(), 0, 4);
        return (1 +
            Math.round(((date.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7));
    },
    hourIncrement: 1,
    ignoredFocusElements: [],
    inline: false,
    locale: "default",
    minuteIncrement: 5,
    mode: "single",
    monthSelectorType: "dropdown",
    nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
    noCalendar: false,
    now: new Date(),
    onChange: [],
    onClose: [],
    onDayCreate: [],
    onDestroy: [],
    onKeyDown: [],
    onMonthChange: [],
    onOpen: [],
    onParseConfig: [],
    onReady: [],
    onValueUpdate: [],
    onYearChange: [],
    onPreCalendarPosition: [],
    plugins: [],
    position: "auto",
    positionElement: undefined,
    prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
    shorthandCurrentMonth: false,
    showMonths: 1,
    static: false,
    time_24hr: false,
    weekNumbers: false,
    wrap: false,
};


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/dates.js":
/*!********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/dates.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateSecondsSinceMidnight: () => (/* binding */ calculateSecondsSinceMidnight),
/* harmony export */   compareDates: () => (/* binding */ compareDates),
/* harmony export */   compareTimes: () => (/* binding */ compareTimes),
/* harmony export */   createDateFormatter: () => (/* binding */ createDateFormatter),
/* harmony export */   createDateParser: () => (/* binding */ createDateParser),
/* harmony export */   duration: () => (/* binding */ duration),
/* harmony export */   getDefaultHours: () => (/* binding */ getDefaultHours),
/* harmony export */   isBetween: () => (/* binding */ isBetween),
/* harmony export */   parseSeconds: () => (/* binding */ parseSeconds)
/* harmony export */ });
/* harmony import */ var _formatting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formatting */ "./node_modules/flatpickr/dist/esm/utils/formatting.js");
/* harmony import */ var _types_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/options */ "./node_modules/flatpickr/dist/esm/types/options.js");
/* harmony import */ var _l10n_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../l10n/default */ "./node_modules/flatpickr/dist/esm/l10n/default.js");



var createDateFormatter = function (_a) {
    var _b = _a.config, config = _b === void 0 ? _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? _l10n_default__WEBPACK_IMPORTED_MODULE_2__.english : _c, _d = _a.isMobile, isMobile = _d === void 0 ? false : _d;
    return function (dateObj, frmt, overrideLocale) {
        var locale = overrideLocale || l10n;
        if (config.formatDate !== undefined && !isMobile) {
            return config.formatDate(dateObj, frmt, locale);
        }
        return frmt
            .split("")
            .map(function (c, i, arr) {
            return _formatting__WEBPACK_IMPORTED_MODULE_0__.formats[c] && arr[i - 1] !== "\\"
                ? _formatting__WEBPACK_IMPORTED_MODULE_0__.formats[c](dateObj, locale, config)
                : c !== "\\"
                    ? c
                    : "";
        })
            .join("");
    };
};
var createDateParser = function (_a) {
    var _b = _a.config, config = _b === void 0 ? _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? _l10n_default__WEBPACK_IMPORTED_MODULE_2__.english : _c;
    return function (date, givenFormat, timeless, customLocale) {
        if (date !== 0 && !date)
            return undefined;
        var locale = customLocale || l10n;
        var parsedDate;
        var dateOrig = date;
        if (date instanceof Date)
            parsedDate = new Date(date.getTime());
        else if (typeof date !== "string" &&
            date.toFixed !== undefined)
            parsedDate = new Date(date);
        else if (typeof date === "string") {
            var format = givenFormat || (config || _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults).dateFormat;
            var datestr = String(date).trim();
            if (datestr === "today") {
                parsedDate = new Date();
                timeless = true;
            }
            else if (config && config.parseDate) {
                parsedDate = config.parseDate(date, format);
            }
            else if (/Z$/.test(datestr) ||
                /GMT$/.test(datestr)) {
                parsedDate = new Date(date);
            }
            else {
                var matched = void 0, ops = [];
                for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
                    var token = format[i];
                    var isBackSlash = token === "\\";
                    var escaped = format[i - 1] === "\\" || isBackSlash;
                    if (_formatting__WEBPACK_IMPORTED_MODULE_0__.tokenRegex[token] && !escaped) {
                        regexStr += _formatting__WEBPACK_IMPORTED_MODULE_0__.tokenRegex[token];
                        var match = new RegExp(regexStr).exec(date);
                        if (match && (matched = true)) {
                            ops[token !== "Y" ? "push" : "unshift"]({
                                fn: _formatting__WEBPACK_IMPORTED_MODULE_0__.revFormat[token],
                                val: match[++matchIndex],
                            });
                        }
                    }
                    else if (!isBackSlash)
                        regexStr += ".";
                }
                parsedDate =
                    !config || !config.noCalendar
                        ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                        : new Date(new Date().setHours(0, 0, 0, 0));
                ops.forEach(function (_a) {
                    var fn = _a.fn, val = _a.val;
                    return (parsedDate = fn(parsedDate, val, locale) || parsedDate);
                });
                parsedDate = matched ? parsedDate : undefined;
            }
        }
        if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
            config.errorHandler(new Error("Invalid date provided: " + dateOrig));
            return undefined;
        }
        if (timeless === true)
            parsedDate.setHours(0, 0, 0, 0);
        return parsedDate;
    };
};
function compareDates(date1, date2, timeless) {
    if (timeless === void 0) { timeless = true; }
    if (timeless !== false) {
        return (new Date(date1.getTime()).setHours(0, 0, 0, 0) -
            new Date(date2.getTime()).setHours(0, 0, 0, 0));
    }
    return date1.getTime() - date2.getTime();
}
function compareTimes(date1, date2) {
    return (3600 * (date1.getHours() - date2.getHours()) +
        60 * (date1.getMinutes() - date2.getMinutes()) +
        date1.getSeconds() -
        date2.getSeconds());
}
var isBetween = function (ts, ts1, ts2) {
    return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};
var calculateSecondsSinceMidnight = function (hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
};
var parseSeconds = function (secondsSinceMidnight) {
    var hours = Math.floor(secondsSinceMidnight / 3600), minutes = (secondsSinceMidnight - hours * 3600) / 60;
    return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
};
var duration = {
    DAY: 86400000,
};
function getDefaultHours(config) {
    var hours = config.defaultHour;
    var minutes = config.defaultMinute;
    var seconds = config.defaultSeconds;
    if (config.minDate !== undefined) {
        var minHour = config.minDate.getHours();
        var minMinutes = config.minDate.getMinutes();
        var minSeconds = config.minDate.getSeconds();
        if (hours < minHour) {
            hours = minHour;
        }
        if (hours === minHour && minutes < minMinutes) {
            minutes = minMinutes;
        }
        if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
            seconds = config.minDate.getSeconds();
    }
    if (config.maxDate !== undefined) {
        var maxHr = config.maxDate.getHours();
        var maxMinutes = config.maxDate.getMinutes();
        hours = Math.min(hours, maxHr);
        if (hours === maxHr)
            minutes = Math.min(maxMinutes, minutes);
        if (hours === maxHr && minutes === maxMinutes)
            seconds = config.maxDate.getSeconds();
    }
    return { hours: hours, minutes: minutes, seconds: seconds };
}


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/dom.js":
/*!******************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/dom.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearNode: () => (/* binding */ clearNode),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   createNumberInput: () => (/* binding */ createNumberInput),
/* harmony export */   findParent: () => (/* binding */ findParent),
/* harmony export */   getEventTarget: () => (/* binding */ getEventTarget),
/* harmony export */   toggleClass: () => (/* binding */ toggleClass)
/* harmony export */ });
function toggleClass(elem, className, bool) {
    if (bool === true)
        return elem.classList.add(className);
    elem.classList.remove(className);
}
function createElement(tag, className, content) {
    var e = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e.className = className;
    if (content !== undefined)
        e.textContent = content;
    return e;
}
function clearNode(node) {
    while (node.firstChild)
        node.removeChild(node.firstChild);
}
function findParent(node, condition) {
    if (condition(node))
        return node;
    else if (node.parentNode)
        return findParent(node.parentNode, condition);
    return undefined;
}
function createNumberInput(inputClassName, opts) {
    var wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
    if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
        numInput.type = "number";
    }
    else {
        numInput.type = "text";
        numInput.pattern = "\\d*";
    }
    if (opts !== undefined)
        for (var key in opts)
            numInput.setAttribute(key, opts[key]);
    wrapper.appendChild(numInput);
    wrapper.appendChild(arrowUp);
    wrapper.appendChild(arrowDown);
    return wrapper;
}
function getEventTarget(event) {
    try {
        if (typeof event.composedPath === "function") {
            var path = event.composedPath();
            return path[0];
        }
        return event.target;
    }
    catch (error) {
        return event.target;
    }
}


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/formatting.js":
/*!*************************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/formatting.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formats: () => (/* binding */ formats),
/* harmony export */   monthToStr: () => (/* binding */ monthToStr),
/* harmony export */   revFormat: () => (/* binding */ revFormat),
/* harmony export */   tokenRegex: () => (/* binding */ tokenRegex)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/flatpickr/dist/esm/utils/index.js");

var doNothing = function () { return undefined; };
var monthToStr = function (monthNumber, shorthand, locale) { return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber]; };
var revFormat = {
    D: doNothing,
    F: function (dateObj, monthName, locale) {
        dateObj.setMonth(locale.months.longhand.indexOf(monthName));
    },
    G: function (dateObj, hour) {
        dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    H: function (dateObj, hour) {
        dateObj.setHours(parseFloat(hour));
    },
    J: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    K: function (dateObj, amPM, locale) {
        dateObj.setHours((dateObj.getHours() % 12) +
            12 * (0,_utils__WEBPACK_IMPORTED_MODULE_0__.int)(new RegExp(locale.amPM[1], "i").test(amPM)));
    },
    M: function (dateObj, shortMonth, locale) {
        dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
    },
    S: function (dateObj, seconds) {
        dateObj.setSeconds(parseFloat(seconds));
    },
    U: function (_, unixSeconds) { return new Date(parseFloat(unixSeconds) * 1000); },
    W: function (dateObj, weekNum, locale) {
        var weekNumber = parseInt(weekNum);
        var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
        date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
        return date;
    },
    Y: function (dateObj, year) {
        dateObj.setFullYear(parseFloat(year));
    },
    Z: function (_, ISODate) { return new Date(ISODate); },
    d: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    h: function (dateObj, hour) {
        dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    i: function (dateObj, minutes) {
        dateObj.setMinutes(parseFloat(minutes));
    },
    j: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    l: doNothing,
    m: function (dateObj, month) {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    n: function (dateObj, month) {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    s: function (dateObj, seconds) {
        dateObj.setSeconds(parseFloat(seconds));
    },
    u: function (_, unixMillSeconds) {
        return new Date(parseFloat(unixMillSeconds));
    },
    w: doNothing,
    y: function (dateObj, year) {
        dateObj.setFullYear(2000 + parseFloat(year));
    },
};
var tokenRegex = {
    D: "",
    F: "",
    G: "(\\d\\d|\\d)",
    H: "(\\d\\d|\\d)",
    J: "(\\d\\d|\\d)\\w+",
    K: "",
    M: "",
    S: "(\\d\\d|\\d)",
    U: "(.+)",
    W: "(\\d\\d|\\d)",
    Y: "(\\d{4})",
    Z: "(.+)",
    d: "(\\d\\d|\\d)",
    h: "(\\d\\d|\\d)",
    i: "(\\d\\d|\\d)",
    j: "(\\d\\d|\\d)",
    l: "",
    m: "(\\d\\d|\\d)",
    n: "(\\d\\d|\\d)",
    s: "(\\d\\d|\\d)",
    u: "(.+)",
    w: "(\\d\\d|\\d)",
    y: "(\\d{2})",
};
var formats = {
    Z: function (date) { return date.toISOString(); },
    D: function (date, locale, options) {
        return locale.weekdays.shorthand[formats.w(date, locale, options)];
    },
    F: function (date, locale, options) {
        return monthToStr(formats.n(date, locale, options) - 1, false, locale);
    },
    G: function (date, locale, options) {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(formats.h(date, locale, options));
    },
    H: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getHours()); },
    J: function (date, locale) {
        return locale.ordinal !== undefined
            ? date.getDate() + locale.ordinal(date.getDate())
            : date.getDate();
    },
    K: function (date, locale) { return locale.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_0__.int)(date.getHours() > 11)]; },
    M: function (date, locale) {
        return monthToStr(date.getMonth(), true, locale);
    },
    S: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getSeconds()); },
    U: function (date) { return date.getTime() / 1000; },
    W: function (date, _, options) {
        return options.getWeek(date);
    },
    Y: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getFullYear(), 4); },
    d: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getDate()); },
    h: function (date) { return (date.getHours() % 12 ? date.getHours() % 12 : 12); },
    i: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getMinutes()); },
    j: function (date) { return date.getDate(); },
    l: function (date, locale) {
        return locale.weekdays.longhand[date.getDay()];
    },
    m: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getMonth() + 1); },
    n: function (date) { return date.getMonth() + 1; },
    s: function (date) { return date.getSeconds(); },
    u: function (date) { return date.getTime(); },
    w: function (date) { return date.getDay(); },
    y: function (date) { return String(date.getFullYear()).substring(2); },
};


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/index.js":
/*!********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayify: () => (/* binding */ arrayify),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   int: () => (/* binding */ int),
/* harmony export */   pad: () => (/* binding */ pad)
/* harmony export */ });
var pad = function (number, length) {
    if (length === void 0) { length = 2; }
    return ("000" + number).slice(length * -1);
};
var int = function (bool) { return (bool === true ? 1 : 0); };
function debounce(fn, wait) {
    var t;
    return function () {
        var _this = this;
        var args = arguments;
        clearTimeout(t);
        t = setTimeout(function () { return fn.apply(_this, args); }, wait);
    };
}
var arrayify = function (obj) {
    return obj instanceof Array ? obj : [obj];
};


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/polyfills.js":
/*!************************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/polyfills.js ***!
  \************************************************************/
/***/ (() => {

"use strict";

if (typeof Object.assign !== "function") {
    Object.assign = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!target) {
            throw TypeError("Cannot convert undefined or null to object");
        }
        var _loop_1 = function (source) {
            if (source) {
                Object.keys(source).forEach(function (key) { return (target[key] = source[key]); });
            }
        };
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var source = args_1[_a];
            _loop_1(source);
        }
        return target;
    };
}


/***/ }),

/***/ "./node_modules/flatpickr/dist/l10n/ru.js":
/*!************************************************!*\
  !*** ./node_modules/flatpickr/dist/l10n/ru.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
   true ? factory(exports) :
  0;
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Russian = {
      weekdays: {
          shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          longhand: [
              "Воскресенье",
              "Понедельник",
              "Вторник",
              "Среда",
              "Четверг",
              "Пятница",
              "Суббота",
          ],
      },
      months: {
          shorthand: [
              "Янв",
              "Фев",
              "Март",
              "Апр",
              "Май",
              "Июнь",
              "Июль",
              "Авг",
              "Сен",
              "Окт",
              "Ноя",
              "Дек",
          ],
          longhand: [
              "Январь",
              "Февраль",
              "Март",
              "Апрель",
              "Май",
              "Июнь",
              "Июль",
              "Август",
              "Сентябрь",
              "Октябрь",
              "Ноябрь",
              "Декабрь",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () {
          return "";
      },
      rangeSeparator: " — ",
      weekAbbreviation: "Нед.",
      scrollTitle: "Прокрутите для увеличения",
      toggleTitle: "Нажмите для переключения",
      amPM: ["ДП", "ПП"],
      yearAriaLabel: "Год",
      time_24hr: true,
  };
  fp.l10ns.ru = Russian;
  var ru = fp.l10ns;

  exports.Russian = Russian;
  exports.default = ru;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ "./node_modules/jquery-custom-select/jquery.custom-select.js":
/*!*******************************************************************!*\
  !*** ./node_modules/jquery-custom-select/jquery.custom-select.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);


/*!
 * Custom Select jQuery Plugin
 */

const CustomSelect = (($) => {

  const defaults = {
    block: 'custom-select',
    hideCallback: false,
    includeValue: false,
    keyboard: true,
    modifier: false,
    placeholder: false,
    search: false,
    showCallback: false,
    transition: 0
  };

  class CustomSelect {

    /**
     * Custom Select
     *
     * @param {Element} select Original `<select>` DOM element to customize.
     * @param {(Object|string)=} options Settings object or method name.
     * @param {string=} options.block Custom select BEM block name.
     * @param {Function=} options.hideCallback Fires after dropdown closes.
     * @param {boolean=} options.includeValue Adds chosen value option to
     *     dropdown. If enabled also cancels dropdown options rerender.
     * @param {boolean=} options.keyboard Enables keyboard control.
     * @param {string=} options.modifier Custom select block BEM modifier.
     * @param {string=} options.placeholder Placeholder hint, can be an HTML
     *     string (appears only if there is no explicitly selected options).
     * @param {boolean=} options.search Adds input to filter options.
     * @param {Function=} options.showCallback Fires after dropdown opens.
     * @param {(number|string)=} options.transition jQuery slideUp/Down param.
     */
    constructor(select, options) {
      this._$select = $(select);
      this._options = {
        ...defaults,
        ...typeof options === 'object' ? options : {}
      };

      // Modifiers
      this._activeModifier = `${this._options.block}--active`;
      this._dropupModifier = `${this._options.block}--dropup`;
      this._optionSelectedModifier = `${this._options.block}__option--selected`;

      // Event handlers that can be removed
      this._keydown = this._keydown.bind(this);
      this._dropup = this._dropup.bind(this);
      this._outside = this._outside.bind(this);

      this._init();
    }

    /**
     * Resets custom select options.
     *
     * @public
     */
    reset() {
      this._$dropdown.hide().empty();
      this._$value.off('click');

      this._fill();
    }

    /**
     * Renders initial state of custom select & sets
     * options click event listeners.
     *
     * @private
     */
    _init() {
      this._$element = $(
        `<div class="${this._options.block}">
           <button class="${this._options.block}__option ${this._options.block}__option--value" type="button"></button>
           <div class="${this._options.block}__dropdown" style="display: none;"></div>
         </div>`
      );

      this._$select
        .hide()
        .after(this._$element);

      if (this._options.modifier) {
        this._$element.addClass(this._options.modifier);
      }

      this._$value = this._$element.find(`.${this._options.block}__option--value`);
      this._$dropdown = this._$element.find(`.${this._options.block}__dropdown`);

      this._fill();
    }

    /**
     * Renders custom select options by original
     * select element options.
     *
     * @private
     */
    _fill() {
      this._$values = this._$select.find('option');
      this._values = [];

      let placeholder = this._options.placeholder;

      $.each(this._$values, (i, option) => {
        const el = $(option).text().trim();
        this._values.push(el);
      });

      if (placeholder) {
        // Check explicitly selected option
        if (this._$select.find('[selected]').length) {
          placeholder = false;
        } else {
          this._$value.html(placeholder);
          // Set select value to null
          this._$select.prop('selectedIndex', -1);
        }
      }

      $.each(this._values, (i, el) => {
        const cssClass = this._$values.eq(i).attr('class');
        const $option = $(
          `<button class="${this._options.block}__option" type="button">${el}</button>`
        );
        const $selected = this._$select.find(':selected');

        if (this._$values.eq(i).attr('disabled')) {
          $option.prop('disabled', true);
        }

        if ((!$selected.length && i === 0) || el === $selected.text().trim()) {
          if (!placeholder) {
            this._$value
              .text(el)
              .removeClass(this._$value.data('class')).removeData('class')
              .addClass(cssClass).data('class', cssClass);
          }

          if (this._options.includeValue || placeholder) {
            $option.addClass(cssClass);
            $option.toggleClass(this._optionSelectedModifier, this._$values.eq(i).is('[selected]'));
            this._$dropdown.append($option);
          }
        } else {
          $option.addClass(cssClass);
          this._$dropdown.append($option);
        }
      });

      this._$options = this._$dropdown.find(`.${this._options.block}__option`);

      if (this._options.search) {
        this._search();
      }

      this._$value.one('click', event => {
        this._show(event);
      });

      this._$value.prop('disabled', !this._$options.length);

      this._$options.on('click', event => {
        this._select(event);
      });
    }

    /**
     * Shows custom select dropdown & sets outside
     * click listener to hide.
     *
     * @param {Object} event Value click jQuery event.
     * @private
     */
    _show(event) {
      event.preventDefault();

      this._dropup();
      $(window).on('resize scroll', this._dropup);

      this._$element.addClass(this._activeModifier);

      this._$dropdown.slideDown(this._options.transition, () => {
        if (this._options.search) {
          this._$input.focus();

          if (this._options.includeValue) {
            this._scroll();
          }
        }

        // Open callback
        if (typeof this._options.showCallback === 'function') {
          this._options.showCallback.call(this._$element[0]);
        }
      });

      setTimeout(() => {
        $(document).on('touchstart click', this._outside);
      }, 0);

      this._$value.one('click', event => {
        event.preventDefault();

        this._hide();
      });

      if (this._options.keyboard) {
        this._options.index = -1;
        $(window).on('keydown', this._keydown);
      }
    }

    /**
     * Hides custom select dropdown & resets events
     * listeners to initial.
     *
     * @private
     */
    _hide() {
      if (this._options.search) {
        this._$input.val('').blur();
        this._$options.show();
        this._$wrap.scrollTop(0);
      }

      this._$dropdown.slideUp(this._options.transition, () => {
        this._$element
          .removeClass(this._activeModifier)
          .removeClass(this._dropupModifier);

        // Close callback
        if (typeof this._options.hideCallback === 'function') {
          this._options.hideCallback.call(this._$element[0]);
        }

        this._$value
          .off('click')
          .one('click', event => {
            this._show(event);
          });
        $(document).off('touchstart click', this._outside);
        $(window).off('resize scroll', this._dropup);
      });

      if (this._options.keyboard) {
        this._$options.blur();
        $(window).off('keydown', this._keydown);
      }
    }

    /**
     * Centers chosen option in scrollable element
     * of dropdown.
     *
     * @private
     */
    _scroll() {
      $.each(this._$options, (i, option) => {
        const $option = $(option);

        if ($option.text() === this._$value.text()) {
          const top = $option.position().top;
          const height = this._$wrap.outerHeight();
          const center = height / 2 - $option.outerHeight() / 2;

          if (top > center) {
            this._$wrap.scrollTop(top - center);
          }

          return false;
        }
      });
    }

    /**
     * Changes value of custom select & `<select>`
     * by chosen option.
     *
     * @param {Object} event Option click jQuery event.
     * @private
     */
    _select(event) {
      event.preventDefault();

      const choice = $(event.currentTarget).text().trim();
      const values = [...this._values];

      this._$value
        .text(choice)
        .removeClass(this._$value.data('class'));
      this._$values.prop('selected', false);

      $.each(values, (i, el) => {
        if (!this._options.includeValue && el === choice) {
          values.splice(i, 1);
        }

        $.each(this._$values, (i, option) => {
          const $option = $(option);
          if ($option.text().trim() === choice) {
            const cssClass = $option.attr('class');

            $option.prop('selected', true);
            this._$value.addClass(cssClass).data('class', cssClass);
          }
        });
      });

      this._hide();

      if (!this._options.includeValue) {
        // Update dropdown options content
        if (this._$options.length > values.length) {
          const last = this._$options.eq(values.length);

          last.remove();
          this._$options = this._$options.not(last);

          if (!this._$options.length) {
            this._$value.prop('disabled', true);
          }
        }

        $.each(this._$options, (i, option) => {
          const $option = $(option);
          $option.text(values[i]);

          // Reset option class
          $option.attr('class', `${this._options.block}__option`);

          $.each(this._$values, function () {
            const $this = $(this);
            if ($this.text().trim() === values[i]) {
              $option.addClass($this.attr('class'));
              $option.prop('disabled', $this.prop('disabled'));
            }
          });
        });
      } else {
        // Select chosen option
        this._$options.removeClass(this._optionSelectedModifier);

        $.each(this._$options, (i, option) => {
          const $option = $(option);

          if ($option.text().trim() === choice) {
            $option.addClass(this._optionSelectedModifier);

            return false;
          }
        });
      }

      if (typeof event.originalEvent !== 'undefined') {
        this._$select.trigger('change');
      }
    }

    /**
     * Wraps options by wrap element, adds search
     * input to dropdown.
     *
     * @private
     */
    _search() {
      this._$input = $(`<input class="${this._options.block}__input" autocomplete="off">`);
      this._$dropdown.prepend(this._$input);

      // Add scrollable wrap
      this._$options.wrapAll(`<div class="${this._options.block}__option-wrap"></div>`);
      this._$wrap = this._$element.find(`.${this._options.block}__option-wrap`);

      this._$input.on('focus', () => {
        this._options.index = -1;
      });

      this._$input.on('keyup', () => {
        const query = this._$input.val().trim();

        if (query.length) {
          this._$wrap.scrollTop(0);

          setTimeout(() => {
            if (query === this._$input.val().trim()) {
              $.each(this._$options, (i, option) => {
                const $option = $(option);
                const text = $option.text().trim().toLowerCase();
                const match = text.indexOf(query.toLowerCase()) !== -1;

                $option.toggle(match);
              });
            }
          }, 300);
        } else {
          this._$options.show();
        }
      });
    }

    /**
     * Toggles custom select dropup modifier based
     * on space for dropdown below.
     *
     * @private
     */
    _dropup() {
      const bottom = this._$element[0].getBoundingClientRect().bottom;
      const up = $(window).height() - bottom < this._$dropdown.height();

      this._$element.toggleClass(this._dropupModifier, up);
    }

    /**
     * Hides dropdown if target of event (e.g. click
     * on `$window`) is not custom select.
     *
     * @param {Object} event Outside "click" jQuery event.
     * @private
     */
    _outside(event) {
      const $target = $(event.target);
      if (!$target.parents().is(this._$element) && !$target.is(this._$element)) {
        this._hide();
      }
    }

    /**
     * Controls navigation from keyboard by custom
     * select options.
     *
     * @param {Object} event Keydown jQuery event.
     * @private
     */
    _keydown(event) {
      const $visible = this._$options.filter(':visible').not('[disabled]');

      switch (event.which) {
        // Down
        case 40:
          event.preventDefault();

          const next = $visible.eq(this._options.index + 1).length;
          if (next) {
            this._options.index += 1;
          } else {
            this._options.index = 0;
          }

          $visible.eq(this._options.index).focus();
          break;

        // Up
        case 38:
          event.preventDefault();

          const prev = $visible.eq(this._options.index - 1).length;
          if (prev && this._options.index - 1 >= 0) {
            this._options.index -= 1;
          } else {
            this._options.index = $visible.length - 1;
          }

          $visible.eq(this._options.index).focus();
          break;

        // Enter
        case 13:

        // Space
        case 32:
          if (!this._$input || !this._$input.is(':focus')) {
            event.preventDefault();

            const $option = this._$options.add(this._$value).filter(':focus');
            $option.trigger('click');

            if (!$option.is(this._$value)) {
              this._$select.trigger('change');
            }
            this._$value.focus();
          }
          break;

        // Esc
        case 27:
          event.preventDefault();

          this._hide();
          this._$value.focus();
          break;

        default:
          break;
      }
    }

    /**
     * Creates jQuery plugin function.
     *
     * @param {(Object|string)=} config Options or method.
     * @returns {Function} jQuery plugin.
     */
    static _jQueryPlugin(config) {
      return this.each(function () {
        const $this = $(this);
        let data = $this.data('custom-select');

        if (!data) {
          if (typeof config !== 'string') {
            data = new CustomSelect(this, config);
            $this.data('custom-select', data);
          }
        } else {
          if (config === 'reset') {
            data.reset();
          }
        }
      });
    }
  }

  $.fn['customSelect'] = CustomSelect._jQueryPlugin;
  $.fn['customSelect'].noConflict = () => $.fn['customSelect'];

  return CustomSelect;

})((jquery__WEBPACK_IMPORTED_MODULE_0___default()));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CustomSelect);


/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.mjs":
/*!***************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ api)
/* harmony export */ });
/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */




/***/ }),

/***/ "./node_modules/lenis/dist/lenis.mjs":
/*!*******************************************!*\
  !*** ./node_modules/lenis/dist/lenis.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lenis)
/* harmony export */ });
// package.json
var version = "1.2.3";

// packages/core/src/maths.ts
function clamp(min, input, max) {
  return Math.max(min, Math.min(input, max));
}
function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}
function damp(x, y, lambda, deltaTime) {
  return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
}
function modulo(n, d) {
  return (n % d + d) % d;
}

// packages/core/src/animate.ts
var Animate = class {
  isRunning = false;
  value = 0;
  from = 0;
  to = 0;
  currentTime = 0;
  // These are instanciated in the fromTo method
  lerp;
  duration;
  easing;
  onUpdate;
  /**
   * Advance the animation by the given delta time
   *
   * @param deltaTime - The time in seconds to advance the animation
   */
  advance(deltaTime) {
    if (!this.isRunning) return;
    let completed = false;
    if (this.duration && this.easing) {
      this.currentTime += deltaTime;
      const linearProgress = clamp(0, this.currentTime / this.duration, 1);
      completed = linearProgress >= 1;
      const easedProgress = completed ? 1 : this.easing(linearProgress);
      this.value = this.from + (this.to - this.from) * easedProgress;
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
      if (Math.round(this.value) === this.to) {
        this.value = this.to;
        completed = true;
      }
    } else {
      this.value = this.to;
      completed = true;
    }
    if (completed) {
      this.stop();
    }
    this.onUpdate?.(this.value, completed);
  }
  /** Stop the animation */
  stop() {
    this.isRunning = false;
  }
  /**
   * Set up the animation from a starting value to an ending value
   * with optional parameters for lerping, duration, easing, and onUpdate callback
   *
   * @param from - The starting value
   * @param to - The ending value
   * @param options - Options for the animation
   */
  fromTo(from, to, { lerp: lerp2, duration, easing, onStart, onUpdate }) {
    this.from = this.value = from;
    this.to = to;
    this.lerp = lerp2;
    this.duration = duration;
    this.easing = easing;
    this.currentTime = 0;
    this.isRunning = true;
    onStart?.();
    this.onUpdate = onUpdate;
  }
};

// packages/core/src/debounce.ts
function debounce(callback, delay) {
  let timer;
  return function(...args) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = void 0;
      callback.apply(context, args);
    }, delay);
  };
}

// packages/core/src/dimensions.ts
var Dimensions = class {
  constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
    this.wrapper = wrapper;
    this.content = content;
    if (autoResize) {
      this.debouncedResize = debounce(this.resize, debounceValue);
      if (this.wrapper instanceof Window) {
        window.addEventListener("resize", this.debouncedResize, false);
      } else {
        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
        this.wrapperResizeObserver.observe(this.wrapper);
      }
      this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
      this.contentResizeObserver.observe(this.content);
    }
    this.resize();
  }
  width = 0;
  height = 0;
  scrollHeight = 0;
  scrollWidth = 0;
  // These are instanciated in the constructor as they need information from the options
  debouncedResize;
  wrapperResizeObserver;
  contentResizeObserver;
  destroy() {
    this.wrapperResizeObserver?.disconnect();
    this.contentResizeObserver?.disconnect();
    if (this.wrapper === window && this.debouncedResize) {
      window.removeEventListener("resize", this.debouncedResize, false);
    }
  }
  resize = () => {
    this.onWrapperResize();
    this.onContentResize();
  };
  onWrapperResize = () => {
    if (this.wrapper instanceof Window) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    } else {
      this.width = this.wrapper.clientWidth;
      this.height = this.wrapper.clientHeight;
    }
  };
  onContentResize = () => {
    if (this.wrapper instanceof Window) {
      this.scrollHeight = this.content.scrollHeight;
      this.scrollWidth = this.content.scrollWidth;
    } else {
      this.scrollHeight = this.wrapper.scrollHeight;
      this.scrollWidth = this.wrapper.scrollWidth;
    }
  };
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height
    };
  }
};

// packages/core/src/emitter.ts
var Emitter = class {
  events = {};
  /**
   * Emit an event with the given data
   * @param event Event name
   * @param args Data to pass to the event handlers
   */
  emit(event, ...args) {
    let callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i]?.(...args);
    }
  }
  /**
   * Add a callback to the event
   * @param event Event name
   * @param cb Callback function
   * @returns Unsubscribe function
   */
  on(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb]);
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  }
  /**
   * Remove a callback from the event
   * @param event Event name
   * @param callback Callback function
   */
  off(event, callback) {
    this.events[event] = this.events[event]?.filter((i) => callback !== i);
  }
  /**
   * Remove all event listeners and clean up
   */
  destroy() {
    this.events = {};
  }
};

// packages/core/src/virtual-scroll.ts
var LINE_HEIGHT = 100 / 6;
var listenerOptions = { passive: false };
var VirtualScroll = class {
  constructor(element, options = { wheelMultiplier: 1, touchMultiplier: 1 }) {
    this.element = element;
    this.options = options;
    window.addEventListener("resize", this.onWindowResize, false);
    this.onWindowResize();
    this.element.addEventListener("wheel", this.onWheel, listenerOptions);
    this.element.addEventListener(
      "touchstart",
      this.onTouchStart,
      listenerOptions
    );
    this.element.addEventListener(
      "touchmove",
      this.onTouchMove,
      listenerOptions
    );
    this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  touchStart = {
    x: 0,
    y: 0
  };
  lastDelta = {
    x: 0,
    y: 0
  };
  window = {
    width: 0,
    height: 0
  };
  emitter = new Emitter();
  /**
   * Add an event listener for the given event and callback
   *
   * @param event Event name
   * @param callback Callback function
   */
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  /** Remove all event listeners and clean up */
  destroy() {
    this.emitter.destroy();
    window.removeEventListener("resize", this.onWindowResize, false);
    this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
    this.element.removeEventListener(
      "touchstart",
      this.onTouchStart,
      listenerOptions
    );
    this.element.removeEventListener(
      "touchmove",
      this.onTouchMove,
      listenerOptions
    );
    this.element.removeEventListener(
      "touchend",
      this.onTouchEnd,
      listenerOptions
    );
  }
  /**
   * Event handler for 'touchstart' event
   *
   * @param event Touch event
   */
  onTouchStart = (event) => {
    const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
    this.touchStart.x = clientX;
    this.touchStart.y = clientY;
    this.lastDelta = {
      x: 0,
      y: 0
    };
    this.emitter.emit("scroll", {
      deltaX: 0,
      deltaY: 0,
      event
    });
  };
  /** Event handler for 'touchmove' event */
  onTouchMove = (event) => {
    const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
    const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
    const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
    this.touchStart.x = clientX;
    this.touchStart.y = clientY;
    this.lastDelta = {
      x: deltaX,
      y: deltaY
    };
    this.emitter.emit("scroll", {
      deltaX,
      deltaY,
      event
    });
  };
  onTouchEnd = (event) => {
    this.emitter.emit("scroll", {
      deltaX: this.lastDelta.x,
      deltaY: this.lastDelta.y,
      event
    });
  };
  /** Event handler for 'wheel' event */
  onWheel = (event) => {
    let { deltaX, deltaY, deltaMode } = event;
    const multiplierX = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.width : 1;
    const multiplierY = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.height : 1;
    deltaX *= multiplierX;
    deltaY *= multiplierY;
    deltaX *= this.options.wheelMultiplier;
    deltaY *= this.options.wheelMultiplier;
    this.emitter.emit("scroll", { deltaX, deltaY, event });
  };
  onWindowResize = () => {
    this.window = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
};

// packages/core/src/lenis.ts
var Lenis = class {
  _isScrolling = false;
  // true when scroll is animating
  _isStopped = false;
  // true if user should not be able to scroll - enable/disable programmatically
  _isLocked = false;
  // same as isStopped but enabled/disabled when scroll reaches target
  _preventNextNativeScrollEvent = false;
  _resetVelocityTimeout = null;
  __rafID = null;
  /**
   * Whether or not the user is touching the screen
   */
  isTouching;
  /**
   * The time in ms since the lenis instance was created
   */
  time = 0;
  /**
   * User data that will be forwarded through the scroll event
   *
   * @example
   * lenis.scrollTo(100, {
   *   userData: {
   *     foo: 'bar'
   *   }
   * })
   */
  userData = {};
  /**
   * The last velocity of the scroll
   */
  lastVelocity = 0;
  /**
   * The current velocity of the scroll
   */
  velocity = 0;
  /**
   * The direction of the scroll
   */
  direction = 0;
  /**
   * The options passed to the lenis instance
   */
  options;
  /**
   * The target scroll value
   */
  targetScroll;
  /**
   * The animated scroll value
   */
  animatedScroll;
  // These are instanciated here as they don't need information from the options
  animate = new Animate();
  emitter = new Emitter();
  // These are instanciated in the constructor as they need information from the options
  dimensions;
  // This is not private because it's used in the Snap class
  virtualScroll;
  constructor({
    wrapper = window,
    content = document.documentElement,
    eventsTarget = wrapper,
    smoothWheel = true,
    syncTouch = false,
    syncTouchLerp = 0.075,
    touchInertiaMultiplier = 35,
    duration,
    // in seconds
    easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    lerp: lerp2 = 0.1,
    infinite = false,
    orientation = "vertical",
    // vertical, horizontal
    gestureOrientation = "vertical",
    // vertical, horizontal, both
    touchMultiplier = 1,
    wheelMultiplier = 1,
    autoResize = true,
    prevent,
    virtualScroll,
    overscroll = true,
    autoRaf = false,
    anchors = false,
    __experimental__naiveDimensions = false
  } = {}) {
    window.lenisVersion = version;
    if (!wrapper || wrapper === document.documentElement) {
      wrapper = window;
    }
    this.options = {
      wrapper,
      content,
      eventsTarget,
      smoothWheel,
      syncTouch,
      syncTouchLerp,
      touchInertiaMultiplier,
      duration,
      easing,
      lerp: lerp2,
      infinite,
      gestureOrientation,
      orientation,
      touchMultiplier,
      wheelMultiplier,
      autoResize,
      prevent,
      virtualScroll,
      overscroll,
      autoRaf,
      anchors,
      __experimental__naiveDimensions
    };
    this.dimensions = new Dimensions(wrapper, content, { autoResize });
    this.updateClassName();
    this.targetScroll = this.animatedScroll = this.actualScroll;
    this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false);
    this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, {
      capture: true
    });
    if (this.options.anchors && this.options.wrapper === window) {
      this.options.wrapper.addEventListener(
        "click",
        this.onClick,
        false
      );
    }
    this.options.wrapper.addEventListener(
      "pointerdown",
      this.onPointerDown,
      false
    );
    this.virtualScroll = new VirtualScroll(eventsTarget, {
      touchMultiplier,
      wheelMultiplier
    });
    this.virtualScroll.on("scroll", this.onVirtualScroll);
    if (this.options.autoRaf) {
      this.__rafID = requestAnimationFrame(this.raf);
    }
  }
  /**
   * Destroy the lenis instance, remove all event listeners and clean up the class name
   */
  destroy() {
    this.emitter.destroy();
    this.options.wrapper.removeEventListener(
      "scroll",
      this.onNativeScroll,
      false
    );
    this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, {
      capture: true
    });
    this.options.wrapper.removeEventListener(
      "pointerdown",
      this.onPointerDown,
      false
    );
    if (this.options.anchors && this.options.wrapper === window) {
      this.options.wrapper.removeEventListener(
        "click",
        this.onClick,
        false
      );
    }
    this.virtualScroll.destroy();
    this.dimensions.destroy();
    this.cleanUpClassName();
    if (this.__rafID) {
      cancelAnimationFrame(this.__rafID);
    }
  }
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  off(event, callback) {
    return this.emitter.off(event, callback);
  }
  onScrollEnd = (e) => {
    if (!(e instanceof CustomEvent)) {
      if (this.isScrolling === "smooth" || this.isScrolling === false) {
        e.stopPropagation();
      }
    }
  };
  dispatchScrollendEvent = () => {
    this.options.wrapper.dispatchEvent(
      new CustomEvent("scrollend", {
        bubbles: this.options.wrapper === window,
        // cancelable: false,
        detail: {
          lenisScrollEnd: true
        }
      })
    );
  };
  setScroll(scroll) {
    if (this.isHorizontal) {
      this.options.wrapper.scrollTo({ left: scroll, behavior: "instant" });
    } else {
      this.options.wrapper.scrollTo({ top: scroll, behavior: "instant" });
    }
  }
  onClick = (event) => {
    const path = event.composedPath();
    const anchor = path.find(
      (node) => node instanceof HTMLAnchorElement && (node.getAttribute("href")?.startsWith("#") || node.getAttribute("href")?.startsWith("/#") || node.getAttribute("href")?.startsWith("./#"))
    );
    if (anchor) {
      const id = anchor.getAttribute("href");
      if (id) {
        const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
        this.scrollTo(`#${id.split("#")[1]}`, options);
      }
    }
  };
  onPointerDown = (event) => {
    if (event.button === 1) {
      this.reset();
    }
  };
  onVirtualScroll = (data) => {
    if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false)
      return;
    const { deltaX, deltaY, event } = data;
    this.emitter.emit("virtual-scroll", { deltaX, deltaY, event });
    if (event.ctrlKey) return;
    if (event.lenisStopPropagation) return;
    const isTouch = event.type.includes("touch");
    const isWheel = event.type.includes("wheel");
    this.isTouching = event.type === "touchstart" || event.type === "touchmove";
    const isClickOrTap = deltaX === 0 && deltaY === 0;
    const isTapToStop = this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked;
    if (isTapToStop) {
      this.reset();
      return;
    }
    const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
    if (isClickOrTap || isUnknownGesture) {
      return;
    }
    let composedPath = event.composedPath();
    composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
    const prevent = this.options.prevent;
    if (!!composedPath.find(
      (node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel"))
    ))
      return;
    if (this.isStopped || this.isLocked) {
      event.preventDefault();
      return;
    }
    const isSmooth = this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel;
    if (!isSmooth) {
      this.isScrolling = "native";
      this.animate.stop();
      event.lenisStopPropagation = true;
      return;
    }
    let delta = deltaY;
    if (this.options.gestureOrientation === "both") {
      delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    } else if (this.options.gestureOrientation === "horizontal") {
      delta = deltaX;
    }
    if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) {
      event.lenisStopPropagation = true;
    }
    event.preventDefault();
    const isSyncTouch = isTouch && this.options.syncTouch;
    const isTouchEnd = isTouch && event.type === "touchend";
    const hasTouchInertia = isTouchEnd && Math.abs(delta) > 5;
    if (hasTouchInertia) {
      delta = this.velocity * this.options.touchInertiaMultiplier;
    }
    this.scrollTo(this.targetScroll + delta, {
      programmatic: false,
      ...isSyncTouch ? {
        lerp: hasTouchInertia ? this.options.syncTouchLerp : 1
        // immediate: !hasTouchInertia,
      } : {
        lerp: this.options.lerp,
        duration: this.options.duration,
        easing: this.options.easing
      }
    });
  };
  /**
   * Force lenis to recalculate the dimensions
   */
  resize() {
    this.dimensions.resize();
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.emit();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  onNativeScroll = () => {
    if (this._resetVelocityTimeout !== null) {
      clearTimeout(this._resetVelocityTimeout);
      this._resetVelocityTimeout = null;
    }
    if (this._preventNextNativeScrollEvent) {
      this._preventNextNativeScrollEvent = false;
      return;
    }
    if (this.isScrolling === false || this.isScrolling === "native") {
      const lastScroll = this.animatedScroll;
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.lastVelocity = this.velocity;
      this.velocity = this.animatedScroll - lastScroll;
      this.direction = Math.sign(
        this.animatedScroll - lastScroll
      );
      if (!this.isStopped) {
        this.isScrolling = "native";
      }
      this.emit();
      if (this.velocity !== 0) {
        this._resetVelocityTimeout = setTimeout(() => {
          this.lastVelocity = this.velocity;
          this.velocity = 0;
          this.isScrolling = false;
          this.emit();
        }, 400);
      }
    }
  };
  reset() {
    this.isLocked = false;
    this.isScrolling = false;
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.lastVelocity = this.velocity = 0;
    this.animate.stop();
  }
  /**
   * Start lenis scroll after it has been stopped
   */
  start() {
    if (!this.isStopped) return;
    this.reset();
    this.isStopped = false;
  }
  /**
   * Stop lenis scroll
   */
  stop() {
    if (this.isStopped) return;
    this.reset();
    this.isStopped = true;
  }
  /**
   * RequestAnimationFrame for lenis
   *
   * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
   */
  raf = (time) => {
    const deltaTime = time - (this.time || time);
    this.time = time;
    this.animate.advance(deltaTime * 1e-3);
    if (this.options.autoRaf) {
      this.__rafID = requestAnimationFrame(this.raf);
    }
  };
  /**
   * Scroll to a target value
   *
   * @param target The target value to scroll to
   * @param options The options for the scroll
   *
   * @example
   * lenis.scrollTo(100, {
   *   offset: 100,
   *   duration: 1,
   *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
   *   lerp: 0.1,
   *   onStart: () => {
   *     console.log('onStart')
   *   },
   *   onComplete: () => {
   *     console.log('onComplete')
   *   },
   * })
   */
  scrollTo(target, {
    offset = 0,
    immediate = false,
    lock = false,
    duration = this.options.duration,
    easing = this.options.easing,
    lerp: lerp2 = this.options.lerp,
    onStart,
    onComplete,
    force = false,
    // scroll even if stopped
    programmatic = true,
    // called from outside of the class
    userData
  } = {}) {
    if ((this.isStopped || this.isLocked) && !force) return;
    if (typeof target === "string" && ["top", "left", "start"].includes(target)) {
      target = 0;
    } else if (typeof target === "string" && ["bottom", "right", "end"].includes(target)) {
      target = this.limit;
    } else {
      let node;
      if (typeof target === "string") {
        node = document.querySelector(target);
      } else if (target instanceof HTMLElement && target?.nodeType) {
        node = target;
      }
      if (node) {
        if (this.options.wrapper !== window) {
          const wrapperRect = this.rootElement.getBoundingClientRect();
          offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
        }
        const rect = node.getBoundingClientRect();
        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
      }
    }
    if (typeof target !== "number") return;
    target += offset;
    target = Math.round(target);
    if (this.options.infinite) {
      if (programmatic) {
        this.targetScroll = this.animatedScroll = this.scroll;
      }
    } else {
      target = clamp(0, target, this.limit);
    }
    if (target === this.targetScroll) {
      onStart?.(this);
      onComplete?.(this);
      return;
    }
    this.userData = userData ?? {};
    if (immediate) {
      this.animatedScroll = this.targetScroll = target;
      this.setScroll(this.scroll);
      this.reset();
      this.preventNextNativeScrollEvent();
      this.emit();
      onComplete?.(this);
      this.userData = {};
      requestAnimationFrame(() => {
        this.dispatchScrollendEvent();
      });
      return;
    }
    if (!programmatic) {
      this.targetScroll = target;
    }
    this.animate.fromTo(this.animatedScroll, target, {
      duration,
      easing,
      lerp: lerp2,
      onStart: () => {
        if (lock) this.isLocked = true;
        this.isScrolling = "smooth";
        onStart?.(this);
      },
      onUpdate: (value, completed) => {
        this.isScrolling = "smooth";
        this.lastVelocity = this.velocity;
        this.velocity = value - this.animatedScroll;
        this.direction = Math.sign(this.velocity);
        this.animatedScroll = value;
        this.setScroll(this.scroll);
        if (programmatic) {
          this.targetScroll = value;
        }
        if (!completed) this.emit();
        if (completed) {
          this.reset();
          this.emit();
          onComplete?.(this);
          this.userData = {};
          requestAnimationFrame(() => {
            this.dispatchScrollendEvent();
          });
          this.preventNextNativeScrollEvent();
        }
      }
    });
  }
  preventNextNativeScrollEvent() {
    this._preventNextNativeScrollEvent = true;
    requestAnimationFrame(() => {
      this._preventNextNativeScrollEvent = false;
    });
  }
  /**
   * The root element on which lenis is instanced
   */
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  /**
   * The limit which is the maximum scroll value
   */
  get limit() {
    if (this.options.__experimental__naiveDimensions) {
      if (this.isHorizontal) {
        return this.rootElement.scrollWidth - this.rootElement.clientWidth;
      } else {
        return this.rootElement.scrollHeight - this.rootElement.clientHeight;
      }
    } else {
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
  }
  /**
   * Whether or not the scroll is horizontal
   */
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  /**
   * The actual scroll value
   */
  get actualScroll() {
    const wrapper = this.options.wrapper;
    return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
  }
  /**
   * The current scroll value
   */
  get scroll() {
    return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  /**
   * The progress of the scroll relative to the limit
   */
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  /**
   * Current scroll state
   */
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(value) {
    if (this._isScrolling !== value) {
      this._isScrolling = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is stopped
   */
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(value) {
    if (this._isStopped !== value) {
      this._isStopped = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is locked
   */
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(value) {
    if (this._isLocked !== value) {
      this._isLocked = value;
      this.updateClassName();
    }
  }
  /**
   * Check if lenis is smooth scrolling
   */
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  /**
   * The class name applied to the wrapper element
   */
  get className() {
    let className = "lenis";
    if (this.isStopped) className += " lenis-stopped";
    if (this.isLocked) className += " lenis-locked";
    if (this.isScrolling) className += " lenis-scrolling";
    if (this.isScrolling === "smooth") className += " lenis-smooth";
    return className;
  }
  updateClassName() {
    this.cleanUpClassName();
    this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
  }
  cleanUpClassName() {
    this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
  }
};

//# sourceMappingURL=lenis.mjs.map

/***/ }),

/***/ "./node_modules/select2/dist/js/select2.js":
/*!*************************************************!*\
  !*** ./node_modules/select2/dist/js/select2.js ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Select2 4.1.0-rc.0
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
;(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
} (function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

S2.define('select2/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
      var superMethod = superMethods[m];

      DecoratedClass.prototype[superMethod] =
        SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
      params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
      params.push({});
    }

    // Set the `_type` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
      '\\': '&#92;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
      return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
      return replaceMap[match];
    });
  };

  // Cache objects in Utils.__cache instead of $.data (see #4346)
  Utils.__cache = {};

  var id = 0;
  Utils.GetUniqueElementId = function (element) {
    // Get a unique element Id. If element has no id,
    // creates a new unique number, stores it in the id
    // attribute and returns the new id with a prefix.
    // If an id already exists, it simply returns it with a prefix.

    var select2Id = element.getAttribute('data-select2-id');

    if (select2Id != null) {
      return select2Id;
    }

    // If element has id, use it.
    if (element.id) {
      select2Id = 'select2-data-' + element.id;
    } else {
      select2Id = 'select2-data-' + (++id).toString() +
        '-' + Utils.generateChars(4);
    }

    element.setAttribute('data-select2-id', select2Id);

    return select2Id;
  };

  Utils.StoreData = function (element, name, value) {
    // Stores an item in the cache for a specified element.
    // name is the cache key.
    var id = Utils.GetUniqueElementId(element);
    if (!Utils.__cache[id]) {
      Utils.__cache[id] = {};
    }

    Utils.__cache[id][name] = value;
  };

  Utils.GetData = function (element, name) {
    // Retrieves a value from the cache by its key (name)
    // name is optional. If no name specified, return
    // all cache items for the specified element.
    // and for a specified element.
    var id = Utils.GetUniqueElementId(element);
    if (name) {
      if (Utils.__cache[id]) {
        if (Utils.__cache[id][name] != null) {
          return Utils.__cache[id][name];
        }
        return $(element).data(name); // Fallback to HTML5 data attribs.
      }
      return $(element).data(name); // Fallback to HTML5 data attribs.
    } else {
      return Utils.__cache[id];
    }
  };

  Utils.RemoveData = function (element) {
    // Removes all cached items for a specified element.
    var id = Utils.GetUniqueElementId(element);
    if (Utils.__cache[id] != null) {
      delete Utils.__cache[id];
    }

    element.removeAttribute('data-select2-id');
  };

  Utils.copyNonInternalCssClasses = function (dest, src) {
    var classes;

    var destinationClasses = dest.getAttribute('class').trim().split(/\s+/);

    destinationClasses = destinationClasses.filter(function (clazz) {
      // Save all Select2 classes
      return clazz.indexOf('select2-') === 0;
    });

    var sourceClasses = src.getAttribute('class').trim().split(/\s+/);

    sourceClasses = sourceClasses.filter(function (clazz) {
      // Only copy non-Select2 classes
      return clazz.indexOf('select2-') !== 0;
    });

    var replacements = destinationClasses.concat(sourceClasses);

    dest.setAttribute('class', replacements.join(' '));
  };

  return Utils;
});

S2.define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="listbox"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="alert" aria-live="assertive"' +
      ' class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.append(
      escapeMarkup(
        message(params.args)
      )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
  };

  Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var $options = this.$results
      .find('.select2-results__option--selectable');

    var $selected = $options.filter('.select2-results__option--selected');

    // Check if there are any selected options
    if ($selected.length > 0) {
      // If there are selected options, highlight the first
      $selected.first().trigger('mouseenter');
    } else {
      // If there are no selected options, highlight the first option
      // in the dropdown
      $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = selected.map(function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option--selectable');

      $options.each(function () {
        var $option = $(this);

        var item = Utils.GetData(this, 'data');

        // id needs to be converted to a string when comparing
        var id = '' + item.id;

        if ((item.element != null && item.element.selected) ||
            (item.element == null && selectedIds.indexOf(id) > -1)) {
          this.classList.add('select2-results__option--selected');
          $option.attr('aria-selected', 'true');
        } else {
          this.classList.remove('select2-results__option--selected');
          $option.attr('aria-selected', 'false');
        }
      });

    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.classList.add('select2-results__option');
    option.classList.add('select2-results__option--selectable');

    var attrs = {
      'role': 'option'
    };

    var matches = window.Element.prototype.matches ||
      window.Element.prototype.msMatchesSelector ||
      window.Element.prototype.webkitMatchesSelector;

    if ((data.element != null && matches.call(data.element, ':disabled')) ||
        (data.element == null && data.disabled)) {
      attrs['aria-disabled'] = 'true';

      option.classList.remove('select2-results__option--selectable');
      option.classList.add('select2-results__option--disabled');
    }

    if (data.id == null) {
      option.classList.remove('select2-results__option--selectable');
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs.role = 'group';
      attrs['aria-label'] = data.text;

      option.classList.remove('select2-results__option--selectable');
      option.classList.add('select2-results__option--group');
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested',
        'role': 'none'
      });

      $childrenContainer.append($children);

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    Utils.StoreData(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
        self.highlightFirstItem();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.hideMessages();
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get('scrollAfterSelect')) {
        self.highlightFirstItem();
      }
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get('scrollAfterSelect')) {
        self.highlightFirstItem();
      }
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = Utils.GetData($highlighted[0], 'data');

      if ($highlighted.hasClass('select2-results__option--selected')) {
        self.trigger('close', {});
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('.select2-results__option--selectable');

      var currentIndex = $options.index($highlighted);

      // If we are already at the top, don't move further
      // If no options, currentIndex will be -1
      if (currentIndex <= 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('.select2-results__option--selectable');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element[0].classList.add('select2-results__option--highlighted');
      params.element[0].setAttribute('aria-selected', 'true');
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option--selectable',
      function (evt) {
      var $this = $(this);

      var data = Utils.GetData(this, 'data');

      if ($this.hasClass('select2-results__option--selected')) {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close', {});
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option--selectable',
      function (evt) {
      var data = Utils.GetData(this, 'data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted')
          .attr('aria-selected', 'false');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('.select2-results__option--selectable');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');
    var escapeMarkup = this.options.get('escapeMarkup');

    var content = template(result, container);

    if (content == null) {
      container.style.display = 'none';
    } else if (typeof content === 'string') {
      container.innerHTML = escapeMarkup(content);
    } else {
      $(container).append(content);
    }
  };

  return Results;
});

S2.define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" role="combobox" ' +
      ' aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    this._tabindex = 0;

    if (Utils.GetData(this.$element[0], 'old-tabindex') != null) {
      this._tabindex = Utils.GetData(this.$element[0], 'old-tabindex');
    } else if (this.$element.attr('tabindex') != null) {
      this._tabindex = this.$element.attr('tabindex');
    }

    $selection.attr('title', this.$element.attr('title'));
    $selection.attr('tabindex', this._tabindex);
    $selection.attr('aria-disabled', 'false');

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.on('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');
      self.$selection.attr('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');
      self.$selection.removeAttr('aria-owns');

      self.$selection.trigger('focus');

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', self._tabindex);
      self.$selection.attr('aria-disabled', 'false');
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
      self.$selection.attr('aria-disabled', 'true');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger `blur` if the focus is still in the selection
      if (
        (document.activeElement == self.$selection[0]) ||
        ($.contains(self.$selection[0], document.activeElement))
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        if (this == $select[0]) {
          return;
        }

        var $element = Utils.GetData(this, 'element');

        $element.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  BaseSelection.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  BaseSelection.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  return BaseSelection;
});

S2.define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection[0].classList.add('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered')
      .attr('id', id)
      .attr('role', 'textbox')
      .attr('aria-readonly', 'true');
    this.$selection.attr('aria-labelledby', id);
    this.$selection.attr('aria-controls', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.trigger('focus');
      }
    });
  };

  SingleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title'); // clear tooltip on empty
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);

    var title = selection.title || selection.text;

    if (title) {
      $rendered.attr('title', title);
    } else {
      $rendered.removeAttr('title');
    }
  };

  return SingleSelection;
});

S2.define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection[0].classList.add('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';
    this.$selection.find('.select2-selection__rendered').attr('id', id);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.isDisabled()) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = Utils.GetData($selection[0], 'data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );

    this.$selection.on(
      'keydown',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.isDisabled()) {
          return;
        }

        evt.stopPropagation();
      }
    );
  };

  MultipleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title');
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<button type="button" class="select2-selection__choice__remove" ' +
        'tabindex="-1">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '<span class="select2-selection__choice__display"></span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    var selectionIdPrefix = this.$selection.find('.select2-selection__rendered')
      .attr('id') + '-choice-';

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      var selectionId = selectionIdPrefix + Utils.generateChars(4) + '-';

      if (selection.id) {
        selectionId += selection.id;
      } else {
        selectionId += Utils.generateChars(4);
      }

      $selection.find('.select2-selection__choice__display')
        .append(formatted)
        .attr('id', selectionId);

      var title = selection.title || selection.text;

      if (title) {
        $selection.attr('title', title);
      }

      var removeItem = this.options.get('translations').get('removeItem');

      var $remove = $selection.find('.select2-selection__choice__remove');

      $remove.attr('title', removeItem());
      $remove.attr('aria-label', removeItem());
      $remove.attr('aria-describedby', selectionId);

      Utils.StoreData($selection[0], 'data', selection);

      $selections.push($selection);
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    $rendered.append($selections);
  };

  return MultipleSelection;
});

S2.define('select2/selection/placeholder',[

], function () {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder[0].classList.add('select2-selection__placeholder');
    $placeholder[0].classList.remove('select2-selection__choice');

    var placeholderTitle = placeholder.title ||
      placeholder.text ||
      $placeholder.text();

    this.$selection.find('.select2-selection__rendered').attr(
      'title',
      placeholderTitle
    );

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

S2.define('select2/selection/allowClear',[
  'jquery',
  '../keys',
  '../utils'
], function ($, KEYS, Utils) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
      if (this.options.get('debug') && window.console && console.error) {
        console.error(
          'Select2: The `allowClear` option should be used in combination ' +
          'with the `placeholder` option.'
        );
      }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        self._handleClear(evt);
    });

    container.on('keypress', function (evt) {
      self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.isDisabled()) {
      return;
    }

    var $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
      return;
    }

    evt.stopPropagation();

    var data = Utils.GetData($clear[0], 'data');

    var previousVal = this.$element.val();
    this.$element.val(this.placeholder.id);

    var unselectData = {
      data: data
    };
    this.trigger('clear', unselectData);
    if (unselectData.prevented) {
      this.$element.val(previousVal);
      return;
    }

    for (var d = 0; d < data.length; d++) {
      unselectData = {
        data: data[d]
      };

      // Trigger the `unselect` event, so people can prevent it from being
      // cleared.
      this.trigger('unselect', unselectData);

      // If the event was prevented, don't clear it out.
      if (unselectData.prevented) {
        this.$element.val(previousVal);
        return;
      }
    }

    this.$element.trigger('input').trigger('change');

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
      return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
      this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    this.$selection.find('.select2-selection__clear').remove();
    this.$selection[0].classList.remove('select2-selection--clearable');

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var selectionId = this.$selection.find('.select2-selection__rendered')
      .attr('id');

    var removeAll = this.options.get('translations').get('removeAllItems');

    var $remove = $(
      '<button type="button" class="select2-selection__clear" tabindex="-1">' +
        '<span aria-hidden="true">&times;</span>' +
      '</button>'
    );
    $remove.attr('title', removeAll());
    $remove.attr('aria-label', removeAll());
    $remove.attr('aria-describedby', selectionId);
    Utils.StoreData($remove[0], 'data', data);

    this.$selection.prepend($remove);
    this.$selection[0].classList.add('select2-selection--clearable');
  };

  return AllowClear;
});

S2.define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var searchLabel = this.options.get('translations').get('search');
    var $search = $(
      '<span class="select2-search select2-search--inline">' +
        '<textarea class="select2-search__field"'+
        ' type="search" tabindex="-1"' +
        ' autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" >' +
        '</textarea>' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('textarea');

    this.$search.prop('autocomplete', this.options.get('autocomplete'));
    this.$search.attr('aria-label', searchLabel());

    var $rendered = decorated.call(this);

    this._transferTabIndex();
    $rendered.append(this.$searchContainer);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var resultsId = container.id + '-results';
    var selectionId = container.id + '-container';

    decorated.call(this, container, $container);

    self.$search.attr('aria-describedby', selectionId);

    container.on('open', function () {
      self.$search.attr('aria-controls', resultsId);
      self.$search.trigger('focus');
    });

    container.on('close', function () {
      self.$search.val('');
      self.resizeSearch();
      self.$search.removeAttr('aria-controls');
      self.$search.removeAttr('aria-activedescendant');
      self.$search.trigger('focus');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);

      self._transferTabIndex();
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    container.on('focus', function (evt) {
      self.$search.trigger('focus');
    });

    container.on('results:focus', function (params) {
      if (params.data._resultId) {
        self.$search.attr('aria-activedescendant', params.data._resultId);
      } else {
        self.$search.removeAttr('aria-activedescendant');
      }
    });

    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$selection
          .find('.select2-selection__choice').last();

        if ($previousChoice.length > 0) {
          var item = Utils.GetData($previousChoice[0], 'data');

          self.searchRemoveChoice(item);

          evt.preventDefault();
        }
      }
    });

    this.$selection.on('click', '.select2-search--inline', function (evt) {
      if (self.$search.val()) {
        evt.stopPropagation();
      }
    });

    // Try to detect the IE version should the `documentMode` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$selection.on(
      'input.searchcheck',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents) {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        // Unbind the duplicated `keyup` event
        self.$selection.off('keyup.search');
      }
    );

    this.$selection.on(
      'keyup.search input.search',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents && evt.type === 'input') {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        var key = evt.which;

        // We can freely ignore events from modifier keys
        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
          return;
        }

        // Tabbing will be handled during the `keydown` phase
        if (key == KEYS.TAB) {
          return;
        }

        self.handleSearch(evt);
      }
    );
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
    this.$selection.attr('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.$search[0] == document.activeElement;

    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.resizeSearch();
    if (searchHadFocus) {
      this.$search.trigger('focus');
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.$search.val(item.text);
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '100%';

    if (this.$search.attr('placeholder') === '') {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

S2.define('select2/selection/selectionCss',[
  '../utils'
], function (Utils) {
  function SelectionCSS () { }

  SelectionCSS.prototype.render = function (decorated) {
    var $selection = decorated.call(this);

    var selectionCssClass = this.options.get('selectionCssClass') || '';

    if (selectionCssClass.indexOf(':all:') !== -1) {
      selectionCssClass = selectionCssClass.replace(':all:', '');

      Utils.copyNonInternalCssClasses($selection[0], this.$element[0]);
    }

    $selection.addClass(selectionCssClass);

    return $selection;
  };

  return SelectionCSS;
});

S2.define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting',
      'clear', 'clearing'
    ];

    var preventableEvents = [
      'opening', 'closing', 'selecting', 'unselecting', 'clearing'
    ];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if (relayEvents.indexOf(name) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if (preventableEvents.indexOf(name) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

S2.define('select2/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u0152': 'OE',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u0153': 'oe',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03CE': '\u03C9',
    '\u03C2': '\u03C3',
    '\u2019': '\''
  };

  return diacritics;
});

S2.define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

S2.define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var self = this;

    var data = Array.prototype.map.call(
      this.$element[0].querySelectorAll(':checked'),
      function (selectedElement) {
        return self.item($(selectedElement));
      }
    );

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if (
      data.element != null && data.element.tagName.toLowerCase() === 'option'
    ) {
      data.element.selected = true;

      this.$element.trigger('input').trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          var id = data[d].id;

          if (val.indexOf(id) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('input').trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger('input').trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    data.selected = false;

    if (
      data.element != null &&
      data.element.tagName.toLowerCase() === 'option'
    ) {
      data.element.selected = false;

      this.$element.trigger('input').trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        var id = currentData[d].id;

        if (id !== data.id && val.indexOf(id) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('input').trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      Utils.RemoveData(this);
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      if (
        this.tagName.toLowerCase() !== 'option' &&
        this.tagName.toLowerCase() !== 'optgroup'
      ) {
        return;
      }

      var $option = $(this);

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.addOptions = function ($options) {
    this.$element.append($options);
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');

      if (option.textContent !== undefined) {
        option.textContent = data.text;
      } else {
        option.innerText = data.text;
      }
    }

    if (data.id !== undefined) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    if (data.title) {
      option.title = data.title;
    }

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    Utils.StoreData(option, 'data', normalizedData);

    return $(option);
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = Utils.GetData($option[0], 'data');

    if (data != null) {
      return data;
    }

    var option = $option[0];

    if (option.tagName.toLowerCase() === 'option') {
      data = {
        id: $option.val(),
        text: $option.text(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected'),
        title: $option.prop('title')
      };
    } else if (option.tagName.toLowerCase() === 'optgroup') {
      data = {
        text: $option.prop('label'),
        children: [],
        title: $option.prop('title')
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    Utils.StoreData($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (item !== Object(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

S2.define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    this._dataToConvert = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.bind = function (container, $container) {
    ArrayAdapter.__super__.bind.call(this, container, $container);

    this.addOptions(this.convertToOptions(this._dataToConvert));
  };

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
      return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
      $option = this.option(data);

      this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if (existingIds.indexOf(item.id) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, item, existingData);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        $option.append($children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(failure);

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if (typeof this._request.abort === 'function') {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request () {
      var $request = options.transport(options, function (data) {
        var results = self.processResults(data, params);

        if (self.options.get('debug') && window.console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !Array.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
      }, function () {
        // Attempt to detect if a request was aborted
        // Only works if the transport exposes a status property
        if ('status' in $request &&
            ($request.status === 0 || $request.status === '0')) {
          return;
        }

        self.trigger('results:message', {
          message: 'errorLoading'
        });
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

S2.define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    var insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
        this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if (Array.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var optionText = (option.text || '').toUpperCase();
        var paramsTerm = (params.term || '').toUpperCase();

        var checkText = optionText === paramsTerm;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', 'true');

        self.addOptions([$option]);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    if (params.term == null) {
      return null;
    }

    var term = params.term.trim();

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

S2.define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect (data) {
      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);

      // Check if the data object already exists as a tag
      // Select it if it doesn't
      var $existingOptions = self.$element.find('option').filter(function () {
        return $(this).val() === item.id;
      });

      // If an existing option wasn't found for it, create the option
      if (!$existingOptions.length) {
        var $option = self.option(item);
        $option.attr('data-select2-tag', true);

        self._removeOldTags();
        self.addOptions([$option]);
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select (data) {
      self.trigger('select', {
        data: data
      });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.trigger('focus');
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if (separators.indexOf(termChar) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

S2.define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

S2.define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          maximum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

S2.define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.bind =
    function (decorated, container, $container) {
      var self = this;

      decorated.call(this, container, $container);

      container.on('select', function () {
        self._checkIfMaximumSelected();
      });
  };

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this._checkIfMaximumSelected(function () {
        decorated.call(self, params, callback);
      });
  };

  MaximumSelectionLength.prototype._checkIfMaximumSelected =
    function (_, successCallback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }

        if (successCallback) {
          successCallback();
        }
      });
  };

  return MaximumSelectionLength;
});

S2.define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});

S2.define('select2/dropdown/search',[
  'jquery'
], function ($) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);
    var searchLabel = this.options.get('translations').get('search');

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="searchbox" aria-autocomplete="list" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    this.$search.prop('autocomplete', this.options.get('autocomplete'));
    this.$search.attr('aria-label', searchLabel());

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$search.on('input', function (evt) {
      // Unbind the duplicated `keyup` event
      $(this).off('keyup');
    });

    this.$search.on('keyup input', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);
      self.$search.attr('aria-controls', resultsId);

      self.$search.trigger('focus');

      window.setTimeout(function () {
        self.$search.trigger('focus');
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);
      self.$search.removeAttr('aria-controls');
      self.$search.removeAttr('aria-activedescendant');

      self.$search.val('');
      self.$search.trigger('blur');
    });

    container.on('focus', function () {
      if (!container.isOpen()) {
        self.$search.trigger('focus');
      }
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer[0].classList.remove('select2-search--hide');
        } else {
          self.$searchContainer[0].classList.add('select2-search--hide');
        }
      }
    });

    container.on('results:focus', function (params) {
      if (params.data._resultId) {
        self.$search.attr('aria-activedescendant', params.data._resultId);
      } else {
        self.$search.removeAttr('aria-activedescendant');
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

S2.define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

S2.define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
      this.loadMoreIfNeeded();
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', this.loadMoreIfNeeded.bind(this));
  };

  InfiniteScroll.prototype.loadMoreIfNeeded = function () {
    var isLoadMoreVisible = $.contains(
      document.documentElement,
      this.$loadingMore[0]
    );

    if (this.loading || !isLoadMoreVisible) {
      return;
    }

    var currentOffset = this.$results.offset().top +
      this.$results.outerHeight(false);
    var loadingMoreOffset = this.$loadingMore.offset().top +
      this.$loadingMore.outerHeight(false);

    if (currentOffset + 50 >= loadingMoreOffset) {
      this.loadMore();
    }
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li ' +
      'class="select2-results__option select2-results__option--load-more"' +
      'role="option" aria-disabled="true"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

S2.define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = $(options.get('dropdownParent') || document.body);

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      // Must bind after the results handlers to ensure correct sizing
      self._bindContainerResultHandlers(container);
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown[0].classList.remove('select2');
    $dropdown[0].classList.add('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._bindContainerResultHandlers =
      function (decorated, container) {

    // These should only be bound once
    if (this._containerResultsHandlersBound) {
      return;
    }

    var self = this;

    container.on('results:all', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:append', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:message', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('select', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('unselect', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    this._containerResultsHandlersBound = true;
  };

  AttachBody.prototype._attachPositioningHandler =
      function (decorated, container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      Utils.StoreData(this, 'select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = Utils.GetData(this, 'select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler =
      function (decorated, container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown[0].classList
      .contains('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown[0].classList
      .contains('select2-dropdown--below');

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    // Determine what the parent element is to use for calculating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positioned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
      $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = {
      top: 0,
      left: 0
    };

    if (
      $.contains(document.body, $offsetParent[0]) ||
      $offsetParent[0].isConnected
      ) {
      parentOffset = $offsetParent.offset();
    }

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown[0].classList.remove('select2-dropdown--below');
      this.$dropdown[0].classList.remove('select2-dropdown--above');
      this.$dropdown[0].classList.add('select2-dropdown--' + newDirection);

      this.$container[0].classList.remove('select2-container--below');
      this.$container[0].classList.remove('select2-container--above');
      this.$container[0].classList.add('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
      width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
      css.minWidth = css.width;
      css.position = 'relative';
      css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

S2.define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    var count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    if (this.minimumResultsForSearch < 0) {
      this.minimumResultsForSearch = Infinity;
    }

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

S2.define('select2/dropdown/selectOnClose',[
  '../utils'
], function (Utils) {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (params) {
      self._handleSelectOnClose(params);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
    if (params && params.originalSelect2Event != null) {
      var event = params.originalSelect2Event;

      // Don't select an item if the close event was triggered from a select or
      // unselect event
      if (event._type === 'select' || event._type === 'unselect') {
        return;
      }
    }

    var $highlightedResults = this.getHighlightedResults();

    // Only select highlighted results
    if ($highlightedResults.length < 1) {
      return;
    }

    var data = Utils.GetData($highlightedResults[0], 'data');

    // Don't re-select already selected resulte
    if (
      (data.element != null && data.element.selected) ||
      (data.element == null && data.selected)
    ) {
      return;
    }

    this.trigger('select', {
        data: data
    });
  };

  return SelectOnClose;
});

S2.define('select2/dropdown/closeOnSelect',[

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
      self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey)) {
      return;
    }

    this.trigger('close', {
      originalEvent: originalEvent,
      originalSelect2Event: evt
    });
  };

  return CloseOnSelect;
});

S2.define('select2/dropdown/dropdownCss',[
  '../utils'
], function (Utils) {
  function DropdownCSS () { }

  DropdownCSS.prototype.render = function (decorated) {
    var $dropdown = decorated.call(this);

    var dropdownCssClass = this.options.get('dropdownCssClass') || '';

    if (dropdownCssClass.indexOf(':all:') !== -1) {
      dropdownCssClass = dropdownCssClass.replace(':all:', '');

      Utils.copyNonInternalCssClasses($dropdown[0], this.$element[0]);
    }

    $dropdown.addClass(dropdownCssClass);

    return $dropdown;
  };

  return DropdownCSS;
});

S2.define('select2/dropdown/tagsSearchHighlight',[
  '../utils'
], function (Utils) {
  function TagsSearchHighlight () { }

  TagsSearchHighlight.prototype.highlightFirstItem = function (decorated) {
    var $options = this.$results
    .find(
      '.select2-results__option--selectable' +
      ':not(.select2-results__option--selected)'
    );

    if ($options.length > 0) {
      var $firstOption = $options.first();
      var data = Utils.GetData($firstOption[0], 'data');
      var firstElement = data.element;

      if (firstElement && firstElement.getAttribute) {
        if (firstElement.getAttribute('data-select2-tag') === 'true') {
          $firstOption.trigger('mouseenter');

          return;
        }
      }
    }

    decorated.call(this);
  };

  return TagsSearchHighlight;
});

S2.define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    },
    removeAllItems: function () {
      return 'Remove all items';
    },
    removeItem: function () {
      return 'Remove item';
    },
    search: function() {
      return 'Search';
    }
  };
});

S2.define('select2/defaults',[
  'jquery',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/selectionCss',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',
  './dropdown/dropdownCss',
  './dropdown/tagsSearchHighlight',

  './i18n/en'
], function ($,

             ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, SelectionCSS, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,
             DropdownCSS, TagsSearchHighlight,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }

      if (options.tags) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          TagsSearchHighlight
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch !== 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      if (options.closeOnSelect) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          CloseOnSelect
        );
      }

      if (options.dropdownCssClass != null) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          DropdownCSS
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }

      if (options.allowClear) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          AllowClear
        );
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      if (options.selectionCssClass != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionCSS
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    // If the defaults were not previously applied from an element, it is
    // possible for the language option to have not been resolved
    options.language = this._resolveLanguage(options.language);

    // Always fall back to English since it will always be complete
    options.language.push('en');

    var uniqueLanguages = [];

    for (var l = 0; l < options.language.length; l++) {
      var language = options.language[l];

      if (uniqueLanguages.indexOf(language) === -1) {
        uniqueLanguages.push(language);
      }
    }

    options.language = uniqueLanguages;

    options.translations = this._processTranslations(
      options.language,
      options.debug
    );

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if (params.term == null || params.term.trim() === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdLanguageBase: './i18n/',
      autocomplete: 'off',
      closeOnSelect: true,
      debug: false,
      dropdownAutoWidth: false,
      escapeMarkup: Utils.escapeMarkup,
      language: {},
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      scrollAfterSelect: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.applyFromElement = function (options, $element) {
    var optionLanguage = options.language;
    var defaultLanguage = this.defaults.language;
    var elementLanguage = $element.prop('lang');
    var parentLanguage = $element.closest('[lang]').prop('lang');

    var languages = Array.prototype.concat.call(
      this._resolveLanguage(elementLanguage),
      this._resolveLanguage(optionLanguage),
      this._resolveLanguage(defaultLanguage),
      this._resolveLanguage(parentLanguage)
    );

    options.language = languages;

    return options;
  };

  Defaults.prototype._resolveLanguage = function (language) {
    if (!language) {
      return [];
    }

    if ($.isEmptyObject(language)) {
      return [];
    }

    if ($.isPlainObject(language)) {
      return [language];
    }

    var languages;

    if (!Array.isArray(language)) {
      languages = [language];
    } else {
      languages = language;
    }

    var resolvedLanguages = [];

    for (var l = 0; l < languages.length; l++) {
      resolvedLanguages.push(languages[l]);

      if (typeof languages[l] === 'string' && languages[l].indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = languages[l].split('-');
        var baseLanguage = languageParts[0];

        resolvedLanguages.push(baseLanguage);
      }
    }

    return resolvedLanguages;
  };

  Defaults.prototype._processTranslations = function (languages, debug) {
    var translations = new Translation();

    for (var l = 0; l < languages.length; l++) {
      var languageData = new Translation();

      var language = languages[l];

      if (typeof language === 'string') {
        try {
          // Try to load it with the original name
          languageData = Translation.loadPath(language);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            language = this.defaults.amdLanguageBase + language;
            languageData = Translation.loadPath(language);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files
            if (debug && window.console && console.warn) {
              console.warn(
                'Select2: The language file for "' + language + '" could ' +
                'not be automatically loaded. A fallback will be used instead.'
              );
            }
          }
        }
      } else if ($.isPlainObject(language)) {
        languageData = new Translation(language);
      } else {
        languageData = language;
      }

      translations.extend(languageData);
    }

    return translations;
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(true, this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('select2/options',[
  'jquery',
  './defaults',
  './utils'
], function ($, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    if ($element != null) {
      this.options = Defaults.applyFromElement(this.options, $element);
    }

    this.options = Defaults.apply(this.options);
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.autocomplete == null && $e.prop('autocomplete')) {
      this.options.autocomplete = $e.prop('autocomplete');
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if (Utils.GetData($e[0], 'select2Tags')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      Utils.StoreData($e[0], 'data', Utils.GetData($e[0], 'select2Tags'));
      Utils.StoreData($e[0], 'tags', true);
    }

    if (Utils.GetData($e[0], 'ajaxUrl')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.attr('ajax--url', Utils.GetData($e[0], 'ajaxUrl'));
      Utils.StoreData($e[0], 'ajax-Url', Utils.GetData($e[0], 'ajaxUrl'));
    }

    var dataset = {};

    function upperCaseLetter(_, letter) {
      return letter.toUpperCase();
    }

    // Pre-load all of the attributes which are prefixed with `data-`
    for (var attr = 0; attr < $e[0].attributes.length; attr++) {
      var attributeName = $e[0].attributes[attr].name;
      var prefix = 'data-';

      if (attributeName.substr(0, prefix.length) == prefix) {
        // Get the contents of the attribute after `data-`
        var dataName = attributeName.substring(prefix.length);

        // Get the data contents from the consistent source
        // This is more than likely the jQuery data helper
        var dataValue = Utils.GetData($e[0], dataName);

        // camelCase the attribute name to match the spec
        var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);

        // Store the data attribute contents into the dataset since
        dataset[camelDataName] = dataValue;
      }
    }

    // Prefer the element's `dataset` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
      dataset = $.extend(true, {}, $e[0].dataset, dataset);
    }

    // Prefer our internal data cache if it exists
    var data = $.extend(true, {}, Utils.GetData($e[0]), dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if (excludedData.indexOf(key) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if (Utils.GetData($element[0], 'select2') != null) {
      Utils.GetData($element[0], 'select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = $element.attr('tabindex') || 0;
    Utils.StoreData($element[0], 'old-tabindex', tabindex);
    $element.attr('tabindex', '-1');

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element[0].classList.add('select2-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    Utils.StoreData($element[0], 'select2', this);

    // Ensure backwards compatibility with $element.data('select2').
    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
        var attr = attrs[i].replace(/\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    if (method == 'computedstyle') {
      var computedStyle = window.getComputedStyle($element[0]);

      return computedStyle.width;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.dataAdapter.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.$element.on('focus.select2', function (evt) {
      self.trigger('focus', evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    this._observer = new window.MutationObserver(function (mutations) {
      self._syncA();
      self._syncS(mutations);
    });
    this._observer.observe(this.$element[0], {
      attributes: true,
      childList: true,
      subtree: false
    });
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle', 'focus'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('focus', function (params) {
      self.focus(params);
    });

    this.selection.on('*', function (name, params) {
      if (nonRelayEvents.indexOf(name) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container[0].classList.add('select2-container--open');
    });

    this.on('close', function () {
      self.$container[0].classList.remove('select2-container--open');
    });

    this.on('enable', function () {
      self.$container[0].classList.remove('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container[0].classList.add('select2-container--disabled');
    });

    this.on('blur', function () {
      self.$container[0].classList.remove('select2-container--focus');
    });

    this.on('query', function (params) {
      if (!self.isOpen()) {
        self.trigger('open', {});
      }

      this.dataAdapter.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.dataAdapter.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('keypress', function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ESC || (key === KEYS.UP && evt.altKey)) {
          self.close(evt);

          evt.preventDefault();
        } else if (key === KEYS.ENTER || key === KEYS.TAB) {
          self.trigger('results:select', {});

          evt.preventDefault();
        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
          self.trigger('results:toggle', {});

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous', {});

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next', {});

          evt.preventDefault();
        }
      } else {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            (key === KEYS.DOWN && evt.altKey)) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.isDisabled()) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable', {});
    } else {
      this.trigger('enable', {});
    }
  };

  Select2.prototype._isChangeMutation = function (mutations) {
    var self = this;

    if (mutations.addedNodes && mutations.addedNodes.length > 0) {
      for (var n = 0; n < mutations.addedNodes.length; n++) {
        var node = mutations.addedNodes[n];

        if (node.selected) {
          return true;
        }
      }
    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
      return true;
    } else if (Array.isArray(mutations)) {
      return mutations.some(function (mutation) {
        return self._isChangeMutation(mutation);
      });
    }

    return false;
  };

  Select2.prototype._syncSubtree = function (mutations) {
    var changed = this._isChangeMutation(mutations);
    var self = this;

    // Only re-pull the data if we think there is a change
    if (changed) {
      this.dataAdapter.current(function (currentData) {
        self.trigger('selection:update', {
          data: currentData
        });
      });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting',
      'clear': 'clearing'
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.isDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    if (this.isDisabled()) {
      return;
    }

    this.trigger('query', {});
  };

  Select2.prototype.close = function (evt) {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close', { originalEvent : evt });
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  Select2.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  Select2.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  Select2.prototype.isOpen = function () {
    return this.$container[0].classList.contains('select2-container--open');
  };

  Select2.prototype.hasFocus = function () {
    return this.$container[0].classList.contains('select2-container--focus');
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
      return;
    }

    this.$container[0].classList.add('select2-container--focus');
    this.trigger('focus', {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args == null || args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.data = function () {
    if (this.options.get('debug') &&
        arguments.length > 0 && window.console && console.warn) {
      console.warn(
        'Select2: Data can no longer be set using `select2("data")`. You ' +
        'should consider setting the value instead using `$element.val()`.'
      );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
      data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args == null || args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if (Array.isArray(newVal)) {
      newVal = newVal.map(function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('input').trigger('change');
  };

  Select2.prototype.destroy = function () {
    Utils.RemoveData(this.$container[0]);
    this.$container.remove();

    this._observer.disconnect();
    this._observer = null;

    this._syncA = null;
    this._syncS = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex',
    Utils.GetData(this.$element[0], 'old-tabindex'));

    this.$element[0].classList.remove('select2-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    Utils.RemoveData(this.$element[0]);
    this.$element.removeData('select2');

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container[0].classList
      .add('select2-container--' + this.options.get('theme'));

    Utils.StoreData($container[0], 'element', this.$element);

    return $container;
  };

  return Select2;
});

S2.define('jquery-mousewheel',[
  'jquery'
], function ($) {
  // Used to shim jQuery.mousewheel for non-full builds.
  return $;
});

S2.define('jquery.select2',[
  'jquery',
  'jquery-mousewheel',

  './select2/core',
  './select2/defaults',
  './select2/utils'
], function ($, _, Select2, Defaults, Utils) {
  if ($.fn.select2 == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = Utils.GetData(this, 'select2');

          if (instance == null && window.console && console.error) {
            console.error(
              'The select2(\'' + options + '\') method was called on an ' +
              'element that is not using Select2.'
            );
          }

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if (thisMethods.indexOf(options) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));


/***/ }),

/***/ "./src/AfishaFilterForm.js":
/*!*********************************!*\
  !*** ./src/AfishaFilterForm.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AfishaFilterFormCollection)
/* harmony export */ });
/* harmony import */ var _AfishaMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AfishaMap */ "./src/AfishaMap.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_AfishaMap__WEBPACK_IMPORTED_MODULE_0__]);
_AfishaMap__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const ROOT_SELECTOR = '[data-js-afisha-filter-form]';
class AfishaFilterForm {
  selectors = {
    root: ROOT_SELECTOR,
    afishaContent: '[data-js-afisha-filter-form-content]',
    outOfTimeContent: '[data-js-afisha-filter-form-out-of-time-content]',
    moreButton: '[data-js-afisha-filter-form-more-button]',
    resetButton: '[data-js-afisha-filter-form-reset-button]',
    preSelectedFilterButton: '[data-js-afisha-filter-form-preselected-button]',
    emptyContent: '[data-js-afisha-filter-form-empty]'
  };
  stateSelectors = {
    isFetching: 'is-fetching',
    isDisabled: 'is-disabled'
  };
  constructor(form) {
    /**
     * @type {HTMLFormElement}
     */
    this.root = form;
    if (!this.root) {
      return;
    }
    this.map = new _AfishaMap__WEBPACK_IMPORTED_MODULE_0__["default"](document.querySelector('[data-js-yandex-map]'));
    this.pageControl = this.root.page;
    this.afishaContent = document.querySelector(this.selectors.afishaContent);
    this.outOfTimeContent = document.querySelector(this.selectors.outOfTimeContent);
    this.emptyContent = document.querySelector(this.selectors.emptyContent);

    /**
     * @type {HTMLButtonElement}
     */
    this.moreButton = document.querySelector(this.selectors.moreButton);
    /**
     * @type {HTMLButtonElement}
     */
    this.resetButton = this.root.querySelector(this.selectors.resetButton);

    /**
     * @type {NodeListOf<HTMLButtonElement>}
     */
    this.preSelectedFilterButtons = this.root.querySelectorAll(this.selectors.preSelectedFilterButton);
    this.preSelectedFilterButtonConfigs = new Map();
    this.preSelectedFilterButtons.forEach(button => {
      this.preSelectedFilterButtonConfigs.set(button, JSON.parse(button.dataset.jsAfishaFilterFormPreselectedButton));
    });
    this.initialFormData = {
      date: '',
      city: '',
      activity: '',
      page: '1'
    };
    this.state = this._getProxyState({
      isFindingCity: false,
      isFetching: false,
      maxPages: this.moreButton ? parseInt(this.moreButton.dataset.maxPages) : 0,
      hasChanges: false
    });
    this.updateUI();
    this.bindEvents();
  }
  getFormData() {
    console.log(this.root);
  }
  hasFormChanges() {
    const formData = new FormData(this.root);
    for (const name in this.initialFormData) {
      const value = this.initialFormData[name];
      if (formData.get(name) && value !== formData.get(name)) {
        return true;
      }
    }
    return false;
  }
  _getProxyState(initialState) {
    let isUpdating = false;
    let needsUpdate = false;
    return new Proxy(initialState, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, newValue) => {
        const currentValue = target[prop];
        target[prop] = newValue;
        if (currentValue !== newValue) {
          if (isUpdating) {
            needsUpdate = true;
          } else {
            isUpdating = true;
            this.updateUI();
            isUpdating = false;
            if (needsUpdate) {
              needsUpdate = false;
              this.updateUI();
            }
          }
        }
        return true;
      }
    });
  }
  updateUI() {
    console.log({
      ...this.state
    }, {
      ...this.previousState
    });
    const pageValue = parseInt(this.pageControl.value);
    this.root.classList.toggle(this.stateSelectors.isFetching, this.state.isFetching);
    document.body.style.cursor = this.state.isFindingCity ? 'wait' : null;
    this.afishaContent.closest('.r-afisha').classList.toggle(this.stateSelectors.isFetching, this.state.isFetching);
    if (this.moreButton) {
      this.moreButton.disabled = this.state.isFetching || pageValue === this.state.maxPages;
      this.moreButton.hidden = pageValue === this.state.maxPages;
    }

    // Maybe later :))
    // this.preSelectedFilterButtonsConfigs.forEach((config, button) => {
    // 	button.classList.toggle('active', )
    // 	console.log({ config, button });
    // });

    this.resetButton.disabled = !this.state.hasChanges;
    this.resetButton.hidden = !this.state.hasChanges;
    this.previousState = {
      ...this.state
    };
  }
  async fetchPosts() {
    this.state.isFetching = true;
    try {
      const formData = new FormData(this.root);
      const response = await fetch(BKSQ.AJAX_URL, {
        method: 'POST',
        body: formData
      });
      const {
        success,
        data
      } = await response.json();
      console.log({
        success,
        data
      });
      if (!success) {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      this.state.isFetching = false;
    }
  }
  async getUserLocation() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      return position;
    } catch (error) {
      console.error(error);
      window.alert(`Ошибка при определении геопозиции: ${error}`);
      throw error;
    }
  }
  async getUserCity() {
    const {
      data,
      error
    } = await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.promiseWrapper)(this.getUserLocation());
    console.log({
      data,
      error
    });
    if (error) {
      return;
    }
    this.state.isFindingCity = true;
    if (!data.coords.longitude || !data.coords.latitude) {
      throw new Error('Ошибка при опредении координат');
    }
    const coordinatesString = `${data.coords.longitude},${data.coords.latitude}`;
    const geocoderUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&geocode=${encodeURIComponent(coordinatesString)}&format=json`;
    try {
      const response = await fetch(geocoderUrl);
      const json = await response.json();
      const cityName = json.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
      return cityName;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.state.isFindingCity = false;
    }
  }

  /**
   *
   * @param {string} error
   */
  showError(error) {
    console.error(error);
  }

  /**
   *
   * @param {Event} event
   */
  onChange = async event => {
    console.log(event);
    this.map.setLocation(this.root.city.value);
    this.state.hasChanges = this.hasFormChanges();
    if (event.target !== this.pageControl) {
      this.pageControl.value = 1;
    }
    const {
      data,
      error
    } = await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.promiseWrapper)(this.fetchPosts());
    if (error) {
      this.showError(error);
      return;
    }
    if (this.map) {
      const newMarkers = BKSQ.LOCATIONS.filter(location => data.all_events.includes(location.id));
      this.map.setMarkers(newMarkers);
    }
    if (data.page === 1) {
      this.afishaContent.innerHTML = data.content;
    } else {
      this.afishaContent.innerHTML += data.content;
    }
    this.outOfTimeContent.innerHTML = data.outOfTimeContent;
    if (!data.content && !data.outOfTimeContent) {
      this.emptyContent.style.display = 'flex';
    } else {
      this.emptyContent.style.display = null;
    }
    if (data.maxPages) {
      this.state.maxPages = parseInt(data.maxPages);
    }
  };

  /**
   *
   * @param {PointerEvent} event
   */
  onMoreButtonClick = event => {
    event.preventDefault();
    event.stopPropagation();
    this.pageControl.value = parseInt(this.pageControl.value) + 1;
    this.pageControl.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  };

  /**
   *
   * @param {PointerEvent} event
   */
  onPreSelectedButtonClick = async event => {
    event.preventDefault();
    event.stopPropagation();
    const button = event.target.closest('button');
    const isActive = !button.classList.contains('active');
    const config = JSON.parse(button.dataset.jsAfishaFilterFormPreselectedButton);
    const targetControl = this.root.querySelector(config.controlSelector);
    button.classList.toggle('active', isActive);
    this.preSelectedFilterButtonConfigs.forEach((conf, buttonElement) => {
      if (conf.controlSelector === config.controlSelector && buttonElement !== button) {
        buttonElement.classList.remove('active');
      }
    });
    let value = '';
    if (isActive) {
      if (config.action) {
        const {
          data,
          error
        } = await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.promiseWrapper)(this[config.action]());
        if (error) {
          return;
        }
        value = data;
      } else {
        value = config.value;
      }
    }

    // if (config.value) {
    // 	if (targetControl.type.includes('select')) {
    // 		Array.from(targetControl.options).forEach((option) => {
    // 			option.selected = option.value === config.value;
    // 		});
    // 	} else {
    // 		targetControl.value = config.value;
    // 	}

    // 	// $(targetControl).trigger('change');
    // 	targetControl.dispatchEvent(
    // 		new Event('change', {
    // 			bubbles: true,
    // 		})
    // 	);

    // 	return;
    // }

    if (targetControl.type.includes('select')) {
      if (targetControl.name === 'city') {
        const targetOption = [...targetControl.options].find(option => option.value === value);
        if (targetOption) {
          targetOption.selected = true;
        } else {
          const newOption = new Option(value, value, true, true);
          $(targetControl).append(newOption);
        }
      } else {
        Array.from(targetControl.options).forEach(option => {
          option.selected = option.value === value;
        });
      }
    } else {
      targetControl.value = value;
    }
    if (targetControl.name === 'date') {
      const calendar = targetControl._flatpickr;
      if (value !== 'Вечное') {
        calendar.setDate(value, false);
        calendar.close();
      } else {
        calendar.input.value = value;
        calendar._input.value = value;
      }
    }
    targetControl.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  };

  /**
   *
   * @param {Event} event
   */
  onReset = event => {
    this.preSelectedFilterButtons.forEach(button => {
      button.classList.remove('active');
    });
    for (const name in this.initialFormData) {
      const value = this.initialFormData[name];
      this.root[name].value = value;
    }
    this.root.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  };
  bindEvents() {
    this.root.addEventListener('change', this.onChange);
    this.root.addEventListener('reset', this.onReset);
    if (this.moreButton) {
      this.moreButton.addEventListener('click', this.onMoreButtonClick);
    }
    this.preSelectedFilterButtons.forEach(button => {
      button.addEventListener('click', this.onPreSelectedButtonClick);
    });
  }
  destroy() {
    this.root.removeEventListener('change', this.onChange);
    this.root.removeEventListener('reset', this.onReset);
    if (this.moreButton) {
      this.moreButton.removeEventListener('click', this.onMoreButtonClick);
    }
    this.preSelectedFilterButtons.forEach(button => {
      button.removeEventListener('click', this.onPreSelectedButtonClick);
    });
    this.map.destroy();
  }
}
class AfishaFilterFormCollection {
  /**
   * @type {Map<HTMLFormElement, AfishaFilterForm>}
   */
  static afishaFilterForms = new Map();
  static init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(form => {
      const AfishaFilterFormInstance = new AfishaFilterForm(form);
      AfishaFilterFormCollection.afishaFilterForms.set(form, AfishaFilterFormInstance);
    });
  }
  static destroyAll() {
    AfishaFilterFormCollection.afishaFilterForms.forEach(formInstance => {
      formInstance.destroy();
    });
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./src/AfishaMap.js":
/*!**************************!*\
  !*** ./src/AfishaMap.js ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ YandexMap)
/* harmony export */ });
/* harmony import */ var ymaps3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ymaps3 */ "ymaps3");
/* harmony import */ var _mapCustomizationConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mapCustomizationConfig */ "./src/mapCustomizationConfig.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ymaps3__WEBPACK_IMPORTED_MODULE_0__]);
ymaps3__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
/* harmony import */ var ymaps3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ymaps3__WEBPACK_IMPORTED_MODULE_0__);


const ROOT_SELECTOR = '[data-js-yandex-map]';
class YandexMap {
  selectors = {
    root: ROOT_SELECTOR
  };
  stateSelectors = {
    isActive: 'is-active',
    isDisabled: 'is-disabled'
  };

  /**
   *
   * @param {HTMLElement} mapContainer
   */
  constructor(mapContainer) {
    this.container = mapContainer;
    this.selectedCity = 'Москва';
    this.selectedLocations = [];
    this.initMap();
  }
  async initMap() {
    // Дождитесь резолва`ymaps3.ready`
    await ymaps3__WEBPACK_IMPORTED_MODULE_0__.ready;
    const {
      YMap,
      YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer
    } = ymaps3__WEBPACK_IMPORTED_MODULE_0__;
    this.ymaps = ymaps3__WEBPACK_IMPORTED_MODULE_0__;

    // Карта инициализируется в первом контейнере
    this.map = new YMap(this.container, {
      behaviors: ['drag', 'pinchZoom', 'mouseTilt', 'dblClick'],
      location: {
        center: [37.6156, 55.7522],
        zoom: 12
      }
    });
    this.map.addChild(new YMapDefaultSchemeLayer({
      customization: _mapCustomizationConfig__WEBPACK_IMPORTED_MODULE_1__.customization,
      theme: 'dark'
    }));
    this.map.addChild(new YMapDefaultFeaturesLayer({}));
    this.setLocation();
    this.setMarkers(BKSQ.LOCATIONS);
  }
  async setLocation(city) {
    if (!city) {
      city = 'Москва';
    }
    if (this.selectedCity === city) {
      return;
    }
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&geocode=${encodeURIComponent(city)}&format=json`);
    const json = await response.json();
    if (json.response.GeoObjectCollection.featureMember.length === 0) {
      throw new Error('City not found');
    }
    const coordinates = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(Number);
    this.map.setLocation({
      center: coordinates,
      zoom: 12
    });
    this.selectedCity = city;
  }
  setMarkers(locations = []) {
    const {
      YMapComplexEntity,
      YMapMarker
    } = this.ymaps;
    let map = this.map;
    class CustomMarkerWithPopup extends YMapComplexEntity {
      constructor(options) {
        super(options);
        this._marker = null;
        this._popup = null;
        this._closePopupBodyClickHandler = this._closePopupBodyClickHandler.bind(this);
      }

      // Handler for attaching the control to the map
      _onAttach() {
        this._createMarker();
      }
      // Handler for detaching control from the map
      _onDetach() {
        this._marker = null;
        document.body.removeEventListener('click', this._closePopupBodyClickHandler);
      }
      // Handler for updating marker properties
      _onUpdate(props) {
        if (props.zIndex !== undefined) {
          this._marker?.update({
            zIndex: props.zIndex
          });
        }
        if (props.coordinates !== undefined) {
          this._marker?.update({
            coordinates: props.coordinates
          });
        }
      }
      // Method for creating a marker element
      _createMarker() {
        const element = document.createElement('div');
        element.className = 'marker';
        if (this._props.icon) {
          element.style.backgroundImage = `url(${this._props.icon})`;
          element.style.backgroundSize = 'contain';
          element.style.backgroundRepeat = 'no-repeat';
        }
        element.onclick = () => {
          this._openPopup();
          map.setLocation({
            center: this._props.coordinates,
            duration: 800
          });
        };
        this._marker = new YMapMarker({
          coordinates: this._props.coordinates
        }, element);
        this.addChild(this._marker);
      }
      _closePopupBodyClickHandler(event) {
        if (!event.target.closest('.popup') && event.target !== this._marker.element) {
          this._closePopup();
        }
      }

      // Method for creating a popup window element
      _openPopup() {
        var _this$_props$zIndex;
        if (this._popup) {
          return;
        }
        this._marker.element.classList.add('marker--selected');
        const element = document.createElement('div');
        element.setAttribute('data-popup-trigger', `afishaItem${this._props.id}`);
        element.className = 'popup popup--afisha';
        element.style.cursor = 'pointer';

        /**
         *
         * @param {PointerEvent} event
         */
        element.onclick = event => {
          event.preventDefault();
          document.getElementById(element.dataset.popupTrigger)?.click();
        };
        const dateElement = document.createElement('div');
        dateElement.className = 'popup__date';
        dateElement.innerHTML = this._props.date;
        const headerElement = document.createElement('header');
        headerElement.className = 'popup__header';
        headerElement.textContent = this._props.title;
        const bodyElement = document.createElement('div');
        bodyElement.className = 'popup__body';
        bodyElement.innerHTML = this._props.address;
        if (this._props.linkToShop) {
          const separatorElement = document.createElement('div');
          separatorElement.className = 'popup__separator';
          bodyElement.append(separatorElement);
          const linkElement = document.createElement('a');
          linkElement.className = 'popup__link';
          linkElement.href = this._props.linkToShop;
          linkElement.textContent = 'Купить онлайн';
          linkElement.target = '_blank';
          bodyElement.append(linkElement);
        }
        if (this._props.additionalInfo) {
          const additionalInfoElement = document.createElement('div');
          additionalInfoElement.className = 'popup__additional-info';
          additionalInfoElement.textContent = this._props.additionalInfo;
          bodyElement.append(additionalInfoElement);
        }

        // const closeBtn = document.createElement('button');
        // closeBtn.className = 'popup__close';
        // closeBtn.textContent = 'Close Popup';
        // closeBtn.onclick = () => this._closePopup();

        element.append(dateElement, headerElement, bodyElement);
        document.body.addEventListener('click', this._closePopupBodyClickHandler);
        const zIndex = ((_this$_props$zIndex = this._props.zIndex) !== null && _this$_props$zIndex !== void 0 ? _this$_props$zIndex : YMapMarker.defaultProps.zIndex) + 1_000;
        this._popup = new YMapMarker({
          coordinates: this._props.coordinates,
          zIndex,
          // This allows you to scroll over popup
          blockBehaviors: this._props.blockBehaviors
        }, element);
        this.addChild(this._popup);
      }
      _closePopup() {
        if (!this._popup) {
          return;
        }
        this.removeChild(this._popup);
        this._popup = null;
        this._marker?.element?.classList.remove('marker--selected');
      }
    }
    this.selectedLocations.forEach(location => {
      this.map.removeChild(location);
    });
    this.selectedLocations = locations.map(location => {
      return new CustomMarkerWithPopup(location);
    });
    this.selectedLocations.forEach(loc => {
      this.map.addChild(loc);
    });
  }
  destroy() {
    this.map.destroy();
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./src/AfishaPopupStaff.js":
/*!*********************************!*\
  !*** ./src/AfishaPopupStaff.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initAfishaPopupStaff: () => (/* binding */ initAfishaPopupStaff)
/* harmony export */ });
/* harmony import */ var _lenis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lenis */ "./src/lenis.js");

const initAfishaPopupStaff = () => {
  // Обработчик клика на элементы с классом 'afisha-item'

  var prevlink = 0;
  $('.r-afisha').on('click', function (e) {
    console.log('kkkk');
    e.preventDefault(); // Отменяем стандартное поведение ссылки
    $('.popupin').remove();
    if (!e.target.closest('.afisha-item')) {
      return;
    }
    const $afishaItem = $(e.target.closest('.afisha-item'));
    prevlink = window.location.href;
    var link = $afishaItem.attr('href'); // Получаем ссылку из атрибута data-link

    $.ajax({
      url: link,
      success: function (response) {
        // В случае успешного получения данных
        var content = $(response).find('.events-single').html(); // Извлекаем контент из .events-single

        if (content !== undefined && content.length > 0) {
          $('.popupevents').append(content); // Подставляем контент в элемент с классом 'popupevents'
          $('html').addClass('popupopened');
          _lenis__WEBPACK_IMPORTED_MODULE_0__.lenis.stop();
          history.pushState(null, null, link);
        }
      },
      error: function (xhr, status, error) {
        console.log('error');
        // [console.log(](console.log()"Ошибка: " + [xhr.status](xhr.status) + " " + error);
      }
    });
  });
  $('.new-close-pop-left,.new-btn-close-pop').on('click', function () {
    $('html').removeClass('popupopened');
    _lenis__WEBPACK_IMPORTED_MODULE_0__.lenis.start();
    history.pushState(null, null, prevlink);
  });
  window.addEventListener('popstate', event => {
    if (document.documentElement.classList.contains('popupopened')) {
      $('html').removeClass('popupopened');
      _lenis__WEBPACK_IMPORTED_MODULE_0__.lenis.start();
      history.pushState(null, null, prevlink);
    }
  });
};

/***/ }),

/***/ "./src/BookSlider.js":
/*!***************************!*\
  !*** ./src/BookSlider.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BookSliderCollection)
/* harmony export */ });
const ROOT_SELECTOR = '.book-slider';
class BookSlider {
  constructor(element) {
    this.slider = element;
    console.log(this.slider);
    if (!this.slider) {
      return;
    }
    this.sliderContainer = this.slider.querySelector('.book-slider__container');
    this.books = Array.from(this.slider.querySelectorAll('.book-slider__slide'));
    this.sliderContainerWidth = this.sliderContainer.getBoundingClientRect().width;
    this.bookWidth = this.books[0].scrollWidth;
    this.halfBookWidth = this.bookWidth / 2;
    this.bookThickness = this.books[0].querySelector('.book__root').scrollWidth;
    this.halfBookThickness = this.bookThickness / 2;
    this.booksGap = 16;
    this.currentBook = 0;
    this.books.forEach(book => {
      const root = book.querySelector('.book__root');
      book.style.setProperty('--root-width', `-${this.bookThickness}px`);
      root.style.transform = `translate3d(50%, 0px, ${-this.halfBookThickness}px) rotateY(-180deg)`;
    });
    this.setupBooks();
    this.bindEvents();
    setTimeout(() => {
      this.books.forEach(book => book.style.transition = 'all 0.6s ease-out');
    });
  }
  setupBooks() {
    const halfBookWidth = this.bookWidth / 2;
    this.books.forEach((book, index) => {
      const normalizedIndex = Math.abs(index - (this.books.length - 1));

      // book.style.zIndex = normalizedIndex + 1;

      book.classList.toggle('book-slider__slide--active', index === this.currentBook);
      if (index === this.currentBook) {
        book.style.rotate = 'y 0deg';
      } else {
        book.style.rotate = 'y 90deg';
      }
      if (index < this.currentBook) {
        book.style.translate = `${-this.sliderContainerWidth + halfBookWidth + this.bookThickness * (index + 1) + index * this.booksGap}px`;
        book.style.zIndex = null;
      } else if (index > this.currentBook) {
        book.style.translate = `${halfBookWidth - this.bookThickness * normalizedIndex - normalizedIndex * this.booksGap}px`;
        book.style.zIndex = normalizedIndex + 1;
      }
      if (index === this.currentBook) {
        if (index === 0) {
          book.style.translate = `${-this.sliderContainerWidth + this.bookWidth}px`;
        } else if (index === this.books.length - 1) {
          book.style.translate = '0px';
        } else {
          const leftBookTranslate = -this.sliderContainerWidth + halfBookWidth + this.bookThickness * (index - 1) + (index - 1) * this.booksGap;
          const rightBookTranslate = halfBookWidth - this.bookThickness * normalizedIndex - (normalizedIndex - 1) * this.booksGap;
          const currentBookTranslate = (rightBookTranslate - Math.abs(leftBookTranslate)) / 2 + this.bookThickness / 2;
          book.style.translate = `${currentBookTranslate}px`;
        }
      }
    });
  }

  /**
   * Bind click event to each book, which will toggle the active class.
   * If the current book is already active, the click event will not do anything.
   */
  bindEvents() {
    this.books.forEach((slide, i) => {
      /**
       * 
       * @param {PointerEvent} event 
       * @returns 
       */
      slide.onclick = event => {
        if (this.currentBook === i) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        this.slider.scrollIntoView({
          behavior: 'smooth'
        });
        this.currentBook = i;
        this.setupBooks();
      };
    });
  }
  destroy() {}
}
class BookSliderCollection {
  /**
   * @type {Map<HTMLElement,BookSlider>}
   */
  static bookSliderMap = new Map();
  static init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(slider => {
      const BookSliderInstance = new BookSlider(slider);
      BookSliderCollection.bookSliderMap.set(slider, BookSliderInstance);
    });
  }
  static destroyAll() {
    BookSliderCollection.bookSliderMap.forEach(bookSlider => {
      bookSlider.destroy();
    });
    BookSliderCollection.bookSliderMap.clear();
  }
}

/***/ }),

/***/ "./src/CustomDatepicker.js":
/*!*********************************!*\
  !*** ./src/CustomDatepicker.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CustomDatePickerCollection)
/* harmony export */ });
/* harmony import */ var flatpickr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flatpickr */ "./node_modules/flatpickr/dist/esm/index.js");
/* harmony import */ var flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flatpickr/dist/l10n/ru.js */ "./node_modules/flatpickr/dist/l10n/ru.js");
/* harmony import */ var flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1__);


const ROOT_SELECTOR = '[data-js-custom-datepicker]';
class CustomDatePicker {
  /**
   *
   * @param {HTMLInputElement} element
   */
  constructor(element) {
    this.root = element;
    function extraBKSQButtons() {
      return function (fp) {
        return {
          onReady() {
            fp.calendarContainer.classList.add('bksq-calendar');
            fp.innerContainer.classList.add('bksq-calendar__inner');
            fp.monthNav.classList.add('bksq-calendar__months');
            fp.nextMonthNav.classList.add('bksq-calendar__months-next');
            fp.prevMonthNav.classList.add('bksq-calendar__months-prev');
            fp.daysContainer.classList.add('bksq-calendar__days-wrapper');
            fp.days.classList.add('bksq-calendar__days');
            fp.todayDateElem.classList.add('bksq-calendar__today');
            fp.monthElements.forEach(element => {
              element.disabled = true;
            });
            const markup = `
						<div class="bksq-actions">
							<button 
								id="bksqCalendarApplyButton" 
								type="button" 
								class="bksq-actions__button button" 
								disabled
							>
								Выбрать
							</button>
							<button 
								id="bksqCalendarCloseButton" 
								type="button" 
								class="bksq-actions__button button button--link"
							>
								Закрыть
							</button>
							<div class="bksq-actions__separator"></div>
							<button 
								id="bksqCalendarOutOfTimeButton" 
								type="button" 
								class="bksq-actions__button button button--outline"
							>
								Вне времени и дат
							</button>
						</div>
						`;
            fp.calendarContainer.insertAdjacentHTML('beforeend', markup);
            fp.bksqApplyButton = fp.calendarContainer.querySelector('#bksqCalendarApplyButton');
            fp.bksqCloseButton = fp.calendarContainer.querySelector('#bksqCalendarCloseButton');
            fp.bksqOutOfTimeButton = fp.calendarContainer.querySelector('#bksqCalendarOutOfTimeButton');

            /**
             *
             * @param {PointerEvent} e
             */
            fp.bksqApplyButton.onclick = e => {
              e.preventDefault();
              e.stopPropagation();
              if (fp.selectedDates.length <= 0) {
                return;
              }
              fp.close();
            };

            /**
             *
             * @param {PointerEvent} e
             */
            fp.bksqCloseButton.onclick = e => {
              e.preventDefault();
              e.stopPropagation();
              fp.close();
            };

            /**
             *
             * @param {PointerEvent} e
             */
            fp.bksqOutOfTimeButton.onclick = e => {
              e.preventDefault();
              e.stopPropagation();
              fp._input.value = 'Вечное';
              fp.input.value = 'Вечное';
              fp.close();
            };
            fp.loadedPlugins.push('extraBKSQButtons');
          },
          onChange(selectedDates, dateStr, instance) {
            console.log({
              selectedDates,
              dateStr,
              instance
            });
            fp.bksqApplyButton.disabled = fp.selectedDates.length <= 0;
            instance.open();
          }
        };
      };
    }
    this.customDatePicker = (0,flatpickr__WEBPACK_IMPORTED_MODULE_0__["default"])(this.root, {
      altInput: true,
      mode: 'range',
      altFormat: 'F j, Y',
      enableYear: false,
      dateFormat: 'Y-m-d',
      locale: flatpickr_dist_l10n_ru_js__WEBPACK_IMPORTED_MODULE_1__.Russian,
      plugins: [new extraBKSQButtons()]
    });
    console.log(this.customDatePicker);
  }
  destroy() {
    this.customDatePicker.destroy();
  }
}
class CustomDatePickerCollection {
  /**
   * @type {Map<HTMLInputElement, CustomDatePicker>}
   */
  static customDatePickerMap = new Map();
  static init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(input => {
      const CustomDatePickerInstance = new CustomDatePicker(input);
      CustomDatePickerCollection.customDatePickerMap.set(input, CustomDatePickerInstance);
    });
  }
  static destroyAll() {
    CustomDatePickerCollection.customDatePickerMap.forEach(datePicker => {
      datePicker.destroy();
    });
    CustomDatePickerCollection.customDatePickerMap.clear();
  }
}

// export const initCustomDatePicker = () => {
// 	const dateControl = document.getElementById('afishaFilterFormDateControl');

// 	if (dateControl) {
// 		function extraBKSQButtons() {
// 			return function (fp) {
// 				return {
// 					onReady() {
// 						console.log(fp);

// 						fp.calendarContainer.classList.add('bksq-calendar');
// 						fp.innerContainer.classList.add('bksq-calendar__inner');
// 						fp.monthNav.classList.add('bksq-calendar__months');
// 						fp.nextMonthNav.classList.add('bksq-calendar__months-next');
// 						fp.prevMonthNav.classList.add('bksq-calendar__months-prev');
// 						fp.daysContainer.classList.add('bksq-calendar__days-wrapper');
// 						fp.days.classList.add('bksq-calendar__days');
// 						fp.todayDateElem.classList.add('bksq-calendar__today');

// 						fp.monthElements.forEach((element) => {
// 							element.disabled = true;
// 						});

// 						const markup = `
// 						<div class="bksq-actions">
// 							<button 
// 								id="bksqCalendarApplyButton" 
// 								type="button" 
// 								class="bksq-actions__button button" 
// 								disabled
// 							>
// 								Выбрать
// 							</button>
// 							<button 
// 								id="bksqCalendarCloseButton" 
// 								type="button" 
// 								class="bksq-actions__button button button--link"
// 							>
// 								Закрыть
// 							</button>
// 							<div class="bksq-actions__separator"></div>
// 							<button 
// 								id="bksqCalendarOutOfTimeButton" 
// 								type="button" 
// 								class="bksq-actions__button button button--outline"
// 							>
// 								Вне времени и дат
// 							</button>
// 						</div>
// 						`;

// 						fp.calendarContainer.insertAdjacentHTML('beforeend', markup);

// 						fp.bksqApplyButton = fp.calendarContainer.querySelector(
// 							'#bksqCalendarApplyButton'
// 						);
// 						fp.bksqCloseButton = fp.calendarContainer.querySelector(
// 							'#bksqCalendarCloseButton'
// 						);
// 						fp.bksqOutOfTimeButton = fp.calendarContainer.querySelector(
// 							'#bksqCalendarOutOfTimeButton'
// 						);

// 						/**
// 						 *
// 						 * @param {PointerEvent} e
// 						 */
// 						fp.bksqApplyButton.onclick = (e) => {
// 							e.preventDefault();
// 							e.stopPropagation();

// 							if (fp.selectedDates.length <= 0) {
// 								return;
// 							}

// 							fp.close();
// 						};

// 						/**
// 						 *
// 						 * @param {PointerEvent} e
// 						 */
// 						fp.bksqCloseButton.onclick = (e) => {
// 							e.preventDefault();
// 							e.stopPropagation();

// 							fp.close();
// 						};

// 						/**
// 						 *
// 						 * @param {PointerEvent} e
// 						 */
// 						fp.bksqOutOfTimeButton.onclick = (e) => {
// 							e.preventDefault();
// 							e.stopPropagation();

// 							fp._input.value = 'Вечное';
// 							fp.input.value = 'Вечное';

// 							fp.close();
// 						};

// 						// const id = fp.input.id;

// 						// if (!id) {
// 						// 	return;
// 						// }

// 						// if (fp.mobileInput) {
// 						// 	fp.input.removeAttribute('id');
// 						// 	fp.mobileInput.id = id;
// 						// } else if (fp.altInput) {
// 						// 	fp.input.removeAttribute('id');
// 						// 	fp.altInput.id = id;
// 						// }

// 						fp.loadedPlugins.push('extraBKSQButtons');
// 					},
// 					onChange(selectedDates, dateStr, instance) {
// 						console.log({ selectedDates, dateStr, instance });

// 						fp.bksqApplyButton.disabled = fp.selectedDates.length <= 0;

// 						instance.open();
// 					},
// 				};
// 			};
// 		}

// 		const calendar = flatpickr(dateControl, {
// 			altInput: true,
// 			mode: 'range',
// 			altFormat: 'F j, Y',
// 			enableYear: false,
// 			dateFormat: 'Y-m-d',
// 			locale: Russian,
// 			plugins: [new extraBKSQButtons()],
// 		});
// 	}
// };

/***/ }),

/***/ "./src/CustomSelect.js":
/*!*****************************!*\
  !*** ./src/CustomSelect.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CustomSelectCollection)
/* harmony export */ });
/* harmony import */ var select2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! select2 */ "./node_modules/select2/dist/js/select2.js");
/* harmony import */ var select2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(select2__WEBPACK_IMPORTED_MODULE_0__);

const CUSTOM_SELECT_SELECTOR = '[data-js-custom-select]';
class CustomSelect {
  /**
   *
   * @param {HTMLSelectElement} element
   */
  constructor(element) {
    this.root = element;
    this.config = {
      searchable: true,
      templateSelection: function (data) {
        if (!data.id) {
          return data.text; // Возвращаем текст без изменений для placeholder
        }

        // Убираем дефисы и начальные пробелы из текста
        var cleanText = data.text.replace(/^[–\s]+/, '');

        // Если нужно удалить все дефисы из названия (даже внутри слов), используйте:
        // var cleanText = data.text.replace(/–/g, '').trim();

        return cleanText;
      },
      ...(element.dataset.config ? JSON.parse(element.dataset.config) : {})
    };
    this.$customSelect = $(element);
    this.$customSelect.select2(this.config);
    this.bindEvents();
  }
  onOpen = event => {
    $('.select2-dropdown').attr('data-lenis-prevent', '');
    $('.select2-search__field').attr('placeholder', 'Поиск');
  };
  onChangeBubble = event => {
    this.$customSelect.off('change', this.onChangeBubble);
    event.target.dispatchEvent(new Event('change', {
      bubbles: true
    }));
    this.$customSelect.on('change', this.onChangeBubble);
  };
  onReset = () => {
    this.$customSelect.val(null).trigger('change');
  };
  bindEvents() {
    document.addEventListener('reset', this.onReset);
    this.$customSelect.on('change', this.onChangeBubble);
    this.$customSelect.on('select2:open', this.onOpen);
  }
  destroy() {
    this.$customSelect.select2('destroy');
    document.removeEventListener('reset', this.onReset);
  }
}
class CustomSelectCollection {
  /**
   * @type {Map<HTMLSelectElement, CustomSelect>}
   */
  static customSelectMap = new Map();
  static init() {
    document.querySelectorAll(CUSTOM_SELECT_SELECTOR).forEach(select => {
      const CustomSelectInstance = new CustomSelect(select);
      CustomSelectCollection.customSelectMap.set(select, CustomSelectInstance);
    });
  }
  static destroyAll() {
    CustomSelectCollection.customSelectMap.forEach(CustomSelect => {
      CustomSelect.destroy();
    });
    CustomSelectCollection.customSelectMap.clear();
  }
}

// export const initCustomSelectComponents = () => {
// 	const $customSelect = $(CUSTOM_SELECT_SELECTOR);

// 	$customSelect.select2({
// 		searchable: true,
// 	});

// 	$customSelect.on('select2:open', function () {
// 		$('.select2-dropdown').attr('data-lenis-prevent', '');
// 		$('.select2-search__field').attr('placeholder', 'Поиск');
// 	});

// 	const bubbleEvent = (e) => {
// 		$customSelect.off('change', bubbleEvent);

// 		e.target.dispatchEvent(
// 			new Event('change', {
// 				bubbles: true,
// 			})
// 		);

// 		$customSelect.on('change', bubbleEvent);
// 	};

// 	$customSelect.on('change', bubbleEvent);

// 	document.addEventListener('reset', (e) => {
// 		$customSelect.val(null).trigger('change');
// 	});
// };

/***/ }),

/***/ "./src/FlippingBook.js":
/*!*****************************!*\
  !*** ./src/FlippingBook.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initFlippingBook: () => (/* binding */ initFlippingBook)
/* harmony export */ });
/* harmony import */ var _ksedline_turnjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ksedline/turnjs */ "./node_modules/@ksedline/turnjs/index.js");
/* harmony import */ var _ksedline_turnjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ksedline_turnjs__WEBPACK_IMPORTED_MODULE_0__);

const ROOT_SELECTOR = '[data-book="flipping-book"]';
const initFlippingBook = () => {
  const $flipping = $(ROOT_SELECTOR);
  let isFlipping = false;
  let wasFlipped = false;
  if ($flipping.length === 0) {
    return;
  }
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $flipping.turn("page", 2);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.8
  });
  observer.observe($flipping.get(0));
  $flipping.turn({
    when: {
      turn: function (e, page, view) {
        const $blockToHide = $(".left-hero-image-clone.left-col");
        if (page > 1) {
          $blockToHide.animate({
            opacity: 0
          }, 500);
        } else {
          $blockToHide.animate({
            opacity: 1
          }, 500);
        }
      },
      turning: function (e, page, view) {
        isFlipping = true;
      },
      turned: function (e, page, view) {
        //if (page > 1) {
        //  wasFlipped = true;
        //} else {
        //  wasFlipped = false;
        //}
        //
        //isFlipping = false;
      }
    }
  });
  if (window.innerWidth < 768) {
    $flipping.turn("page", 2);
  }
  $(".hero-text-box-2").on("click", function (e) {
    e.preventDefault();
    $flipping.turn("page", 2);
  });
  $flipping.on("click", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const $window = $(window);
    const offset = $flipping.offset();
    const top = offset.top + $flipping.height() / 2 - $window.height() / 2;
    const page = $flipping.turn("page");
    window.scrollTo({
      top,
      behavior: "smooth"
    });
    if (isFlipping) {
      return;
    }

    //if (page === 1 && !wasFlipped) {
    //$flipping.turn("page", 2);
    //}
  });
  let startX;
  $flipping.on("pointerdown", function (event) {
    startX = event.clientX;
  });
  $flipping.on("pointerup", function (event) {
    const clickX = event.clientX;
    const halfWidth = $flipping.width() / 2;
    if (Math.abs(clickX - startX) < 50) {
      if (clickX > halfWidth) {
        $flipping.turn("next");
      } else {
        $flipping.turn("previous");
      }
    }
  });
};

// class FlippingBook {
// 	constructor(element) {
// 		this.book = element;
// 		console.log(this.book);

// 		if (!this.book) {
// 			return;
// 		}
// 		this.pages = Array.from(this.book.querySelectorAll('.book-el__page'));
// 		this.bookWidth = this.book.scrollWidth;
// 		this.isAnimating = false;

// 		this.mobileWidthMediaQuery = window.matchMedia('(max-width: 767px)');

// 		this.options = {
// 			maxDisplayPages: 10,
// 			...(this.book.dataset.config ? JSON.parse(this.book.dataset.config) : {}),
// 		};

// 		for (let i = 0; i < this.pages.length; i++) {
// 			const page = this.pages[i];
// 			page.setAttribute('data-page-index', i);
// 			page.style.zIndex = this.pages.length - 1 - i;
// 			page.style.translate = `${this.bookWidth / 2}px`;

// 			if (i > this.options.maxDisplayPages) {
// 				page.style.display = 'none';
// 			}
// 		}

// 		this.visiblePages = this.pages.slice(0, this.options.maxDisplayPages);

// 		this.setPagesWidth();
// 		this.bindEvents();

// 		if (this.mobileWidthMediaQuery.matches) {
// 			this.pages[0].classList.add('book-page--flipped');

// 			setTimeout(() => {
// 				this.pages[0].style.zIndex = 0;
// 			}, 500);
// 		}
// 	}

// 	setPagesWidth() {
// 		for (let index = 0; index < this.visiblePages.length; index++) {
// 			const page = this.visiblePages[index];
// 			const pageWidth =
// 				this.bookWidth / 2 -
// 				piecewiseFunction2(index, this.visiblePages.length - 1);

// 			page.style.width = pageWidth + 'px';
// 		}
// 	}

// 	togglePage(index) {
// 		if (this.isAnimating) {
// 			return;
// 		}

// 		this.isAnimating = true;

// 		this.currentBook = index;
// 		this.visiblePages = [];

// 		for (let i = 0; i < this.pages.length; i++) {
// 			const page = this.pages[i];

// 			if (i < index) {
// 				if (!page.classList.contains('book-page--flipped')) {
// 					page.classList.add('book-page--flipped');
// 					page.style.willChange = 'transform';
// 				}
// 			}

// 			if (i === index) {
// 				page.style.willChange = 'transform';

// 				page.classList.toggle(
// 					'book-page--flipped',
// 					!page.classList.contains('book-page--flipped')
// 				);
// 			}

// 			if (page.classList.contains('book-page--flipped')) {
// 				setTimeout(() => {
// 					page.style.zIndex = 0;
// 				}, 250);
// 			} else {
// 				page.style.zIndex = this.pages.length - 1 - i;
// 			}

// 			// if (i < index - 5 || i > index + 5) {
// 			// 	page.style.display = 'none';
// 			// } else {
// 			// 	page.style.display = null;
// 			// 	this.visiblePages.push(page);
// 			// }
// 		}

// 		this.setPagesWidth();

// 		// for (let i = 0; i < visiblePages.length; i++) {
// 		// 	const page = visiblePages[i];
// 		// 	const pageWidth =
// 		// 		this.bookWidth / 2 - piecewiseFunction2(i, visiblePages.length - 1);

// 		// 	page.style.width = pageWidth + 'px';
// 		// }
// 	}

// 	onResize = throttle(() => {
// 		this.bookWidth = this.book.scrollWidth;

// 		this.setPagesWidth();
// 	}, 100);

// 	/**
// 	 * Bind click event to each page, which will open the page and animate to
// 	 * it. Also, bind transitionend event to each page, which will reset the
// 	 * will-change property and transform property after the animation.
// 	 */
// 	bindEvents() {
// 		this.pages.forEach((page) => {
// 			page.onclick = (event) => {
// 				this.book.parentElement.scrollIntoView({ behavior: 'smooth' });

// 				if (this.isAnimating) {
// 					return;
// 				}

// 				const pageIndex = Number(page.getAttribute('data-page-index'));

// 				if (
// 					this.mobileWidthMediaQuery.matches &&
// 					(pageIndex === 0 || pageIndex === this.pages.length - 1)
// 				) {
// 					return;
// 				}

// 				this.isAnimating = true;

// 				this.visiblePages = [];

// 				// this.togglePage(pageIndex);
// 				page.classList.toggle(
// 					'book-page--flipped',
// 					!page.classList.contains('book-page--flipped')
// 				);

// 				page.style.willChange = 'transform';

// 				if (page.classList.contains('book-page--flipped')) {
// 					setTimeout(() => {
// 						page.style.zIndex = 0;
// 					}, 500);
// 				} else {
// 					page.style.zIndex = this.pages.length - pageIndex;
// 				}

// 				for (let i = 0; i < this.pages.length; i++) {
// 					const page = this.pages[i];

// 					if (i < pageIndex - 10 || i > pageIndex + 10) {
// 						page.style.display = 'none';
// 					} else {
// 						page.style.display = null;
// 						this.visiblePages.push(page);
// 					}
// 				}

// 				this.setPagesWidth();
// 			};

// 			page.ontransitionend = (event) => {
// 				page.style.removeProperty('will-change');
// 				page.style.removeProperty('transform');

// 				this.isAnimating = false;
// 			};
// 		});

// 		window.addEventListener('resize', this.onResize);
// 	}

// 	destroy() {
// 		window.removeEventListener('resize', this.onResize);
// 	}
// }

// export default class FlippingBookCollection {
// 	/**
// 	 * @type {Map<HTMLElement, FlippingBook>}
// 	 */
// 	static flippingBookMap = new Map();

// 	static init() {
// 		document.querySelectorAll(ROOT_SELECTOR).forEach((element) => {
// 			const FlippingBookInstance = new FlippingBook(element);

// 			FlippingBookCollection.flippingBookMap.set(element, FlippingBookInstance);
// 		});
// 	}

// 	static destroyAll() {
// 		FlippingBookCollection.flippingBookMap.forEach((flippingBook) => {
// 			flippingBook.destroy();
// 		});
// 		FlippingBookCollection.flippingBookMap.clear();
// 	}
// }

/***/ }),

/***/ "./src/LoadMorePassedEventsButton.js":
/*!*******************************************!*\
  !*** ./src/LoadMorePassedEventsButton.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initLoadMorePassedEventsButtons: () => (/* binding */ initLoadMorePassedEventsButtons)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");

const ROOT_SELECTOR = '[data-js-load-more-passed-events]';
const initLoadMorePassedEventsButtons = () => {
  document.querySelectorAll(ROOT_SELECTOR).forEach(button => {
    console.log(button);

    /**
     *
     * @param {PointerEvent} event
     */
    button.onclick = async event => {
      event.preventDefault();
      event.stopPropagation();
      try {
        const formData = new FormData();
        const page = parseInt(button.dataset.page) + 1;
        formData.append('action', 'load_more_passed_events');
        formData.append('page', page);
        formData.append('nonce', button.dataset.nonce);
        const response = await fetch(BKSQ.AJAX_URL, {
          method: 'POST',
          body: formData
        });
        const {
          success,
          data
        } = await response.json();
        console.log({
          success,
          data
        });
        if (!success) {
          console.error(data.message);
          return;
        }
        document.querySelector(button.dataset.outputSelector).innerHTML += data.html;
        if (data.page >= parseInt(button.dataset.maxPages)) {
          button.disabled = true;
          button.hidden = true;
        }
      } catch (error) {
        console.error(error);
      }
    };
  });
};

/***/ }),

/***/ "./src/MagazineActionSwitcher.js":
/*!***************************************!*\
  !*** ./src/MagazineActionSwitcher.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initMagazineActionSwitcher: () => (/* binding */ initMagazineActionSwitcher)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");

const initMagazineActionSwitcher = () => {
  const queryParams = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getQueryParams)();
  if (!queryParams.magazineAction) {
    return;
  }
  const switcherInputs = document.querySelector('.switcher').querySelectorAll('input[type="radio"][name="switcher"]');
  if (queryParams.magazineAction === 'read') {
    switcherInputs.forEach(input => {
      if (input.value === 'Где почитать') {
        input.checked = true;
      } else {
        input.checked = false;
      }
    });
  }
};

/***/ }),

/***/ "./src/MagazineForm.js":
/*!*****************************!*\
  !*** ./src/MagazineForm.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initMagazineForms: () => (/* binding */ initMagazineForms)
/* harmony export */ });
/* harmony import */ var _Validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Validator */ "./src/Validator.js");

function initMagazineForms() {
  const MAGAZINE_FORM_SELECTOR = '.mag-form';
  const FIELD_CONTAINER_SELECTOR = '.form-field-wrap';
  const INVALID_FIELD_SELECTOR = '.form-field-wrap--invalid';
  $(document.body).append(`<style>${INVALID_FIELD_SELECTOR} { color: red; }</style>`);
  $(MAGAZINE_FORM_SELECTOR).each(function () {
    const $form = $(this);
    const $requiredFields = $form.find('[required]');
    $requiredFields.on('input', function () {
      $(this.closest(FIELD_CONTAINER_SELECTOR)).removeClass(INVALID_FIELD_SELECTOR.replace('.', ''));
    });
    function validateField($field) {
      let isValid = true;
      const type = $field.attr('type');
      switch (type) {
        case 'checkbox':
        case 'radio':
          isValid = _Validator__WEBPACK_IMPORTED_MODULE_0__.Validator.isChecked($field);
          break;
        case 'email':
          isValid = _Validator__WEBPACK_IMPORTED_MODULE_0__.Validator.isValidEmail($field.val());
          break;
        case 'tel':
          isValid = _Validator__WEBPACK_IMPORTED_MODULE_0__.Validator.isValidPhone($field.val());
          break;
        default:
          isValid = !_Validator__WEBPACK_IMPORTED_MODULE_0__.Validator.isEmpty($field);
          break;
      }
      return isValid;
    }
    $requiredFields.on('change', function () {
      let isValid = validateField($(this));
      $(this).closest(FIELD_CONTAINER_SELECTOR).toggleClass(INVALID_FIELD_SELECTOR.replace('.', ''), !isValid);
    });
    $form.on('submit', function (e) {
      let isValid = true;
      const requiredFieldsArray = $requiredFields.toArray();
      for (let i = 0; i < requiredFieldsArray.length; i++) {
        const $field = $(requiredFieldsArray[i]);
        isValid = validateField($field);
        if (!isValid) {
          break;
        }
        $field.closest(FIELD_CONTAINER_SELECTOR).toggleClass(INVALID_FIELD_SELECTOR.replace('.', ''), !isValid);
      }
      if (!isValid) {
        return false;
      }
    });
    $form.attr('novalidate', 'true');
    // $form.parent().removeClass('w-form');
  });
}

/***/ }),

/***/ "./src/MagazineMap.js":
/*!****************************!*\
  !*** ./src/MagazineMap.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initMagazineMaps: () => (/* binding */ initMagazineMaps)
/* harmony export */ });
function initMagazineMaps() {
  function cleanString(str) {
    return str.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  }
  //document.addEventListener('DOMContentLoaded', function (scriptTag) {
  const SELECT_SELECTOR = '.hidden-select';
  const DROPDOWN_LINK = '.form-drop-link'; // set your dropdown item class
  const PLACEHOLDER = '.is-drop-placeholder'; // set your droptoggle placeholder class
  const ACTIVE = '.is-active1'; //set your active-link class

  const selects = document.querySelectorAll(SELECT_SELECTOR);
  selects.forEach(select => {
    let parent = select.parentNode.parentNode;
    let dropdown = parent.querySelector('.w-dropdown');
    const options = select.querySelectorAll('option');
    const dropdownLinks = Array.from(dropdown.querySelectorAll(DROPDOWN_LINK));
    let selectedLinks = [];
    options.forEach(option => {
      option.value = cleanString(option.value);
    });
    function setupValues() {
      const values = $(select).val();
      $(PLACEHOLDER).text(values.join(', '));
      selectedLinks = [];
      dropdownLinks.forEach(dropdownLink => {
        dropdownLink.classList.remove(ACTIVE.replace('.', ''));
      });
      values.forEach(value => {
        dropdownLinks.forEach(dropdownLink => {
          if (cleanString(dropdownLink.textContent) === value) {
            dropdownLink.classList.add(ACTIVE.replace('.', ''));
            selectedLinks.push(dropdownLink);
          }
        });
      });
    }
    setupValues();
    $(select).hide();
    $(select).on('change', function () {
      setupValues();
    });
    dropdown.querySelectorAll(DROPDOWN_LINK).forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        if (link.classList.contains(ACTIVE.replace('.', ''))) {
          if (selectedLinks.length === 1) {
            return;
          }
          link.classList.remove(ACTIVE.replace('.', ''));
        } else {
          link.classList.add(ACTIVE.replace('.', ''));
        }
        const selectedValues = Array.from(dropdown.querySelectorAll(DROPDOWN_LINK + ACTIVE)).map(dropdownLink => dropdownLink.textContent).map(cleanString);
        select.querySelectorAll('option').forEach(option => {
          if (selectedValues.includes(cleanString(option.value))) {
            option.selected = true;
          } else {
            option.selected = false;
          }
        });
        select.dispatchEvent(new Event('change'));
        let event = new Event('w-close');
        dropdown.dispatchEvent(event);
      });
    });
  });
  //});
}

/***/ }),

/***/ "./src/MagazineYandexMap.js":
/*!**********************************!*\
  !*** ./src/MagazineYandexMap.js ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initMagazineYandexMap: () => (/* binding */ initMagazineYandexMap)
/* harmony export */ });
/* harmony import */ var ymaps3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ymaps3 */ "ymaps3");
/* harmony import */ var _mapCustomizationConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mapCustomizationConfig */ "./src/mapCustomizationConfig.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ymaps3__WEBPACK_IMPORTED_MODULE_0__]);
ymaps3__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
/* harmony import */ var ymaps3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ymaps3__WEBPACK_IMPORTED_MODULE_0__);


const initMagazineYandexMap = async () => {
  console.log('initMap');
  const mapContainerElement = document.getElementById('map');
  if (!mapContainerElement) {
    return null;
  }
  await ymaps3__WEBPACK_IMPORTED_MODULE_0__.ready;
  const {
    YMapComplexEntity,
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker
  } = ymaps3__WEBPACK_IMPORTED_MODULE_0__;
  const map = new YMap(mapContainerElement, {
    behaviors: ['drag', 'pinchZoom', 'mouseTilt', 'dblClick'],
    location: {
      center: [37.588144, 55.733842],
      zoom: 10
    }
  });
  const form = document.querySelector('.filter-form');
  let state = {};
  let selectedLocations = [];
  const setupCities = () => {
    const citySelect = document.querySelector('select[name="city"]');
    const cities = [...new Set(window.locations.map(loc => loc.city))];
    const cityOptions = cities.map(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      return option;
    });
    cityOptions.forEach(option => {
      citySelect.append(option);
    });
  };
  const setupLocations = async () => {
    if (selectedLocations.length > 0) {
      selectedLocations.forEach(loc => {
        map.removeChild(loc);
      });
    }
    const newState = Object.fromEntries(new FormData(form).entries());
    if (state.city !== newState.city) {
      const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&geocode=${encodeURIComponent(newState.city)}&format=json`);
      const json = await response.json();
      if (json.response.GeoObjectCollection.featureMember.length === 0) {
        throw new Error('City not found');
      }
      const coordinates = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(Number);
      map.setLocation({
        center: coordinates,
        zoom: 12
      });
    }
    selectedLocations = window.locations.filter(loc => {
      const isSameCity = loc.city === newState.city;
      return isSameCity && loc.categories.includes(newState.switcher);
    });
    selectedLocations = selectedLocations.map(loc => {
      return new CustomMarkerWithPopup(loc);
    });
    selectedLocations.forEach(loc => {
      map.addChild(loc);
    });
    state = newState;
  };
  setupCities();
  map.addChild(new YMapDefaultSchemeLayer({
    customization: _mapCustomizationConfig__WEBPACK_IMPORTED_MODULE_1__.customization,
    theme: 'dark'
  }));
  map.addChild(new YMapDefaultFeaturesLayer({}));
  form.onchange = setupLocations;
  setupLocations();
  class CustomMarkerWithPopup extends YMapComplexEntity {
    constructor(options) {
      super(options);
      this._marker = null;
      this._popup = null;
      this._closePopupBodyClickHandler = this._closePopupBodyClickHandler.bind(this);
    }

    // Handler for attaching the control to the map
    _onAttach() {
      this._createMarker();
    }
    // Handler for detaching control from the map
    _onDetach() {
      this._marker = null;
      document.body.removeEventListener('click', this._closePopupBodyClickHandler);
    }
    // Handler for updating marker properties
    _onUpdate(props) {
      if (props.zIndex !== undefined) {
        this._marker?.update({
          zIndex: props.zIndex
        });
      }
      if (props.coordinates !== undefined) {
        this._marker?.update({
          coordinates: props.coordinates
        });
      }
    }
    // Method for creating a marker element
    _createMarker() {
      const element = document.createElement('div');
      element.className = 'marker';
      element.onclick = () => {
        this._openPopup();
        map.setLocation({
          center: this._props.coordinates,
          duration: 800
        });
      };
      this._marker = new YMapMarker({
        coordinates: this._props.coordinates
      }, element);
      this.addChild(this._marker);
    }
    _closePopupBodyClickHandler(event) {
      if (!event.target.closest('.popup') && event.target !== this._marker.element) {
        this._closePopup();
      }
    }

    // Method for creating a popup window element
    _openPopup() {
      var _this$_props$zIndex;
      if (this._popup) {
        return;
      }
      this._marker.element.classList.add('marker--selected');
      const element = document.createElement('div');
      element.className = 'popup';
      const headerElement = document.createElement('header');
      headerElement.className = 'popup__header';
      headerElement.textContent = this._props.title;
      const bodyElement = document.createElement('div');
      bodyElement.className = 'popup__body';
      bodyElement.textContent = this._props.address;
      if (this._props.linkToShop) {
        const separatorElement = document.createElement('div');
        separatorElement.className = 'popup__separator';
        bodyElement.append(separatorElement);
        const linkElement = document.createElement('a');
        linkElement.className = 'popup__link';
        linkElement.href = this._props.linkToShop;
        linkElement.textContent = 'Купить онлайн';
        linkElement.target = '_blank';
        bodyElement.append(linkElement);
      }
      if (this._props.additionalInfo) {
        const additionalInfoElement = document.createElement('div');
        additionalInfoElement.className = 'popup__additional-info';
        additionalInfoElement.textContent = this._props.additionalInfo;
        bodyElement.append(additionalInfoElement);
      }

      // const closeBtn = document.createElement('button');
      // closeBtn.className = 'popup__close';
      // closeBtn.textContent = 'Close Popup';
      // closeBtn.onclick = () => this._closePopup();

      element.append(headerElement, bodyElement);
      document.body.addEventListener('click', this._closePopupBodyClickHandler);
      const zIndex = ((_this$_props$zIndex = this._props.zIndex) !== null && _this$_props$zIndex !== void 0 ? _this$_props$zIndex : YMapMarker.defaultProps.zIndex) + 1_000;
      this._popup = new YMapMarker({
        coordinates: this._props.coordinates,
        zIndex,
        // This allows you to scroll over popup
        blockBehaviors: this._props.blockBehaviors
      }, element);
      this.addChild(this._popup);
    }
    _closePopup() {
      if (!this._popup) {
        return;
      }
      this.removeChild(this._popup);
      this._popup = null;
      this._marker?.element?.classList.remove('marker--selected');
    }
  }
  return () => {
    map.destroy();
  };
};
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./src/NumberInput.js":
/*!****************************!*\
  !*** ./src/NumberInput.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initNumberInputs: () => (/* binding */ initNumberInputs)
/* harmony export */ });
const initNumberInputs = () => {
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.oninput = e => {
      e.target.value = e.target.value.replace(/\D+/g, '');
    };
  });
};

/***/ }),

/***/ "./src/ObserverController.js":
/*!***********************************!*\
  !*** ./src/ObserverController.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObserverController: () => (/* binding */ ObserverController)
/* harmony export */ });
class ObserverController {
  /**
   * @type {Map<string, IntersectionObserver>}
   */
  static observerMap = new Map();
  static init() {
    const observerCallbacks = {
      '.scrollobs': (entries, observer) => {
        entries.forEach(async entry => {
          if (entry.isIntersecting) {
            $(entry.target).addClass('visible');
          } else {}
        });
      },
      '.scrollobs-line': (entries, observer) => {
        entries.forEach(async entry => {
          if (entry.isIntersecting) {
            $(entry.target).addClass('visible');
          } else {}
        });
      },
      '.scrollobs-opc': (entries, observer) => {
        entries.forEach(async entry => {
          if (entry.isIntersecting) {
            $(entry.target).addClass('visible');
          } else {}
        });
      }
    };
    for (const selector in observerCallbacks) {
      if (Object.prototype.hasOwnProperty.call(observerCallbacks, selector)) {
        const callback = observerCallbacks[selector];
        const observer = new IntersectionObserver(callback, {
          threshold: 0
        });
        document.querySelectorAll(selector).forEach(element => {
          observer.observe(element);
        });
        ObserverController.observerMap.set(selector, observer);
      }
    }
  }
  static disconnectAll() {
    ObserverController.observerMap.forEach(observer => observer.disconnect());
    ObserverController.observerMap.clear();
  }
}

// document.querySelectorAll('.scrollobs').forEach((trigger) => {
// 	new IntersectionObserver(
// 		(entries, observer) => {
// 			entries.forEach(async (entry) => {
// 				if (entry.isIntersecting) {
// 					$(entry.target).addClass('visible');
// 				} else {
// 				}
// 			});
// 		},
// 		{
// 			threshold: 0,
// 		}
// 	).observe(trigger);
// });

// document.querySelectorAll('.scrollobs-line').forEach((trigger) => {
// 	new IntersectionObserver(
// 		(entries, observer) => {
// 			entries.forEach(async (entry) => {
// 				if (entry.isIntersecting) {
// 					$(entry.target).addClass('visible');
// 				} else {
// 				}
// 			});
// 		},
// 		{
// 			threshold: 0,
// 		}
// 	).observe(trigger);
// });

// document.querySelectorAll('.scrollobs-opc').forEach((trigger) => {
// 	new IntersectionObserver(
// 		(entries, observer) => {
// 			entries.forEach(async (entry) => {
// 				if (entry.isIntersecting) {
// 					$(entry.target).addClass('visible');
// 				} else {
// 				}
// 			});
// 		},
// 		{
// 			threshold: 0,
// 		}
// 	).observe(trigger);
// });

/***/ }),

/***/ "./src/ShareButton.js":
/*!****************************!*\
  !*** ./src/ShareButton.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShareButton: () => (/* binding */ ShareButton)
/* harmony export */ });
const ROOT_SELECTOR = '[data-js-share-button]';
class ShareButton {
  selectors = {
    root: ROOT_SELECTOR
  };

  /**
   *
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.root = element;
    this.bindEvents();
  }
  bindEvents() {
    document.addEventListener('click', event => {
      const button = event.target.closest(this.selectors.root);
      if (!button) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (navigator.share) {
        navigator.share({
          title: button.dataset.title,
          url: button.dataset.url
        });
      }
    });
  }
}

/***/ }),

/***/ "./src/SplideSlider.js":
/*!*****************************!*\
  !*** ./src/SplideSlider.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initSplideSliders: () => (/* binding */ initSplideSliders)
/* harmony export */ });
/* harmony import */ var _splidejs_splide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @splidejs/splide */ "./node_modules/@splidejs/splide/dist/js/splide.esm.js");

const initSplideSliders = () => {
  document.querySelectorAll('.slider').forEach(swiperElement => {
    var splide = new _splidejs_splide__WEBPACK_IMPORTED_MODULE_0__["default"](swiperElement, {
      // 		type: 'loop',
      perMove: 1,
      perPage: 2.5,
      pagination: false,
      arrows: false,
      focus: 'left',
      speed: 400,
      //	trimSpace: false,
      wheelMinThreshold: 50,
      // releaseWheel: true,
      // wheelSleep: 500,
      // wheel: true,
      autoplay: false,
      drag: true,
      interval: 2000,
      // wheel: true,
      // waitForTransition: true,
      // 		direction: 'ltr',
      breakpoints: {
        991: {},
        767: {
          perPage: 1
        }
      }
    });
    splide.mount();
  });
  document.querySelectorAll('.slider-loop').forEach(swiperElement2 => {
    var splide = new _splidejs_splide__WEBPACK_IMPORTED_MODULE_0__["default"](swiperElement2, {
      // 		type: 'loop',
      perMove: 1,
      perPage: 1.2,
      wheelMinThreshold: 50,
      releaseWheel: true,
      wheelSleep: 500,
      wheel: true,
      pagination: false,
      wheel: true,
      arrows: false,
      focus: 'сenter',
      speed: 500,
      autoplay: false,
      drag: true,
      interval: 2000,
      focus: 'center',
      // wheel: true,
      // waitForTransition: true,
      direction: 'ltr',
      breakpoints: {
        991: {},
        767: {
          perPage: 1
        }
      }
    });

    // 	 var bar    = splide.root.querySelector( '.my-carousel-progress-bar' );
    splide.on('mounted move', function () {
      console.log('dsds');
      var end = splide.Components.Controller.getEnd() + 1;
      var rate = Math.min((splide.index + 1) / end, 1);
      var progggg = String(100 * rate) + '%';
      console.log(progggg);
      $('.my-slider-progress-bar').css('width', progggg);
      // bar.style.width = String( 100 * rate ) + '%';
    });
    splide.mount();
  });
};

/***/ }),

/***/ "./src/Validator.js":
/*!**************************!*\
  !*** ./src/Validator.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Validator: () => (/* binding */ Validator)
/* harmony export */ });
class Validator {
  /**
   * @param {string} email
   * @returns {boolean}
   */
  static isValidEmail(email) {
    console.log(email);
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * @param {string} phone
   * @returns {boolean}
   */
  static isValidPhone(phone) {
    const cleanedPhone = phone.replace(/[^+\d]/g, ''); // Удаляем все символы кроме цифр и плюса
    const re = /^(?:\+)?([0-9]{6,14})$/; // Допускаем наличие или отсутствие плюса в начале
    return re.test(cleanedPhone);
  }

  /**
   * @param {HTMLInputElement} checkbox
   * @returns {boolean}
   */
  static isChecked(checkbox) {
    if (checkbox instanceof jQuery) {
      return checkbox.is(':checked');
    }
    return checkbox.checked;
  }
  static isEmpty(field) {
    if (field instanceof jQuery) {
      return !field.val();
    }
    return !field.value;
  }
}

/***/ }),

/***/ "./src/VladsScripts.js":
/*!*****************************!*\
  !*** ./src/VladsScripts.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initVladsScripts: () => (/* binding */ initVladsScripts)
/* harmony export */ });
const initVladsScripts = () => {
  $('.team-tab-link').each(function () {
    var position = $(this).position();
    var left = position.left;
    $(this).attr('data-scroll', left);
  });
  if (window.innerWidth <= 475) {
    $('.left-hero-image-clone.left-col').on('click', function () {
      document.getElementsByClassName('div-block-3')[0].scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
  window.addEventListener('resize', function (event) {
    $('.team-tab-link').each(function () {
      var position = $(this).position();
      var left = position.left;
      $(this).attr('data-scroll', left);
    });
  }, true);
  $('.team-tab-link').on('click', function () {
    var scroll = $(this).attr('data-scroll');
    $('.team-tabs-menu').animate({
      scrollLeft: scroll
    }, 600);
  });
  $('.team-tab-pane.active').removeClass('active');
  $('.team-tab-pane').eq(0).addClass('active');
  $('.team-tab-link.active').removeClass('active');
  $('.team-tab-link').eq(0).addClass('active');
  $('.team-tab-link').on('click', function () {
    var index = $(this).index();
    $('.team-tab-link.active').removeClass('active');
    $(this).addClass('active');
    $('.team-tab-pane.active').removeClass('active');
    $('.team-tab-pane').eq(index).addClass('active');
  });
  $('.ms5-box').on('click', function () {
    var index = $(this).index();
    $('.popup-wrapper.mag').eq(index).addClass('active');
  });
  $('.ms4-image-box').on('click', function () {
    $('.mag5-popup-wrapper.mag').addClass('active');
  });
  $('.sw-btn').on('click', function () {
    $('.sw-btn').toggleClass('active');
    if ($(this).hasClass('map-bbtn')) {
      $('.afisha-core').addClass('showmap');
    } else {
      $('.afisha-core').removeClass('showmap');
    }
  });
  $('.close-popup').on('click', function () {
    $('.popup-wrapper.active').removeClass('active');
  });
  $('.popup-bg-overlay').on('click', function () {
    $('.popup-wrapper.active').removeClass('active');
  });
  $('.mob-btn').on('click', function () {
    $('html').toggleClass('menuopened');
  });
  $('.viewallpop').on('click', function () {
    $('.popup-wrapper.see-all-popup-wrapper').addClass('active');
  });
  $('.cons-s6-left.active').removeClass('active');
  $('.cons-s6-left').eq(0).addClass('active');
  $('.consultant-box').hover(function () {
    var index = $(this).index();
    $('.consultant-box.active').removeClass('active');
    $(this).addClass('active');
    $('.cons-s6-left.active').removeClass('active');
    $('.cons-s6-left').eq(index).addClass('active');
  });
};

/***/ }),

/***/ "./src/acceptCookie.js":
/*!*****************************!*\
  !*** ./src/acceptCookie.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initCookies: () => (/* binding */ initCookies)
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");

const initCookies = () => {
  $(document).ready(function () {
    $('.show-coocky').on('click', function () {
      $('.popup-overlay').show();
    });
    $('#accept').on('click', function () {
      js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].set('alert', true, {
        expires: 365
      });
    });
    if (!js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get('alert')) {
      $('.popup-overlay').show();
    }
  });
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var barba_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! barba.js */ "./node_modules/barba.js/dist/barba.js");
/* harmony import */ var barba_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(barba_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AfishaFilterForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AfishaFilterForm */ "./src/AfishaFilterForm.js");
/* harmony import */ var _CustomDatepicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CustomDatepicker */ "./src/CustomDatepicker.js");
/* harmony import */ var _CustomSelect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CustomSelect */ "./src/CustomSelect.js");
/* harmony import */ var _LoadMorePassedEventsButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LoadMorePassedEventsButton */ "./src/LoadMorePassedEventsButton.js");
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
/* harmony import */ var _acceptCookie__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./acceptCookie */ "./src/acceptCookie.js");
/* harmony import */ var _NumberInput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./NumberInput */ "./src/NumberInput.js");
/* harmony import */ var _videos__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./videos */ "./src/videos.js");
/* harmony import */ var _VladsScripts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./VladsScripts */ "./src/VladsScripts.js");
/* harmony import */ var _SplideSlider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SplideSlider */ "./src/SplideSlider.js");
/* harmony import */ var _lenis__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./lenis */ "./src/lenis.js");
/* harmony import */ var _ObserverController__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ObserverController */ "./src/ObserverController.js");
/* harmony import */ var _MagazineForm__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MagazineForm */ "./src/MagazineForm.js");
/* harmony import */ var _AfishaPopupStaff__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./AfishaPopupStaff */ "./src/AfishaPopupStaff.js");
/* harmony import */ var _MagazineMap__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./MagazineMap */ "./src/MagazineMap.js");
/* harmony import */ var _BookSlider__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./BookSlider */ "./src/BookSlider.js");
/* harmony import */ var _FlippingBook__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./FlippingBook */ "./src/FlippingBook.js");
/* harmony import */ var _MagazineYandexMap__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./MagazineYandexMap */ "./src/MagazineYandexMap.js");
/* harmony import */ var _jQueryCustomSelect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./jQueryCustomSelect */ "./src/jQueryCustomSelect.js");
/* harmony import */ var _MagazineActionSwitcher__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./MagazineActionSwitcher */ "./src/MagazineActionSwitcher.js");
/* harmony import */ var _ShareButton__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./ShareButton */ "./src/ShareButton.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_AfishaFilterForm__WEBPACK_IMPORTED_MODULE_1__, _MagazineYandexMap__WEBPACK_IMPORTED_MODULE_18__]);
([_AfishaFilterForm__WEBPACK_IMPORTED_MODULE_1__, _MagazineYandexMap__WEBPACK_IMPORTED_MODULE_18__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
console.log('bundle.js start');























window.magazineYandexMapDestroyCallback = null;
new _ShareButton__WEBPACK_IMPORTED_MODULE_21__.ShareButton();
if (location.hash) {
  (0,_utils__WEBPACK_IMPORTED_MODULE_22__.pageScroll)(location.hash);
}
$(function () {
  console.log('DOMContentLoaded');
  initPage();
  initHomePage();
  initAfishaPage();
  initSingleMagazinePage();
  barba_js__WEBPACK_IMPORTED_MODULE_0___default().Pjax.start();
  barba_js__WEBPACK_IMPORTED_MODULE_0___default().Prefetch.init();
  var FadeTransition = barba_js__WEBPACK_IMPORTED_MODULE_0___default().BaseTransition.extend({
    start: function () {
      this.newContainerLoading.then(this.perehod.bind(this)).then(this.fadeOut.bind(this)).then(this.fadeIn.bind(this));
    },
    perehod: function () {
      _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.stop();
      $('html').addClass('perehod');
    },
    fadeOut: function () {
      return $(this.oldContainer).animate({
        visibility: 'visible'
      }, 4000).promise();
    },
    fadeIn: function () {
      $(window).scrollTop(0);
      var _this = this;
      _this.done();
      $('html').removeClass('menuopened');
      $('html').addClass('perehoddone');
      setTimeout(function () {
        $('html').removeClass('perehod');
        $('html').removeClass('perehoddone');
      }, 2_000);
      Webflow.destroy();
      Webflow.ready();
      Webflow.require('ix2').init();
      _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
      if (location.hash) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_22__.pageScroll)(location.hash, 250);
      }
    }
  });
  (barba_js__WEBPACK_IMPORTED_MODULE_0___default().Pjax).getTransition = function () {
    return FadeTransition;
  };
  barba_js__WEBPACK_IMPORTED_MODULE_0___default().Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container, newPageRawHTML) {
    var response = newPageRawHTML.replace(/(<\/?)html( .+?)?>/gi, '$1nothtml$2>', newPageRawHTML);
    var bodyClasses = $(response).filter('nothtml').attr('data-wf-page');
    $('html').attr('data-wf-page', bodyClasses);
  });
  barba_js__WEBPACK_IMPORTED_MODULE_0___default().Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container) {
    // Найдем все скрипты на новой странице
    var scripts = container.querySelectorAll('script');
    scripts.forEach(function (script) {
      // Если у скрипта есть src, создаем новый элемент script
      if (script.src) {
        var newScript = document.createElement('script');
        newScript.src = script.src;
        document.body.appendChild(newScript);
      }
      // Для инлайновых скриптов
      else {
        eval(script.innerHTML);
      }
    });
  });
  barba_js__WEBPACK_IMPORTED_MODULE_0___default().Dispatcher.on('initStateChange', () => {
    $('html').removeClass('popupopened');
    _BookSlider__WEBPACK_IMPORTED_MODULE_16__["default"].destroyAll();
    _CustomDatepicker__WEBPACK_IMPORTED_MODULE_2__["default"].destroyAll();
    _CustomSelect__WEBPACK_IMPORTED_MODULE_3__["default"].destroyAll();
    _AfishaFilterForm__WEBPACK_IMPORTED_MODULE_1__["default"].destroyAll();
    _ObserverController__WEBPACK_IMPORTED_MODULE_12__.ObserverController.disconnectAll();
  });
  barba_js__WEBPACK_IMPORTED_MODULE_0___default().Dispatcher.on('transitionCompleted', function (currentStatus, prevStatus) {
    initPage();
    const actions = {
      afisha: initAfishaPage,
      homepage: initHomePage.bind(null, false),
      'single-magazine': initSingleMagazinePage
    };
    actions[currentStatus.namespace]();
  });
  (barba_js__WEBPACK_IMPORTED_MODULE_0___default().Pjax).originalPreventCheck = (barba_js__WEBPACK_IMPORTED_MODULE_0___default().Pjax).preventCheck;
  (barba_js__WEBPACK_IMPORTED_MODULE_0___default().Pjax).preventCheck = function (evt, element) {
    if (element && element.getAttribute('href') && element.getAttribute('href').indexOf('#') > -1) return true;else return barba_js__WEBPACK_IMPORTED_MODULE_0___default().Pjax.originalPreventCheck(evt, element);
  };
});
function initPage() {
  console.log('initPage');
  (0,_videos__WEBPACK_IMPORTED_MODULE_8__.initVideos)();
  (0,_acceptCookie__WEBPACK_IMPORTED_MODULE_6__.initCookies)();
  initLenisButtons();
  (0,_NumberInput__WEBPACK_IMPORTED_MODULE_7__.initNumberInputs)();
  // initVladsScripts();
  (0,_SplideSlider__WEBPACK_IMPORTED_MODULE_10__.initSplideSliders)();
  _ObserverController__WEBPACK_IMPORTED_MODULE_12__.ObserverController.init();
  (0,_MagazineForm__WEBPACK_IMPORTED_MODULE_13__.initMagazineForms)();
  initSomeStaff();
}
function initSomeStaff() {
  $('.team-tab-link').each(function () {
    var position = $(this).position();
    var left = position.left;
    $(this).attr('data-scroll', left);
  });
  if (window.innerWidth <= 475) {
    $('.left-hero-image-clone.left-col').on('click', function () {
      document.getElementsByClassName('div-block-3')[0].scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
  window.addEventListener('resize', function (event) {
    $('.team-tab-link').each(function () {
      var position = $(this).position();
      var left = position.left;
      $(this).attr('data-scroll', left);
    });
  }, true);
  $('.team-tab-link').on('click', function () {
    var scroll = $(this).attr('data-scroll');
    $('.team-tabs-menu').animate({
      scrollLeft: scroll
    }, 600);
  });
  $('.team-tab-pane.active').removeClass('active');
  $('.team-tab-pane').eq(0).addClass('active');
  $('.team-tab-link.active').removeClass('active');
  $('.team-tab-link').eq(0).addClass('active');
  $('.team-tab-link').on('click', function () {
    var index = $(this).index();
    $('.team-tab-link.active').removeClass('active');
    $(this).addClass('active');
    $('.team-tab-pane.active').removeClass('active');
    $('.team-tab-pane').eq(index).addClass('active');
  });
  $('.ms5-box').on('click', function () {
    var index = $(this).index();
    $('.popup-wrapper.mag').eq(index).addClass('active');
  });
  $('.ms4-image-box').on('click', function () {
    $('.mag5-popup-wrapper.mag').addClass('active');
  });
  const afishaListMapToggleButtons = document.querySelectorAll('.sw-btn');
  afishaListMapToggleButtons.forEach(button => {
    /**
     *
     * @param {PointerEvent} event
     */
    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      afishaListMapToggleButtons.forEach(b => {
        b.classList.remove('active');
      });
      button.classList.add('active');
      const afishaContentContainer = document.querySelector('.afisha-core');
      const isMapButton = button.classList.contains('map-bbtn');
      afishaContentContainer.classList.toggle('showmap', isMapButton);
      if (isMapButton) {
        _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.scrollTo(afishaContentContainer, {
          immediate: true,
          lock: true
        });
      }
    };
  });
  $('.close-popup').on('click', function () {
    $('.popup-wrapper.active').removeClass('active');
  });
  $('.popup-bg-overlay').on('click', function () {
    $('.popup-wrapper.active').removeClass('active');
  });
  $('.mob-btn').on('click', function () {
    $('html').toggleClass('menuopened');
  });
  $('.viewallpop').on('click', function () {
    $('.popup-wrapper.see-all-popup-wrapper').addClass('active');
  });
  $('.cons-s6-left.active').removeClass('active');
  $('.cons-s6-left').eq(0).addClass('active');
  $('.consultant-box').hover(function () {
    var index = $(this).index();
    $('.consultant-box.active').removeClass('active');
    $(this).addClass('active');
    $('.cons-s6-left.active').removeClass('active');
    $('.cons-s6-left').eq(index).addClass('active');
  });

  //app()

  if ($('.mag-form').length) {
    const $form = $('form');
    const $submitBtn = $("input[type='submit']", $form);
    const $btnsGroup = $submitBtn.parent();
    if ($btnsGroup.children().length === 2) {
      const submitText = $submitBtn.data('wait');
      const $newSubmitBtn = $btnsGroup.find('a');
      $submitBtn.css('display', 'none');
      $newSubmitBtn.click(function (e) {
        e.preventDefault();
        $submitBtn.click();
      });
      $form.on('submit', function () {
        $newSubmitBtn.text(submitText);
      });
    }
  }
  if ($('.div-block-3').length) {
    var widthlist = $('.div-block-3').width();
    console.log(widthlist);
    var ch = widthlist.toFixed();
    console.log(ch);
    $('.hero-image-column-2.main-ggl').css('width', ch);
    $('#flipping').on('click', function () {
      $('.hero-image-column-2.main-ggl').addClass('bluere');
      setTimeout(function () {
        $('.hero-image-column-2.main-ggl').removeClass('bluere');
      }, 600);
    });
  }
}
function initLenisButtons() {
  $('[data-lenis-start]').on('click', function () {
    _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
  });
  $('[data-lenis-stop]').on('click', function () {
    _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.stop();
  });
  $('[data-lenis-toggle]').on('click', function () {
    $(this).toggleClass('stop-scroll');
    if ($(this).hasClass('stop-scroll')) {
      _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.stop();
    } else {
      _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
    }
  });
}
function countTo100(currentCount) {
  if (currentCount < 100) {
    $('#loadertext').text(currentCount);
    setTimeout(function () {
      countTo100(currentCount + 1);
    }, 10);
  } else if (currentCount > 98) {
    $('#loadertext').text(100);
    $('html').removeClass('startloaded');
    $('html').addClass('loaded');
    _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
  } else {
    $('html').removeClass('startloaded');
    $('html').addClass('loaded');
    _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
  }
}
function initHomePage(isFirtsLoad = true) {
  _BookSlider__WEBPACK_IMPORTED_MODULE_16__["default"].init();
  (0,_FlippingBook__WEBPACK_IMPORTED_MODULE_17__.initFlippingBook)();
  if ($('.home-page').length) {
    // 	  $('.s7-left').find('img').attr('src', $(".s7-right").find("img").attr("src"));

    if ($('.home-page').hasClass('hp2')) {
      if (isFirtsLoad) {
        setTimeout(function () {
          $('html').addClass('startloaded');
          $('video').each(function () {
            $(this)[0].play();
          });
        }, 10_000);

        //	$('#520b82ca-5889-57f3-7d4d-af38d7e037a1-video').removeAttr( "loop" );

        $('#fa638008-8774-3ace-e4f6-f7ea57a4cabb-video').on('ended', function () {
          // What you want to do after the event

          $('html').removeClass('startloaded');
          $('html').addClass('loaded');
          _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
        });
        $('.skip-btn').on('click', function () {
          $('html').removeClass('startloaded');
          $('html').addClass('loaded');
          _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
        });
      }
    } else {
      // countTo100(0);
      // $('html').addClass('startloaded');
    }
  } else {
    _lenis__WEBPACK_IMPORTED_MODULE_11__.lenis.start();
  }
}
function initAfishaPage() {
  console.log('initAfishaPage');
  (0,_LoadMorePassedEventsButton__WEBPACK_IMPORTED_MODULE_4__.initLoadMorePassedEventsButtons)();
  (0,_AfishaPopupStaff__WEBPACK_IMPORTED_MODULE_14__.initAfishaPopupStaff)();
  _CustomDatepicker__WEBPACK_IMPORTED_MODULE_2__["default"].init();
  _CustomSelect__WEBPACK_IMPORTED_MODULE_3__["default"].init();
  _AfishaFilterForm__WEBPACK_IMPORTED_MODULE_1__["default"].init();
}
function initSingleMagazinePage() {
  _BookSlider__WEBPACK_IMPORTED_MODULE_16__["default"].init();
  (0,_MagazineMap__WEBPACK_IMPORTED_MODULE_15__.initMagazineMaps)();
  (0,_MagazineActionSwitcher__WEBPACK_IMPORTED_MODULE_20__.initMagazineActionSwitcher)();
  (0,_MagazineYandexMap__WEBPACK_IMPORTED_MODULE_18__.initMagazineYandexMap)().then(cb => {
    console.log({
      cb
    });
    window.magazineYandexMapDestroyCallback = cb;
    (0,_jQueryCustomSelect__WEBPACK_IMPORTED_MODULE_19__.initjQueryCustomSelect)();
  });
}

// initCustomDatePicker();
// // initCustomSelectComponents();

// const map = new YandexMap(document.querySelector('[data-js-yandex-map]'));

// new AfishaFilterForm(map);

// initLoadMorePassedEventsButtons();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./src/jQueryCustomSelect.js":
/*!***********************************!*\
  !*** ./src/jQueryCustomSelect.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initjQueryCustomSelect: () => (/* binding */ initjQueryCustomSelect)
/* harmony export */ });
/* harmony import */ var jquery_custom_select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery-custom-select */ "./node_modules/jquery-custom-select/jquery.custom-select.js");

const initjQueryCustomSelect = () => {
  const $select = $('[data-custom="select"]');
  $select.customSelect();
};

/***/ }),

/***/ "./src/lenis.js":
/*!**********************!*\
  !*** ./src/lenis.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lenis: () => (/* binding */ lenis)
/* harmony export */ });
/* harmony import */ var lenis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lenis */ "./node_modules/lenis/dist/lenis.mjs");

const lenis = new lenis__WEBPACK_IMPORTED_MODULE_0__["default"]({
  lerp: 0.2,
  wheelMultiplier: 0.6,
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: false
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/***/ }),

/***/ "./src/mapCustomizationConfig.js":
/*!***************************************!*\
  !*** ./src/mapCustomizationConfig.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customization: () => (/* binding */ customization)
/* harmony export */ });
const customization = [{
  tags: "country",
  elements: "geometry.fill",
  stylers: [{
    color: "#0b0d0e"
  }, {
    opacity: 0.8,
    zoom: 0
  }, {
    opacity: 0.8,
    zoom: 1
  }, {
    opacity: 0.8,
    zoom: 2
  }, {
    opacity: 0.8,
    zoom: 3
  }, {
    opacity: 0.8,
    zoom: 4
  }, {
    opacity: 1,
    zoom: 5
  }, {
    opacity: 1,
    zoom: 6
  }, {
    opacity: 1,
    zoom: 7
  }, {
    opacity: 1,
    zoom: 8
  }, {
    opacity: 1,
    zoom: 9
  }, {
    opacity: 1,
    zoom: 10
  }, {
    opacity: 1,
    zoom: 11
  }, {
    opacity: 1,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "country",
  elements: "geometry.outline",
  stylers: [{
    color: "#2e3338"
  }, {
    opacity: 0.15,
    zoom: 0
  }, {
    opacity: 0.15,
    zoom: 1
  }, {
    opacity: 0.15,
    zoom: 2
  }, {
    opacity: 0.15,
    zoom: 3
  }, {
    opacity: 0.15,
    zoom: 4
  }, {
    opacity: 0.15,
    zoom: 5
  }, {
    opacity: 0.25,
    zoom: 6
  }, {
    opacity: 0.5,
    zoom: 7
  }, {
    opacity: 0.47,
    zoom: 8
  }, {
    opacity: 0.44,
    zoom: 9
  }, {
    opacity: 0.41,
    zoom: 10
  }, {
    opacity: 0.38,
    zoom: 11
  }, {
    opacity: 0.35,
    zoom: 12
  }, {
    opacity: 0.33,
    zoom: 13
  }, {
    opacity: 0.3,
    zoom: 14
  }, {
    opacity: 0.28,
    zoom: 15
  }, {
    opacity: 0.25,
    zoom: 16
  }, {
    opacity: 0.25,
    zoom: 17
  }, {
    opacity: 0.25,
    zoom: 18
  }, {
    opacity: 0.25,
    zoom: 19
  }, {
    opacity: 0.25,
    zoom: 20
  }, {
    opacity: 0.25,
    zoom: 21
  }]
}, {
  tags: "region",
  elements: "geometry.fill",
  stylers: [{
    color: "#000000",
    opacity: 0.5,
    zoom: 0
  }, {
    color: "#000000",
    opacity: 0.5,
    zoom: 1
  }, {
    color: "#000000",
    opacity: 0.5,
    zoom: 2
  }, {
    color: "#000000",
    opacity: 0.5,
    zoom: 3
  }, {
    color: "#000000",
    opacity: 0.5,
    zoom: 4
  }, {
    color: "#000000",
    opacity: 0.5,
    zoom: 5
  }, {
    color: "#000000",
    opacity: 1,
    zoom: 6
  }, {
    color: "#000000",
    opacity: 1,
    zoom: 7
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 8
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 9
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 10
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 11
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 12
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 13
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 14
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 15
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 16
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 17
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 18
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 19
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 20
  }, {
    color: "#0b0d0e",
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "region",
  elements: "geometry.outline",
  stylers: [{
    color: "#2e3338"
  }, {
    opacity: 0.15,
    zoom: 0
  }, {
    opacity: 0.15,
    zoom: 1
  }, {
    opacity: 0.15,
    zoom: 2
  }, {
    opacity: 0.15,
    zoom: 3
  }, {
    opacity: 0.15,
    zoom: 4
  }, {
    opacity: 0.15,
    zoom: 5
  }, {
    opacity: 0.25,
    zoom: 6
  }, {
    opacity: 0.5,
    zoom: 7
  }, {
    opacity: 0.47,
    zoom: 8
  }, {
    opacity: 0.44,
    zoom: 9
  }, {
    opacity: 0.41,
    zoom: 10
  }, {
    opacity: 0.38,
    zoom: 11
  }, {
    opacity: 0.35,
    zoom: 12
  }, {
    opacity: 0.33,
    zoom: 13
  }, {
    opacity: 0.3,
    zoom: 14
  }, {
    opacity: 0.28,
    zoom: 15
  }, {
    opacity: 0.25,
    zoom: 16
  }, {
    opacity: 0.25,
    zoom: 17
  }, {
    opacity: 0.25,
    zoom: 18
  }, {
    opacity: 0.25,
    zoom: 19
  }, {
    opacity: 0.25,
    zoom: 20
  }, {
    opacity: 0.25,
    zoom: 21
  }]
}, {
  tags: {
    any: "admin",
    none: ["country", "region", "locality", "district", "address"]
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#0b0d0e"
  }, {
    opacity: 0.5,
    zoom: 0
  }, {
    opacity: 0.5,
    zoom: 1
  }, {
    opacity: 0.5,
    zoom: 2
  }, {
    opacity: 0.5,
    zoom: 3
  }, {
    opacity: 0.5,
    zoom: 4
  }, {
    opacity: 0.5,
    zoom: 5
  }, {
    opacity: 1,
    zoom: 6
  }, {
    opacity: 1,
    zoom: 7
  }, {
    opacity: 1,
    zoom: 8
  }, {
    opacity: 1,
    zoom: 9
  }, {
    opacity: 1,
    zoom: 10
  }, {
    opacity: 1,
    zoom: 11
  }, {
    opacity: 1,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: {
    any: "admin",
    none: ["country", "region", "locality", "district", "address"]
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#2e3338"
  }, {
    opacity: 0.15,
    zoom: 0
  }, {
    opacity: 0.15,
    zoom: 1
  }, {
    opacity: 0.15,
    zoom: 2
  }, {
    opacity: 0.15,
    zoom: 3
  }, {
    opacity: 0.15,
    zoom: 4
  }, {
    opacity: 0.15,
    zoom: 5
  }, {
    opacity: 0.25,
    zoom: 6
  }, {
    opacity: 0.5,
    zoom: 7
  }, {
    opacity: 0.47,
    zoom: 8
  }, {
    opacity: 0.44,
    zoom: 9
  }, {
    opacity: 0.41,
    zoom: 10
  }, {
    opacity: 0.38,
    zoom: 11
  }, {
    opacity: 0.35,
    zoom: 12
  }, {
    opacity: 0.33,
    zoom: 13
  }, {
    opacity: 0.3,
    zoom: 14
  }, {
    opacity: 0.28,
    zoom: 15
  }, {
    opacity: 0.25,
    zoom: 16
  }, {
    opacity: 0.25,
    zoom: 17
  }, {
    opacity: 0.25,
    zoom: 18
  }, {
    opacity: 0.25,
    zoom: 19
  }, {
    opacity: 0.25,
    zoom: 20
  }, {
    opacity: 0.25,
    zoom: 21
  }]
}, {
  tags: {
    any: "landcover",
    none: "vegetation"
  },
  stylers: [{
    hue: "#32383e"
  }]
}, {
  tags: "vegetation",
  elements: "geometry",
  stylers: [{
    color: "#49525a",
    opacity: 0.1,
    zoom: 0
  }, {
    color: "#49525a",
    opacity: 0.1,
    zoom: 1
  }, {
    color: "#49525a",
    opacity: 0.1,
    zoom: 2
  }, {
    color: "#49525a",
    opacity: 0.1,
    zoom: 3
  }, {
    color: "#49525a",
    opacity: 0.1,
    zoom: 4
  }, {
    color: "#49525a",
    opacity: 0.1,
    zoom: 5
  }, {
    color: "#49525a",
    opacity: 0.2,
    zoom: 6
  }, {
    color: "#32383e",
    opacity: 0.3,
    zoom: 7
  }, {
    color: "#32383e",
    opacity: 0.4,
    zoom: 8
  }, {
    color: "#32383e",
    opacity: 0.6,
    zoom: 9
  }, {
    color: "#32383e",
    opacity: 0.8,
    zoom: 10
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 11
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 12
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 13
  }, {
    color: "#2e3339",
    opacity: 1,
    zoom: 14
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 15
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 16
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 17
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 18
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 19
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 20
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "park",
  elements: "geometry",
  stylers: [{
    color: "#32383e",
    opacity: 0.1,
    zoom: 0
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 1
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 2
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 3
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 4
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 5
  }, {
    color: "#32383e",
    opacity: 0.2,
    zoom: 6
  }, {
    color: "#32383e",
    opacity: 0.3,
    zoom: 7
  }, {
    color: "#32383e",
    opacity: 0.4,
    zoom: 8
  }, {
    color: "#32383e",
    opacity: 0.6,
    zoom: 9
  }, {
    color: "#32383e",
    opacity: 0.8,
    zoom: 10
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 11
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 12
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 13
  }, {
    color: "#2e3339",
    opacity: 1,
    zoom: 14
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 15
  }, {
    color: "#292e33",
    opacity: 0.9,
    zoom: 16
  }, {
    color: "#292e33",
    opacity: 0.8,
    zoom: 17
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 18
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 19
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 20
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 21
  }]
}, {
  tags: "national_park",
  elements: "geometry",
  stylers: [{
    color: "#32383e",
    opacity: 0.1,
    zoom: 0
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 1
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 2
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 3
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 4
  }, {
    color: "#32383e",
    opacity: 0.1,
    zoom: 5
  }, {
    color: "#32383e",
    opacity: 0.2,
    zoom: 6
  }, {
    color: "#32383e",
    opacity: 0.3,
    zoom: 7
  }, {
    color: "#32383e",
    opacity: 0.4,
    zoom: 8
  }, {
    color: "#32383e",
    opacity: 0.6,
    zoom: 9
  }, {
    color: "#32383e",
    opacity: 0.8,
    zoom: 10
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 11
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 12
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 13
  }, {
    color: "#2e3339",
    opacity: 1,
    zoom: 14
  }, {
    color: "#292e33",
    opacity: 1,
    zoom: 15
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 16
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 17
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 18
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 19
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 20
  }, {
    color: "#292e33",
    opacity: 0.7,
    zoom: 21
  }]
}, {
  tags: "cemetery",
  elements: "geometry",
  stylers: [{
    color: "#32383e",
    zoom: 0
  }, {
    color: "#32383e",
    zoom: 1
  }, {
    color: "#32383e",
    zoom: 2
  }, {
    color: "#32383e",
    zoom: 3
  }, {
    color: "#32383e",
    zoom: 4
  }, {
    color: "#32383e",
    zoom: 5
  }, {
    color: "#32383e",
    zoom: 6
  }, {
    color: "#32383e",
    zoom: 7
  }, {
    color: "#32383e",
    zoom: 8
  }, {
    color: "#32383e",
    zoom: 9
  }, {
    color: "#32383e",
    zoom: 10
  }, {
    color: "#32383e",
    zoom: 11
  }, {
    color: "#32383e",
    zoom: 12
  }, {
    color: "#32383e",
    zoom: 13
  }, {
    color: "#2e3339",
    zoom: 14
  }, {
    color: "#292e33",
    zoom: 15
  }, {
    color: "#292e33",
    zoom: 16
  }, {
    color: "#292e33",
    zoom: 17
  }, {
    color: "#292e33",
    zoom: 18
  }, {
    color: "#292e33",
    zoom: 19
  }, {
    color: "#292e33",
    zoom: 20
  }, {
    color: "#292e33",
    zoom: 21
  }]
}, {
  tags: "sports_ground",
  elements: "geometry",
  stylers: [{
    color: "#3d454c",
    opacity: 0,
    zoom: 0
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 1
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 2
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 3
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 4
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 5
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 6
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 7
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 8
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 9
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 10
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 11
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 12
  }, {
    color: "#3d454c",
    opacity: 0,
    zoom: 13
  }, {
    color: "#394047",
    opacity: 0,
    zoom: 14
  }, {
    color: "#343b41",
    opacity: 0.5,
    zoom: 15
  }, {
    color: "#333a40",
    opacity: 1,
    zoom: 16
  }, {
    color: "#32393f",
    opacity: 1,
    zoom: 17
  }, {
    color: "#32393e",
    opacity: 1,
    zoom: 18
  }, {
    color: "#31383d",
    opacity: 1,
    zoom: 19
  }, {
    color: "#30373c",
    opacity: 1,
    zoom: 20
  }, {
    color: "#2f363b",
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "terrain",
  elements: "geometry",
  stylers: [{
    hue: "#40474f"
  }, {
    opacity: 0.3,
    zoom: 0
  }, {
    opacity: 0.3,
    zoom: 1
  }, {
    opacity: 0.3,
    zoom: 2
  }, {
    opacity: 0.3,
    zoom: 3
  }, {
    opacity: 0.3,
    zoom: 4
  }, {
    opacity: 0.35,
    zoom: 5
  }, {
    opacity: 0.4,
    zoom: 6
  }, {
    opacity: 0.6,
    zoom: 7
  }, {
    opacity: 0.8,
    zoom: 8
  }, {
    opacity: 0.9,
    zoom: 9
  }, {
    opacity: 1,
    zoom: 10
  }, {
    opacity: 1,
    zoom: 11
  }, {
    opacity: 1,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "geographic_line",
  elements: "geometry",
  stylers: [{
    color: "#a5adb6"
  }]
}, {
  tags: "land",
  elements: "geometry",
  stylers: [{
    color: "#40474f",
    zoom: 0
  }, {
    color: "#40474f",
    zoom: 1
  }, {
    color: "#40474f",
    zoom: 2
  }, {
    color: "#40474f",
    zoom: 3
  }, {
    color: "#40474f",
    zoom: 4
  }, {
    color: "#3e454c",
    zoom: 5
  }, {
    color: "#3c424a",
    zoom: 6
  }, {
    color: "#394047",
    zoom: 7
  }, {
    color: "#373d44",
    zoom: 8
  }, {
    color: "#373d44",
    zoom: 9
  }, {
    color: "#373d44",
    zoom: 10
  }, {
    color: "#373d44",
    zoom: 11
  }, {
    color: "#373d44",
    zoom: 12
  }, {
    color: "#373d44",
    zoom: 13
  }, {
    color: "#353b41",
    zoom: 14
  }, {
    color: "#32383e",
    zoom: 15
  }, {
    color: "#32383e",
    zoom: 16
  }, {
    color: "#31373d",
    zoom: 17
  }, {
    color: "#31373d",
    zoom: 18
  }, {
    color: "#31363d",
    zoom: 19
  }, {
    color: "#30363c",
    zoom: 20
  }, {
    color: "#30353c",
    zoom: 21
  }]
}, {
  tags: "residential",
  elements: "geometry",
  stylers: [{
    color: "#40474f",
    opacity: 0.5,
    zoom: 0
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 1
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 2
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 3
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 4
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 5
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 6
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 7
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 8
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 9
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 10
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 11
  }, {
    color: "#40474f",
    opacity: 0.5,
    zoom: 12
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 13
  }, {
    color: "#3c424a",
    opacity: 1,
    zoom: 14
  }, {
    color: "#373d44",
    opacity: 1,
    zoom: 15
  }, {
    color: "#363c43",
    opacity: 1,
    zoom: 16
  }, {
    color: "#353b42",
    opacity: 1,
    zoom: 17
  }, {
    color: "#353b41",
    opacity: 1,
    zoom: 18
  }, {
    color: "#343a40",
    opacity: 1,
    zoom: 19
  }, {
    color: "#33393f",
    opacity: 1,
    zoom: 20
  }, {
    color: "#32383e",
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "locality",
  elements: "geometry",
  stylers: [{
    color: "#40474f",
    zoom: 0
  }, {
    color: "#40474f",
    zoom: 1
  }, {
    color: "#40474f",
    zoom: 2
  }, {
    color: "#40474f",
    zoom: 3
  }, {
    color: "#40474f",
    zoom: 4
  }, {
    color: "#40474f",
    zoom: 5
  }, {
    color: "#40474f",
    zoom: 6
  }, {
    color: "#40474f",
    zoom: 7
  }, {
    color: "#40474f",
    zoom: 8
  }, {
    color: "#40474f",
    zoom: 9
  }, {
    color: "#40474f",
    zoom: 10
  }, {
    color: "#40474f",
    zoom: 11
  }, {
    color: "#40474f",
    zoom: 12
  }, {
    color: "#40474f",
    zoom: 13
  }, {
    color: "#3c424a",
    zoom: 14
  }, {
    color: "#373d44",
    zoom: 15
  }, {
    color: "#363c43",
    zoom: 16
  }, {
    color: "#353b42",
    zoom: 17
  }, {
    color: "#353b41",
    zoom: 18
  }, {
    color: "#343a40",
    zoom: 19
  }, {
    color: "#33393f",
    zoom: 20
  }, {
    color: "#32383e",
    zoom: 21
  }]
}, {
  tags: {
    any: "structure",
    none: ["building", "fence"]
  },
  elements: "geometry",
  stylers: [{
    opacity: 0.9
  }, {
    color: "#40474f",
    zoom: 0
  }, {
    color: "#40474f",
    zoom: 1
  }, {
    color: "#40474f",
    zoom: 2
  }, {
    color: "#40474f",
    zoom: 3
  }, {
    color: "#40474f",
    zoom: 4
  }, {
    color: "#40474f",
    zoom: 5
  }, {
    color: "#40474f",
    zoom: 6
  }, {
    color: "#40474f",
    zoom: 7
  }, {
    color: "#40474f",
    zoom: 8
  }, {
    color: "#40474f",
    zoom: 9
  }, {
    color: "#40474f",
    zoom: 10
  }, {
    color: "#40474f",
    zoom: 11
  }, {
    color: "#40474f",
    zoom: 12
  }, {
    color: "#40474f",
    zoom: 13
  }, {
    color: "#3c424a",
    zoom: 14
  }, {
    color: "#373d44",
    zoom: 15
  }, {
    color: "#363c43",
    zoom: 16
  }, {
    color: "#353b42",
    zoom: 17
  }, {
    color: "#353b41",
    zoom: 18
  }, {
    color: "#343a40",
    zoom: 19
  }, {
    color: "#33393f",
    zoom: 20
  }, {
    color: "#32383e",
    zoom: 21
  }]
}, {
  tags: "building",
  elements: "geometry.fill",
  stylers: [{
    color: "#434a51"
  }, {
    opacity: 0.7,
    zoom: 0
  }, {
    opacity: 0.7,
    zoom: 1
  }, {
    opacity: 0.7,
    zoom: 2
  }, {
    opacity: 0.7,
    zoom: 3
  }, {
    opacity: 0.7,
    zoom: 4
  }, {
    opacity: 0.7,
    zoom: 5
  }, {
    opacity: 0.7,
    zoom: 6
  }, {
    opacity: 0.7,
    zoom: 7
  }, {
    opacity: 0.7,
    zoom: 8
  }, {
    opacity: 0.7,
    zoom: 9
  }, {
    opacity: 0.7,
    zoom: 10
  }, {
    opacity: 0.7,
    zoom: 11
  }, {
    opacity: 0.7,
    zoom: 12
  }, {
    opacity: 0.7,
    zoom: 13
  }, {
    opacity: 0.7,
    zoom: 14
  }, {
    opacity: 0.7,
    zoom: 15
  }, {
    opacity: 0.9,
    zoom: 16
  }, {
    opacity: 0.6,
    zoom: 17
  }, {
    opacity: 0.6,
    zoom: 18
  }, {
    opacity: 0.6,
    zoom: 19
  }, {
    opacity: 0.6,
    zoom: 20
  }, {
    opacity: 0.6,
    zoom: 21
  }]
}, {
  tags: "building",
  elements: "geometry.outline",
  stylers: [{
    color: "#555e67"
  }, {
    opacity: 0.5,
    zoom: 0
  }, {
    opacity: 0.5,
    zoom: 1
  }, {
    opacity: 0.5,
    zoom: 2
  }, {
    opacity: 0.5,
    zoom: 3
  }, {
    opacity: 0.5,
    zoom: 4
  }, {
    opacity: 0.5,
    zoom: 5
  }, {
    opacity: 0.5,
    zoom: 6
  }, {
    opacity: 0.5,
    zoom: 7
  }, {
    opacity: 0.5,
    zoom: 8
  }, {
    opacity: 0.5,
    zoom: 9
  }, {
    opacity: 0.5,
    zoom: 10
  }, {
    opacity: 0.5,
    zoom: 11
  }, {
    opacity: 0.5,
    zoom: 12
  }, {
    opacity: 0.5,
    zoom: 13
  }, {
    opacity: 0.5,
    zoom: 14
  }, {
    opacity: 0.5,
    zoom: 15
  }, {
    opacity: 0.5,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: {
    any: "urban_area",
    none: ["residential", "industrial", "cemetery", "park", "medical", "sports_ground", "beach", "construction_site"]
  },
  elements: "geometry",
  stylers: [{
    color: "#40474f",
    opacity: 1,
    zoom: 0
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 1
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 2
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 3
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 4
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 5
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 6
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 7
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 8
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 9
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 10
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 11
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 12
  }, {
    color: "#40474f",
    opacity: 1,
    zoom: 13
  }, {
    color: "#3b4148",
    opacity: 1,
    zoom: 14
  }, {
    color: "#353a41",
    opacity: 1,
    zoom: 15
  }, {
    color: "#2f343a",
    opacity: 0.67,
    zoom: 16
  }, {
    color: "#292e33",
    opacity: 0.33,
    zoom: 17
  }, {
    color: "#292e33",
    opacity: 0,
    zoom: 18
  }, {
    color: "#292e33",
    opacity: 0,
    zoom: 19
  }, {
    color: "#292e33",
    opacity: 0,
    zoom: 20
  }, {
    color: "#292e33",
    opacity: 0,
    zoom: 21
  }]
}, {
  tags: "poi",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "poi",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "poi",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "outdoor",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "outdoor",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "outdoor",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "park",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "park",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "park",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "cemetery",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "cemetery",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "cemetery",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "beach",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "beach",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "beach",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "medical",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "medical",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "medical",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "shopping",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "shopping",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "shopping",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "commercial_services",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "commercial_services",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "commercial_services",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "food_and_drink",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "food_and_drink",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "food_and_drink",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "road",
  elements: "label.icon",
  types: "point",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: "road",
  elements: "label.text.fill",
  types: "point",
  stylers: [{
    color: "#8f99a3"
  }]
}, {
  tags: "entrance",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }]
}, {
  tags: "locality",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8f99a3"
  }]
}, {
  tags: "country",
  elements: "label.text.fill",
  stylers: [{
    opacity: 0.8
  }, {
    color: "#73808c"
  }]
}, {
  tags: "country",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "region",
  elements: "label.text.fill",
  stylers: [{
    color: "#73808c"
  }, {
    opacity: 0.8
  }]
}, {
  tags: "region",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "district",
  elements: "label.text.fill",
  stylers: [{
    color: "#73808c"
  }, {
    opacity: 0.8
  }]
}, {
  tags: "district",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: {
    any: "admin",
    none: ["country", "region", "locality", "district", "address"]
  },
  elements: "label.text.fill",
  stylers: [{
    color: "#73808c"
  }]
}, {
  tags: {
    any: "admin",
    none: ["country", "region", "locality", "district", "address"]
  },
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "locality",
  elements: "label.text.fill",
  stylers: [{
    color: "#94999e",
    zoom: 0
  }, {
    color: "#94999e",
    zoom: 1
  }, {
    color: "#94999e",
    zoom: 2
  }, {
    color: "#94999e",
    zoom: 3
  }, {
    color: "#94999e",
    zoom: 4
  }, {
    color: "#969ba0",
    zoom: 5
  }, {
    color: "#989da2",
    zoom: 6
  }, {
    color: "#9a9fa4",
    zoom: 7
  }, {
    color: "#9da2a6",
    zoom: 8
  }, {
    color: "#9fa4a8",
    zoom: 9
  }, {
    color: "#a1a6aa",
    zoom: 10
  }, {
    color: "#a1a6aa",
    zoom: 11
  }, {
    color: "#a1a6aa",
    zoom: 12
  }, {
    color: "#a1a6aa",
    zoom: 13
  }, {
    color: "#a1a6aa",
    zoom: 14
  }, {
    color: "#a1a6aa",
    zoom: 15
  }, {
    color: "#a1a6aa",
    zoom: 16
  }, {
    color: "#a1a6aa",
    zoom: 17
  }, {
    color: "#a1a6aa",
    zoom: 18
  }, {
    color: "#a1a6aa",
    zoom: 19
  }, {
    color: "#a1a6aa",
    zoom: 20
  }, {
    color: "#a1a6aa",
    zoom: 21
  }]
}, {
  tags: "locality",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "road",
  elements: "label.text.fill",
  types: "polyline",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "road",
  elements: "label.text.outline",
  types: "polyline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "road",
  elements: "geometry.fill.pattern",
  types: "polyline",
  stylers: [{
    scale: 1
  }, {
    color: "#61666b"
  }]
}, {
  tags: "road",
  elements: "label.text.fill",
  types: "point",
  stylers: [{
    color: "#94999e"
  }]
}, {
  tags: "structure",
  elements: "label.text.fill",
  stylers: [{
    color: "#73808c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "structure",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "entrance",
  elements: "label.text.fill",
  stylers: [{
    color: "#73808c"
  }, {
    opacity: 1
  }]
}, {
  tags: "entrance",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "address",
  elements: "label.text.fill",
  stylers: [{
    color: "#73808c"
  }, {
    opacity: 0.9,
    zoom: 0
  }, {
    opacity: 0.9,
    zoom: 1
  }, {
    opacity: 0.9,
    zoom: 2
  }, {
    opacity: 0.9,
    zoom: 3
  }, {
    opacity: 0.9,
    zoom: 4
  }, {
    opacity: 0.9,
    zoom: 5
  }, {
    opacity: 0.9,
    zoom: 6
  }, {
    opacity: 0.9,
    zoom: 7
  }, {
    opacity: 0.9,
    zoom: 8
  }, {
    opacity: 0.9,
    zoom: 9
  }, {
    opacity: 0.9,
    zoom: 10
  }, {
    opacity: 0.9,
    zoom: 11
  }, {
    opacity: 0.9,
    zoom: 12
  }, {
    opacity: 0.9,
    zoom: 13
  }, {
    opacity: 0.9,
    zoom: 14
  }, {
    opacity: 0.9,
    zoom: 15
  }, {
    opacity: 0.9,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "address",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5
  }]
}, {
  tags: "landscape",
  elements: "label.text.fill",
  stylers: [{
    color: "#73808c",
    opacity: 1,
    zoom: 0
  }, {
    color: "#73808c",
    opacity: 1,
    zoom: 1
  }, {
    color: "#73808c",
    opacity: 1,
    zoom: 2
  }, {
    color: "#73808c",
    opacity: 1,
    zoom: 3
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 4
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 5
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 6
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 7
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 8
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 9
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 10
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 11
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 12
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 13
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 14
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 15
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 16
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 17
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 18
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 19
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 20
  }, {
    color: "#73808c",
    opacity: 0.5,
    zoom: 21
  }]
}, {
  tags: "landscape",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5,
    zoom: 0
  }, {
    opacity: 0.5,
    zoom: 1
  }, {
    opacity: 0.5,
    zoom: 2
  }, {
    opacity: 0.5,
    zoom: 3
  }, {
    opacity: 0,
    zoom: 4
  }, {
    opacity: 0,
    zoom: 5
  }, {
    opacity: 0,
    zoom: 6
  }, {
    opacity: 0,
    zoom: 7
  }, {
    opacity: 0,
    zoom: 8
  }, {
    opacity: 0,
    zoom: 9
  }, {
    opacity: 0,
    zoom: 10
  }, {
    opacity: 0,
    zoom: 11
  }, {
    opacity: 0,
    zoom: 12
  }, {
    opacity: 0,
    zoom: 13
  }, {
    opacity: 0,
    zoom: 14
  }, {
    opacity: 0,
    zoom: 15
  }, {
    opacity: 0,
    zoom: 16
  }, {
    opacity: 0,
    zoom: 17
  }, {
    opacity: 0,
    zoom: 18
  }, {
    opacity: 0,
    zoom: 19
  }, {
    opacity: 0,
    zoom: 20
  }, {
    opacity: 0,
    zoom: 21
  }]
}, {
  tags: "water",
  elements: "label.text.fill",
  stylers: [{
    color: "#6c7c8e"
  }, {
    opacity: 0.8
  }]
}, {
  tags: "water",
  elements: "label.text.outline",
  types: "polyline",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.2
  }]
}, {
  tags: {
    any: "road_1",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76",
    scale: 0,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 2.64,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 2.84,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 3.13,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 3.55,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 3.21,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 2.72,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 2.35,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 2.02,
    zoom: 13
  }, {
    color: "#5f6974",
    scale: 1.81,
    zoom: 14
  }, {
    color: "#5d6873",
    scale: 1.69,
    zoom: 15
  }, {
    color: "#5c6671",
    scale: 1.66,
    zoom: 16
  }, {
    color: "#5b656f",
    scale: 1.31,
    zoom: 17
  }, {
    color: "#59636d",
    scale: 1.08,
    zoom: 18
  }, {
    color: "#58616c",
    scale: 0.93,
    zoom: 19
  }, {
    color: "#56606a",
    scale: 0.84,
    zoom: 20
  }, {
    color: "#555e68",
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_1"
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 0.9,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 4
  }, {
    color: "#2e3338",
    scale: 0.9,
    zoom: 5
  }, {
    color: "#2e3338",
    scale: 1.96,
    zoom: 6
  }, {
    color: "#2e3338",
    scale: 1.96,
    zoom: 7
  }, {
    color: "#2e3338",
    scale: 2.02,
    zoom: 8
  }, {
    color: "#2e3338",
    scale: 2.16,
    zoom: 9
  }, {
    color: "#2e3338",
    scale: 2.16,
    zoom: 10
  }, {
    color: "#2e3338",
    scale: 2.04,
    zoom: 11
  }, {
    color: "#2e3338",
    scale: 1.93,
    zoom: 12
  }, {
    color: "#2e3338",
    scale: 1.8,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 1.71,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 1.68,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 1.7,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 1.38,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 1.15,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 1,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.91,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.87,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_2",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76",
    scale: 0,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 2.64,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 2.84,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 3.13,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 3.55,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 3.21,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 2.72,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 2.35,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 2.02,
    zoom: 13
  }, {
    color: "#5f6974",
    scale: 1.81,
    zoom: 14
  }, {
    color: "#5d6873",
    scale: 1.69,
    zoom: 15
  }, {
    color: "#5c6671",
    scale: 1.66,
    zoom: 16
  }, {
    color: "#5b656f",
    scale: 1.31,
    zoom: 17
  }, {
    color: "#59636d",
    scale: 1.08,
    zoom: 18
  }, {
    color: "#58616c",
    scale: 0.93,
    zoom: 19
  }, {
    color: "#56606a",
    scale: 0.84,
    zoom: 20
  }, {
    color: "#555e68",
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_2"
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 0.9,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 4
  }, {
    color: "#2e3338",
    scale: 0.9,
    zoom: 5
  }, {
    color: "#2e3338",
    scale: 1.96,
    zoom: 6
  }, {
    color: "#2e3338",
    scale: 1.96,
    zoom: 7
  }, {
    color: "#2e3338",
    scale: 2.02,
    zoom: 8
  }, {
    color: "#2e3338",
    scale: 2.16,
    zoom: 9
  }, {
    color: "#2e3338",
    scale: 2.16,
    zoom: 10
  }, {
    color: "#2e3338",
    scale: 2.04,
    zoom: 11
  }, {
    color: "#2e3338",
    scale: 1.93,
    zoom: 12
  }, {
    color: "#2e3338",
    scale: 1.8,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 1.71,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 1.68,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 1.7,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 1.38,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 1.15,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 1,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.91,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.87,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_3",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76",
    scale: 0,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 2.23,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 2.33,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 1.49,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 1.48,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 1.23,
    zoom: 13
  }, {
    color: "#5f6974",
    scale: 1.06,
    zoom: 14
  }, {
    color: "#5d6873",
    scale: 0.96,
    zoom: 15
  }, {
    color: "#5c6671",
    scale: 0.92,
    zoom: 16
  }, {
    color: "#5b656f",
    scale: 0.81,
    zoom: 17
  }, {
    color: "#59636d",
    scale: 0.75,
    zoom: 18
  }, {
    color: "#58616c",
    scale: 0.73,
    zoom: 19
  }, {
    color: "#56606a",
    scale: 0.75,
    zoom: 20
  }, {
    color: "#555e68",
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_3"
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 1.03,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 1.03,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 1.03,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 1.03,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 1.03,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 1.03,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 1.03,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 1.03,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0.83,
    zoom: 8
  }, {
    color: "#2e3338",
    scale: 2.71,
    zoom: 9
  }, {
    color: "#2e3338",
    scale: 1.76,
    zoom: 10
  }, {
    color: "#2e3338",
    scale: 1.31,
    zoom: 11
  }, {
    color: "#2e3338",
    scale: 1.37,
    zoom: 12
  }, {
    color: "#2e3338",
    scale: 1.21,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 1.1,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 1.02,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 1,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 0.88,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 0.81,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 0.79,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.81,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.87,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_4",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76",
    scale: 0,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 1.5,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 1.12,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 1.25,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 1.05,
    zoom: 13
  }, {
    color: "#5f6974",
    scale: 0.93,
    zoom: 14
  }, {
    color: "#5d6873",
    scale: 0.86,
    zoom: 15
  }, {
    color: "#5c6671",
    scale: 1.02,
    zoom: 16
  }, {
    color: "#5b656f",
    scale: 0.88,
    zoom: 17
  }, {
    color: "#59636d",
    scale: 0.79,
    zoom: 18
  }, {
    color: "#58616c",
    scale: 0.76,
    zoom: 19
  }, {
    color: "#56606a",
    scale: 0.76,
    zoom: 20
  }, {
    color: "#555e68",
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_4"
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 0.9,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0.72,
    zoom: 9
  }, {
    color: "#2e3338",
    scale: 1.22,
    zoom: 10
  }, {
    color: "#2e3338",
    scale: 1.04,
    zoom: 11
  }, {
    color: "#2e3338",
    scale: 1.17,
    zoom: 12
  }, {
    color: "#2e3338",
    scale: 1.06,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 0.97,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 0.92,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 1.09,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 0.95,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 0.86,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 0.82,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.82,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.86,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_5",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76",
    scale: 0,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 1.11,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 0.84,
    zoom: 13
  }, {
    color: "#5f6974",
    scale: 0.72,
    zoom: 14
  }, {
    color: "#5d6873",
    scale: 0.84,
    zoom: 15
  }, {
    color: "#5c6671",
    scale: 0.97,
    zoom: 16
  }, {
    color: "#5b656f",
    scale: 0.83,
    zoom: 17
  }, {
    color: "#59636d",
    scale: 0.75,
    zoom: 18
  }, {
    color: "#58616c",
    scale: 0.73,
    zoom: 19
  }, {
    color: "#56606a",
    scale: 0.74,
    zoom: 20
  }, {
    color: "#555e68",
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_5"
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 0.9,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 0.4,
    zoom: 11
  }, {
    color: "#2e3338",
    scale: 1.03,
    zoom: 12
  }, {
    color: "#2e3338",
    scale: 0.88,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 0.79,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 0.91,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 1.05,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 0.9,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 0.82,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 0.79,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.81,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.86,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_6",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76",
    scale: 0,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 2,
    zoom: 13
  }, {
    color: "#5f6974",
    scale: 1.13,
    zoom: 14
  }, {
    color: "#5d6873",
    scale: 1.11,
    zoom: 15
  }, {
    color: "#5c6671",
    scale: 1.16,
    zoom: 16
  }, {
    color: "#5b656f",
    scale: 0.93,
    zoom: 17
  }, {
    color: "#59636d",
    scale: 0.8,
    zoom: 18
  }, {
    color: "#58616c",
    scale: 0.75,
    zoom: 19
  }, {
    color: "#56606a",
    scale: 0.75,
    zoom: 20
  }, {
    color: "#555e68",
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_6"
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 0.9,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 12
  }, {
    color: "#2e3338",
    scale: 1.49,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 1.09,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 1.13,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 1.22,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 0.99,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 0.87,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 0.82,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.82,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.86,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_7",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76",
    scale: 0,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 0,
    zoom: 13
  }, {
    color: "#5f6974",
    scale: 0.8,
    zoom: 14
  }, {
    color: "#5d6873",
    scale: 0.69,
    zoom: 15
  }, {
    color: "#5c6671",
    scale: 0.78,
    zoom: 16
  }, {
    color: "#5b656f",
    scale: 0.71,
    zoom: 17
  }, {
    color: "#59636d",
    scale: 0.69,
    zoom: 18
  }, {
    color: "#58616c",
    scale: 0.7,
    zoom: 19
  }, {
    color: "#56606a",
    scale: 0.74,
    zoom: 20
  }, {
    color: "#555e68",
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_7"
  },
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 0.9,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 0.84,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 0.77,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 0.84,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 0.78,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 0.75,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 0.76,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.79,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.86,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_minor",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#3e454c"
  }, {
    scale: 0,
    zoom: 0
  }, {
    scale: 0,
    zoom: 1
  }, {
    scale: 0,
    zoom: 2
  }, {
    scale: 0,
    zoom: 3
  }, {
    scale: 0,
    zoom: 4
  }, {
    scale: 0,
    zoom: 5
  }, {
    scale: 0,
    zoom: 6
  }, {
    scale: 0,
    zoom: 7
  }, {
    scale: 0,
    zoom: 8
  }, {
    scale: 0,
    zoom: 9
  }, {
    scale: 0,
    zoom: 10
  }, {
    scale: 0,
    zoom: 11
  }, {
    scale: 0,
    zoom: 12
  }, {
    scale: 0,
    zoom: 13
  }, {
    scale: 0,
    zoom: 14
  }, {
    scale: 0,
    zoom: 15
  }, {
    scale: 0.8,
    zoom: 16
  }, {
    scale: 0.8,
    zoom: 17
  }, {
    scale: 0.8,
    zoom: 18
  }, {
    scale: 0.8,
    zoom: 19
  }, {
    scale: 0.8,
    zoom: 20
  }, {
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_minor"
  },
  elements: "geometry.outline",
  stylers: [{
    opacity: 0
  }]
}, {
  tags: {
    any: "road_unclassified",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#3e454c"
  }, {
    scale: 0,
    zoom: 0
  }, {
    scale: 0,
    zoom: 1
  }, {
    scale: 0,
    zoom: 2
  }, {
    scale: 0,
    zoom: 3
  }, {
    scale: 0,
    zoom: 4
  }, {
    scale: 0,
    zoom: 5
  }, {
    scale: 0,
    zoom: 6
  }, {
    scale: 0,
    zoom: 7
  }, {
    scale: 0,
    zoom: 8
  }, {
    scale: 0,
    zoom: 9
  }, {
    scale: 0,
    zoom: 10
  }, {
    scale: 0,
    zoom: 11
  }, {
    scale: 0,
    zoom: 12
  }, {
    scale: 0,
    zoom: 13
  }, {
    scale: 0,
    zoom: 14
  }, {
    scale: 0,
    zoom: 15
  }, {
    scale: 0.8,
    zoom: 16
  }, {
    scale: 0.8,
    zoom: 17
  }, {
    scale: 0.8,
    zoom: 18
  }, {
    scale: 0.8,
    zoom: 19
  }, {
    scale: 0.8,
    zoom: 20
  }, {
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: {
    any: "road_unclassified"
  },
  elements: "geometry.outline",
  stylers: [{
    opacity: 0
  }]
}, {
  tags: {
    all: "is_tunnel",
    none: "path"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#454c55",
    zoom: 0
  }, {
    color: "#454c55",
    zoom: 1
  }, {
    color: "#454c55",
    zoom: 2
  }, {
    color: "#454c55",
    zoom: 3
  }, {
    color: "#454c55",
    zoom: 4
  }, {
    color: "#454c55",
    zoom: 5
  }, {
    color: "#454c55",
    zoom: 6
  }, {
    color: "#454c55",
    zoom: 7
  }, {
    color: "#454c55",
    zoom: 8
  }, {
    color: "#454c55",
    zoom: 9
  }, {
    color: "#454c55",
    zoom: 10
  }, {
    color: "#454c55",
    zoom: 11
  }, {
    color: "#454c55",
    zoom: 12
  }, {
    color: "#454c55",
    zoom: 13
  }, {
    color: "#40474f",
    zoom: 14
  }, {
    color: "#3b4249",
    zoom: 15
  }, {
    color: "#3a4148",
    zoom: 16
  }, {
    color: "#3a4047",
    zoom: 17
  }, {
    color: "#394047",
    zoom: 18
  }, {
    color: "#383f46",
    zoom: 19
  }, {
    color: "#383e45",
    zoom: 20
  }, {
    color: "#373d44",
    zoom: 21
  }]
}, {
  tags: {
    all: "path",
    none: "is_tunnel"
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#171a1c"
  }, {
    opacity: 0.5,
    zoom: 0
  }, {
    opacity: 0.5,
    zoom: 1
  }, {
    opacity: 0.5,
    zoom: 2
  }, {
    opacity: 0.5,
    zoom: 3
  }, {
    opacity: 0.5,
    zoom: 4
  }, {
    opacity: 0.5,
    zoom: 5
  }, {
    opacity: 0.5,
    zoom: 6
  }, {
    opacity: 0.5,
    zoom: 7
  }, {
    opacity: 0.5,
    zoom: 8
  }, {
    opacity: 0.5,
    zoom: 9
  }, {
    opacity: 0.5,
    zoom: 10
  }, {
    opacity: 0.5,
    zoom: 11
  }, {
    opacity: 0.5,
    zoom: 12
  }, {
    opacity: 0.5,
    zoom: 13
  }, {
    opacity: 0.5,
    zoom: 14
  }, {
    opacity: 0.5,
    zoom: 15
  }, {
    opacity: 0.5,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: {
    all: "path",
    none: "is_tunnel"
  },
  elements: "geometry.outline",
  stylers: [{
    opacity: 0.7
  }, {
    color: "#40474f",
    zoom: 0
  }, {
    color: "#40474f",
    zoom: 1
  }, {
    color: "#40474f",
    zoom: 2
  }, {
    color: "#40474f",
    zoom: 3
  }, {
    color: "#40474f",
    zoom: 4
  }, {
    color: "#40474f",
    zoom: 5
  }, {
    color: "#40474f",
    zoom: 6
  }, {
    color: "#40474f",
    zoom: 7
  }, {
    color: "#40474f",
    zoom: 8
  }, {
    color: "#40474f",
    zoom: 9
  }, {
    color: "#40474f",
    zoom: 10
  }, {
    color: "#40474f",
    zoom: 11
  }, {
    color: "#40474f",
    zoom: 12
  }, {
    color: "#40474f",
    zoom: 13
  }, {
    color: "#3c424a",
    zoom: 14
  }, {
    color: "#373d44",
    zoom: 15
  }, {
    color: "#363c43",
    zoom: 16
  }, {
    color: "#353b42",
    zoom: 17
  }, {
    color: "#353b41",
    zoom: 18
  }, {
    color: "#343a40",
    zoom: 19
  }, {
    color: "#33393f",
    zoom: 20
  }, {
    color: "#32383e",
    zoom: 21
  }]
}, {
  tags: "road_construction",
  elements: "geometry.fill",
  stylers: [{
    color: "#606b76"
  }]
}, {
  tags: "road_construction",
  elements: "geometry.outline",
  stylers: [{
    color: "#171a1c",
    zoom: 0
  }, {
    color: "#171a1c",
    zoom: 1
  }, {
    color: "#171a1c",
    zoom: 2
  }, {
    color: "#171a1c",
    zoom: 3
  }, {
    color: "#171a1c",
    zoom: 4
  }, {
    color: "#171a1c",
    zoom: 5
  }, {
    color: "#171a1c",
    zoom: 6
  }, {
    color: "#171a1c",
    zoom: 7
  }, {
    color: "#171a1c",
    zoom: 8
  }, {
    color: "#171a1c",
    zoom: 9
  }, {
    color: "#171a1c",
    zoom: 10
  }, {
    color: "#171a1c",
    zoom: 11
  }, {
    color: "#171a1c",
    zoom: 12
  }, {
    color: "#171a1c",
    zoom: 13
  }, {
    color: "#2e3338",
    zoom: 14
  }, {
    color: "#171a1c",
    zoom: 15
  }, {
    color: "#131617",
    zoom: 16
  }, {
    color: "#0f1113",
    zoom: 17
  }, {
    color: "#0c0d0e",
    zoom: 18
  }, {
    color: "#080909",
    zoom: 19
  }, {
    color: "#040405",
    zoom: 20
  }, {
    color: "#000000",
    zoom: 21
  }]
}, {
  tags: {
    any: "ferry"
  },
  stylers: [{
    color: "#404954"
  }]
}, {
  tags: "transit_location",
  elements: "label.icon",
  stylers: [{
    saturation: -1
  }, {
    opacity: 0,
    zoom: 0
  }, {
    opacity: 0,
    zoom: 1
  }, {
    opacity: 0,
    zoom: 2
  }, {
    opacity: 0,
    zoom: 3
  }, {
    opacity: 0,
    zoom: 4
  }, {
    opacity: 0,
    zoom: 5
  }, {
    opacity: 0,
    zoom: 6
  }, {
    opacity: 0,
    zoom: 7
  }, {
    opacity: 0,
    zoom: 8
  }, {
    opacity: 0,
    zoom: 9
  }, {
    opacity: 0,
    zoom: 10
  }, {
    opacity: 0,
    zoom: 11
  }, {
    opacity: 0,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "transit_location",
  elements: "label.text",
  stylers: [{
    opacity: 0,
    zoom: 0
  }, {
    opacity: 0,
    zoom: 1
  }, {
    opacity: 0,
    zoom: 2
  }, {
    opacity: 0,
    zoom: 3
  }, {
    opacity: 0,
    zoom: 4
  }, {
    opacity: 0,
    zoom: 5
  }, {
    opacity: 0,
    zoom: 6
  }, {
    opacity: 0,
    zoom: 7
  }, {
    opacity: 0,
    zoom: 8
  }, {
    opacity: 0,
    zoom: 9
  }, {
    opacity: 0,
    zoom: 10
  }, {
    opacity: 0,
    zoom: 11
  }, {
    opacity: 0,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "transit_location",
  elements: "label.text.fill",
  stylers: [{
    color: "#8aa1a8"
  }]
}, {
  tags: "transit_location",
  elements: "label.text.outline",
  stylers: [{
    color: "#171a1c"
  }]
}, {
  tags: "transit_schema",
  elements: "geometry.fill",
  stylers: [{
    color: "#8aa1a8"
  }, {
    scale: 0.7
  }, {
    opacity: 0.6,
    zoom: 0
  }, {
    opacity: 0.6,
    zoom: 1
  }, {
    opacity: 0.6,
    zoom: 2
  }, {
    opacity: 0.6,
    zoom: 3
  }, {
    opacity: 0.6,
    zoom: 4
  }, {
    opacity: 0.6,
    zoom: 5
  }, {
    opacity: 0.6,
    zoom: 6
  }, {
    opacity: 0.6,
    zoom: 7
  }, {
    opacity: 0.6,
    zoom: 8
  }, {
    opacity: 0.6,
    zoom: 9
  }, {
    opacity: 0.6,
    zoom: 10
  }, {
    opacity: 0.6,
    zoom: 11
  }, {
    opacity: 0.6,
    zoom: 12
  }, {
    opacity: 0.6,
    zoom: 13
  }, {
    opacity: 0.6,
    zoom: 14
  }, {
    opacity: 0.5,
    zoom: 15
  }, {
    opacity: 0.4,
    zoom: 16
  }, {
    opacity: 0.4,
    zoom: 17
  }, {
    opacity: 0.4,
    zoom: 18
  }, {
    opacity: 0.4,
    zoom: 19
  }, {
    opacity: 0.4,
    zoom: 20
  }, {
    opacity: 0.4,
    zoom: 21
  }]
}, {
  tags: "transit_schema",
  elements: "geometry.outline",
  stylers: [{
    opacity: 0
  }]
}, {
  tags: "transit_line",
  elements: "geometry.fill.pattern",
  stylers: [{
    color: "#7a8386"
  }, {
    opacity: 0,
    zoom: 0
  }, {
    opacity: 0,
    zoom: 1
  }, {
    opacity: 0,
    zoom: 2
  }, {
    opacity: 0,
    zoom: 3
  }, {
    opacity: 0,
    zoom: 4
  }, {
    opacity: 0,
    zoom: 5
  }, {
    opacity: 0,
    zoom: 6
  }, {
    opacity: 0,
    zoom: 7
  }, {
    opacity: 0,
    zoom: 8
  }, {
    opacity: 0,
    zoom: 9
  }, {
    opacity: 0,
    zoom: 10
  }, {
    opacity: 0,
    zoom: 11
  }, {
    opacity: 0,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "transit_line",
  elements: "geometry.fill",
  stylers: [{
    color: "#7a8386"
  }, {
    scale: 0.4
  }, {
    opacity: 0,
    zoom: 0
  }, {
    opacity: 0,
    zoom: 1
  }, {
    opacity: 0,
    zoom: 2
  }, {
    opacity: 0,
    zoom: 3
  }, {
    opacity: 0,
    zoom: 4
  }, {
    opacity: 0,
    zoom: 5
  }, {
    opacity: 0,
    zoom: 6
  }, {
    opacity: 0,
    zoom: 7
  }, {
    opacity: 0,
    zoom: 8
  }, {
    opacity: 0,
    zoom: 9
  }, {
    opacity: 0,
    zoom: 10
  }, {
    opacity: 0,
    zoom: 11
  }, {
    opacity: 0,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "water",
  elements: "geometry",
  stylers: [{
    color: "#2a3037",
    zoom: 0
  }, {
    color: "#2a3037",
    zoom: 1
  }, {
    color: "#2a3037",
    zoom: 2
  }, {
    color: "#2a3037",
    zoom: 3
  }, {
    color: "#2a3037",
    zoom: 4
  }, {
    color: "#2a3037",
    zoom: 5
  }, {
    color: "#2a3037",
    zoom: 6
  }, {
    color: "#2a3037",
    zoom: 7
  }, {
    color: "#292e35",
    zoom: 8
  }, {
    color: "#272d33",
    zoom: 9
  }, {
    color: "#262b31",
    zoom: 10
  }, {
    color: "#252a30",
    zoom: 11
  }, {
    color: "#24292f",
    zoom: 12
  }, {
    color: "#23282e",
    zoom: 13
  }, {
    color: "#22272d",
    zoom: 14
  }, {
    color: "#21262b",
    zoom: 15
  }, {
    color: "#20242a",
    zoom: 16
  }, {
    color: "#1f2329",
    zoom: 17
  }, {
    color: "#1e2227",
    zoom: 18
  }, {
    color: "#1d2126",
    zoom: 19
  }, {
    color: "#1c1f24",
    zoom: 20
  }, {
    color: "#1b1e23",
    zoom: 21
  }]
}, {
  tags: "water",
  elements: "geometry",
  types: "polyline",
  stylers: [{
    opacity: 0.4,
    zoom: 0
  }, {
    opacity: 0.4,
    zoom: 1
  }, {
    opacity: 0.4,
    zoom: 2
  }, {
    opacity: 0.4,
    zoom: 3
  }, {
    opacity: 0.6,
    zoom: 4
  }, {
    opacity: 0.8,
    zoom: 5
  }, {
    opacity: 1,
    zoom: 6
  }, {
    opacity: 1,
    zoom: 7
  }, {
    opacity: 1,
    zoom: 8
  }, {
    opacity: 1,
    zoom: 9
  }, {
    opacity: 1,
    zoom: 10
  }, {
    opacity: 1,
    zoom: 11
  }, {
    opacity: 1,
    zoom: 12
  }, {
    opacity: 1,
    zoom: 13
  }, {
    opacity: 1,
    zoom: 14
  }, {
    opacity: 1,
    zoom: 15
  }, {
    opacity: 1,
    zoom: 16
  }, {
    opacity: 1,
    zoom: 17
  }, {
    opacity: 1,
    zoom: 18
  }, {
    opacity: 1,
    zoom: 19
  }, {
    opacity: 1,
    zoom: 20
  }, {
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: "bathymetry",
  elements: "geometry",
  stylers: [{
    hue: "#2a3037"
  }]
}, {
  tags: {
    any: ["industrial", "construction_site"]
  },
  elements: "geometry",
  stylers: [{
    color: "#3c4249",
    zoom: 0
  }, {
    color: "#3c4249",
    zoom: 1
  }, {
    color: "#3c4249",
    zoom: 2
  }, {
    color: "#3c4249",
    zoom: 3
  }, {
    color: "#3c4249",
    zoom: 4
  }, {
    color: "#3c4249",
    zoom: 5
  }, {
    color: "#3c4249",
    zoom: 6
  }, {
    color: "#3c4249",
    zoom: 7
  }, {
    color: "#3c4249",
    zoom: 8
  }, {
    color: "#3c4249",
    zoom: 9
  }, {
    color: "#3c4249",
    zoom: 10
  }, {
    color: "#3c4249",
    zoom: 11
  }, {
    color: "#3c4249",
    zoom: 12
  }, {
    color: "#3c4249",
    zoom: 13
  }, {
    color: "#383d44",
    zoom: 14
  }, {
    color: "#33383e",
    zoom: 15
  }, {
    color: "#32373d",
    zoom: 16
  }, {
    color: "#31363c",
    zoom: 17
  }, {
    color: "#31363b",
    zoom: 18
  }, {
    color: "#30353a",
    zoom: 19
  }, {
    color: "#2f3439",
    zoom: 20
  }, {
    color: "#2e3338",
    zoom: 21
  }]
}, {
  tags: {
    any: "transit",
    none: ["transit_location", "transit_line", "transit_schema", "is_unclassified_transit"]
  },
  elements: "geometry",
  stylers: [{
    color: "#3c4249",
    zoom: 0
  }, {
    color: "#3c4249",
    zoom: 1
  }, {
    color: "#3c4249",
    zoom: 2
  }, {
    color: "#3c4249",
    zoom: 3
  }, {
    color: "#3c4249",
    zoom: 4
  }, {
    color: "#3c4249",
    zoom: 5
  }, {
    color: "#3c4249",
    zoom: 6
  }, {
    color: "#3c4249",
    zoom: 7
  }, {
    color: "#3c4249",
    zoom: 8
  }, {
    color: "#3c4249",
    zoom: 9
  }, {
    color: "#3c4249",
    zoom: 10
  }, {
    color: "#3c4249",
    zoom: 11
  }, {
    color: "#3c4249",
    zoom: 12
  }, {
    color: "#3c4249",
    zoom: 13
  }, {
    color: "#383d44",
    zoom: 14
  }, {
    color: "#33383e",
    zoom: 15
  }, {
    color: "#32373d",
    zoom: 16
  }, {
    color: "#31363c",
    zoom: 17
  }, {
    color: "#31363b",
    zoom: 18
  }, {
    color: "#30353a",
    zoom: 19
  }, {
    color: "#2f3439",
    zoom: 20
  }, {
    color: "#2e3338",
    zoom: 21
  }]
}, {
  tags: "fence",
  elements: "geometry.fill",
  stylers: [{
    color: "#454c54"
  }, {
    opacity: 0.75,
    zoom: 0
  }, {
    opacity: 0.75,
    zoom: 1
  }, {
    opacity: 0.75,
    zoom: 2
  }, {
    opacity: 0.75,
    zoom: 3
  }, {
    opacity: 0.75,
    zoom: 4
  }, {
    opacity: 0.75,
    zoom: 5
  }, {
    opacity: 0.75,
    zoom: 6
  }, {
    opacity: 0.75,
    zoom: 7
  }, {
    opacity: 0.75,
    zoom: 8
  }, {
    opacity: 0.75,
    zoom: 9
  }, {
    opacity: 0.75,
    zoom: 10
  }, {
    opacity: 0.75,
    zoom: 11
  }, {
    opacity: 0.75,
    zoom: 12
  }, {
    opacity: 0.75,
    zoom: 13
  }, {
    opacity: 0.75,
    zoom: 14
  }, {
    opacity: 0.75,
    zoom: 15
  }, {
    opacity: 0.75,
    zoom: 16
  }, {
    opacity: 0.45,
    zoom: 17
  }, {
    opacity: 0.45,
    zoom: 18
  }, {
    opacity: 0.45,
    zoom: 19
  }, {
    opacity: 0.45,
    zoom: 20
  }, {
    opacity: 0.45,
    zoom: 21
  }]
}, {
  tags: "medical",
  elements: "geometry",
  stylers: [{
    color: "#3c4249",
    zoom: 0
  }, {
    color: "#3c4249",
    zoom: 1
  }, {
    color: "#3c4249",
    zoom: 2
  }, {
    color: "#3c4249",
    zoom: 3
  }, {
    color: "#3c4249",
    zoom: 4
  }, {
    color: "#3c4249",
    zoom: 5
  }, {
    color: "#3c4249",
    zoom: 6
  }, {
    color: "#3c4249",
    zoom: 7
  }, {
    color: "#3c4249",
    zoom: 8
  }, {
    color: "#3c4249",
    zoom: 9
  }, {
    color: "#3c4249",
    zoom: 10
  }, {
    color: "#3c4249",
    zoom: 11
  }, {
    color: "#3c4249",
    zoom: 12
  }, {
    color: "#3c4249",
    zoom: 13
  }, {
    color: "#383d44",
    zoom: 14
  }, {
    color: "#33383e",
    zoom: 15
  }, {
    color: "#32373d",
    zoom: 16
  }, {
    color: "#31363c",
    zoom: 17
  }, {
    color: "#31363b",
    zoom: 18
  }, {
    color: "#30353a",
    zoom: 19
  }, {
    color: "#2f3439",
    zoom: 20
  }, {
    color: "#2e3338",
    zoom: 21
  }]
}, {
  tags: "beach",
  elements: "geometry",
  stylers: [{
    color: "#3c4249",
    opacity: 0.3,
    zoom: 0
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 1
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 2
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 3
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 4
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 5
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 6
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 7
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 8
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 9
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 10
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 11
  }, {
    color: "#3c4249",
    opacity: 0.3,
    zoom: 12
  }, {
    color: "#3c4249",
    opacity: 0.65,
    zoom: 13
  }, {
    color: "#383d44",
    opacity: 1,
    zoom: 14
  }, {
    color: "#33383e",
    opacity: 1,
    zoom: 15
  }, {
    color: "#32373d",
    opacity: 1,
    zoom: 16
  }, {
    color: "#31363c",
    opacity: 1,
    zoom: 17
  }, {
    color: "#31363b",
    opacity: 1,
    zoom: 18
  }, {
    color: "#30353a",
    opacity: 1,
    zoom: 19
  }, {
    color: "#2f3439",
    opacity: 1,
    zoom: 20
  }, {
    color: "#2e3338",
    opacity: 1,
    zoom: 21
  }]
}, {
  tags: {
    all: ["is_tunnel", "path"]
  },
  elements: "geometry.fill",
  stylers: [{
    color: "#272b30"
  }, {
    opacity: 0.3
  }]
}, {
  tags: {
    all: ["is_tunnel", "path"]
  },
  elements: "geometry.outline",
  stylers: [{
    opacity: 0
  }]
}, {
  tags: "road_limited",
  elements: "geometry.fill",
  stylers: [{
    color: "#171a1c"
  }, {
    scale: 0,
    zoom: 0
  }, {
    scale: 0,
    zoom: 1
  }, {
    scale: 0,
    zoom: 2
  }, {
    scale: 0,
    zoom: 3
  }, {
    scale: 0,
    zoom: 4
  }, {
    scale: 0,
    zoom: 5
  }, {
    scale: 0,
    zoom: 6
  }, {
    scale: 0,
    zoom: 7
  }, {
    scale: 0,
    zoom: 8
  }, {
    scale: 0,
    zoom: 9
  }, {
    scale: 0,
    zoom: 10
  }, {
    scale: 0,
    zoom: 11
  }, {
    scale: 0,
    zoom: 12
  }, {
    scale: 0.1,
    zoom: 13
  }, {
    scale: 0.2,
    zoom: 14
  }, {
    scale: 0.3,
    zoom: 15
  }, {
    scale: 0.5,
    zoom: 16
  }, {
    scale: 0.6,
    zoom: 17
  }, {
    scale: 0.69,
    zoom: 18
  }, {
    scale: 0.7,
    zoom: 19
  }, {
    scale: 0.74,
    zoom: 20
  }, {
    scale: 0.8,
    zoom: 21
  }]
}, {
  tags: "road_limited",
  elements: "geometry.outline",
  stylers: [{
    color: "#606b76",
    scale: 0.9,
    zoom: 0
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 1
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 2
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 3
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 4
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 5
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 6
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 7
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 8
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 9
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 10
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 11
  }, {
    color: "#606b76",
    scale: 0.9,
    zoom: 12
  }, {
    color: "#606b76",
    scale: 0.1,
    zoom: 13
  }, {
    color: "#2e3338",
    scale: 0.2,
    zoom: 14
  }, {
    color: "#2e3338",
    scale: 0.3,
    zoom: 15
  }, {
    color: "#2e3338",
    scale: 0.5,
    zoom: 16
  }, {
    color: "#2e3338",
    scale: 0.6,
    zoom: 17
  }, {
    color: "#2e3338",
    scale: 0.75,
    zoom: 18
  }, {
    color: "#2e3338",
    scale: 0.76,
    zoom: 19
  }, {
    color: "#2e3338",
    scale: 0.79,
    zoom: 20
  }, {
    color: "#2e3338",
    scale: 0.86,
    zoom: 21
  }]
}, {
  tags: "transit_stop",
  elements: "label.icon",
  stylers: [{
    color: "#171a1c"
  }, {
    "secondary-color": "#8aa1a8"
  }, {
    "tertiary-color": "#505962"
  }]
}, {
  tags: {
    any: "landcover",
    none: "vegetation"
  },
  stylers: {
    visibility: "off"
  }
}];

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getQueryParams: () => (/* binding */ getQueryParams),
/* harmony export */   pageScroll: () => (/* binding */ pageScroll),
/* harmony export */   promiseWrapper: () => (/* binding */ promiseWrapper),
/* harmony export */   throttle: () => (/* binding */ throttle)
/* harmony export */ });
/* harmony import */ var _lenis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lenis */ "./src/lenis.js");


/**
 *
 * @param {Promise<any>} promise
 */
const promiseWrapper = async promise => {
  const [{
    value,
    reason
  }] = await Promise.allSettled([promise]);
  return {
    data: value,
    error: reason
  };
};
const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const queryParams = {};
  for (const [key, value] of searchParams.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
};
const throttle = (fn, delay) => {
  let timeout;
  return function (...args) {
    const context = this;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(context, args);
      }, delay);
    }
  };
};
const pageScroll = (x, time = 0) => {
  _lenis__WEBPACK_IMPORTED_MODULE_0__.lenis.scrollTo($(x).offset().top, {
    duration: time / 1_000,
    lock: true
  });
  // setTimeout(function () {
  // 	$('html, body').animate(
  // 		{
  // 			scrollTop: $(x).offset().top,
  // 		},
  // 		ms
  // 	);
  // }, 500);
};

/***/ }),

/***/ "./src/videos.js":
/*!***********************!*\
  !*** ./src/videos.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initVideos: () => (/* binding */ initVideos)
/* harmony export */ });
const initVideos = () => {
  const videos = [...document.querySelectorAll('video')];
  if (videos.length > 0) {
    videos[0].play();
    console.log('video', videos[0]);
  }
};

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = window["jQuery"];

/***/ }),

/***/ "ymaps3":
/*!*******************************************************************************************************************!*\
  !*** external ["https://api-maps.yandex.ru/v3/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&lang=ru_RU","ymaps3"] ***!
  \*******************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
var __webpack_error__ = new Error();
module.exports = new Promise((resolve, reject) => {
	if(typeof ymaps3 !== "undefined") return resolve();
	__webpack_require__.l("https://api-maps.yandex.ru/v3/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&lang=ru_RU", (event) => {
		if(typeof ymaps3 !== "undefined") return resolve();
		var errorType = event && (event.type === 'load' ? 'missing' : event.type);
		var realSrc = event && event.target && event.target.src;
		__webpack_error__.message = 'Loading script failed.\n(' + errorType + ': ' + realSrc + ')';
		__webpack_error__.name = 'ScriptExternalLoadError';
		__webpack_error__.type = errorType;
		__webpack_error__.request = realSrc;
		reject(__webpack_error__);
	}, "ymaps3");
}).then(() => (ymaps3));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "bksq:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map