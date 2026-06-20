import React, { useState, useEffect, useRef, useMemo, useTransition } from 'react';
import { 
  QRCodeCanvas, 
  QRCodeSVG 
} from 'qrcode.react';
import { 
  Globe, 
  MessageCircle, 
  Instagram, 
  CreditCard, 
  MapPin, 
  Download, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  RefreshCw, 
  AlertTriangle, 
  Printer, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  Palette,
  Heart,
  Layout,
  Upload,
  Type,
  Image as ImageIcon
} from 'lucide-react';

// Color Presets for QR Code
const COLOR_PRESETS = [
  { name: 'Pure Ink', fg: '#000000', bg: '#ffffff' },
  { name: 'Dark Inverted', fg: '#ffffff', bg: '#000000' },
  { name: 'Carbon & Alabaster', fg: '#171717', bg: '#fafafa' },
  { name: 'Slate Charcoal', fg: '#0f172a', bg: '#f8fafc' },
  { name: 'Zinc Matte', fg: '#27272a', bg: '#f4f4f5' },
  { name: 'Asphalt Ink', fg: '#0a0a0a', bg: '#e5e5e5' },
  { name: 'Obsidian Light', fg: '#09090b', bg: '#ffffff' },
];

// Grayscale/Monochrome Preset Frame Gradients
const FRAME_GRADIENT_PRESETS = [
  { name: 'Clean White', solid: true, color1: '#ffffff', border: '#000000', text: '#000000' },
  { name: 'Pure Charcoal', solid: true, color1: '#171717', border: '#ffffff', text: '#ffffff' },
  { name: 'High Contrast', solid: true, color1: '#000000', border: '#ffffff', text: '#ffffff' },
  { name: 'Silver Matte', solid: true, color1: '#f5f5f5', border: '#171717', text: '#171717' },
  { name: 'Carbon Gradient', solid: false, color1: '#262626', color2: '#0a0a0a', border: '#ffffff', text: '#ffffff' },
  { name: 'Steel Gradient', solid: false, color1: '#fafafa', color2: '#e5e5e5', border: '#171717', text: '#171717' },
  { name: 'Midnight Glow', solid: false, color1: '#1e293b', color2: '#0f172a', border: '#e2e8f0', text: '#f8fafc' },
];

// Base64 SVG Icons for Center Logos to ensure absolute compatibility
const LOGO_PRESETS = {
  shop: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiAyTDMgNnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWNmwtMy00SDR6Ii8+PGxpbmUgeDE9IjMiIHkxPSI2IiB4Mj0iMjEiIHkyPSI2Ii8+PHBhdGggZD0iTTE2IDEwYTQgNCAwIDAgMS04IDAiLz48L3N2Zz4=",
  whatsapp: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTEuNWE4LjM4IDguMzggMCAwIDEtLjkgMy44IDguNSA4LjUgMCAwIDEtNy42IDQuNyA4LjM4IDguMzggMCAwIDEtMy44LS45TDMgMjFsMS45LTUuN2E4LjM4IDguMzggMCAwIDEtLjktMy44IDguNSA4LjUgMCAwIDEgNC43LTcuNiA4LjM4IDguMzggMCAwIDEgMy44LS45aC41YTguNDggOC40OCAwIDAgMSA4IDh2LjV6Ii8+PC9zdmc+",
  instagram: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSI1IiByeT0iNSIvPjxwYXRoIGQ9Ik0xNiAxMS4zN0E0IDQgMCAxIDEgMTIuNjMgOCA0IDQgMCAwIDEgMTYgMTEuMzd6Ii8+PGxpbmUgeDE9IjE3LjUiIHkxPSI2LjUiIHgyPSIxNy41MSIgeTI9IjYuNSIvPjwvc3ZnPg==",
  upi: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSI1IiB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHJ4PSIyIiByeT0iMiIvPjxsaW5lIHgxPSIyIiB5MT0iMTAiIHgyPSIyMiIgeTI9IjEwIi8+PC9zdmc+",
  maps: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTBhOSA5IDAgMCAxIDE4IDB6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIvPjwvc3ZnPg=="
};

function App() {
  // Page view state ('generator', 'privacy', 'terms')
  const [currentView, setCurrentView] = useState('generator');

  // Theme state (system default or stored)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
    } catch (e) {
      console.warn('localStorage is not accessible:', e);
    }
    try {
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (e) {
      console.warn('matchMedia is not accessible:', e);
    }
    return false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {
        console.warn('localStorage is not writable:', e);
      }
    } else {
      document.body.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {
        console.warn('localStorage is not writable:', e);
      }
    }
  }, [darkMode]);

  // Form active tab state
  const [activeTab, setActiveTab] = useState('website');

  // Input states
  const [webUrl, setWebUrl] = useState('');
  
  // WhatsApp states
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');

  // Instagram states
  const [instaUser, setInstaUser] = useState('');

  // UPI Payment states
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [upiNote, setUpiNote] = useState('');

  // Google Maps states
  const [mapsType, setMapsType] = useState('search'); // 'search' or 'coords'
  const [mapsQuery, setMapsQuery] = useState('');
  const [mapsLat, setMapsLat] = useState('');
  const [mapsLng, setMapsLng] = useState('');

  // Customizer states (Default Pure Ink theme)
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(500); // 500 or 2000
  const [includeMargin, setIncludeMargin] = useState(true);
  const [ecc, setEcc] = useState('Q'); // L, M, Q, H error correction

  // Premium Flyer / Frame Designer States
  const [frameEnabled, setFrameEnabled] = useState(false);
  const [frameStyle, setFrameStyle] = useState('badge'); // 'badge' (vertical card), 'card' (horizontal business card), 'minimal' (just border)
  const [frameShape, setFrameShape] = useState('rounded'); // 'square', 'rounded', 'circle'
  const [frameSolid, setFrameSolid] = useState(true);
  const [frameColor1, setFrameColor1] = useState('#ffffff');
  const [frameColor2, setFrameColor2] = useState('#e5e5e5');
  const [frameBorderColor, setFrameBorderColor] = useState('#000000');
  const [frameTextColor, setFrameTextColor] = useState('#000000');
  
  // Text layers
  const [businessName, setBusinessName] = useState('');
  const [scanText, setScanText] = useState('SCAN ME');

  // Center logo states
  const [logoMode, setLogoMode] = useState('auto'); // 'none', 'auto', 'custom'
  const [logoSrc, setLogoSrc] = useState('');
  const [logoSize, setLogoSize] = useState(18); // percentage size inside QR, e.g. 15%-25%
  const [sliderSize, setSliderSize] = useState(18); // immediate state for the slider track
  const [isPending, startTransition] = useTransition();

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setSliderSize(val);
    startTransition(() => {
      setLogoSize(val);
    });
  };

  // Interaction feedback states
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Refs for download & print
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // Asynchronous high-res rendering triggers to prevent mobile drag lag
  const [downloadTrigger, setDownloadTrigger] = useState(null); // 'png' or 'svg'
  const downloadCanvasRef = useRef(null);
  const downloadSvgRef = useRef(null);

  // Effect to handle deferred 2000px high-res downloads
  useEffect(() => {
    if (downloadTrigger) {
      const timer = setTimeout(() => {
        try {
          if (downloadTrigger === 'png') {
            if (frameEnabled) {
              downloadFramePNG(downloadCanvasRef.current);
            } else {
              downloadPlainPNG(downloadCanvasRef.current);
            }
          } else if (downloadTrigger === 'svg') {
            if (frameEnabled) {
              downloadFrameSVG(downloadSvgRef.current);
            } else {
              downloadPlainSVG(downloadSvgRef.current);
            }
          }
        } catch (err) {
          console.error(err);
          setValidationError('Error rendering high-res QR for download.');
        } finally {
          setDownloadTrigger(null);
        }
      }, 150); // Small delay to let React commit and mount the hidden 2000px canvas
      return () => clearTimeout(timer);
    }
  }, [downloadTrigger, frameEnabled]);

  // Parse Hex to RGB helper
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Relative Luminance helper (WCAG Formula)
  const getLuminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  // Color Contrast Ratio calculation
  const contrastRatio = useMemo(() => {
    const rgb1 = hexToRgb(fgColor);
    const rgb2 = hexToRgb(bgColor);
    if (!rgb1 || !rgb2) return 21; // Perfect default
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return parseFloat(ratio.toFixed(2));
  }, [fgColor, bgColor]);

  // Construct target link based on active template
  const qrValue = useMemo(() => {
    switch (activeTab) {
      case 'website': {
        const cleanUrl = webUrl.trim();
        if (!cleanUrl) return 'https://qrforbusiness.app'; // Default placeholder
        if (/^https?:\/\//i.test(cleanUrl)) {
          return cleanUrl;
        }
        return `https://${cleanUrl}`;
      }
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        if (!cleanPhone) return 'https://wa.me/'; // Default placeholder
        const textParam = waMessage.trim() ? `?text=${encodeURIComponent(waMessage.trim())}` : '';
        return `https://wa.me/${cleanPhone}${textParam}`;
      }
      case 'instagram': {
        const cleanUser = instaUser.trim().replace(/^@/, '');
        if (!cleanUser) return 'https://instagram.com'; // Default placeholder
        return `https://instagram.com/${cleanUser}`;
      }
      case 'upi': {
        if (!upiId.trim()) return 'upi://pay?pa='; // Default placeholder
        let upiLink = `upi://pay?pa=${encodeURIComponent(upiId.trim())}`;
        if (upiName.trim()) {
          upiLink += `&pn=${encodeURIComponent(upiName.trim())}`;
        }
        if (upiAmount && parseFloat(upiAmount) > 0) {
          upiLink += `&am=${encodeURIComponent(parseFloat(upiAmount).toString())}`;
        }
        if (upiNote.trim()) {
          upiLink += `&tn=${encodeURIComponent(upiNote.trim())}`;
        }
        upiLink += `&cu=INR`;
        return upiLink;
      }
      case 'maps': {
        if (mapsType === 'search') {
          if (!mapsQuery.trim()) return 'https://www.google.com/maps'; // Default placeholder
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery.trim())}`;
        } else {
          if (!mapsLat.trim() || !mapsLng.trim()) return 'https://www.google.com/maps'; // Default placeholder
          return `https://www.google.com/maps/search/?api=1&query=${mapsLat.trim()},${mapsLng.trim()}`;
        }
      }
      default:
        return 'https://qrforbusiness.app';
    }
  }, [activeTab, webUrl, waPhone, waMessage, instaUser, upiId, upiName, upiAmount, upiNote, mapsType, mapsQuery, mapsLat, mapsLng]);

  // Resolve center logo source dynamically
  const resolvedLogoSrc = useMemo(() => {
    if (logoMode === 'none') return '';
    if (logoMode === 'custom') return logoSrc;
    
    // Auto preset selection based on active tab
    if (activeTab === 'website') return LOGO_PRESETS.shop;
    if (activeTab === 'whatsapp') return LOGO_PRESETS.whatsapp;
    if (activeTab === 'instagram') return LOGO_PRESETS.instagram;
    if (activeTab === 'upi') return LOGO_PRESETS.upi;
    if (activeTab === 'maps') return LOGO_PRESETS.maps;
    return '';
  }, [logoMode, activeTab, logoSrc]);

  // Center logo settings object resolved for 500px preview canvas
  const previewImageSettings = useMemo(() => {
    const src = resolvedLogoSrc;
    if (!src) return undefined;
    const finalSize = Math.floor(500 * (logoSize / 100));
    return {
      src,
      height: finalSize,
      width: finalSize,
      excavate: true,
    };
  }, [resolvedLogoSrc, logoSize]);

  // Center logo settings object resolved for 2000px download canvas
  const downloadImageSettings = useMemo(() => {
    const src = resolvedLogoSrc;
    if (!src) return undefined;
    const finalSize = Math.floor(2000 * (logoSize / 100));
    return {
      src,
      height: finalSize,
      width: finalSize,
      excavate: true,
    };
  }, [resolvedLogoSrc, logoSize]);

  // Form validator before download or custom actions
  const validateForm = () => {
    setValidationError('');
    if (activeTab === 'website' && webUrl.trim() === '') {
      setValidationError('Please enter a website URL.');
      return false;
    }
    if (activeTab === 'whatsapp' && waPhone.trim() === '') {
      setValidationError('Please enter a phone number with country code.');
      return false;
    }
    if (activeTab === 'instagram' && instaUser.trim() === '') {
      setValidationError('Please enter your Instagram username.');
      return false;
    }
    if (activeTab === 'upi') {
      if (upiId.trim() === '') {
        setValidationError('Please enter a UPI ID (VPA).');
        return false;
      }
      if (!upiId.includes('@')) {
        setValidationError('A valid UPI ID must contain "@" (e.g. store@upi).');
        return false;
      }
    }
    if (activeTab === 'maps') {
      if (mapsType === 'search' && mapsQuery.trim() === '') {
        setValidationError('Please enter a shop address or place name.');
        return false;
      }
      if (mapsType === 'coords' && (mapsLat.trim() === '' || mapsLng.trim() === '')) {
        setValidationError('Please enter both Latitude and Longitude coordinates.');
        return false;
      }
    }
    if (contrastRatio < 3.0) {
      setValidationError('Contrast is too low! Please select a darker foreground color or lighter background color first.');
      return false;
    }
    return true;
  };

  // Triggers HMR update
  const handleGenerateClick = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 450);
  };

  // Handle local center logo upload with validation
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationError('Invalid file type. Please upload a valid image (PNG or JPG).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setValidationError('File size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoSrc(event.target.result);
        setLogoMode('custom');
        setValidationError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearCustomLogo = () => {
    setLogoSrc('');
    setLogoMode('none');
  };

  // Download plain QR code PNG
  const downloadPlainPNG = (customCanvas) => {
    const canvas = customCanvas || canvasRef.current;
    if (!canvas) return;
    try {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-for-business-${activeTab}-${qrSize}px.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (e) {
      console.error(e);
      setValidationError('Error exporting PNG.');
    }
  };

  // Download entire flyer card as PNG
  const downloadFramePNG = (customCanvas) => {
    const qrCanvas = customCanvas || canvasRef.current;
    if (!qrCanvas) return;

    // Use higher resolution canvas for output print quality (e.g. 1500x2000 px)
    const isCircle = frameShape === 'circle';
    const isCard = frameStyle === 'card';
    
    // Choose size multiplier based on digital vs print quality
    const baseW = isCard ? 800 : 600;
    const baseH = isCard ? 600 : (isCircle ? 600 : 800);
    const scale = qrSize === 2000 ? 3 : 1;
    
    const W = baseW * scale;
    const H = baseH * scale;

    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = W;
    frameCanvas.height = H;
    const ctx = frameCanvas.getContext('2d');

    // 1. Draw Card Background
    ctx.save();
    if (isCircle) {
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, Math.min(W, H) / 2 - 10, 0, Math.PI * 2);
      ctx.clip();
    }
    
    if (frameSolid) {
      ctx.fillStyle = frameColor1;
      ctx.fillRect(0, 0, W, H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, frameColor1);
      grad.addColorStop(1, frameColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // 2. Draw Outer Border Stroke
    ctx.save();
    ctx.strokeStyle = frameBorderColor;
    ctx.lineWidth = 10 * scale;
    if (isCircle) {
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, Math.min(W, H) / 2 - (5 * scale), 0, Math.PI * 2);
      ctx.stroke();
    } else if (frameShape === 'rounded') {
      const radius = 24 * scale;
      ctx.beginPath();
      ctx.roundRect(5 * scale, 5 * scale, W - (10 * scale), H - (10 * scale), radius);
      ctx.stroke();
    } else {
      ctx.strokeRect(5 * scale, 5 * scale, W - (10 * scale), H - (10 * scale));
    }
    ctx.restore();

    // 3. Draw QR Container White Backdrop (so QR is always readable)
    ctx.save();
    const qrBoxSize = (isCard ? 200 : 320) * scale;
    const qrX = (W - qrBoxSize) / 2;
    const qrY = isCard ? (H - qrBoxSize) / 2 : (H * 0.28);
    
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.06)';
    ctx.shadowBlur = 10 * scale;
    
    // Draw rounded container for QR
    const rRadius = 12 * scale;
    ctx.beginPath();
    ctx.roundRect(qrX - (16 * scale), qrY - (16 * scale), qrBoxSize + (32 * scale), qrBoxSize + (32 * scale), rRadius);
    ctx.fill();
    ctx.restore();

    // 4. Draw QR Code pixels on top
    ctx.save();
    ctx.drawImage(qrCanvas, qrX, qrY, qrBoxSize, qrBoxSize);
    ctx.restore();

    // 5. Draw Business Name Text (Top)
    if (!isCard) {
      ctx.save();
      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.font = `bold ${Math.floor(26 * scale)}px Outfit, sans-serif`;
      // Position adapts for circular badge
      const topY = isCircle ? (H * 0.22) : (H * 0.18);
      ctx.fillText((businessName || 'YOUR BUSINESS').toUpperCase(), W / 2, topY);
      ctx.restore();
    } else {
      // Horizontal card layout puts text on left/right or top
      ctx.save();
      ctx.fillStyle = frameTextColor;
      ctx.textAlign = 'center';
      ctx.font = `bold ${Math.floor(24 * scale)}px Outfit, sans-serif`;
      ctx.fillText((businessName || 'YOUR BUSINESS').toUpperCase(), W / 2, H * 0.16);
      ctx.restore();
    }

    // 6. Draw Call to Action (Bottom Text)
    ctx.save();
    ctx.fillStyle = frameTextColor;
    ctx.textAlign = 'center';
    ctx.font = `bold ${Math.floor(isCard ? 18 : 22) * scale}px Outfit, sans-serif`;
    const bottomY = isCard ? (H * 0.88) : (isCircle ? (H * 0.82) : (H * 0.86));
    ctx.fillText((scanText || 'SCAN ME').toUpperCase(), W / 2, bottomY);
    ctx.restore();

    // 7. Download
    try {
      const dataUrl = frameCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `qr-for-business-flyer-${activeTab}-${qrSize}px.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (e) {
      console.error(e);
      setValidationError('Error rendering flyer canvas.');
    }
  };

  // Trigger correct download depending on layout mode
  const handleDownloadPNG = () => {
    if (!validateForm()) return;
    if (qrSize === 2000) {
      setDownloadTrigger('png');
    } else {
      if (frameEnabled) {
        downloadFramePNG();
      } else {
        downloadPlainPNG();
      }
    }
  };

  // Dynamic SVG Serializer for frame flyer templates
  const downloadFrameSVG = (customSvg) => {
    const qrSvgElement = customSvg || svgRef.current;
    if (!qrSvgElement) return;

    // Standard high fidelity template size
    const isCard = frameStyle === 'card';
    const isCircle = frameShape === 'circle';
    const W = isCard ? 800 : 600;
    const H = isCard ? 600 : (isCircle ? 600 : 800);

    const qrInnerSvg = qrSvgElement.innerHTML;

    let rx = 0;
    if (frameShape === 'rounded') rx = 24;

    const qrSizeSVG = isCard ? 200 : 320;
    const qrX = (W - qrSizeSVG) / 2;
    const qrY = isCard ? (H - qrSizeSVG) / 2 : (H * 0.28);

    const escapeHtml = (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Embed dynamic inline elements
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&amp;display=swap');
            .text-title {
              font-family: 'Outfit', sans-serif;
              font-weight: 800;
              font-size: 26px;
              text-anchor: middle;
            }
            .text-subtitle {
              font-family: 'Outfit', sans-serif;
              font-weight: 600;
              font-size: 22px;
              text-anchor: middle;
            }
          </style>
          <linearGradient id="frame-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${frameColor1}" />
            <stop offset="100%" stop-color="${frameSolid ? frameColor1 : frameColor2}" />
          </linearGradient>
        </defs>
        
        <!-- Backdrop flyer -->
        ${isCircle 
          ? `<circle cx="${W/2}" cy="${H/2}" r="${W/2 - 10}" fill="url(#frame-grad)" stroke="${frameBorderColor}" stroke-width="10" />`
          : `<rect width="${W}" height="${H}" rx="${rx}" fill="url(#frame-grad)" stroke="${frameBorderColor}" stroke-width="10" />`
        }

        <!-- White QR Backdrop -->
        <rect x="${qrX - 16}" y="${qrY - 16}" width="${qrSizeSVG + 32}" height="${qrSizeSVG + 32}" rx="12" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />

        <!-- Centered QR SVG Group scaled -->
        <g transform="translate(${qrX}, ${qrY})">
          <g transform="scale(${qrSizeSVG / 500})">
            ${qrInnerSvg}
          </g>
        </g>

        <!-- Business Name Header -->
        <text x="${W/2}" y="${isCard ? H*0.16 : (isCircle ? H*0.22 : H*0.18)}" class="text-title" fill="${frameTextColor}">
          ${escapeHtml((businessName || 'YOUR BUSINESS').toUpperCase())}
        </text>

        <!-- Call to Action bottom -->
        <text x="${W/2}" y="${isCard ? H*0.88 : (isCircle ? H*0.82 : H*0.86)}" class="text-subtitle" fill="${frameTextColor}">
          ${escapeHtml((scanText || 'SCAN ME').toUpperCase())}
        </text>
      </svg>
    `;

    try {
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `qr-for-business-flyer-${activeTab}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } catch (e) {
      console.error(e);
      setValidationError('Error rendering flyer SVG.');
    }
  };

  // Download plain QR SVG
  const downloadPlainSVG = (customSvg) => {
    const svgElement = customSvg || svgRef.current;
    if (!svgElement) return;
    try {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);
      if (!svgString.includes('http://www.w3.org/2000/svg')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `qr-for-business-${activeTab}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } catch (e) {
      console.error(e);
      setValidationError('Error exporting SVG.');
    }
  };

  const handleDownloadSVG = () => {
    if (!validateForm()) return;
    if (qrSize === 2000) {
      setDownloadTrigger('svg');
    } else {
      if (frameEnabled) {
        downloadFrameSVG();
      } else {
        downloadPlainSVG();
      }
    }
  };

  // Copy Link text to Clipboard
  const copyQRLinkText = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setValidationError('Could not write to clipboard.');
    }
  };

  // Print QR Code
  const printQRCode = () => {
    if (!validateForm()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setValidationError('Popup blocked! Please allow popups to open the print dialog.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR for Business Print Template</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: 'Outfit', sans-serif;
              color: #000000;
              background-color: #ffffff;
            }
            .container {
              border: 3px solid #000000;
              padding: 40px;
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              max-width: 450px;
              text-align: center;
            }
            img {
              width: 320px;
              height: 320px;
              object-fit: contain;
              margin-bottom: 24px;
            }
            h1 {
              font-size: 28px;
              margin: 0 0 8px 0;
              font-weight: 800;
              letter-spacing: -0.025em;
              text-transform: uppercase;
            }
            p {
              font-size: 16px;
              margin: 0 0 32px 0;
              color: #262626;
              font-weight: 400;
            }
            .footer {
              font-size: 12px;
              color: #737373;
              margin-top: 10px;
              font-weight: 500;
            }
            @media print {
              .container {
                border: none;
                padding: 0;
              }
              .btn-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${dataUrl}" alt="QR Code" />
            <h1>Scan to connect</h1>
            <p>Scan this QR code with your phone camera to visit our links or make a secure payment.</p>
            <div class="footer">Generated free by QR for Business (qrforbusiness.app)</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Reset form values for active tab
  const handleReset = () => {
    setValidationError('');
    switch (activeTab) {
      case 'website': setWebUrl(''); break;
      case 'whatsapp': setWaPhone(''); setWaMessage(''); break;
      case 'instagram': setInstaUser(''); break;
      case 'upi': setUpiId(''); setUpiName(''); setUpiAmount(''); setUpiNote(''); break;
      case 'maps': setMapsQuery(''); setMapsLat(''); setMapsLng(''); break;
    }
  };

  // Contrast Status Formatting (Neutral monochrome styling)
  const getContrastStatus = () => {
    if (contrastRatio >= 4.5) {
      return { 
        text: 'Excellent Contrast (WCAG AAA)', 
        color: 'text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800' 
      };
    }
    if (contrastRatio >= 3.0) {
      return { 
        text: 'Good Contrast (WCAG AA)', 
        color: 'text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800' 
      };
    }
    return { 
      text: 'Low Contrast Warning', 
      color: 'text-rose-600 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/20 border-neutral-200 dark:border-rose-900/50 border animate-pulse' 
    };
  };

  const contrastStatus = getContrastStatus();

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col justify-between">
      
      {/* Subtle Monochrome background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neutral-200/40 dark:bg-neutral-800/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neutral-200/40 dark:bg-neutral-800/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-900 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="QR for Business Logo" 
              className="w-10 h-10 rounded-xl object-cover border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm"
            />
            <div>
              <span className="text-xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-1">
                QR <span className="font-light">for Business</span>
              </span>
              <p className="text-[10px] text-neutral-400 font-bold tracking-wide uppercase hidden sm:block">Monochrome Custom Utility</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-105 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 py-1 px-3 rounded-full">
              <span className="w-1.5 h-1.5 bg-neutral-500 dark:bg-neutral-400 rounded-full"></span>
              <span>No Registration Required</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 pt-5 pb-8 sm:py-8 lg:py-12 flex-grow">
        {currentView === 'generator' && (
          <>
            {/* Hero Tagline */}
        <div className="text-center mb-5 sm:mb-8 mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-tight">
            Create Custom <span className="gradient-text font-black">QR Flyers</span>
          </h1>
        </div>

        {/* Dynamic Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* Form and Controls Card (Col Span 7) — order-2 pushes it below preview on mobile */}
          <div className="lg:col-span-7 order-2 lg:order-1 glass-panel rounded-3xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-8 relative overflow-hidden transition-all duration-300">
            
            {/* Step 1: Choose Template */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-neutral-550" />
                Step 1: Choose Template
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 w-full bg-neutral-100/70 dark:bg-neutral-950/65 p-1.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-900/50">
                <button
                  type="button"
                  onClick={() => { setActiveTab('website'); setValidationError(''); }}
                  className={`flex flex-row items-center justify-center gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                    activeTab === 'website'
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('whatsapp'); setValidationError(''); }}
                  className={`flex flex-row items-center justify-center gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                    activeTab === 'whatsapp'
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('instagram'); setValidationError(''); }}
                  className={`flex flex-row items-center justify-center gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                    activeTab === 'instagram'
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('upi'); setValidationError(''); }}
                  className={`flex flex-row items-center justify-center gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                    activeTab === 'upi'
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>UPI Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('maps'); setValidationError(''); }}
                  className={`flex flex-row items-center justify-center gap-1.5 py-2.5 px-1 sm:px-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                    activeTab === 'maps'
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Maps</span>
                </button>
              </div>
            </div>

            {/* Step 2: Dynamic Form Fields */}
            <form onSubmit={handleGenerateClick} className="space-y-5">
              
              {/* Form header descriptions */}
              <div className="pb-2 border-b border-neutral-200/60 dark:border-neutral-800/40">
                {activeTab === 'website' && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Link / URL</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Direct traffic to your shop homepage, menu page, or landing site.</p>
                  </div>
                )}
                {activeTab === 'whatsapp' && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">WhatsApp Direct Message</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-450">Enables customers to scan, open a chat room, and send a pre-filled query directly.</p>
                  </div>
                )}
                {activeTab === 'instagram' && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Instagram Handle</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-455">Grow social following. Redirects scanner directly to your profile page.</p>
                  </div>
                )}
                {activeTab === 'upi' && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">UPI Instant Payment</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-455">Generate scan-to-pay codes compatible with all standard UPI apps.</p>
                  </div>
                )}
                {activeTab === 'maps' && (
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Google Maps Finder</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-455">Direct customers to your physical shop, storefront, or business branch.</p>
                  </div>
                )}
              </div>

              {/* Dynamic field rendering */}
              <div className="space-y-4">
                
                {/* WEBSITE INPUT */}
                {activeTab === 'website' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Website URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-450">
                        <Globe className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        value={webUrl}
                        onChange={(e) => setWebUrl(e.target.value)}
                        placeholder="www.yourbakery.com/menu"
                        className="glass-input pl-11 pr-4 py-3 rounded-2xl w-full text-sm placeholder-neutral-400 dark:placeholder-neutral-600"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500">Supports regular websites, online PDFs, catalog links, or Google Forms.</span>
                  </div>
                )}

                {/* WHATSAPP INPUTS */}
                {activeTab === 'whatsapp' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Phone Number (with Country Code)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-450">
                          <span className="text-sm font-extrabold">+</span>
                        </div>
                        <input 
                          type="tel" 
                          value={waPhone}
                          onChange={(e) => setWaPhone(e.target.value)}
                          placeholder="919876543210 (Code + Number, no space/hyphen)"
                          className="glass-input pl-8 pr-4 py-3 rounded-2xl w-full text-sm"
                        />
                      </div>
                      <span className="text-[11px] text-neutral-450 dark:text-neutral-500">Example: Use 91 for India, 1 for USA/Canada, 44 for UK, followed by phone.</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Preset Chat Message (Optional)</label>
                      <textarea 
                        rows="3"
                        value={waMessage}
                        onChange={(e) => setWaMessage(e.target.value)}
                        placeholder="Hello! I would like to book a table / inquire about your services."
                        className="glass-input p-4 rounded-2xl w-full text-sm resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* INSTAGRAM INPUT */}
                {activeTab === 'instagram' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Instagram Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-455">
                        <span className="text-sm font-bold">@</span>
                      </div>
                      <input 
                        type="text" 
                        value={instaUser}
                        onChange={(e) => setInstaUser(e.target.value)}
                        placeholder="sweet_bites_bakery"
                        className="glass-input pl-9 pr-4 py-3 rounded-2xl w-full text-sm"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-450 dark:text-neutral-500">Do not include spacing. Handles are automatically resolved to instagram.com/username.</span>
                  </div>
                )}

                {/* UPI INPUTS */}
                {activeTab === 'upi' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">UPI ID (VPA)</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. shopname@okhdfcbank or payee@upi"
                        className="glass-input px-4 py-3 rounded-2xl w-full text-sm"
                      />
                      <span className="text-[11px] text-neutral-450 dark:text-neutral-500">Double check this string. Scanners make transfers directly to this address.</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Payee Name / Merchant Name</label>
                      <input 
                        type="text" 
                        value={upiName}
                        onChange={(e) => setUpiName(e.target.value)}
                        placeholder="e.g. John Doe Bakery"
                        className="glass-input px-4 py-3 rounded-2xl w-full text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Fixed Amount in ₹ (Optional)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(e.target.value)}
                        placeholder="e.g. 299 (leave blank for user input)"
                        className="glass-input px-4 py-3 rounded-2xl w-full text-sm"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Transaction Note (Optional)</label>
                      <input 
                        type="text" 
                        value={upiNote}
                        onChange={(e) => setUpiNote(e.target.value)}
                        placeholder="e.g. Table 5 Bill Payment"
                        className="glass-input px-4 py-3 rounded-2xl w-full text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* MAPS INPUTS */}
                {activeTab === 'maps' && (
                  <div className="space-y-4">
                    <div className="flex border-b border-neutral-250 dark:border-neutral-800 gap-4 text-xs font-bold pb-1">
                      <button 
                        type="button" 
                        onClick={() => setMapsType('search')}
                        className={`pb-2 border-b-2 transition-all ${mapsType === 'search' ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100' : 'border-transparent text-neutral-450'}`}
                      >
                        Address Search
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setMapsType('coords')}
                        className={`pb-2 border-b-2 transition-all ${mapsType === 'coords' ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100' : 'border-transparent text-neutral-450'}`}
                      >
                        GPS Coordinates
                      </button>
                    </div>

                    {mapsType === 'search' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Place Name / Exact Shop Address</label>
                        <input 
                          type="text" 
                          value={mapsQuery}
                          onChange={(e) => setMapsQuery(e.target.value)}
                          placeholder="e.g. Starbucks, Connaught Place, New Delhi"
                          className="glass-input px-4 py-3 rounded-2xl w-full text-sm"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Latitude</label>
                          <input 
                            type="text" 
                            value={mapsLat}
                            onChange={(e) => setMapsLat(e.target.value)}
                            placeholder="e.g. 28.6139"
                            className="glass-input px-4 py-3 rounded-2xl w-full text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Longitude</label>
                          <input 
                            type="text" 
                            value={mapsLng}
                            onChange={(e) => setMapsLng(e.target.value)}
                            placeholder="e.g. 77.2090"
                            className="glass-input px-4 py-3 rounded-2xl w-full text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Action buttons inside form */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={generating}
                  className="gradient-btn py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <RefreshCw className={`w-4 h-4 flex-shrink-0 ${generating ? 'animate-spin' : ''}`} />
                  <span className="truncate">{generating ? 'Generating...' : 'Generate QR'}</span>
                </button>
                <button 
                  type="button"
                  onClick={handleReset}
                  className="bg-neutral-200/60 hover:bg-neutral-200 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 py-3 px-4 rounded-2xl text-neutral-700 dark:text-neutral-300 font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98]"
                >
                  Reset Fields
                </button>
              </div>

              {validationError && (
                <div className="flex items-center gap-2 p-3 bg-neutral-100 dark:bg-neutral-900/50 text-rose-600 dark:text-rose-450 border border-neutral-200 dark:border-rose-900/50 rounded-xl text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </form>
            <hr className="border-neutral-200/60 dark:border-neutral-800/40" />

            {/* Export Settings Card */}
            <div className="bg-neutral-100/55 dark:bg-neutral-900/10 border border-neutral-200/60 dark:border-neutral-800/40 p-5 rounded-2xl space-y-4">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-350 flex items-center gap-1.5 uppercase tracking-wide">
                <Sliders className="w-4 h-4 text-neutral-500" /> Export & Printing Settings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Export Print Quality:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQrSize(500)}
                      className={`flex-1 py-2.5 px-2 border rounded-xl text-[11px] font-bold tracking-tight transition-all ${
                        qrSize === 500
                          ? 'border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-extrabold'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-650 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      Digital (500px)
                    </button>
                    <button
                      onClick={() => setQrSize(2000)}
                      className={`flex-1 py-2.5 px-2 border rounded-xl text-[11px] font-bold tracking-tight transition-all ${
                        qrSize === 2000
                          ? 'border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-extrabold'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-650 dark:text-neutral-405 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      Print (2000px)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Safety margins on QR:</span>
                  <button
                    onClick={() => setIncludeMargin(!includeMargin)}
                    className={`w-full py-2.5 px-4 border rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      includeMargin 
                        ? 'border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-extrabold' 
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-650 dark:text-neutral-450'
                    }`}
                  >
                    <span>QR Boundary Padding</span>
                    <span>{includeMargin ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                </div>
              </div>

              {/* Embedded Center Logo Section */}
              <div className="border-t border-neutral-200/60 dark:border-neutral-800/40 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-350 flex items-center gap-1.5 uppercase tracking-wide">
                    <ImageIcon className="w-4 h-4 text-neutral-500" /> Embedded QR Center Logo
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Scannability Safeguard</span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Logo Options:</span>
                  <div className="grid grid-cols-3 gap-2 bg-neutral-100/70 dark:bg-neutral-955/65 p-1 rounded-xl border border-neutral-200/30 dark:border-neutral-900/30">
                    <button
                      type="button"
                      onClick={() => setLogoMode('none')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        logoMode === 'none'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm font-extrabold'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-355'
                      }`}
                    >
                      No Logo
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('auto')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        logoMode === 'auto'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm font-extrabold'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-355'
                      }`}
                    >
                      Auto Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('custom')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        logoMode === 'custom'
                          ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-sm font-extrabold'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-355'
                      }`}
                    >
                      Custom Logo
                    </button>
                  </div>
                </div>

                {logoMode === 'custom' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Upload Logo (PNG/JPG, Max 2MB):</span>
                    {logoSrc ? (
                      <div className="flex items-center gap-3 bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <img 
                          src={logoSrc} 
                          alt="Uploaded logo" 
                          className="w-12 h-12 object-contain rounded-lg border border-neutral-250 dark:border-neutral-850 p-1 bg-white"
                        />
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">Custom logo loaded</p>
                          <p className="text-[10px] text-neutral-450">Ready for embedding</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearCustomLogo}
                          className="text-xs font-bold text-rose-600 dark:text-rose-450 hover:underline px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-xl p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-all">
                        <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                        <span className="text-xs font-bold text-neutral-650 dark:text-neutral-350">Choose logo image</span>
                        <span className="text-[9px] text-neutral-450 mt-0.5">PNG, JPG formats accepted</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}

                {logoMode !== 'none' && (logoMode !== 'custom' || logoSrc) && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-bold">Logo Scale Size:</span>
                      <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{sliderSize}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      value={sliderSize}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-950 dark:accent-white touch-none"
                    />
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block leading-tight">
                      * Kept within 10% - 25% safe range to ensure the QR code patterns remain readable by all standard mobile scanners.
                    </span>
                  </div>
                )}
              </div>
            </div>



          </div>

          {/* Sticky Preview Panel (Col Span 5) — order-1 floats it above form on mobile */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 space-y-4 sm:space-y-6">
            
            {/* Visual preview card */}
            <div className="glass-panel rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300">
              
              <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-neutral-800/40">
                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-450 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse"></span>
                  Live Preview Layout
                </span>
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 py-0.5 px-2.5 rounded-full border border-neutral-200/30 dark:border-neutral-800/30">
                  EC Level: {ecc}
                </span>
              </div>

              {/* Original simple QR preview box */}
              <div className="relative w-full max-w-[260px] sm:max-w-[280px] aspect-square rounded-2xl bg-white p-5 sm:p-6 shadow-md border border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                
                {(generating || downloadTrigger) && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-neutral-955/95 flex flex-col items-center justify-center space-y-3 z-10 transition-all">
                    <RefreshCw className="w-8 h-8 text-neutral-950 dark:text-white animate-spin" />
                    <span className="text-xs font-bold text-neutral-500">
                      {downloadTrigger ? 'Generating Print Quality...' : 'Updating Pattern...'}
                    </span>
                  </div>
                )}
                
                <QRCodeCanvas
                  ref={canvasRef}
                  value={qrValue}
                  size={500}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={ecc}
                  includeMargin={includeMargin}
                  imageSettings={previewImageSettings}
                  className="w-full h-full max-w-[240px] max-h-[240px] object-contain transition-all"
                  style={{ width: '100%', height: '100%', maxWidth: '240px', maxHeight: '240px' }}
                />

                <div style={{ display: 'none' }}>
                  <QRCodeSVG
                    ref={svgRef}
                    value={qrValue}
                    size={500}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={ecc}
                    includeMargin={includeMargin}
                    imageSettings={previewImageSettings}
                  />
                </div>

                {/* Asynchronous high-resolution canvases rendered only when download is processing to prevent mobile slider lag */}
                {downloadTrigger && (
                  <div style={{ display: 'none' }}>
                    <QRCodeCanvas
                      ref={downloadCanvasRef}
                      value={qrValue}
                      size={2000}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={ecc}
                      includeMargin={includeMargin}
                      imageSettings={downloadImageSettings}
                    />
                    <QRCodeSVG
                      ref={downloadSvgRef}
                      value={qrValue}
                      size={2000}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={ecc}
                      includeMargin={includeMargin}
                      imageSettings={downloadImageSettings}
                    />
                  </div>
                )}

              </div>

              {/* Live scanner advice helper */}
              <div className="space-y-1 w-full text-center">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center justify-center gap-1">
                  💡
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200 max-w-full truncate block text-[11px]" title={qrValue}>
                    {qrValue}
                  </span>
                </p>
                <p className="text-[10px] text-neutral-400">Scan the preview above to verify it works.</p>
              </div>

              <hr className="w-full border-neutral-200/50 dark:border-neutral-800/40" />

              {/* Action Buttons Panel */}
              <div className="w-full grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  className="gradient-btn py-3 px-2 sm:px-4 rounded-2xl font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-250 dark:border-neutral-800 py-3 px-2 sm:px-4 rounded-2xl text-neutral-850 dark:text-neutral-200 font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={copyQRLinkText}
                  className="bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-800 py-3 px-2 sm:px-4 rounded-2xl text-neutral-750 dark:text-neutral-350 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={printQRCode}
                  className="bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-800 py-3 px-2 sm:px-4 rounded-2xl text-neutral-750 dark:text-neutral-350 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Template</span>
                </button>
              </div>

            </div>

            {/* Error correction advice helper card */}
            <div className="bg-neutral-100/50 dark:bg-neutral-900/25 border border-neutral-200/50 dark:border-neutral-800/40 rounded-2xl p-4 flex gap-3 text-xs text-neutral-500">
              <HelpCircle className="w-5 h-5 text-neutral-800 dark:text-neutral-200 flex-shrink-0" />
              <div className="space-y-1">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Flyer printing tip:</span>
                <p className="leading-relaxed">Use <strong>Print Standee (2000px)</strong> to output ultra-sharp files. SVG format exports all shapes as vectors, which graphic designers can scale infinitely without pixelation.</p>
              </div>
            </div>
          </div>

        </div>
        </>
      )}

      {currentView === 'privacy' && (
        <div className="max-w-3xl mx-auto py-8 md:py-12 px-4 space-y-8 animate-fade-in">
          <button 
            onClick={() => { setCurrentView('generator'); window.scrollTo(0, 0); }}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-all"
          >
            &larr; Back to QR Generator
          </button>
          
          <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-6">
            <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white uppercase">Privacy Policy</h1>
            <p className="text-xs text-neutral-450 uppercase font-bold tracking-wider">Last updated: June 2026</p>
            
            <div className="border-b border-neutral-250 dark:border-neutral-800 my-4"></div>
            
            <div className="space-y-6 text-sm text-neutral-650 dark:text-neutral-400 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-neutral-850 dark:text-neutral-200 uppercase">1. Zero Data Collection</h2>
                <p>
                  We believe in complete privacy. <strong>QR for Business</strong> does not collect, log, track, or share any information you input. All parameters (URLs, names, messages, payment details, or coordinates) remain entirely private and local to your device.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-neutral-850 dark:text-neutral-200 uppercase">2. Local Browser Execution</h2>
                <p>
                  The QR generation process runs 100% client-side. When you input details or upload a logo, the computations are handled by your browser using JavaScript. No files, assets, or values are uploaded to any server. Your custom business logo stays on your local machine.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-neutral-850 dark:text-neutral-200 uppercase">3. Cookies & Tracking</h2>
                <p>
                  We do not use tracking cookies, analytics, or user fingerprinting. The dark mode preference is stored locally on your device using browser <code>localStorage</code> and never leaves your machine.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-neutral-850 dark:text-neutral-200 uppercase">4. Security</h2>
                <p>
                  Since no data is collected, stored, or processed remotely, there is no remote server database that can be breached. Your generated payment codes and business details are as secure as your local browser environment.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {currentView === 'terms' && (
        <div className="max-w-3xl mx-auto py-8 md:py-12 px-4 space-y-8 animate-fade-in">
          <button 
            onClick={() => { setCurrentView('generator'); window.scrollTo(0, 0); }}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-all"
          >
            &larr; Back to QR Generator
          </button>
          
          <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-6">
            <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white uppercase">Terms of Service</h1>
            <p className="text-xs text-neutral-450 uppercase font-bold tracking-wider">Last updated: June 2026</p>
            
            <div className="border-b border-neutral-250 dark:border-neutral-800 my-4"></div>
            
            <div className="space-y-6 text-sm text-neutral-655 dark:text-neutral-400 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-neutral-850 dark:text-neutral-200 uppercase">1. Usage License</h2>
                <p>
                  You are granted a free, perpetual license to use the generated QR codes for personal and commercial business activities. You may print, distribute, and publish the custom standee flyer patterns without attribution or cost.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-neutral-850 dark:text-neutral-200 uppercase">2. Input Verification Responsibilities</h2>
                <p>
                  You are solely responsible for verifying that your inputs are correct. For payments, always double check that the <strong>UPI ID</strong> matches your bank merchant account. We are not responsible for transactions sent to incorrect addresses due to user typos.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-neutral-850 dark:text-neutral-200 uppercase">3. Disclaimer of Liability</h2>
                <p>
                  This service is provided "as is" and "as available" without warranties of any kind. We do not guarantee scannability of QR codes on all camera models, particularly if you design low-contrast configurations. Under no circumstances shall QR for Business be liable for any direct, indirect, or consequential losses arising from the use or inability to use this site.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/50 py-6 sm:py-8 px-4 text-center mt-8 sm:mt-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            <span>✓ 100% Free & Unlimited Scans</span>
            <span>✓ Standard-Compliant Coding</span>
            <span>✓ No Registration or Signup</span>
            <span>✓ High-Resolution Exports</span>
          </div>
          <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Simple Business Tools
          </p>
          <div className="flex justify-center gap-4 text-[11px] font-bold text-neutral-450 dark:text-neutral-500 py-1">
            <button type="button" onClick={() => { setCurrentView('privacy'); window.scrollTo(0, 0); }} className="hover:underline hover:text-neutral-950 dark:hover:text-white transition-colors">Privacy Policy</button>
            <span className="text-neutral-300 dark:text-neutral-850">•</span>
            <button type="button" onClick={() => { setCurrentView('terms'); window.scrollTo(0, 0); }} className="hover:underline hover:text-neutral-950 dark:hover:text-white transition-colors">Terms & Conditions</button>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1.5 font-medium">
            Designed for local shops and merchants • Crafted with <Heart className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 fill-neutral-300 dark:fill-neutral-800" /> & React
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
