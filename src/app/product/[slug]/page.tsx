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
    <div className="container mx-auto px-4 my-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <PhotoCarousel images={productImages} />
        </div>
        <div className="w-full ml-4 lg:w-1/2 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">{name}</h2>
          <ProductSizeSelector product={product} />
          <hr className="my-4" />
          <div>
            <h4 className="text-lg font-semibold mb-2">Description</h4>
            <div className="text-gray-600 space-y-2">
              {description.split('\n').map((text, index) => (
                <p key={index} className="text-sm sm:text-base">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {category && <RelatedProducts productId={id} category={category} />}
    </div>
  );
}
