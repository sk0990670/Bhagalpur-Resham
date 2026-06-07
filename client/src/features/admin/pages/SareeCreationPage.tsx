import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductImage } from '../../../shared/utils/imageHelper';
import { productService } from '../../../shared/services/product.service';
import api from '../../../shared/services/api';
import AdminSidebar from '../../../shared/components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';

const COLOR_PALETTE = [
  { name: 'Red', bg: 'bg-[#FF0000]' },
  { name: 'Maroon', bg: 'bg-[#800000]' },
  { name: 'Pink', bg: 'bg-[#FFC0CB]' },
  { name: 'Peach', bg: 'bg-[#FFDAB9]' },
  { name: 'Orange', bg: 'bg-[#FFA500]' },
  { name: 'Mustard', bg: 'bg-[#FFDB58]' },
  { name: 'Yellow', bg: 'bg-[#FFFF00]' },
  { name: 'Gold', bg: 'bg-[#D4AF37]' },
  { name: 'Beige', bg: 'bg-[#F5F5DC]' },
  { name: 'Cream', bg: 'bg-[#FFFDD0]' },
  { name: 'Off White', bg: 'bg-[#FAF9F6]' },
  { name: 'White', bg: 'bg-[#FFFFFF]' },
  { name: 'Black', bg: 'bg-[#000000]' },
  { name: 'Grey', bg: 'bg-[#808080]' },
  { name: 'Silver', bg: 'bg-[#C0C0C0]' },
  { name: 'Brown', bg: 'bg-[#8B4513]' },
  { name: 'Green', bg: 'bg-[#008000]' },
  { name: 'Olive Green', bg: 'bg-[#808000]' },
  { name: 'Mehendi Green', bg: 'bg-[#A0A53A]' },
  { name: 'Mint Green', bg: 'bg-[#98FF98]' },
  { name: 'Sea Green', bg: 'bg-[#2E8B57]' },
  { name: 'Bottle Green', bg: 'bg-[#006A4E]' },
  { name: 'Emerald Green', bg: 'bg-[#50C878]' },
  { name: 'Blue', bg: 'bg-[#0000FF]' },
  { name: 'Navy Blue', bg: 'bg-[#000080]' },
  { name: 'Royal Blue', bg: 'bg-[#4169E1]' },
  { name: 'Sky Blue', bg: 'bg-[#87CEEB]' },
  { name: 'Turquoise Blue', bg: 'bg-[#00CED1]' },
  { name: 'Teal Blue', bg: 'bg-[#008080]' },
  { name: 'Purple', bg: 'bg-[#800080]' },
  { name: 'Lavender', bg: 'bg-[#E6E6FA]' },
  { name: 'Violet', bg: 'bg-[#EE82EE]' },
  { name: 'Magenta', bg: 'bg-[#FF00FF]' },
  { name: 'Wine', bg: 'bg-[#722F37]' },
  { name: 'Rust', bg: 'bg-[#B7410E]' },
  { name: 'Coral', bg: 'bg-[#FF7F50]' },
  { name: 'Multicolor', bg: 'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500' }
];

const AdminSareeCreation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isWeaveDropdownOpen, setIsWeaveDropdownOpen] = useState(false);
    const [isOccasionDropdownOpen, setIsOccasionDropdownOpen] = useState(false);
    const [isBadgeDropdownOpen, setIsBadgeDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

// Maps each weave type to its canonical SKU prefix
const SKU_PREFIX: Record<string, string> = {
    'Pure Tussar Silk Weave':       'TSS',
    'Ghicha Silk Weave':            'GHC',
    'Matka Silk Weave':             'MTK',
    'Dupion Silk Weave':            'DUP',
    'Cotton-Silk Bhagalpuri Weave': 'CSB',
    'Zari Bhagalpuri Weave':        'ZAR',
};

const generateSKU = (weave: string = 'Pure Tussar Silk Weave') => {
    const prefix = SKU_PREFIX[weave] || 'SKU';
    const suffix = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${suffix}`;
};

    const [formData, setFormData] = useState({
        name: '',
        sku: generateSKU('Pure Tussar Silk Weave'),
        stock: '',
        price: '',
        discountPrice: '',
        description: '',
        weaveType: 'Pure Tussar Silk Weave',
        weight: '',
        gstPercent: '5',
        careInstructions: '',
        badge: 'Normal',
        primaryColor: '',
        occasion: '',
        status: 'Active',
    });

    const [images, setImages] = useState([
        { url: '', tempId: '', shotType: 'fullBody', isUploading: false, label: 'Full Body Shot *' },
        { url: '', tempId: '', shotType: 'closeup', isUploading: false, label: 'Close Up Shot' },
        { url: '', tempId: '', shotType: 'micro', isUploading: false, label: 'Micro Shot' }
    ]);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const res = await productService.getProductById(id);
                    if (res.success && res.data) {
                        const p = res.data;
                        setFormData({
                            name: p.name || '',
                            sku: p.sku || '',
                            stock: p.stock?.toString() ?? '0',
                            price: p.price?.toString() ?? '',
                            discountPrice: p.discountPrice?.toString() ?? '',
                            description: p.description || '',
                            weaveType: p.weaveType || 'Pure Tussar Silk Weave',
                            weight: p.weight?.toString() ?? '',
                            gstPercent: p.gstPercent?.toString() ?? '5',
                            careInstructions: p.careInstructions || '',
                            badge: p.badge || 'Normal',
                            primaryColor: p.attributes?.color || '',
                            occasion: p.attributes?.occasion || '',
                            status: p.isActive ? (p.stock === 0 ? 'Out of Stock' : 'Active') : 'Draft',
                        });
                        if (p.images) {
                            const newImages = [
                                { url: '', tempId: '', shotType: 'fullBody', isUploading: false, label: 'Full Body Shot *' },
                                { url: '', tempId: '', shotType: 'closeup', isUploading: false, label: 'Close Up Shot' },
                                { url: '', tempId: '', shotType: 'micro', isUploading: false, label: 'Micro Shot' }
                            ];
                            const fullBodyUrl = getProductImage(p, 'fullBody');
                            const closeupUrl = getProductImage(p, 'closeup');
                            const microUrl = getProductImage(p, 'micro');

                            const v = Date.now();
                            if (fullBodyUrl && !fullBodyUrl.includes('placeholder')) {
                                newImages[0].url = `${fullBodyUrl}?v=${v}`;
                                newImages[0].tempId = 'existing';
                            }
                            if (closeupUrl && !closeupUrl.includes('placeholder')) {
                                newImages[1].url = `${closeupUrl}?v=${v}`;
                                newImages[1].tempId = 'existing';
                            }
                            if (microUrl && !microUrl.includes('placeholder')) {
                                newImages[2].url = `${microUrl}?v=${v}`;
                                newImages[2].tempId = 'existing';
                            }
                            setImages(newImages);
                        }
                    }
                } catch (err) {
                    setError('Failed to fetch product data for editing.');
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Set uploading state with functional update
        setImages(prev => {
            const newImages = [...prev];
            newImages[index].isUploading = true;
            return newImages;
        });
        setError('');

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const response = await api.post('/upload/temp', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data?.success) {
                const { tempId } = response.data.data;
                const localUrl = URL.createObjectURL(file);
                
                setImages(prev => {
                    const updatedImages = [...prev];
                    updatedImages[index].tempId = tempId;
                    updatedImages[index].url = localUrl;
                    updatedImages[index].isUploading = false;
                    return updatedImages;
                });
            }
        } catch (err) {
            setImages(prev => {
                const failedImages = [...prev];
                failedImages[index].isUploading = false;
                return failedImages;
            });
            setError('Failed to upload image. Please check the file size and try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.sku || !formData.stock || !formData.price || !formData.description || !formData.primaryColor || !formData.occasion) {
            setError('Please fill in all required essence and craft details, including color and occasion.');
            return;
        }

        const skuParts = formData.sku.split('-');
        if (skuParts.length < 2 || !skuParts[1].trim()) {
            setError('Please provide a valid SKU suffix.');
            return;
        }

        if (formData.discountPrice && Number(formData.discountPrice) >= Number(formData.price)) {
            setError('Discount price must be less than the regular price.');
            return;
        }

        const emptyImage = !images[0].tempId.trim() && !images[0].url.trim();
        if (emptyImage && !id) {
            setError('The Full Body Shot image is required to publish the masterpiece.');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name: formData.name,
                sku: formData.sku,
                stock: formData.status === 'Out of Stock' ? 0 : Number(formData.stock),
                price: Number(formData.price),
                discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
                description: formData.description,
                weaveType: formData.weaveType,
                weight: formData.weight ? Number(formData.weight) : undefined,
                isActive: formData.status !== 'Draft',
                gstPercent: Number(formData.gstPercent),
                attributes: {
                    color: formData.primaryColor,
                    occasion: formData.occasion
                },
                careInstructions: formData.careInstructions,
                badge: formData.badge,
                ...(images.some(img => img.tempId && img.tempId !== 'existing') && !id && {
                    tempImages: images.filter(img => img.tempId && img.tempId !== 'existing').map(img => ({ tempId: img.tempId, shotType: img.shotType }))
                }),
                ...(id && {
                    imageUpdates: images.filter(img => img.url || img.tempId).map(img => {
                        if (img.tempId === 'existing') {
                            return { type: 'keep', shotType: img.shotType };
                        }
                        return { type: 'new', tempId: img.tempId, shotType: img.shotType };
                    })
                })
            };

            const res = id 
                ? await productService.updateProduct(id, payload)
                : await productService.createProduct(payload);

            if (res.success || res.status === 'Processing') {
                navigate('/admin/inventory');
            } else {
                setError(res.message || 'Failed to save masterpiece.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create masterpiece.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen w-full overflow-hidden flex bg-pattern-madhubani">
            <AdminSidebar />

            <main className="ml-64 flex-1 flex flex-col h-full overflow-hidden">
                <AdminHeader />

                <div className="flex-1 overflow-y-auto p-gutter lg:p-margin-desktop bg-surface-container-lowest">
                    <div className="max-w-container-max mx-auto space-y-section-gap pb-section-gap">
                        
                        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 pb-[400px]">
                            <div className="mb-8">
                                <Link className="inline-flex items-center text-primary font-label-caps text-label-caps hover:opacity-70 transition-opacity mb-4" to="/admin/inventory">
                                    <span className="material-symbols-outlined mr-2" style={{ fontSize: '16px' }}>arrow_back</span>
                                    BACK TO INVENTORY
                                </Link>
                                <h2 className="font-headline-xl text-headline-xl text-on-background mb-2">{id ? 'Edit Masterpiece' : 'Create Masterpiece'}</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant">{id ? 'Update the details of your silk creation.' : 'Weave a new story. Add details, imagery, and pricing for your new silk creation.'}</p>
                            </div>
                            
                            {error && (
                                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-md border border-error flex items-start gap-3">
                                    <span className="material-symbols-outlined text-error">error</span>
                                    <div>
                                        <p className="font-bold">Creation Failed</p>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form className="space-y-12" onSubmit={handleSubmit}>
                                {/*  Basic Information  */}
                                <section className="ambient-shadow bg-surface-container-lowest p-6 md:p-10 ornamental-border">
                                    <h3 className="font-story-serif text-story-serif text-tertiary mb-6 border-b border-outline-variant/30 pb-2">I. The Essence</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">Saree Name *</label>
                                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full custom-input font-headline-md text-headline-md text-on-surface focus:ring-0 placeholder:text-outline/50" placeholder="e.g. Royal Maroon Tussar Silk" type="text"/>
                                        </div>
                                        <div>
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">SKU *</label>
                                            <div className="flex items-stretch">
                                                {/* Locked prefix badge */}
                                                <div className="flex items-center px-3 bg-primary/10 border border-r-0 border-outline-variant font-label-caps text-label-caps text-primary tracking-widest select-none shrink-0">
                                                    {SKU_PREFIX[formData.weaveType] || 'SKU'}-
                                                </div>
                                                {/* Editable suffix */}
                                                <input
                                                    name="sku"
                                                    value={formData.sku.includes('-') ? formData.sku.split('-').slice(1).join('-') : formData.sku}
                                                    onChange={(e) => {
                                                        const prefix = SKU_PREFIX[formData.weaveType] || 'SKU';
                                                        setFormData(prev => ({ ...prev, sku: `${prefix}-${e.target.value.toUpperCase()}` }));
                                                    }}
                                                    required
                                                    maxLength={20}
                                                    className="flex-1 custom-input font-body-lg text-body-lg text-on-surface focus:ring-0 uppercase tracking-wider"
                                                    placeholder="KYBEXP"
                                                    type="text"
                                                />
                                            </div>
                                            <p className="text-xs text-on-surface-variant mt-1">Prefix is fixed by weave type. Only edit the suffix.</p>
                                        </div>
                                        <div>
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">Stock Quantity *</label>
                                            <input name="stock" value={formData.stock} onChange={handleChange} required min="0" className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="0" type="number"/>
                                        </div>
                                        <div>
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">Price (INR) *</label>
                                            <input name="price" value={formData.price} onChange={handleChange} required min="1" className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="₹" type="number"/>
                                        </div>
                                        <div>
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">Discount Price (Optional)</label>
                                            <input name="discountPrice" value={formData.discountPrice} onChange={handleChange} min="1" className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="₹" type="number"/>
                                        </div>
                                        <div className="relative">
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">Weave Type</label>
                                            <div 
                                                className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0 cursor-pointer flex items-center justify-between"
                                                onClick={() => setIsWeaveDropdownOpen(!isWeaveDropdownOpen)}
                                            >
                                                <span>{formData.weaveType || 'Select a weave type'}</span>
                                                <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                            
                                            {isWeaveDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setIsWeaveDropdownOpen(false)}></div>
                                                    <div className="absolute z-20 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                        {['Pure Tussar Silk Weave', 'Ghicha Silk Weave', 'Matka Silk Weave', 'Dupion Silk Weave', 'Cotton-Silk Bhagalpuri Weave', 'Zari Bhagalpuri Weave'].map((weave) => (
                                                            <div 
                                                                key={weave}
                                                                className="px-4 py-3 hover:bg-surface-variant cursor-pointer transition-colors font-body-md text-on-surface flex items-center justify-between"
                                                                onClick={() => {
                                                                    const newPrefix = SKU_PREFIX[weave] || 'SKU';
                                                                    // Preserve user-typed suffix if any, otherwise generate a new random one
                                                                    const currentSuffix = formData.sku.includes('-')
                                                                        ? formData.sku.split('-').slice(1).join('-')
                                                                        : Math.random().toString(36).substr(2, 6).toUpperCase();
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        weaveType: weave,
                                                                        sku: `${newPrefix}-${currentSuffix}`
                                                                    }));
                                                                    setIsWeaveDropdownOpen(false);
                                                                }}
                                                            >
                                                                <span>{weave}</span>
                                                                <span className="font-label-caps text-label-caps text-secondary/70 text-xs tracking-widest">{SKU_PREFIX[weave]}-</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">Weight (grams)</label>
                                            <input name="weight" value={formData.weight} onChange={handleChange} min="0" className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="e.g. 650" type="number"/>
                                        </div>
                                        <div>
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">GST Percent</label>
                                            <input name="gstPercent" value={formData.gstPercent} onChange={handleChange} min="0" max="28" className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="e.g. 5" type="number"/>
                                        </div>
                                        <div className="relative">
                                            <label className="block font-label-caps text-label-caps text-primary mb-1">Status</label>
                                            <div 
                                                className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0 cursor-pointer flex items-center justify-between"
                                                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                            >
                                                <span>{formData.status}</span>
                                                <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                            
                                            {isStatusDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)}></div>
                                                    <div className="absolute z-20 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                        {['Active', 'Draft', 'Out of Stock'].map((status) => (
                                                            <div 
                                                                key={status}
                                                                className="px-4 py-3 hover:bg-surface-variant cursor-pointer transition-colors font-body-md text-on-surface"
                                                                onClick={() => {
                                                                    setFormData(prev => ({ ...prev, status }));
                                                                    setIsStatusDropdownOpen(false);
                                                                }}
                                                            >
                                                                {status}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/*  Media Upload  */}
                                <section className="ambient-shadow bg-surface-container-lowest p-6 md:p-10 ornamental-border">
                                    <h3 className="font-story-serif text-story-serif text-tertiary mb-6 border-b border-outline-variant/30 pb-2">II. Visuals</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        {images.map((img, index) => (
                                            <div key={index} className="flex flex-col md:flex-row md:items-center gap-4">
                                                <div className="flex-1">
                                                    <label className="block font-label-caps text-label-caps text-primary mb-1">{img.label}</label>
                                                    <input 
                                                        required={!img.url}
                                                        className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0 cursor-pointer file:cursor-pointer file:border-0 file:bg-primary-container file:text-on-primary-container file:font-label-caps file:text-xs file:py-2 file:px-4 file:mr-4 hover:file:bg-primary hover:file:text-on-primary file:transition-colors" 
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload(index, e)}
                                                    />
                                                </div>
                                                <div className="w-24 h-24 border border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden shrink-0">
                                                    {img.isUploading ? (
                                                        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                                                    ) : img.url ? (
                                                        <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-outline-variant">image</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/*  Product Details  */}
                                <section className="ambient-shadow bg-surface-container-lowest p-6 md:p-10 ornamental-border">
                                    <h3 className="font-story-serif text-story-serif text-tertiary mb-6 border-b border-outline-variant/30 pb-2">III. The Craft</h3>
                                    <div className="space-y-8">
                                        <div>
                                            <label className="block font-label-caps text-label-caps text-primary mb-2">Artisanal Story (Description) *</label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border border-outline-variant bg-transparent p-4 font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary resize-none" placeholder="Describe the weave, the inspiration, and the legacy..." rows={4}></textarea>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block font-label-caps text-label-caps text-primary mb-1">Care Instructions</label>
                                                <input name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0" placeholder="e.g. Dry Clean Only" type="text"/>
                                            </div>
                                            <div className="relative">
                                                <label className="block font-label-caps text-label-caps text-primary mb-1">Badge (Overlay)</label>
                                                <div 
                                                    className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0 cursor-pointer flex items-center justify-between"
                                                    onClick={() => setIsBadgeDropdownOpen(!isBadgeDropdownOpen)}
                                                >
                                                    <span>{formData.badge}</span>
                                                    <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>
                                                
                                                {isBadgeDropdownOpen && (
                                                    <>
                                                        <div 
                                                            className="fixed inset-0 z-10" 
                                                            onClick={() => setIsBadgeDropdownOpen(false)}
                                                        ></div>
                                                        <div className="absolute z-20 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                            {['Normal', 'Authentic Collection', 'New Arrival', 'Best Seller'].map((badgeType) => (
                                                                <div 
                                                                    key={badgeType}
                                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-surface-variant cursor-pointer transition-colors"
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, badge: badgeType }));
                                                                        setIsBadgeDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <span className="font-body-md text-on-surface">{badgeType}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <label className="block font-label-caps text-label-caps text-primary mb-1">Primary Color *</label>
                                                <div 
                                                    className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0 cursor-pointer flex items-center justify-between"
                                                    onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                                                >
                                                    {formData.primaryColor ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full border border-outline-variant/30 ${COLOR_PALETTE.find(c => c.name === formData.primaryColor)?.bg || 'bg-transparent'}`}></div>
                                                            <span>{formData.primaryColor}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-on-surface-variant">Select a color</span>
                                                    )}
                                                    <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>
                                                
                                                {isColorDropdownOpen && (
                                                    <>
                                                        <div 
                                                            className="fixed inset-0 z-10" 
                                                            onClick={() => setIsColorDropdownOpen(false)}
                                                        ></div>
                                                        <div className="absolute z-20 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                            {COLOR_PALETTE.map((color) => (
                                                                <div 
                                                                    key={color.name}
                                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-surface-variant cursor-pointer transition-colors"
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, primaryColor: color.name }));
                                                                        setIsColorDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <div className={`w-5 h-5 rounded-full border border-outline-variant/30 ${color.bg}`}></div>
                                                                    <span className="font-body-md text-on-surface">{color.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <label className="block font-label-caps text-label-caps text-primary mb-1">Occasion *</label>
                                                <div 
                                                    className="w-full custom-input font-body-lg text-body-lg text-on-surface focus:ring-0 cursor-pointer flex items-center justify-between"
                                                    onClick={() => setIsOccasionDropdownOpen(!isOccasionDropdownOpen)}
                                                >
                                                    <span>{formData.occasion || 'Select an occasion'}</span>
                                                    <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>
                                                
                                                {isOccasionDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setIsOccasionDropdownOpen(false)}></div>
                                                        <div className="absolute z-20 w-full mt-1 bg-surface border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                            {['Wedding', 'Festive', 'Casual'].map((occ) => (
                                                                <div 
                                                                    key={occ}
                                                                    className="px-4 py-3 hover:bg-surface-variant cursor-pointer transition-colors font-body-md text-on-surface"
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, occasion: occ }));
                                                                        setIsOccasionDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    {occ}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/*  Sticky Action Bar  */}
                                <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface-container-lowest border-t border-outline-variant/50 p-4 md:px-margin-desktop shadow-[0_-4px_20px_rgba(128,0,32,0.05)] z-40 flex justify-end gap-4 items-center">
                                    <button disabled={isLoading} type="submit" className="font-label-caps text-label-caps text-secondary-fixed bg-[#8B0000] px-8 py-3 hover:bg-tertiary transition-colors shadow-sm disabled:opacity-50">
                                        {isLoading ? (id ? 'SAVING...' : 'PUBLISHING...') : (id ? 'SAVE CHANGES' : 'PUBLISH MASTERPIECE')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSareeCreation;
