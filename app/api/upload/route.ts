// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
    // 🚩 핵심: 파일 업로드는 request.json()이 아니라 formData()를 써야 합니다.
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 1. 저장 경로 설정 (public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // 2. uploads 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 3. 파일명 생성 (중복 방지를 위해 타임스탬프 추가)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    // 4. 파일을 Buffer로 변환하여 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 5. 클라이언트에서 접근 가능한 URL 반환
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      filename: filename
    });

  } catch (error) {
    console.error("파일 업로드 에러:", error);
    return NextResponse.json({ error: "서버에 파일 저장 실패" }, { status: 500 });
  }
}