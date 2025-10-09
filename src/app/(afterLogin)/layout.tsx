import { Suspense } from "react";
import Header from "./_components/header";
import InfoChangeModal from "./_components/infoChangeScreen/infoChangeModal";
import PageTitle from "./_components/pageTitle";
import SideNavigation from "./_components/sideNav";
import ProtectedPage from "./_components/protectedPage";

export default function AfterLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense>
        <ProtectedPage>
          <Header />
          <PageTitle />
          <SideNavigation />

          <InfoChangeModal />

          <div className="ml-80 pr-16">{children}</div>
        </ProtectedPage>
      </Suspense>
    </>
  );
}
