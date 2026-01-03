export interface TagV3 {
  tagId: number;
  tagName: string;
  tagEnName: string;
}

export interface Corner {
  cornerType: number;
  name: string;
  color: string;
}

export interface RankVo {
  rankType: number;
  hotCode: string;
  sort: number;
}

export interface Drama {
  bookId: string;
  bookName: string;
  coverWap?: string;
  cover?: string;
  chapterCount: number;
  introduction: string;
  tags?: string[];
  tagNames?: string[];
  tagV3s?: TagV3[];
  protagonist?: string;
  playCount?: string;
  corner?: Corner;
  rankVo?: RankVo;
  shelfTime?: string;
  inLibrary: boolean;
}

export interface SearchResult {
  bookId: string;
  bookName: string;
  introduction: string;
  author: string;
  cover: string;
  protagonist: string;
  tagNames: string[];
  inLibrary: boolean;
}

// Detail Types
export interface Performer {
  performerId: string;
  performerName: string;
  performerFormatName: string;
  performerAvatar: string;
  videoCount: number;
}

export interface TypeTwo {
  id: number;
  name: string;
  replaceName: string;
}

export interface ChapterDetail {
  id: string;
  name: string;
  index: number;
  indexStr: string;
  unlock: boolean;
  mp4: string;
  m3u8Url: string;
  m3u8Flag: boolean;
  cover: string;
  utime: string;
  chapterPrice: number;
  duration: number;
  new: boolean;
}

export interface BookDetail {
  bookId: string;
  bookName: string;
  cover: string;
  viewCount: number;
  followCount: number;
  introduction: string;
  chapterCount: number;
  labels: string[];
  tags: string[];
  typeTwoNames: string[];
  typeTwoList: TypeTwo[];
  language: string;
  typeTwoName: string;
  shelfTime: string;
  performerList: Performer[];
}

export interface RecommendDrama {
  bookId: string;
  bookName: string;
  cover: string;
  followCount: number;
  introduction: string;
  chapterCount: number;
  labels: string[];
  tags: string[];
  typeTwoNames: string[];
}

export interface DramaDetailResponse {
  data: {
    book: BookDetail;
    recommends: RecommendDrama[];
    chapterList: ChapterDetail[];
  };
  status: number;
  message: string;
  success: boolean;
}

// Episode Types
export interface VideoPath {
  quality: number;
  videoPath: string;
  isDefault: number;
  isVipEquity: number;
}

export interface CdnInfo {
  cdnDomain: string;
  isDefault: number;
  videoPathList: VideoPath[];
}

export interface Episode {
  chapterId: string;
  chapterIndex: number;
  isCharge: number;
  chapterName: string;
  cdnList: CdnInfo[];
  chapterImg: string;
  chargeChapter: boolean;
}
// Drama TS BARU
export type ApiSource = "dramabox" | "netshort";

// ===== UNIFIED DRAMA TYPE =====
export interface Drama {
  id: string;
  title: string;
  cover: string;
  labels?: string[];
  heatScore?: number;
  scriptName?: string;
  publishTime?: number;
  source: ApiSource;
  _raw?: any; // Data asli dari API untuk keperluan detail
}

export interface SearchResult {
  id: string;
  title: string;
  cover: string;
  labels?: string[];
  heatScore?: number;
  source: ApiSource;
}

// ===== NETSHORT SPECIFIC TYPES =====
export interface NetshortDrama {
  id: string | null;
  shortPlayId: string;
  shortPlayLibraryId: string;
  shortPlayName: string;
  shortPlayCover: string;
  groupShortPlayCover: string;
  shortPlayLabels: string;
  labelArray: string[];
  isNewLabel: boolean;
  labelLanguageIds: string[];
  heatScore: number;
  heatScoreShow: string;
  totalReserveNum: string;
  isReserve: number;
  script: number;
  scriptName: string;
  scriptType: number;
  publishTime: number;
  contentModel: number | null;
  isChase: boolean;
  expGroup: string;
  expName: string;
  sceneId: string;
  highImage: string | null;
  isNeedHighImage: boolean;
  isForceShortPlay: boolean;
}

export interface NetshortGroup {
  contentType: number;
  groupId: string;
  contentName: string;
  contentModel: number;
  contentInfos: NetshortDrama[];
  heatShowSwitch: number;
  freeEndTime: number;
  hiddenName: number;
  highShowCount: number;
  contentRemark: string;
}

export type NetshortResponse = NetshortGroup[];

// ===== DRAMABOX SPECIFIC TYPES =====
export interface DramaboxDrama {
  id: string;
  dramaId?: string;
  title?: string;
  name?: string;
  cover?: string;
  thumbnail?: string;
  image?: string;
  tags?: string[];
  genres?: string[];
  views?: number;
  popularity?: number;
  publishTime?: number;
  createdAt?: number;
}
