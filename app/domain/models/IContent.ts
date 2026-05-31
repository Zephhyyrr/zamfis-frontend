export interface IContent {
    id: number;
    judul: string;
    gambarUrl: string;
    jenis: 'berita' | 'pengurus' | 'imsakiyah';
    isTampil: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

export interface ICreateContentPayload {
    judul: string;
    jenis: 'berita' | 'pengurus' | 'imsakiyah';
    gambarUrl?: File | null;
    isTampil?: boolean;
}

export interface IUpdateContentPayload {
    judul?: string;
    jenis?: 'berita' | 'pengurus' | 'imsakiyah';
    gambarUrl?: File | null;
    isTampil?: boolean;
}
