import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KEYFRAMES } from './cameraRig';
import { sceneState } from './sceneState';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const toStatePatch = (i: number) => {
  const k = KEYFRAMES[i];
  return {
    px: k.position[0],
    py: k.position[1],
    pz: k.position[2],
    tx: k.target[0],
    ty: k.target[1],
    tz: k.target[2],
    sun: k.lighting.sun,
    pendants: k.lighting.pendants,
    ambient: k.lighting.ambient,
    sky: k.sky,
    parallax: k.parallax ?? 0,
  };
};

export function useSceneTimeline(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.inOut', duration: 1 },
      });
      KEYFRAMES.slice(1).forEach((_, i) => {
        timeline.to(sceneState, toStatePatch(i + 1), i);
      });

      ScrollTrigger.create({
        trigger: scope,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        animation: timeline,
      });

      const progress = document.querySelector<HTMLElement>('[data-progress]');
      if (progress) {
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
          },
        );
      }

      if (!reduced) {
        gsap.from('[data-hero-line]', {
          y: 48,
          opacity: 0,
          duration: 1.2,
          stagger: 0.14,
          ease: 'power3.out',
          delay: 0.35,
        });
        gsap.to('[data-hero-inner]', {
          opacity: 0,
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hero]',
            start: 'top top',
            end: 'bottom 60%',
            scrub: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 44,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          });
        });
      }

      const veil = document.querySelector<HTMLElement>('[data-veil]');
      if (veil) {
        gsap.fromTo(
          veil,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-contact]',
              start: 'top 95%',
              end: 'top 30%',
              scrub: 1,
            },
          },
        );
      }
    },
    { scope: scopeRef },
  );
}
