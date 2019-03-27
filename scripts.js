let currentSlideIndex;

const init = () => {
  const initialSlides = document.querySelectorAll('div.slide');
  const initialCurrentIndex = Array.from(initialSlides.values()).findIndex((value) => value.classList.contains('current'));
  setSlideIndex(initialCurrentIndex);
  markSlideAsCurrent();
}

const setSlideIndex = (newValue) => {
  const slides = document.querySelectorAll('div.slide');  
  if (newValue >= slides.length) {
    currentSlideIndex = slides.length - 1;
    return;
  }

  if (newValue < 0) {
    currentSlideIndex = 0;
    return;
  }

  currentSlideIndex = newValue;
}

const markSlideAsCurrent = (scrollTo = true, smoothScroll = true) => {
  const slides = Array.from(document.querySelectorAll('div.slide').values());
  slides.forEach(slide => slide.classList.remove('current'));
  slides[currentSlideIndex].classList.add('current');  
  if (scrollTo) {
    slides[currentSlideIndex].scrollIntoView({
      behavior: smoothScroll ? 'smooth': 'auto',
    });
  }
}

const gotoNextSlide = () => {
  setSlideIndex(currentSlideIndex + 1);
  markSlideAsCurrent();
}

const gotoPrevSlide = () => {
  setSlideIndex(currentSlideIndex - 1);
  markSlideAsCurrent();
}

document.addEventListener('keyup', (e) => {
  switch(e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      gotoNextSlide();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      gotoPrevSlide();
      break;
  }
});

let blockScroll = false;
let lastTimeoutId;

window.addEventListener('resize', () => {
  clearTimeout(lastTimeoutId);
  blockScroll = true;
  const slides = Array.from(document.querySelectorAll('div.slide').values());
  slides[currentSlideIndex].scrollIntoView();
  lastTimeoutId = setTimeout(() => blockScroll = false, 100);
});

document.addEventListener('scroll', (e) => {
  if (blockScroll) {
    return;
  }

  const slides = Array.from(document.querySelectorAll('div.slide').values());
  const pageOffset = window.pageYOffset;
  const closestSlide = slides.reduce((prev, slide) => {
    const prevScrollDiff = Math.abs(prev.offsetTop - pageOffset);
    const slideScrollDiff = Math.abs(slide.offsetTop - pageOffset);
    if (slideScrollDiff < prevScrollDiff) {
      return slide;
    }

    return prev;
  }, slides[0]);

  const closestSlideIndex = slides.indexOf(closestSlide);
  setSlideIndex(closestSlideIndex);
  markSlideAsCurrent(false);
});

init();
