import SlideNav from "./slide.js";
const slide = new SlideNav('.slide-wrapper','.slide');
slide.addArrow('.prev', '.next');
slide.init();
slide.changeSlide(0);
slide.addControle('.custom-slide');