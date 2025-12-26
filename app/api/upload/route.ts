// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { mkdir, writeFile } from "fs/promises"
import crypto from "crypto"

export const runtime = "nodejs"

function detectFolder(mime: string) {
  if (mime.startsWith("image/")) return "images"
  if (mime.startsWith("video/")) return "videos"
  if (mime === "application/pdf") return "pdfs"
  return "files"
}

function getUploadBaseDir() {
  // 1) 배포환경: UPLOAD_DIR=/app/public/uploads 로 주면 그 경로 사용
  // 2) 로컬환경: 기본값 public/uploads
  return process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const folder = detectFolder(file.type)

    // 업로드 루트 (환경변수 기반)
    const baseDir = getUploadBaseDir()
    const uploadDir = path.join(baseDir, folder)
    await mkdir(uploadDir, { recursive: true })

    const ext = path.extname(file.name || "").toLowerCase()
    const safeName = `${crypto.randomUUID()}${ext || ""}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const savedPath = path.join(uploadDir, safeName)
    await writeFile(savedPath, buffer)

    // URL은 무조건 Next 정적 경로로 접근 가능하게 /uploads/... 유지
    return NextResponse.json({
      url: `/uploads/${folder}/${safeName}`,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
