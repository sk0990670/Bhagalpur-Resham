export const getProductImage = (product: any, type: 'fullBody' | 'closeup' | 'micro') => {
  if (!product || !product.images) return '/assets/product-placeholder.webp';

  let imageUrl = '/assets/product-placeholder.webp';

  // 1. New schema format
  if (product.images[type]) {
    imageUrl = product.images[type];
  } 
  // 2. Legacy array format mapping
  else if (Array.isArray(product.images)) {
    if (type === 'fullBody' && product.images[0]) imageUrl = product.images[0].url || product.images[0];
    else if (type === 'closeup' && product.images[1]) imageUrl = product.images[1].url || product.images[1];
    else if (type === 'micro' && product.images[2]) imageUrl = product.images[2].url || product.images[2];
    // Fallback to first image if requesting something that doesn't exist
    else if (product.images[0]) imageUrl = product.images[0].url || product.images[0];
  }
  // 3. Object with wrong names fallback
  else if (typeof product.images === 'object') {
    if (type === 'fullBody') imageUrl = product.images.fullBody || product.images.full_body || product.images.full || imageUrl;
    else if (type === 'closeup') imageUrl = product.images.closeup || product.images.close_up || product.images.close || imageUrl;
    else if (type === 'micro') imageUrl = product.images.micro || product.images.detail || product.images.small || imageUrl;
  }

  // Cloudinary Cache Busting: Ensure images reload if the product was updated
  if (imageUrl && !imageUrl.includes('placeholder') && product.updatedAt) {
    const timestamp = new Date(product.updatedAt).getTime();
    imageUrl = `${imageUrl}?v=${timestamp}`;
  }

  return imageUrl;
};
