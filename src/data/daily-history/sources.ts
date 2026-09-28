import { ApprovedSource } from './types';

/**
 * Centralized Approved Source Registry for Akhyana.
 * 
 * In accordance with Akhyana's strict source-of-truth principles:
 * - NO unapproved internet search or dynamic fact generation is permitted.
 * - Every historical event displayed in 'Aaj Ka Akhyana' must trace back
 *   to an approved government, academic, archive, or museum record listed below.
 */
export const APPROVED_SOURCES: Record<string, ApprovedSource> = {
  asi: {
    id: 'asi',
    name: 'Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI), Ministry of Culture, Government of India',
    url: 'https://asi.nic.in/',
    type: 'government',
    description: 'Official archaeological excavations, epigraphy memoirs, and monument conservation archives.',
  },
  nai: {
    id: 'nai',
    name: 'National Archives of India',
    organization: 'National Archives of India, Ministry of Culture, Government of India',
    url: 'https://nationalarchives.nic.in/',
    type: 'archive',
    description: 'Official repository of non-current records of the Government of India and freedom movement documents.',
  },
  parliament: {
    id: 'parliament',
    name: 'Parliament of India Archives',
    organization: 'Parliament Library and Reference Service, Parliament of India',
    url: 'https://eparlib.sansad.in/',
    type: 'government',
    description: 'Official records of parliamentary proceedings, legislative acts, and Constituent Assembly debates.',
  },
  india_code: {
    id: 'india_code',
    name: 'India Code / Legislative Department',
    organization: 'Legislative Department, Ministry of Law and Justice, Government of India',
    url: 'https://www.indiacode.nic.in/',
    type: 'government',
    description: 'Digital repository of all central enactments, ordinances, and historical legal gazettes.',
  },
  isro: {
    id: 'isro',
    name: 'Indian Space Research Organisation',
    organization: 'Department of Space, Government of India',
    url: 'https://www.isro.gov.in/',
    type: 'government',
    description: 'Official mission archives, planetary exploration logs, and scientific instrumentation records.',
  },
  rbi: {
    id: 'rbi',
    name: 'Reserve Bank of India Monetary Archives',
    organization: 'Reserve Bank of India',
    url: 'https://www.rbi.org.in/',
    type: 'archive',
    description: 'Official historical records of Indian currency, banking regulation, and monetary institutional evolution.',
  },
  ministry_culture: {
    id: 'ministry_culture',
    name: 'Indian Culture Portal',
    organization: 'Ministry of Culture, Government of India',
    url: 'https://indianculture.gov.in/',
    type: 'government',
    description: 'Curated national portal for rare books, manuscripts, freedom fighters, and cultural heritage exhibits.',
  },
  unesco_whc: {
    id: 'unesco_whc',
    name: 'UNESCO World Heritage Centre',
    organization: 'United Nations Educational, Scientific and Cultural Organization',
    url: 'https://whc.unesco.org/',
    type: 'academic',
    description: 'Global register and peer-reviewed documentation of historical and cultural heritage sites.',
  },
  national_museum_delhi: {
    id: 'national_museum_delhi',
    name: 'National Museum, New Delhi',
    organization: 'National Museum, Janpath, New Delhi',
    url: 'https://www.nationalmuseumindia.gov.in/',
    type: 'museum',
    description: 'Primary repository of ancient antiquities, sculpture, numismatics, and manuscript collections.',
  },
};

export function getApprovedSource(sourceId: string): ApprovedSource | undefined {
  return APPROVED_SOURCES[sourceId];
}

export function isSourceApproved(sourceId: string): boolean {
  return Boolean(APPROVED_SOURCES[sourceId]);
}
