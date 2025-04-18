import { lenis } from './lenis';

export const initAfishaPopupStaff = () => {
	// Обработчик клика на элементы с классом 'afisha-item'

	var prevlink = 0;
	let currentScroll = 0;

	$('.r-afisha').on('click', function (e) {
		e.preventDefault(); // Отменяем стандартное поведение ссылки
		$('.popupin').remove();

		if (!e.target.closest('.afisha-item')) {
			return;
		}

		currentScroll = lenis.actualScroll;

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
					lenis.stop();
					history.pushState(null, null, link);
				}
			},
			error: function (xhr, status, error) {
				console.log('error');
				// [console.log(](console.log()"Ошибка: " + [xhr.status](xhr.status) + " " + error);
			},
		});
	});

	$('.new-close-pop-left,.new-btn-close-pop').on('click', function () {
		$('html').removeClass('popupopened');
		lenis.start();
		history.pushState(null, null, prevlink);
	});

	window.addEventListener('popstate', (event) => {
		if (document.documentElement.classList.contains('popupopened')) {
			$('html').removeClass('popupopened');
			// history.pushState(null, null, prevlink);
			console.log({ currentScroll });

			setTimeout(() => {
				lenis.scrollTo(currentScroll, {
					lock: true,
					immediate: true,
				});
				lenis.start();
			}, 5);
		}
	});
};
