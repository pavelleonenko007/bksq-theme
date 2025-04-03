import "@ksedline/turnjs";

const ROOT_SELECTOR = '[data-book="flipping-book"]';

export const initFlippingBook = () => {
  const $flipping = $(ROOT_SELECTOR);
  let isFlipping = false;
  let wasFlipped = false;

  if ($flipping.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $flipping.turn("page", 2);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.8,
    },
  );

  observer.observe($flipping.get(0));

  $flipping.turn({
    when: {
      turn: function (e, page, view) {
        const $blockToHide = $(".left-hero-image-clone.left-col");

        if (page > 1) {
          $blockToHide.animate({ opacity: 0 }, 500);
        } else {
          $blockToHide.animate({ opacity: 1 }, 500);
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
      },
    },
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

    window.scrollTo({ top, behavior: "smooth" });

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
}

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
