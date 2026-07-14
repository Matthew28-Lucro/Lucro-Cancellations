import { lazy, Suspense, useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";

const BillingDashboard = lazy(() => import("./pages/BillingDashboard.jsx"));
const DesignSystem = lazy(() => import("./pages/DesignSystem.jsx"));

function getCurrentPage() {
  if (window.location.hash === "#billing") return "billing";
  return window.location.hash === "#design" ? "design" : "dashboard";
}

function PageSwitcher({ currentPage }) {
  const links = [
    { id: "dashboard", label: "Cancellation Dashboard", href: "#" },
    { id: "billing", label: "Billing Dashboard", href: "#billing" },
    { id: "design", label: "Design System", href: "#design" },
  ];

  return (
    <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-lucro-border pb-3 text-[12px]">
      <div className="font-bold text-lucro-text">Lucro Dashboard Workspace</div>
      <div className="flex flex-wrap items-center gap-4">
        {links.map((link) => {
          const isActive = currentPage === link.id;

          return (
            <a
              key={link.id}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`border-b-2 py-1 transition ${
                isActive
                  ? "border-lucro-accent text-lucro-accent"
                  : "border-transparent text-lucro-muted hover:border-lucro-border hover:text-lucro-text"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  useEffect(() => {
    const handleHashChange = () => setCurrentPage(getCurrentPage());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigation = <PageSwitcher currentPage={currentPage} />;

  if (currentPage === "billing") {
    return (
      <Suspense fallback={<PageLoading navigation={navigation} />}>
        <BillingDashboard navigation={navigation} />
      </Suspense>
    );
  }

  return currentPage === "design" ? (
    <Suspense fallback={<PageLoading navigation={navigation} />}>
      <DesignSystem navigation={navigation} />
    </Suspense>
  ) : (
    <Dashboard navigation={navigation} />
  );
}

function PageLoading({ navigation }) {
  return (
    <main className="min-h-screen bg-lucro-bg px-4 py-6 font-sans text-lucro-text sm:px-6 sm:py-8">
      {navigation}
      <div className="h-80 animate-pulse rounded-[14px] border border-lucro-border bg-lucro-card shadow-panel" />
    </main>
  );
}
