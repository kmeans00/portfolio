import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

// App Router에서는 아래와 같이 용량 제한을 설정하지 않아도 되지만,
// 런타임 환경에 따라 필요할 수 있습니다. (기본적으로는 Nginx 설정이 더 중요합니다)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 1. 저장 경로 설정
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // 2. 폴더 생성
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 3. 🔥 파일명 개선 (한글/공백 문제 해결)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    // 파일 확장자만 추출 (예: .mp4, .jpg)
    const ext = path.extname(file.name);

    // 파일명을 [타임스탬프].[확장자] 형태로 변경 (한글 아예 제거)
    const filename = `${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // 4. 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 5. 성공 응답
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      filename: filename
    });

  } catch (error) {
    console.error("파일 업로드 에러:", error);
    // ECONNRESET 에러가 여기서 찍힌다면 Nginx의 타임아웃 설정을 더 늘려야 합니다.
    return NextResponse.json({ error: "서버에 파일 저장 실패" }, { status: 500 });
  }
}