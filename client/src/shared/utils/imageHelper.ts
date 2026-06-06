export const getProductImage = (product: any, type: 'fullBody' | 'closeup' | 'micro') => {
  if (!product || !product.images) return '/assets/product-placeholder.webp';

  // 1. New schema format
  if (product.images[type]) {
    return product.images[type];
  }

  // 2. Legacy array format mapping
  if (Array.isArray(product.images)) {
    if (type === 'fullBody' && product.images[0]) return product.images[0].url || product.images[0];
    if (type === 'closeup' && product.images[1]) return product.images[1].url || product.images[1];
    if (type === 'micro' && product.images[2]) return product.images[2].url || product.images[2];
    // Fallback to first image if requesting something that doesn't exist
    if (product.images[0]) return product.images[0].url || product.images[0];
  }

  // 3. Object with wrong names fallback
  if (typeof product.images === 'object') {
    if (type === 'fullBody') return product.images.fullBody || product.images.full_body || product.images.full || '/assets/product-placeholder.webp';
    if (type === 'closeup') return product.images.closeup || product.images.close_up || product.images.close || '/assets/product-placeholder.webp';
    if (type === 'micro') return product.images.micro || product.images.detail || product.images.small || '/assets/product-placeholder.webp';
  }

  return '/assets/product-placeholder.webp';
};
