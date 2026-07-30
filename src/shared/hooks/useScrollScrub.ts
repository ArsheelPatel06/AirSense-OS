import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

// Ensure plugins are registered
gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ScrollScrubOptions extends Omit<ScrollTrigger.Vars, 'trigger'> {
    trigger: RefObject<HTMLElement | null>;
    scope?: RefObject<HTMLElement | null>;
    start?: string | number;
    end?: string | number;
    scrub?: boolean | number;
    pin?: boolean | string | HTMLElement;
}

/**
 * A reusable hook for creating GSAP ScrollTrigger timelines with proper cleanup.
 * @param options - Configuration options for the ScrollTrigger
 * @param animationCallback - Callback to define animations on the created timeline
 */
export const useScrollScrub = (
    {
        trigger,
        scope,
        start = "top top",
        end = "+=2000",
        scrub = 1,
        pin = true,
        ...config
    }: ScrollScrubOptions,
    animationCallback?: (tl: gsap.core.Timeline) => void
) => {

    useGSAP(() => {
        if (!trigger.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: trigger.current,
                start,
                end,
                scrub,
                pin,
                anticipatePin: 1,
                ...config
            }
        });

        // Execute user animation logic
        if (animationCallback) {
            animationCallback(tl);
        }

    }, { scope: scope || trigger }); // Auto-scope to trigger if scope not provided
};
