import Header from "./Header.jsx";

export default function DashboardLayout({ headerProps, navigation, children }) {
  return (
    <main className="min-h-screen bg-lucro-bg px-4 py-6 font-sans text-lucro-text sm:px-6 sm:py-8">
      {navigation}
      <Header {...headerProps} />
      {children}
    </main>
  );
}
