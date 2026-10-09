
import { Product } from '@/type/Product';
import Link from 'next/link';
import React from 'react';
import MarqueeText from 'react-marquee-text';
import 'react-marquee-text/dist/styles.css';


const Marquee = async () => {
    const res = await fetch(
        'https://api.api-store.workers.dev/api/bazardor/products'
    );

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    const products: Product[] = data;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('bn-BD').format(price);

    const formatPercent = (pct: number) =>
        new Intl.NumberFormat('bn-BD', {
            maximumFractionDigits: 1,
        }).format(pct);

    const getUnit = (unit: string) => {
        const units: Record<string, string> = {
            kg: 'কেজি',
            liter: 'লিটার',
            dozen: 'ডজন',
            piece: 'পিস',
            pcs: 'পিস',
        };

        return units[unit.toLowerCase()] || unit;
    };

    return (
        <div className="w-full overflow-hidden border-y border-gray-200 bg-white">
            <div className="w-full overflow-hidden font-bold text-sm">
                <MarqueeText
                    className="py-2"
                    direction="right"
                    duration={30}
                >
                    {products.map((product) => {
                        const isUp = product.change.dir === 'up';
                        const isDown = product.change.dir === 'down';

                        return (
                            <Link
                                href={`/product/${product.slug}`}
                                key={product.id}
                                className="inline-flex items-center gap-2 border-r border-gray-100 px-4 whitespace-nowrap"
                            >
                                <span>{product.image}</span>

                                <span className="text-gray-800">
                                    {product.nameBn}
                                </span>

                                <span className="font-medium text-gray-700">
                                    {formatPrice(product.today)} টাকা/{getUnit(product.unit)}
                                </span>

                                <span
                                    className={
                                        isUp
                                            ? 'text-red-600'
                                            : isDown
                                                ? 'text-green-600'
                                                : 'text-gray-500'
                                    }
                                >
                                    {isUp ? '▲' : isDown ? '▼' : '—'}{' '}
                                    {formatPercent(product.change.pct)}%
                                </span>
                            </Link>
                        );
                    })}
                </MarqueeText>
            </div>
        </div>
    );
};

export default Marquee;
