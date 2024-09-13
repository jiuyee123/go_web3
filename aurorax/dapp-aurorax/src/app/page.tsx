import dynamic from "next/dynamic";

// 使用动态导入避免服务器端渲染这些组件
const ClientContent = dynamic(() => import("../components/ClientContent"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Contract Reader</h1>
      <ClientContent />
    </main>
  );
}
