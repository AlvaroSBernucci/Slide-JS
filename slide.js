import debounce from "./debounce.js";
class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper),
        this.slide = document.querySelector(slide),
        this.dist = { DistFinal: 0, DistInicial: 0, Movimento: 0},
        this.activeClass = 'active'
        this.changeEvent = new Event('changeEvent');
    }
    addEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }
    onStart(event) {
        let moveType;
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.DistInicial = event.clientX;
            moveType = 'mousemove';
        } else {
            this.dist.DistInicial = event.changedTouches[0].clientX;
            moveType = 'touchmove';
        }
        this.wrapper.addEventListener(moveType, this.onMove);
    }
    onMove(event){
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const movimento = this.updateDistance(pointerPosition);
        this.moveSlide(movimento);
        
    }
    updateDistance(clientX) {
        this.dist.Movimento = (this.dist.DistInicial - clientX) * 1.5;
        return  this.dist.DistFinal + this.dist.Movimento;
    }
    moveSlide(movimento) {
        this.slide.style.transform = `translate3d(${movimento}px, 0px, 0px)`
    }
    onEnd(event) {
        let moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType,this.onMove);
        this.dist.DistFinal = this.dist.Movimento;
        this.changeSlideOnEnd();
    }
    changeSlideOnEnd() {
        if (this.dist.Movimento < -120 && this.index.next !== undefined) {
            this.activeNextSlide();
          } else if (this.dist.Movimento > 120 && this.index.prev !== undefined) {
            this.activePreviousSlide();
          } else {
            this.changeSlide(this.index.active);
          }
    }
  
    slideConfig() {
        this.config = [...this.slide.children].map((element) => {
            const position = -element.offsetLeft + this.centralizarImg(element);
            return {
                element,
                position,
            }
        })
    }
    centralizarImg(element){
        const margem = (this.wrapper.offsetWidth - element.offsetWidth) / 2;
        return margem
    }
    slideIndexNav(index){
        const last = this.config.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        }
    }
    changeSlide(index) {
        const activeSlide = this.config[index];
        this.moveSlide(activeSlide.position);
        this.activeSlide(activeSlide.element);
        this.slideIndexNav(index);
        this.dist.DistFinal = activeSlide.position;
        this.wrapper.dispatchEvent(this.changeEvent);
    }
    activePreviousSlide() {
        if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
    }
    activeNextSlide() {
        if (this.index.next !== undefined) this.changeSlide(this.index.next);
    }
    activeSlide(activeSlide) {
        this.config.forEach((item) => item.element.classList.remove(this.activeClass))
        activeSlide.classList.add(this.activeClass);
    }
    onResize() {
        setTimeout(() => {
            this.slideConfig();
            this.changeSlide(this.index.active);
        }, 1000);
    }
    addResizeEvent() {
        window.addEventListener('resize', debounce(this.onResize,1000));
    }
    bindItens() {
        this.onStart = this.onStart.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onResize = this.onResize.bind(this);
        this.activePreviousSlide = this.activePreviousSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);
        this.changeSlide = this.changeSlide.bind(this);
        this.addEventoControle = this.addEventoControle.bind(this);
        this.activeControl = this.activeControl.bind(this);
    }
    init() {
        this.bindItens();
        this.addEvents();
        this.addEventsSlideNav();
        this.addResizeEvent();
        this.slideConfig();
        console.log(this);
        return this;
    }

}

export default class SlideNav extends Slide {
    addArrow(prev, next) {
        this.prev = document.querySelector(prev);
        this.next = document.querySelector(next);
    }
    addEventsSlideNav() {
        this.prev.addEventListener('click',this.activePreviousSlide);
        this.next.addEventListener('click',this.activeNextSlide);
    }
    createControl() {
        const controle = document.createElement('ul');
        controle.dataset.controle = 'slide';
        this.config.forEach((element,index) => {
            controle.innerHTML += `<li><a href='#slide${index +1}'></a></li>`;
        })
        this.wrapper.appendChild(controle);
        return controle
    }
    addControle(customControl) {
        this.control = document.querySelector(customControl) || this.createControl();
        this.controlItens = [...this.control.children];
        this.activeControl();
        this.controlItens.forEach(this.addEventoControle);
    }
    addEventoControle(item, index) {
        item.addEventListener('click', ((event) => {
            event.preventDefault();
            this.changeSlide(index);
            this.activeControl();
        }));
        this.wrapper.addEventListener('changeEvent', this.activeControl);
    }
    activeControl() {
        this.controlItens.forEach((item) => item.classList.remove(this.activeClass))
        this.controlItens[this.index.active].classList.add(this.activeClass);
    }
}
