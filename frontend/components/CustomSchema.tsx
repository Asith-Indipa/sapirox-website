import { getSeoSettingsByPath, SEOSetting } from '@/services/api';

interface CustomSchemaProps {
  path: string;
}

export default async function CustomSchema({ path }: CustomSchemaProps) {
  let seo: SEOSetting | null = null;
  
  try {
    // Fetch the SEO settings for the given path on the server-side
    seo = await getSeoSettingsByPath(path);
  } catch {
    // Fail silently if SEO settings or custom schema is not configured for this path
  }
  
  if (seo && seo.schemaMarkup) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: typeof seo.schemaMarkup === 'string' 
            ? seo.schemaMarkup 
            : JSON.stringify(seo.schemaMarkup)
        }}
      />
    );
  }
  
  return null;
}

