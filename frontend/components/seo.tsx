'use client';

import React from 'react';

// ── Organization & Website Schema ──────────────────────────────────────────
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Sapirox',
    'url': 'https://sapirox.com',
    'logo': 'https://sapirox.com/logo.png',
    'sameAs': [
      'https://facebook.com/sapirox',
      'https://linkedin.com/company/sapirox',
      'https://twitter.com/sapirox'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+94-77-123-4567',
      'contactType': 'sales',
      'email': 'info@sapirox.com',
      'areaServed': 'Worldwide'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Sapirox',
    'url': 'https://sapirox.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://sapirox.com/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

// ── Service Schema ───────────────────────────────────────────────────────────
interface ServiceProps {
  title: string;
  description: string;
  features: string[];
}

export function ServiceSchema({ title, description, features }: ServiceProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': title,
    'description': description,
    'provider': {
      '@type': 'Organization',
      'name': 'Sapirox',
      'url': 'https://sapirox.com'
    },
    'serviceType': 'Software Development',
    'areaServed': 'Worldwide',
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'USD',
      'price': 'Contact for pricing'
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Sapirox Capability Features',
      'itemListElement': features.map((feat) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': feat
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Product Schema ───────────────────────────────────────────────────────────
interface ProductProps {
  name: string;
  description: string;
  image: string;
  slug: string;
  tech: string[];
  status: string;
}

export function ProductSchema({ name, description, image, slug, tech, status }: ProductProps) {
  const availability = 
    status === 'ACTIVE' 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/PreOrder';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': name,
    'description': description,
    'image': image,
    'brand': {
      '@type': 'Brand',
      'name': 'Sapirox'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://sapirox.com/products/${slug}`,
      'priceCurrency': 'USD',
      'price': '0',
      'priceValidUntil': '2028-12-31',
      'availability': availability,
      'itemCondition': 'https://schema.org/NewCondition'
    },
    'additionalProperty': tech.map(t => ({
      '@type': 'PropertyValue',
      'name': 'Technology',
      'value': t
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Article/Blog Schema ───────────────────────────────────────────────────────
interface ArticleProps {
  title: string;
  description: string;
  coverImage: string;
  slug: string;
  datePublished: string;
  category: string;
}

export function ArticleSchema({ title, description, coverImage, slug, datePublished, category }: ArticleProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'image': coverImage,
    'datePublished': datePublished,
    'author': {
      '@type': 'Organization',
      'name': 'Sapirox Team',
      'url': 'https://sapirox.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Sapirox',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://sapirox.com/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://sapirox.com/blog/${slug}`
    },
    'articleSection': category
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── ItemList Schema (Directory Listing) ──────────────────────────────────────
interface ItemListProps {
  items: { name: string; url: string; position: number }[];
}

export function ItemListSchema({ items }: ItemListProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': items.map(item => ({
      '@type': 'ListItem',
      'position': item.position,
      'url': item.url,
      'name': item.name
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Client Dynamic Meta Tags Injector ─────────────────────────────────────────
interface DynamicMetaTagsProps {
  path: string;
}

export function DynamicMetaTags({ path }: DynamicMetaTagsProps) {
  React.useEffect(() => {
    async function fetchAndApplySEO() {
      try {
        const encodedPath = encodeURIComponent(path);
        const res = await fetch(`http://localhost:5000/api/seo/${encodedPath}`);
        const json = await res.json();
        
        if (json.success && json.data) {
          const data = json.data;
          
          // Apply Title
          if (data.metaTitle) {
            document.title = data.metaTitle;
          }
          
          // Apply Description
          let descTag = document.querySelector('meta[name="description"]');
          if (descTag) {
            descTag.setAttribute('content', data.metaDescription);
          } else {
            descTag = document.createElement('meta');
            descTag.setAttribute('name', 'description');
            descTag.setAttribute('content', data.metaDescription);
            document.head.appendChild(descTag);
          }
          
          // Apply Keywords
          if (data.keywords && data.keywords.length > 0) {
            let keyTag = document.querySelector('meta[name="keywords"]');
            if (keyTag) {
              keyTag.setAttribute('content', data.keywords.join(', '));
            } else {
              keyTag = document.createElement('meta');
              keyTag.setAttribute('name', 'keywords');
              keyTag.setAttribute('content', data.keywords.join(', '));
              document.head.appendChild(keyTag);
            }
          }

          // Apply Open Graph Title
          if (data.ogTitle) {
            let ogTitleTag = document.querySelector('meta[property="og:title"]');
            if (ogTitleTag) {
              ogTitleTag.setAttribute('content', data.ogTitle);
            } else {
              ogTitleTag = document.createElement('meta');
              ogTitleTag.setAttribute('property', 'og:title');
              ogTitleTag.setAttribute('content', data.ogTitle);
              document.head.appendChild(ogTitleTag);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic page SEO settings:', err);
      }
    }
    fetchAndApplySEO();
  }, [path]);

  return null;
}

