import { useEffect, useRef, useState } from "react"

export default function OnScreen({children, onCenterScreen}){
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            onCenterScreen()
            }
        },
        {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0,
        }
        )

        if (ref.current) {
        observer.observe(ref.current)
        }

        return () => {
        if (ref.current) {
            observer.unobserve(ref.current)
        }
        }
    }, [onCenterScreen])

    return <div style={{display:"flex"}} ref={ref}>{children}</div>
}
