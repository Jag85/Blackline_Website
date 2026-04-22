/**
 * Inline a JSON-LD structured-data block.
 * Renders a non-interactive <script type="application/ld+json"> tag.
 * Safe in both Server and Client Components.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
