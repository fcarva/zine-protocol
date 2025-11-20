"use client";

import { useParams, notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { SubscriptionPrompt } from "@/components/SubscriptionPrompt";
import { MOCK_MENTIONS } from "@/data/mockMentions";

export default function ReadPage() {
    const params = useParams();
    const mention = MOCK_MENTIONS.find((m) => m.slug === params.slug);

    if (!mention) {
        notFound();
    }

    return (
        <ArticleLayout
            title={mention.title}
            meta={
                <>
                    <span>{mention.date}</span>
                    <span>///</span>
                    <span>{mention.author}</span>
                    <span>///</span>
                    <span>{mention.readTime} Read</span>
                </>
            }
        >
            <SubscriptionPrompt>
                <div
                    dangerouslySetInnerHTML={{ __html: mention.content || "" }}
                    className="space-y-6"
                />
            </SubscriptionPrompt>
        </ArticleLayout>
    );
}
