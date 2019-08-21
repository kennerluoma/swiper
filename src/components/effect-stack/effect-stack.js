import Utils from '../../utils/utils';

const Stack = {
  setTranslate() {
    const swiper = this;
    const { slides } = swiper;
    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      const offset =
        Math.round($slideEl[0].swiperSlideSize) + swiper.params.spaceBetween;
      let tx = swiper.translate;
      let ty = 0;
      if (i * offset + tx < 0) {
        tx = -(i * offset);
      }
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }
      $slideEl
        .css({ 'z-index': i })
        .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
    }
  },
  setTransition(duration) {
    const swiper = this;
    const { slides, $wrapperEl } = swiper;
    slides.transition(duration);
    if (swiper.params.virtualTranslate && duration !== 0) {
      let eventTriggered = false;
      slides.transitionEnd(() => {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
        for (let i = 0; i < triggerEvents.length; i++) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }
};

export default {
  name: 'effect-stack',
  params: {
    stackEffect: {}
  },
  create() {
    const swiper = this;
    Utils.extend(swiper, {
      stackEffect: {
        setTranslate: Stack.setTranslate.bind(swiper),
        setTransition: Stack.setTransition.bind(swiper)
      }
    });
  },
  on: {
    beforeInit() {
      const swiper = this;
      if (swiper.params.effect !== 'stack') return;
      swiper.classNames.push(`${swiper.params.containerModifierClass}stack`);
      const overwriteParams = {
        watchSlidesProgress: true,
        virtualTranslate: true
      };
      Utils.extend(swiper.params, overwriteParams);
      Utils.extend(swiper.originalParams, overwriteParams);
    },
    setTranslate() {
      const swiper = this;
      if (swiper.params.effect !== 'stack') return;
      swiper.stackEffect.setTranslate();
    },
    setTransition(duration) {
      const swiper = this;
      if (swiper.params.effect !== 'stack') return;
      swiper.stackEffect.setTransition(duration);
    }
  }
};
