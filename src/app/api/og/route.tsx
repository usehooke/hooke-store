import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Hooke Store';
  const price = searchParams.get('price') || '';
  const imageUrl = searchParams.get('imageUrl') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#FAF9F7',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            style={{
              width: '50%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
        )}

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
            background: '#FAF9F7',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.4em',
              color: '#9ca3af',
              textTransform: 'uppercase',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            HOOKE STORE
          </div>

          <div
            style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#111827',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            {title}
          </div>

          {price && (
            <div
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span>R$ {price}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#065f46',
                  background: '#d1fae5',
                  padding: '4px 8px',
                  letterSpacing: '0.2em',
                }}
              >
                PIX -15%
              </span>
            </div>
          )}

          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#9ca3af',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: '40px',
              display: 'flex',
            }}
          >
            Essencialismo Brasileiro · Design para a Permanência
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: '#111827',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
