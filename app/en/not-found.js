import Link from 'next/link';
export default function EnglishNotFound() {
  return <section className="translation-empty translation-missing"><span className="eyebrow">404 / NOT FOUND</span><h1>This page could not be found.</h1>
    <p>The article may not exist or its English translation may not have been published yet.</p>
    <Link className="button-secondary" href="/en">Go to the English home page ↗</Link></section>;
}
