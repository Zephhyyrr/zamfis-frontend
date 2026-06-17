export interface IContent {
    id: number;
    judul: string;
    isi: string;
    gambarUrl: string[];
    videoUrl?: string;
    jenis: 'berita' | 'pengurus' | 'imsakiyah' | 'sejarah';
    isTampil: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

export interface ICreateContentPayload {
    judul: string;
    isi: string;
    jenis: 'berita' | 'pengurus' | 'imsakiyah' | 'sejarah';
    gambarUrl?: File[];
    videoUrl?: File;
    isTampil?: boolean;
}

export interface IUpdateContentPayload {
    judul?: string;
    isi?: string;
    jenis?: 'berita' | 'pengurus' | 'imsakiyah' | 'sejarah';
    gambarUrl?: File[];
    videoUrl?: File;
    isTampil?: boolean;
}
