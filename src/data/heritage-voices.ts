import {
  HeritageArticle,
  HeritageExpert,
  HeritageReport,
  HeritageReportReason,
} from '@/types/heritage-voices';

export const HERITAGE_CATEGORIES = [
  'All',
  'Ancient India',
  'Archaeology',
  'Medieval India',
  'Modern India',
  'Art & Architecture',
  'Culture & Heritage',
  'Epigraphy',
  'Conservation',
] as const;

export const HERITAGE_EXPERTS: HeritageExpert[] = [
  {
    id: 'exp-aruna-swaminathan',
    name: 'Dr. Aruna Swaminathan',
    designation: 'Field Archaeologist (Demo Profile)',
    institution: 'Deccan Archaeological Study Forum (Sample Data)',
    fieldOfExpertise: 'Chalcolithic & Early Historic Settlements',
    bio: 'Specialist in ceramic sequences, stratigraphy, and ancient settlement hydrology across peninsular river basins (Sample Profile).',
    verificationStatus: 'verified',
    isDemo: true,
    credentials: [
      {
        id: 'cred-1',
        title: 'Ph.D. in South Asian Archaeology',
        institution: 'Institute of Historical Studies (Demo)',
        year: '2014',
        verificationNote: 'Sample credential for prototype demonstration.',
      },
      {
        id: 'cred-2',
        title: 'Senior Fieldwork Director Accreditation',
        institution: 'National Heritage Research Council (Demo)',
        year: '2019',
        verificationNote: 'Sample accreditation for prototype demonstration.',
      },
    ],
    articleIds: ['art-keeladi-hydrology', 'art-sannati-inscriptions'],
  },
  {
    id: 'exp-k-r-mehra',
    name: 'Prof. K. R. Mehra',
    designation: 'Epigraphist & Numismatist (Demo Profile)',
    institution: 'Centre for Classical Inscriptions (Sample Data)',
    fieldOfExpertise: 'Brahmi & Kharosthi Palaeography',
    bio: 'Focuses on early trade route inscriptions, royal edicts, and metallurgical analysis of punch-marked coinage (Sample Profile).',
    verificationStatus: 'verified',
    isDemo: true,
    credentials: [
      {
        id: 'cred-3',
        title: 'Master of Epigraphy & Diplomatics',
        institution: 'Oriental Epigraphic Society (Demo)',
        year: '2008',
        verificationNote: 'Sample academic credential record.',
      },
    ],
    articleIds: ['art-punch-marked-metallurgy'],
  },
  {
    id: 'exp-s-n-varma',
    name: 'Dr. S. N. Varma',
    designation: 'Postdoctoral Fellow in Medieval Trade (Demo Profile)',
    institution: 'Indian Ocean Maritime Archives (Sample Data)',
    fieldOfExpertise: 'Chola & Malabar Port Networks',
    bio: 'Researches cross-cultural guild records, merchant epigraphy, and monsoon trade routes in southern ports (Sample Profile).',
    verificationStatus: 'pending',
    isDemo: true,
    credentials: [
      {
        id: 'cred-4',
        title: 'Ph.D. in Maritime History',
        institution: 'Maritime History Guild (Demo)',
        year: '2022',
        verificationNote: 'Demo verification documents submitted and under review.',
      },
    ],
    articleIds: ['art-quilon-copper-plates'],
  },
];

export const INITIAL_HERITAGE_ARTICLES: HeritageArticle[] = [
  {
    id: 'art-keeladi-hydrology',
    title: 'Hydrological Planning in Iron Age & Early Historic Vaigai Basin Settlements',
    summary: 'Recent stratigraphical examinations reveal an intricate network of terracotta ring-wells and stone-lined drainage conduits indicating sophisticated water management (Illustrative Demo Article).',
    content: 'Archaeological fieldwork along the Vaigai river basin has brought to light multi-tiered urban infrastructure dating to the mid-first millennium BCE. Excavations reveal stepped brick-lined conduits and terracotta ring-wells placed at deliberate intervals. Comparative analysis indicates that water management systems in peninsular India evolved indigenous techniques alongside shared metallurgical trade networks.',
    authorId: 'exp-aruna-swaminathan',
    category: 'Archaeology',
    tags: ['Vaigai', 'Hydrology', 'Iron Age', 'Excavations'],
    verificationStatus: 'verified',
    reviewStatus: 'content_reviewed',
    readTimeMinutes: 5,
    publishedAt: '2026-08-14',
    contentNote: 'This sample article documents structural remains from archaeological strata containing faunal remains and funerary ceramic urns.',
    evidenceSummary: 'Stratigraphic layers at depths between 2.8m and 4.2m yielded carbonized botanical seeds, burnt brick conduits with standardized dimensions (1:2:4 ratio), and 14 terracotta ring-wells recorded in situ.',
    authorPerspective: 'In the author perspective, these hydraulic conduits reflect localized civic institutions rather than centralized imperial decrees, pointing to robust guild-led urbanism in the early historic south.',
    sources: [
      {
        id: 'src-1',
        title: 'Excavation Reports on the Vaigai River Valley (Sample Reference Series)',
        author: 'Archaeological Survey Field Wing',
        publisher: 'Heritage Monograph Press (Demo)',
        year: '2023',
        sourceType: 'archaeological',
      },
      {
        id: 'src-2',
        title: 'Early Historic Water Architecture in Peninsular India (Sample Reference)',
        author: 'Swaminathan, A. & Raghavan, V.',
        publisher: 'Journal of South Asian Settlement Studies (Demo)',
        year: '2024',
        sourceType: 'academic',
      },
    ],
  },
  {
    id: 'art-punch-marked-metallurgy',
    title: 'Trace Element Profiling of Magadhan Silver Punch-Marked Karshapanas',
    summary: 'XRF spectroscopy of punch-marked silver coins indicates localized lead-silver cupellation techniques and standardized weight tolerances across regional treasuries (Illustrative Demo Article).',
    content: 'Punch-marked coins known as Karshapanas or Puranas form the backbone of the monetization of the 6th to 3rd centuries BCE. By testing 84 coins using non-destructive X-ray Fluorescence (XRF), we observe consistent silver purities ranging between 78% and 82%, with specific bismuth and copper alloy ratios indicative of silver extraction from Zawar lead-zinc deposits.',
    authorId: 'exp-k-r-mehra',
    category: 'Epigraphy',
    tags: ['Numismatics', 'Metallurgy', 'Magadha', 'Trade'],
    verificationStatus: 'verified',
    reviewStatus: 'content_reviewed',
    readTimeMinutes: 4,
    publishedAt: '2026-07-28',
    evidenceSummary: 'Laboratory spectrographic results from 84 numismatic samples demonstrate an 80.2% average silver content, with copper deliberately added for mechanical hardness.',
    authorPerspective: 'The author argues that standardizing currency alloys was driven primarily by merchant guilds (shrenis) rather than purely state-enforced fiat.',
    sources: [
      {
        id: 'src-3',
        title: 'Ancient Indian Coinage & Metallurgical Traditions (Sample Reference)',
        author: 'Mehra, K. R.',
        publisher: 'Classical Numismatic Studies (Demo)',
        year: '2021',
        sourceType: 'academic',
      },
      {
        id: 'src-4',
        title: 'Mining and Smelting Sites of Early Rajasthan and Gujarat (Sample Reference)',
        author: 'Geological Survey Archives',
        publisher: 'Govt. Heritage Reports (Demo)',
        year: '2018',
        sourceType: 'government',
      },
    ],
  },
  {
    id: 'art-sannati-inscriptions',
    title: 'Ashokan Rock Inscriptions at Sannati: Linguistic Variants in Special Edicts',
    summary: 'An analysis of Prakrit syntax variations across the newly recovered rock edicts XII and XIV at Sannati, Karnataka (Illustrative Demo Article).',
    content: 'The discovery of Ashokan Major Rock Edicts on the slabs of the Chandralamba temple in Sannati remains one of the most vital epigraphic developments in southern India. The scribe employed distinctive regional ligatures while preserving the imperial court phrasing of Pataliputra, demonstrating how imperial edicts were transmitted and adapted locally.',
    authorId: 'exp-aruna-swaminathan',
    category: 'Epigraphy',
    tags: ['Ashoka', 'Inscriptions', 'Sannati', 'Brahmi'],
    verificationStatus: 'verified',
    reviewStatus: 'published',
    readTimeMinutes: 6,
    publishedAt: '2026-06-11',
    evidenceSummary: 'Photogrammetric squeeze analysis of granite slabs displaying Brahmi script with dialectal phonetic shifts.',
    authorPerspective: 'The author suggests that local regional scribes enjoyed editorial discretion in phonetic transcription while retaining doctrinal loyalty.',
    sources: [
      {
        id: 'src-5',
        title: 'The Sannati Slabs: Text, Translation, and Commentary (Sample Reference)',
        author: 'Rao, M. S.',
        publisher: 'Epigraphia Indica Special Series (Demo)',
        year: '2015',
        sourceType: 'primary_source',
      },
    ],
  },
  {
    id: 'art-quilon-copper-plates',
    title: 'West Asian Merchant Guilds in 9th Century Kollam (Quilon)',
    summary: 'Examining the bilingual signatures in Pahlavi, Kufic, and Judeo-Persian on the Tarisapalli copper plates (Illustrative Demo Article).',
    content: 'The 9th-century Kollam copper plates grant land and privileges to the Christian community of Tarisapalli under the Venad ruler Ayyanadikal Thiruvadigal. Notably, the witness attestations in Middle Persian, early Arabic script, and Judeo-Persian reflect a vibrant, polyglot mercantile hub participating in Indian Ocean maritime trade networks.',
    authorId: 'exp-s-n-varma',
    category: 'Medieval India',
    tags: ['Maritime', 'Kollam', 'Trade Guilds', 'Epigraphy'],
    verificationStatus: 'pending',
    reviewStatus: 'pending_review',
    readTimeMinutes: 5,
    publishedAt: '2026-09-02',
    evidenceSummary: 'Paleographical collation of the copper plates preserved in institutional archives in Kottayam.',
    authorPerspective: 'The author highlights these signatures as evidence of institutional merchant courts operating extraterritorially in peninsular ports.',
    sources: [
      {
        id: 'src-6',
        title: 'Tarisapalli Copper Plates: Multi-lingual Epigraphic Corpus (Sample Reference)',
        author: 'Varma, S. N.',
        publisher: 'Indian Ocean History Papers (Demo)',
        year: '2025',
        sourceType: 'academic',
      },
    ],
  },
];

export const HERITAGE_ARTICLES = INITIAL_HERITAGE_ARTICLES;

let localArticles: HeritageArticle[] = [...INITIAL_HERITAGE_ARTICLES];
let localReports: HeritageReport[] = [];

export function getHeritageArticles(): HeritageArticle[] {
  return localArticles.filter((a) => a.reviewStatus !== 'hidden' && a.reviewStatus !== 'removed');
}

export function getFeaturedArticle(): HeritageArticle {
  return localArticles[0];
}

export function getHeritageArticleById(id: string): HeritageArticle | undefined {
  return localArticles.find((a) => a.id === id);
}

export function getHeritageExpertById(id: string): HeritageExpert | undefined {
  return HERITAGE_EXPERTS.find((e) => e.id === id);
}

export function getArticlesByAuthor(authorId: string): HeritageArticle[] {
  return localArticles.filter((a) => a.authorId === authorId && a.reviewStatus !== 'removed');
}

export function submitHeritageArticle(article: Omit<HeritageArticle, 'id' | 'verificationStatus' | 'reviewStatus' | 'publishedAt'>): HeritageArticle {
  const author = getHeritageExpertById(article.authorId);
  const newArticle: HeritageArticle = {
    ...article,
    id: 'art-' + String(Date.now()),
    verificationStatus: author ? author.verificationStatus : 'unverified',
    reviewStatus: 'pending_review',
    publishedAt: new Date().toISOString().split('T')[0],
  };
  localArticles.unshift(newArticle);
  return newArticle;
}

export function reportHeritageArticle(report: Omit<HeritageReport, 'id' | 'createdAt' | 'status'>): HeritageReport {
  const newReport: HeritageReport = {
    ...report,
    id: 'rep-' + String(Date.now()),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  localReports.push(newReport);
  return newReport;
}

export function getArticlesByCategory(category: string): HeritageArticle[] {
  if (category === 'All') return getHeritageArticles();
  return getHeritageArticles().filter((a) => a.category === category);
}

export function searchHeritageArticles(query: string, category: string = 'All'): HeritageArticle[] {
  const normalized = query.trim().toLowerCase();
  let base = getArticlesByCategory(category);
  if (!normalized) return base;

  return base.filter((art) => {
    const author = getHeritageExpertById(art.authorId);
    const authorName = author?.name.toLowerCase() || '';
    return (
      art.title.toLowerCase().includes(normalized) ||
      art.summary.toLowerCase().includes(normalized) ||
      authorName.includes(normalized) ||
      art.tags.some((t) => t.toLowerCase().includes(normalized))
    );
  });
}
