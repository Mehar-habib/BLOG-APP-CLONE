export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1920px] w-full mx-auto p-4 xl:px-20">{children}</div>
  );
}
