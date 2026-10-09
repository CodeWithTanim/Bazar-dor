export interface Product {
    id: number;
    slug: string;
    nameBn: string;
    image: string;
    unit: string;
    today: number;
    change: {
        dir: 'up' | 'down' | 'flat';
        pct: number;
    };
}