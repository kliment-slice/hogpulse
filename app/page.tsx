"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import questionData from "./data/questions.json";

type Question = {
  id: string;
  title: string;
  type: "feedback" | "contact";
};

type ContactInfo = {
  name: string;
  email: string;
};

type ResponseValue = string | ContactInfo;
type ResponsesById = Record<string, ResponseValue>;

const questions = questionData as Question[];

export default function Home() {
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<ResponsesById>({});
  const [isComplete, setIsComplete] = useState(false);

  if (total === 0) {
    return null;
  }

  const question = questions[index] ?? questions[0];
  if (!question) {
    return null;
  }

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isContact = isLast;

  const goPrev = () => {
    setIndex((current) => (current - 1 + total) % total);
  };

  const goNext = () => {
    setIndex((current) => (current + 1) % total);
  };

  const currentResponse = responses[question.id];
  const feedbackValue = typeof currentResponse === "string" ? currentResponse : "";
  const contactValue =
    typeof currentResponse === "object" && currentResponse
      ? currentResponse
      : { name: "", email: "" };

  const updateFeedback = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setResponses((current) => ({
      ...current,
      [question.id]: value,
    }));
  };

  const updateContact =
    (field: keyof ContactInfo) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setResponses((current) => {
        const existingValue = current[question.id];
        const existing =
          typeof existingValue === "object" && existingValue
            ? existingValue
            : { name: "", email: "" };
        return {
          ...current,
          [question.id]: {
            ...existing,
            [field]: value,
          },
      };
    });
  };

  const handleSubmit = () => {
    if (isLast) {
      setIsComplete(true);
      return;
    }

    goNext();
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="HogPulse logo"
            width={120}
            height={120}
            priority
          />
        </div>
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
              HogPulse Live Feedback
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              {isComplete ? "Thanks for the feedback!" : question.title}
            </h1>
          </div>
          {!isComplete ? (
            <div className="flex items-center gap-3">
              {!isFirst && (
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous question"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 text-xl text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span aria-hidden>{"<"}</span>
                </button>
              )}
              {!isLast && (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next question"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 text-xl text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span aria-hidden>{">"}</span>
                </button>
              )}
            </div>
          ) : null}
        </header>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] md:p-8">
          {isComplete ? (
            <div className="space-y-3">
              <p className="text-lg">
                Your answers are in. We will keep building with your feedback in
                mind.
              </p>
              <p className="text-sm text-[var(--muted)]">
                You can close this tab or pass it along to someone else.
              </p>
            </div>
          ) : !isContact ? (
            <label className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                Your feedback
              </span>
              <textarea
                rows={6}
                placeholder="Tell us what stood out, what fell flat, or what you wish existed."
                value={feedbackValue}
                onChange={updateFeedback}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-transparent px-4 py-4 text-lg focus:border-[var(--ink)] focus:outline-none"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                    Name
                  </span>
                  <input
                    type="text"
                    placeholder="Ada Lovelace"
                    value={contactValue.name}
                    onChange={updateContact("name")}
                    className="h-12 rounded-xl border border-[var(--border)] bg-transparent px-4 text-lg focus:border-[var(--ink)] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="ada@hogpulse.com"
                    value={contactValue.email}
                    onChange={updateContact("email")}
                    className="h-12 rounded-xl border border-[var(--border)] bg-transparent px-4 text-lg focus:border-[var(--ink)] focus:outline-none"
                  />
                </label>
              </div>
              <p className="text-sm text-[var(--muted)]">
                We will only use this to follow up about the feature.
              </p>
            </div>
          )}
        </section>

        {!isComplete ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-[var(--accent)] py-6 text-2xl font-semibold text-[var(--accent-ink)] transition hover:-translate-y-1 hover:shadow-xl"
          >
            Submit
          </button>
        ) : null}

        {!isComplete ? (
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
            <span>
              Question {index + 1} of {total}
            </span>
            <span>Use arrows to cycle</span>
          </div>
        ) : null}
      </div>
    </main>
  );
}
