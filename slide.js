class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper),
        this.slide = document.querySelector(slide)
        this.dist = { DistFinal: 0, DistInicial: 0, Movimento: 0}
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
        this.dist.Movimento = this.dist.DistFinal + ((this.dist.DistInicial - clientX) * 1.5);
        return this.dist.Movimento;
    }
    moveSlide(movimento) {
        this.slide.style.transform = `translate3d(${movimento}px, 0px, 0px)`
    }
    onEnd(event) {
        let moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType,this.onMove);
        this.dist.DistFinal = this.dist.Movimento;
    }
    bindItens() {
        this.onStart = this.onStart.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onMove = this.onMove.bind(this);
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
    changeSlide(index) {
        this.moveSlide(this.config[index].position)
    }
    centralizarImg(element){
        const margem = (this.wrapper.offsetWidth - element.offsetWidth) / 2;
        return margem
    }
    init() {
        this.bindItens();
        this.addEvents();
        this.slideConfig();
        return this;
    }

}

const slide = new Slide('.slide-wrapper','.slide');
slide.init();
console.log(slide.config)
slide.changeSlide(2);

