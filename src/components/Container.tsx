export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-light">
      {children}
    </div>
  );
}
