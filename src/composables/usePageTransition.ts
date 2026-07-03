import { gsap } from 'gsap'

export function usePageTransition() {
  function enter(el: HTMLElement, done: () => void) {
    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', onComplete: done }
    )
  }

  function leave(el: HTMLElement, done: () => void) {
    gsap.to(el, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: done,
    })
  }

  return { enter, leave }
}
