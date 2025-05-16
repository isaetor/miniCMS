import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { containsInappropriateContent } from '@/lib/inappropriate-words';

export async function middleware(request: NextRequest) {
    if (request.method === 'POST' && request.nextUrl.pathname.startsWith('/api/comments')) {
        try {
            const body = await request.json();
            
            if (body.content && containsInappropriateContent(body.content)) {
                return NextResponse.json(
                    { error: 'محتوای نامناسب' },
                    { status: 400 }
                );
            }

            if (body.content && (body.content.length < 3 || body.content.length > 1000)) {
                return NextResponse.json(
                    { error: 'طول محتوا نامعتبر است' },
                    { status: 400 }
                );
            }

            const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
            const rateLimitKey = `rate-limit:${ip}`;
            const rateLimit = await fetch(`${process.env.REDIS_URL}/get/${rateLimitKey}`);
            const currentLimit = await rateLimit.json();

            if (currentLimit && currentLimit.count > 10) {
                return NextResponse.json(
                    { error: 'تعداد درخواست‌های شما بیش از حد مجاز است' },
                    { status: 429 }
                );
            }

            await fetch(`${process.env.REDIS_URL}/incr/${rateLimitKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expire: 60,
                }),
            });

        } catch (error) {
            console.error('Middleware error:', error);
            return NextResponse.json(
                { error: 'خطا در پردازش درخواست' },
                { status: 500 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/comments/:path*',
}; 