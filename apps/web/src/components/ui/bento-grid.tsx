import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid w-full auto-rows-[22rem] grid-cols-3 gap-12",
                    className
                )}
                {...props}
            />
        );
    }
);

BentoGrid.displayName = "BentoGrid";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("relative col-span-3 p-px", className)}
                {...props}
            >
                <div className="bg-border absolute left-[-0.5px] top-1/2 -z-10 h-screen w-px -translate-y-1/2" />
                <div className="bg-border absolute right-[-0.5px] top-1/2 -z-10 h-screen w-px -translate-y-1/2" />
                <div className="bg-border absolute bottom-[-0.5px] left-1/2 -z-10 h-px w-screen -translate-x-1/2" />
                <div className="bg-border absolute left-1/2 top-[-0.5px] -z-10 h-px w-screen -translate-x-1/2" />
                <div className="bg-background group relative z-10 h-full w-full overflow-hidden">
                    <div className="bg-muted/20 flex h-full flex-col justify-between">
                        {children}
                    </div>
                    <div className="group-hover:bg-muted/20 pointer-events-none absolute inset-0 transform-gpu transition-all duration-300" />
                </div>
            </div>
        );
    }
);

BentoCard.displayName = "BentoCard";

interface BentoCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCardHeader = React.forwardRef<HTMLDivElement, BentoCardHeaderProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10",
                    "[&>svg]:text-muted-foreground [&>svg]:h-12 [&>svg]:w-12 [&>svg]:origin-left [&>svg]:transform-gpu [&>svg]:transition-all [&>svg]:duration-300 [&>svg]:ease-in-out [&>svg]:group-hover:scale-75",
                    className
                )}
                {...props}
            />
        );
    }
);

BentoCardHeader.displayName = "BentoCardHeader";

interface BentoCardTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCardTitle = React.forwardRef<HTMLDivElement, BentoCardTitleProps>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn("text-xl font-semibold", className)}
                {...props}
            />
        );
    }
);

BentoCardTitle.displayName = "BentoCardTitle";

interface BentoCardDescriptionProps
    extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCardDescription = React.forwardRef<
    HTMLDivElement,
    BentoCardDescriptionProps
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("text-muted-foreground max-w-lg", className)}
            {...props}
        />
    );
});

BentoCardDescription.displayName = "BentoCardDescription";

interface BentoCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCardContent = React.forwardRef<
    HTMLDivElement,
    BentoCardContentProps
>(({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />;
});

BentoCardContent.displayName = "BentoCardContent";

interface BentoCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCardFooter = React.forwardRef<HTMLDivElement, BentoCardFooterProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                    className
                )}
                {...props}
            />
        );
    }
);

BentoCardFooter.displayName = "BentoCardFooter";

interface BentoCardCTAProps
    extends React.ComponentPropsWithoutRef<typeof Button> {}

const BentoCardCTA = React.forwardRef<HTMLButtonElement, BentoCardCTAProps>(
    ({ className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn("pointer-events-auto", className)}
                {...props}
            />
        );
    }
);

BentoCardCTA.displayName = "BentoCardCTA";

export {
    BentoCard,
    BentoCardContent,
    BentoCardCTA,
    BentoCardDescription,
    BentoCardFooter,
    BentoCardHeader,
    BentoCardTitle,
    BentoGrid
};
