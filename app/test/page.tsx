"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/operations`,
      );
      const data = await res.json();
      console.log(data);
    };

    getData();
  }, []);

  return <div>Check console</div>;
}
