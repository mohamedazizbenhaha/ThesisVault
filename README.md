# Thesis Website Display

A modern, static, filesystem-driven website to display doctoral thesis research, articles, and multimedia.

## Image Specification Guide

To ensure the best visual experience, please follow these guidelines for images placed in `public/content/assets/`.

### 1. Profile Images (Author & Supervisors)
- **Usage**: Displayed in Hero section cards and Person Detail modals.
- **Recommended Size**: `400 x 400 pixels` (Square).
- **Format**: `.jpg` or `.png`.
- **Note**: These should be clear headshots with a neutral background.

### 2. Institution Banners
- **Usage**: Displayed as the top banner in the Person Detail modal.
- **Recommended Size**: `1200 x 500 pixels` (Panoramic/Landscape).
- **Format**: `.jpg`.
- **Content**: These should represent the University, Lab, or Research Institution. Avoid using the same image as the profile photo.

### 3. Gallery Images
- **Usage**: Displayed in the Images section.
- **Recommended Size**: High resolution (at least `1920 x 1080 pixels`).
- **Optimization**: Use compressed `.jpg` files for faster loading.

## How to Update Content

1. **Thesis Info**: Edit `public/content/thesis.json`.
2. **Manuscript**: Place your PDF in `public/content/manuscript/`.
3. **Presentation**: Place your PDF or PPTX in `public/content/presentation/`.
4. **Articles**: Place PDFs in `public/content/articles/`.
5. **Media**: Organize into subfolders in `public/content/images/` or `public/content/videos/`.
