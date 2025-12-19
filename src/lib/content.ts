import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'public', 'content');

export interface PersonLink {
    type: 'linkedin' | 'github' | 'twitter' | 'website' | 'email' | 'orcid';
    url: string;
}

export interface PersonInfo {
    name: string;
    description?: string;
    image?: string;
    bannerImage?: string;
    institution?: string;
    researchFocus?: string; // Comma-separated tags
    links?: PersonLink[];
}

export interface ThesisMetadata {
    title: string;
    description: string;
    author: string; // fallback if authorInfo not present
    authorInfo: PersonInfo;
    supervisorsInfo: PersonInfo[];
}

export type MediaCategory = {
    name: string;
    items: string[]; // filenames
};

export function getThesisMetadata(): ThesisMetadata {
    const filePath = path.join(CONTENT_DIR, 'thesis.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        // Map legacy supervisor data if needed for backward compatibility
        if (data.tutors && !data.supervisorsInfo) {
            data.supervisorsInfo = data.tutors.map((name: string) => ({ name }));
        }

        if (!data.authorInfo) {
            data.authorInfo = { name: data.author || "Author Name" };
        }

        return data;
    } catch (error) {
        console.error("Error reading thesis.json", error);
        return {
            title: "Untitled Thesis",
            description: "No description available.",
            author: "Author Name",
            authorInfo: { name: "Author Name" },
            supervisorsInfo: []
        };
    }
}

export function getMediaCategories(type: 'images' | 'videos'): MediaCategory[] {
    const dirPath = path.join(CONTENT_DIR, type);
    if (!fs.existsSync(dirPath)) return [];

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const categories: MediaCategory[] = [];

    // Check for root items
    const rootItems = entries
        .filter(dirent => dirent.isFile() && !dirent.name.startsWith('.'))
        .map(dirent => dirent.name);

    if (rootItems.length > 0) {
        categories.push({ name: 'General', items: rootItems });
    }

    // Check subfolders
    const subfolders = entries.filter(dirent => dirent.isDirectory());
    for (const folder of subfolders) {
        const subDirPath = path.join(dirPath, folder.name);
        if (!fs.existsSync(subDirPath)) continue;
        const subItems = fs.readdirSync(subDirPath)
            .filter(file => !file.startsWith('.') && fs.statSync(path.join(subDirPath, file)).isFile());

        if (subItems.length > 0) {
            categories.push({ name: folder.name, items: subItems });
        }
    }

    return categories;
}

export function getArticles(): string[] {
    const dirPath = path.join(CONTENT_DIR, 'articles');
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath).filter(file => file.toLowerCase().endsWith('.pdf'));
}

export function getManuscriptFile(): string | null {
    const dirPath = path.join(CONTENT_DIR, 'manuscript');
    console.log(`Checking Manuscript at: ${dirPath}`);
    if (!fs.existsSync(dirPath)) {
        console.log(`Manuscript dir not found!`);
        return null;
    }
    const files = fs.readdirSync(dirPath).filter(file => file.toLowerCase().endsWith('.pdf'));
    console.log(`Manuscript files:`, files);
    return files.length > 0 ? files[0] : null;
}

export function getPresentationFile(): { name: string; type: 'pdf' | 'pptx' | 'ppt' } | null {
    const dirPath = path.join(CONTENT_DIR, 'presentation');
    console.log(`Checking Presentation at: ${dirPath}`);
    if (!fs.existsSync(dirPath)) {
        console.log(`Presentation dir not found!`);
        return null;
    }
    const files = fs.readdirSync(dirPath).filter(file => !file.startsWith('.'));
    console.log(`Presentation files:`, files);

    const pdf = files.find(f => f.toLowerCase().endsWith('.pdf'));
    if (pdf) return { name: pdf, type: 'pdf' };

    const pptx = files.find(f => f.toLowerCase().endsWith('.pptx'));
    if (pptx) return { name: pptx, type: 'pptx' };

    const ppt = files.find(f => f.toLowerCase().endsWith('.ppt'));
    if (ppt) return { name: ppt, type: 'ppt' };

    return null;
}

export function getAvailableSections(): string[] {
    const sections: string[] = [];

    const manuscript = getManuscriptFile();
    if (manuscript) sections.push('manuscript');

    const presentation = getPresentationFile();
    if (presentation) sections.push('presentation');

    const imageCats = getMediaCategories('images');
    if (imageCats.length > 0) sections.push('images');

    const videoCats = getMediaCategories('videos');
    if (videoCats.length > 0) sections.push('videos');

    const articles = getArticles();
    if (articles.length > 0) sections.push('articles');

    console.log(`Sections Result:`, sections);
    return sections;
}
