import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get("title") || "Jack Wang";
  const excerpt = searchParams.get("excerpt") || "";
  const date = searchParams.get("date") || "";
  
  // Truncate excerpt if too long
  const truncatedExcerpt = excerpt.length > 150 
    ? excerpt.substring(0, 147) + "..." 
    : excerpt;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          padding: "64px",
          fontFamily: "system-ui",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            opacity: 0.8,
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              J
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                Jack Wang
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#a0a0a0",
                }}
              >
                Indie Developer
              </span>
            </div>
          </div>
          
          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "white",
                lineHeight: 1.2,
                margin: 0,
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>
            
            {truncatedExcerpt && (
              <p
                style={{
                  fontSize: "20px",
                  color: "#c0c0c0",
                  lineHeight: 1.5,
                  margin: 0,
                  maxWidth: "800px",
                }}
              >
                {truncatedExcerpt}
              </p>
            )}
            
            {date && (
              <span
                style={{
                  fontSize: "16px",
                  color: "#808080",
                }}
              >
                {date}
              </span>
            )}
          </div>
          
          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#606060",
              fontSize: "14px",
            }}
          >
            <span>blog.pagecleans.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
