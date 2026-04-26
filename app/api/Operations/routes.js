// app/api/v1/operations/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OperationModel } from "@/models/operation";

export async function GET() {
  try {
    await connectDB();

    const operations = await OperationModel.find().lean();

    return NextResponse.json(operations);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching operations" },
      { status: 500 },
    );
  }
}
