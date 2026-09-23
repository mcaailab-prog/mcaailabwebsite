export const LAB_HUGGINGFACE_ORGS = [
  {
    name: 'KenCorpus',
    href: 'https://huggingface.co/Kencorpus',
    blurb: 'Kenyan language corpora and models from the KenCorpus programme.',
  },
  {
    name: 'MCAAI (MCAA1-MSU)',
    href: 'https://huggingface.co/MCAA1-MSU',
    blurb: 'Datasets and models published by the Maseno Centre for Applied AI.',
  },
  {
    name: 'African Next Voices / ANV',
    href: 'https://huggingface.co/Anv-ke',
    blurb: 'Speech resources from the African Next Voices Kenya collection.',
  },
] as const;

export function canOpenDataset(dataset: { download_url?: string | null; requires_request?: boolean }) {
  return Boolean(dataset.download_url) && !dataset.requires_request;
}

export function datasetOpenLabel(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes('huggingface.co')) return 'Open on Hugging Face';
  if (lower.includes('github.com')) return 'Open on GitHub';
  return 'Open dataset';
}
