import { Metadata } from 'next';
import { getProductById } from '@/lib/catalog';
import { notFound } from 'next/navigation';
import RelatedProducts from '@/components/RelatedProducts';
import PhotoCarousel from '@/components/PhotoCarousel';
import { metadata as defaultSiteMetadata } from '@/app/layout';
import ProductSizeSelector from '@/components/ProductSizeSelector';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductById(params.slug);
  if (!product) return defaultSiteMetadata;

  const { image: thumbnailImage, name } = product;

  return {
    title: `${name} | SwagSticker.com`,
    openGraph: {
      images: [thumbnailImage],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductById(params.slug);
  if (!product) return notFound();
  const { image: thumbnailImage, name, description, category, id } = product;
  const productImages = [thumbnailImage, '/images/2x2in-sticker-mockup.jpg', '/images/3x3in-sticker-mockup.jpg', '/images/4x4in-sticker-mockup.jpg'];

  return (
    <>
      <div className="flex flex-col md:flex-row my-8">
        <PhotoCarousel images={productImages} />
        <div className="min-w-96 mx-4">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <ProductSizeSelector product={product} />
          <hr className="my-4" />
          <h4 className="text-md font-semibold inline">Description</h4>
          <div className="text-gray-600 ml-2">
            {description.split('\n').map((text, index) => (
              <p key={index} className="text-wrap">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
      {category && <RelatedProducts productId={id} category={category} />}
    </>
  );
}
