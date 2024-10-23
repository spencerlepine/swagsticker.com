import { Product, Size } from '@/types';

export const STICKER_SIZES = {
  TWO_BY_TWO_IN: '2x2in',
  THREE_BY_THREE_IN: '3x3in',
  FOUR_BY_FOUR_IN: '4x4in',
};

export const PRODUCT_CONFIG = {
  language: 'en-US',
  allowCountries: ['US'], // e.g. ['US', 'GB', 'CA'];
  currency: 'USD',
  defaultSize: STICKER_SIZES.TWO_BY_TWO_IN,
};

// hard-coded, based on cost per unit (Printify)
export const STICKER_PRICES = {
  [STICKER_SIZES.TWO_BY_TWO_IN]: 230,
  [STICKER_SIZES.THREE_BY_THREE_IN]: 250,
  [STICKER_SIZES.FOUR_BY_FOUR_IN]: 270,
};
export const DEFAULT_STICKER_SIZES = [
  {
    value: STICKER_SIZES.TWO_BY_TWO_IN,
    price: STICKER_PRICES[STICKER_SIZES.TWO_BY_TWO_IN],
  },
  {
    value: STICKER_SIZES.THREE_BY_THREE_IN,
    price: STICKER_PRICES[STICKER_SIZES.THREE_BY_THREE_IN],
  },
  {
    value: STICKER_SIZES.FOUR_BY_FOUR_IN,
    price: STICKER_PRICES[STICKER_SIZES.FOUR_BY_FOUR_IN],
  },
];

const stickerDescription = `
- Decorate and personalize laptops, windows, and more.\n
- Removable, kiss-cut vinyl stickers.\n
- Super durable vinyl and water-resistant.\n
- Sticker types may be printed and shipped from different locations.\n
- For orders with 2+ small stickers, they will be printed in pairs with two stickers on one sheet to reduce sheet waste.\n
- Items are typically shipped within 2-5 business days.
`;

export const STICKER_PRODUCTS: Product[] = [
  {
    id: 'airtable',
    name: 'Airtable Sticker',
    description: stickerDescription,
    image: `/images/airtable.jpg`,
    dateAdded: '2024-10-12T12:00',
    type: 'sticker',
    category: 'fullstack',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: PRODUCT_CONFIG.defaultSize as Size,
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'amazon-web-services',
    name: 'Amazon Web Services Sticker',
    description: stickerDescription,
    image: `/images/amazon-web-services.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'cloud',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'amazon-web-services-hexagon',
    name: 'Amazon Web Services Hexagon Sticker',
    description: stickerDescription,
    image: `/images/amazon-web-services-hexagon.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'cloud',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'android',
    name: 'Android Sticker',
    description: stickerDescription,
    image: `/images/android.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'mobile',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'ansible',
    name: 'Ansible Sticker',
    description: stickerDescription,
    image: `/images/ansible.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'devops',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'azure',
    name: 'Azure Sticker',
    description: stickerDescription,
    image: `/images/azure.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'cloud',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'c',
    name: 'C Sticker',
    description: stickerDescription,
    image: `/images/c.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'c-plus-plus',
    name: 'C Plus Plus Sticker',
    description: stickerDescription,
    image: `/images/c-plus-plus.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'c-sharp',
    name: 'C Sharp Sticker',
    description: stickerDescription,
    image: `/images/c-sharp.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'chatgpt',
    name: 'Chatgpt Sticker',
    description: stickerDescription,
    image: `/images/chatgpt.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'ai',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'chrome',
    name: 'Chrome Sticker',
    description: stickerDescription,
    image: `/images/chrome.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Sticker',
    description: stickerDescription,
    image: `/images/cloudflare.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'css',
    name: 'Css Sticker',
    description: stickerDescription,
    image: `/images/css.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'django',
    name: 'Django Sticker',
    description: stickerDescription,
    image: `/images/django.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'fullstack',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'docker',
    name: 'Docker Sticker',
    description: stickerDescription,
    image: `/images/docker.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'devops',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'dot-net-core',
    name: 'Dot Net Core Sticker',
    description: stickerDescription,
    image: `/images/dot-net-core.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'fullstack',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch Sticker',
    description: stickerDescription,
    image: `/images/elasticsearch.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'figma',
    name: 'Figma Sticker',
    description: stickerDescription,
    image: `/images/figma.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'firebase',
    name: 'Firebase Sticker',
    description: stickerDescription,
    image: `/images/firebase.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'fullstack',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'flask',
    name: 'Flask Sticker',
    description: stickerDescription,
    image: `/images/flask.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'fullstack',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'git',
    name: 'Git Sticker',
    description: stickerDescription,
    image: `/images/git.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'github-head',
    name: 'Github Head Sticker',
    description: stickerDescription,
    image: `/images/github-head.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'github-octocat',
    name: 'Github Octocat Sticker',
    description: stickerDescription,
    image: `/images/github-octocat.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'go-gopher',
    name: 'Go Gopher Sticker',
    description: stickerDescription,
    image: `/images/go-gopher.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'graphql',
    name: 'Graphql Sticker',
    description: stickerDescription,
    image: `/images/graphql.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'database',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'html',
    name: 'Html Sticker',
    description: stickerDescription,
    image: `/images/html.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'java',
    name: 'Java Sticker',
    description: stickerDescription,
    image: `/images/java.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'javascript',
    name: 'Javascript Sticker',
    description: stickerDescription,
    image: `/images/javascript.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'jquery',
    name: 'Jquery Sticker',
    description: stickerDescription,
    image: `/images/jquery.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Sticker',
    description: stickerDescription,
    image: `/images/kubernetes.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'devops',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'mongo-db-shield',
    name: 'Mongo Db Shield Sticker',
    description: stickerDescription,
    image: `/images/mongo-db-shield.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'database',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'nodejs',
    name: 'Node.js Sticker',
    description: stickerDescription,
    image: `/images/nodejs.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'open-source',
    name: 'Open Source Sticker',
    description: stickerDescription,
    image: `/images/open-source.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'python',
    name: 'Python Sticker',
    description: stickerDescription,
    image: `/images/python.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'react',
    name: 'React Sticker',
    description: stickerDescription,
    image: `/images/react.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'ruby',
    name: 'Ruby Sticker',
    description: stickerDescription,
    image: `/images/ruby.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'ruby-on-rails',
    name: 'Ruby On Rails Sticker',
    description: stickerDescription,
    image: `/images/ruby-on-rails.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'fullstack',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'rust',
    name: 'Rust Sticker',
    description: stickerDescription,
    image: `/images/rust.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'backend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'slack',
    name: 'Slack Sticker',
    description: stickerDescription,
    image: `/images/slack.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'stack-overflow',
    name: 'Stack Overflow Sticker',
    description: stickerDescription,
    image: `/images/stack-overflow.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'supabase',
    name: 'Supabase Sticker',
    description: stickerDescription,
    image: `/images/supabase.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'database',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'svelte',
    name: 'Svelte Sticker',
    description: stickerDescription,
    image: `/images/svelte.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'tensorflow',
    name: 'Tensorflow Sticker',
    description: stickerDescription,
    image: `/images/tensorflow.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'ai',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'typescript',
    name: 'Typescript Sticker',
    description: stickerDescription,
    image: `/images/typescript.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu Sticker',
    description: stickerDescription,
    image: `/images/ubuntu.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'devops',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'vscode',
    name: 'Vscode Sticker',
    description: stickerDescription,
    image: `/images/vscode.jpg`,
    dateAdded: '2024-10-14T12:00',
    type: 'sticker',
    category: 'developer',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
  {
    id: 'webpack',
    name: 'Webpack Sticker',
    description: stickerDescription,
    image: `/images/webpack.jpg`,
    dateAdded: '2024-10-09T12:00',
    type: 'sticker',
    category: 'frontend',
    currency: PRODUCT_CONFIG.currency,
    defaultSize: '2x2in',
    sizes: DEFAULT_STICKER_SIZES,
  },
];
