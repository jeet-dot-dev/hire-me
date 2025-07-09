// components/ui/FullScreenLoader.tsx
export default function FullScreenLoader() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary"></div>
    </div>
  );
}
