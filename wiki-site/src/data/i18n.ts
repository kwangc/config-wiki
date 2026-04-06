export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const i18n: Record<
  Locale,
  {
    nav: {
      wiki: string;
      news: string;
      aboutMe: string;
      drawerTitle: string;
      themeSelect: string;
      themeLightLabel: string;
      themeDarkLabel: string;
      themeSystemLabel: string;
    };
    sidebar: { home: string; wikiDocs: string; companyGroup: string; companyAbout: string; productOverview: string };
    home: { title: string; lead: string; intro: string; newsLink: string; browseLabel: string };
    toc: { onThisPage: string; createdBy: string; lastEditedBy: string; lastEdited: string };
    about: {
      title: string;
      mission: string;
      team: string;
      education: string;
      experience: string;
      focus: string;
    };
    news: { title: string; lead: string };
    dirNames: Record<string, string>;
  }
> = {
  en: {
    nav: {
      wiki: 'Wiki',
      news: 'News',
      aboutMe: 'About Us',
      drawerTitle: 'Menu',
      themeSelect: 'Color theme',
      themeLightLabel: 'Light',
      themeDarkLabel: 'Dark',
      themeSystemLabel: 'System',
    },
    sidebar: {
      home: 'Wiki home',
      wikiDocs: 'Wiki',
      companyGroup: 'Company',
      companyAbout: 'About Config',
      productOverview: 'Product overview',
    },
    home: {
      title: 'Config Wiki',
      lead: 'Company, domain, research, and industry knowledge in one place. Updated as we learn and research.',
      intro: 'Use the sidebar to browse by topic, or jump to a section below.',
      newsLink: 'News — scraping & summaries',
      browseLabel: 'Browse by section',
    },
    toc: {
      onThisPage: 'On this page',
      createdBy: 'Created by',
      lastEditedBy: 'Last edited by',
      lastEdited: 'Last edited',
    },
    about: {
      title: 'About Us',
      mission: 'Building the data infrastructure and technology that enable general-purpose bimanual robotics.',
      team: 'Team',
      education: 'Education',
      experience: 'Experience',
      focus: 'Focus',
    },
    news: {
      title: 'News',
      lead: 'Daily AI news summaries from news.smol.ai, updated automatically every morning.',
    },
    dirNames: {
      root: 'Wiki',
      company: 'Company',
      product: 'Product',
      domains: 'Domains',
      research: 'Research',
      industry: 'Industry',
      glossary: 'Glossary',
      'safety-eval': 'Safety & Evaluation',
    },
  },
  ko: {
    nav: {
      wiki: 'Wiki',
      news: 'News',
      aboutMe: 'About Us',
      drawerTitle: '메뉴',
      themeSelect: '색 테마',
      themeLightLabel: '라이트',
      themeDarkLabel: '다크',
      themeSystemLabel: '시스템',
    },
    sidebar: {
      home: 'Wiki 홈',
      wikiDocs: 'Wiki',
      companyGroup: 'Company',
      companyAbout: 'Config 소개',
      productOverview: 'Product 개요',
    },
    home: {
      title: 'Config Wiki',
      lead: '회사·도메인·리서치·산업 지식을 한곳에서. 학습·조사한 내용을 실시간으로 반영합니다.',
      intro: '왼쪽 사이드바에서 주제별로 둘러보거나, 아래 섹션으로 바로 이동할 수 있습니다.',
      newsLink: 'News — 뉴스·논문 스크래핑 & 요약',
      browseLabel: '섹션별 보기',
    },
    toc: {
      onThisPage: 'On this page',
      createdBy: 'Created by',
      lastEditedBy: 'Last edited by',
      lastEdited: 'Last edited',
    },
    about: {
      title: 'About Us',
      mission: '범용 양팔 로보틱스를 가능하게 하는 데이터 인프라와 기술을 구축합니다.',
      team: '팀',
      education: '학력',
      experience: '경력',
      focus: '관심 분야',
    },
    news: {
      title: 'News',
      lead: 'news.smol.ai의 AI 뉴스를 매일 아침 자동으로 요약합니다.',
    },
    dirNames: {
      root: 'Wiki',
      company: 'Company',
      product: 'Product',
      domains: 'Domains',
      research: 'Research',
      industry: 'Industry',
      glossary: 'Glossary',
      'safety-eval': 'Safety & Evaluation',
    },
  },
};
