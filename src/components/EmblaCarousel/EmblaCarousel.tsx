"use client"

import '@/src/components/EmblaCarousel/embla.css'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'

/* this components has embla library as dependency, please install npm install embla-carousel-react */

type ControlsPosition = 'start' | 'center' | 'end' | 'none';

interface EmblaCarouselProps {
    slides: React.ReactNode[]
    buttonsPosition?: ControlsPosition
    dotsPosition?: ControlsPosition
	showBorder?: boolean;
}

const OPTIONS: EmblaOptionsType = { loop: true, slidesToScroll: 1 }

export const EmblaCarousel = ({ showBorder = true, buttonsPosition = 'start', dotsPosition = 'end', ...props}: EmblaCarouselProps) => {
    const { slides } = props;
    
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
	const borders = showBorder === true ? 'border-2 rounded-[24px]' : ''

    const renderButtons = () => (
        <div className="embla__buttons flex gap-2 items-center">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
    );

    const renderDots = () => (
        <div className="embla__dots flex items-center">
            {scrollSnaps.map((_, index) => (
                <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={'embla__dot'.concat(
                        index === selectedIndex ? ' embla__dot--selected' : ''
                    )}
                />
            ))}
        </div>
    );

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((item, index) => (
                        <div className="embla__slide" key={index}>
                            <div className={`embla__slide__content ${borders}`}>
								{item}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls flex flex-row w-full mt-2 items-center justify-between">
                <div className="flex-1 flex justify-start gap-4">
                    {buttonsPosition === 'start' && renderButtons()}
                    {dotsPosition === 'start' && renderDots()}
                </div>
                <div className="flex-1 flex justify-center gap-4">
                    {buttonsPosition === 'center' && renderButtons()}
                    {dotsPosition === 'center' && renderDots()}
                </div>
                <div className="flex-1 flex justify-end gap-4">
                    {buttonsPosition === 'end' && renderButtons()}
                    {dotsPosition === 'end' && renderDots()}
                </div>
            </div>
        </div>
    )
}