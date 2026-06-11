export interface IContent {
    id: number;
    judul: string;
    isi: string;
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
    isi: string;
    jenis: 'berita' | 'pengurus' | 'imsakiyah';
    gambarUrl?: File | null;
    isTampil?: boolean;
}

export interface IUpdateContentPayload {
    judul?: string;
    isi?: string;
    jenis?: 'berita' | 'pengurus' | 'imsakiyah';
    gambarUrl?: File | null;
    isTampil?: boolean;
}
