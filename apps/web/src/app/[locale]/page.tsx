import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import {
    BentoCard,
    BentoCardContent,
    BentoCardCTA,
    BentoCardDescription,
    BentoCardFooter,
    BentoCardHeader,
    BentoCardTitle,
    BentoGrid
} from "@/components/ui/bento-grid";
import { spaceGrotesk } from "@/fonts";
import { cn } from "@/lib/utils";

type Feature = {
    name: string;
    description: string;
    href: string;
    cta: string;
    className: string;
    disabled?: boolean;
};

const features: Feature[] = [
    {
        name: "IlloUi",
        description:
            "A collection of UI components for IlloStack applications.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        disabled: true
    },
    {
        name: "Api",
        description: "Quick API setup for IlloStack applications.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2",
        disabled: true
    },
    {
        name: "Hooks",
        description: "Collection of hooks for IlloStack applications.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2",
        disabled: true
    },
    {
        name: "Signals",
        description: "Real-time event handling for IlloStack applications.",
        className: "col-span-3 lg:col-span-1",
        href: "#",
        cta: "Learn more",
        disabled: true
    }
];

export default function Page() {
    return (
        <div className="container my-auto max-w-7xl">
            <BentoGrid>
                {features.map((feature, idx) => (
                    <BentoCard
                        key={idx}
                        className={cn(
                            feature.className,
                            feature.disabled
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                        )}
                    >
                        <BentoCardContent />
                        <BentoCardHeader>
                            <BentoCardTitle className={spaceGrotesk.className}>
                                {feature.name}
                            </BentoCardTitle>
                            <BentoCardDescription>
                                {feature.description}
                            </BentoCardDescription>
                        </BentoCardHeader>
                        <BentoCardFooter>
                            <BentoCardCTA asChild disabled={feature.disabled}>
                                <Link href={feature.href}>
                                    {feature.cta}
                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Link>
                            </BentoCardCTA>
                        </BentoCardFooter>
                    </BentoCard>
                ))}
            </BentoGrid>
        </div>
    );
}
