const ROOT_SELECTOR = '.book-slider';

class BookSlider {
	constructor(element) {
		this.slider = element;
		console.log(this.slider);

		if (!this.slider) {
			return;
		}
		this.sliderContainer = this.slider.querySelector('.book-slider__container');
		this.books = Array.from(
			this.slider.querySelectorAll('.book-slider__slide')
		);

		this.sliderContainerWidth =
			this.sliderContainer.getBoundingClientRect().width;
		this.bookWidth = this.books[0].scrollWidth;
		this.halfBookWidth = this.bookWidth / 2;
		this.bookThickness = this.books[0].querySelector('.book__root').scrollWidth;
		this.halfBookThickness = this.bookThickness / 2;
		this.booksGap = 16;

		this.currentBook = 0;

		this.books.forEach((book) => {
			const root = book.querySelector('.book__root');

			book.style.setProperty('--root-width', `-${this.bookThickness}px`);

			root.style.transform = `translate3d(50%, 0px, ${-this
				.halfBookThickness}px) rotateY(-180deg)`;
		});

		this.setupBooks();
		this.bindEvents();

		setTimeout(() => {
			this.books.forEach(
				(book) => (book.style.transition = 'all 0.6s ease-out')
			);
		});
	}

	setupBooks() {
		const halfBookWidth = this.bookWidth / 2;

		this.books.forEach((book, index) => {
			const normalizedIndex = Math.abs(index - (this.books.length - 1));

			// book.style.zIndex = normalizedIndex + 1;

			book.classList.toggle(
				'book-slider__slide--active',
				index === this.currentBook
			);

			if (index === this.currentBook) {
				book.style.rotate = 'y 0deg';
			} else {
				book.style.rotate = 'y 90deg';
			}

			if (index < this.currentBook) {
				book.style.translate = `${
					-this.sliderContainerWidth +
					halfBookWidth +
					this.bookThickness * (index + 1) +
					index * this.booksGap
				}px`;
				book.style.zIndex = null;
			} else if (index > this.currentBook) {
				book.style.translate = `${
					halfBookWidth -
					this.bookThickness * normalizedIndex -
					normalizedIndex * this.booksGap
				}px`;

				book.style.zIndex = normalizedIndex + 1;
			}

			if (index === this.currentBook) {
				if (index === 0) {
					book.style.translate = `${
						-this.sliderContainerWidth + this.bookWidth
					}px`;
				} else if (index === this.books.length - 1) {
					book.style.translate = '0px';
				} else {
					const leftBookTranslate =
						-this.sliderContainerWidth +
						halfBookWidth +
						this.bookThickness * (index - 1) +
						(index - 1) * this.booksGap;
					const rightBookTranslate =
						halfBookWidth -
						this.bookThickness * normalizedIndex -
						(normalizedIndex - 1) * this.booksGap;
					const currentBookTranslate =
						(rightBookTranslate - Math.abs(leftBookTranslate)) / 2 +
						this.bookThickness / 2;

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
			slide.onclick = (event) => {
				if (this.currentBook === i) {
					return;
				}

				event.preventDefault();
				event.stopImmediatePropagation();

				this.slider.scrollIntoView({ behavior: 'smooth' });

				this.currentBook = i;

				this.setupBooks();
			};
		});
	}

	destroy() {
	
	}
}

export default class BookSliderCollection {
	/**
	 * @type {Map<HTMLElement,BookSlider>}
	 */
	static bookSliderMap = new Map();

	static init() {
		document.querySelectorAll(ROOT_SELECTOR).forEach((slider) => {
			const BookSliderInstance = new BookSlider(slider);

			BookSliderCollection.bookSliderMap.set(slider, BookSliderInstance);
		});
	}

	static destroyAll() {
		BookSliderCollection.bookSliderMap.forEach((bookSlider) => {
			bookSlider.destroy();
		});

		BookSliderCollection.bookSliderMap.clear();
	}
}
