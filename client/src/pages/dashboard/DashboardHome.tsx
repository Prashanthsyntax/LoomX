import WalletOverview from "../../components/dashboard/WalletOverview";
import CreditScore from "../../components/dashboard/CreditScore";
import ActiveLoans from "../../components/dashboard/ActiveLoans";
import Earnings from "../../components/dashboard/Earnings";
import CollateralHealth from "../../components/dashboard/CollateralHealth";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import QuickActions from "../../components/dashboard/QuickActions";

const DashboardHome = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      
      {/* Row 1 */}
      <div className="col-span-5">
        <WalletOverview />
      </div>
      <div className="col-span-7">
        <CreditScore />
      </div>

      {/* Row 2 */}
      <div className="col-span-4">
        <ActiveLoans />
      </div>
      <div className="col-span-4">
        <Earnings />
      </div>
      <div className="col-span-4">
        <CollateralHealth />
      </div>

      {/* Row 3 */}
      <div className="col-span-8">
        <AnalyticsChart />
      </div>
      <div className="col-span-4">
        <QuickActions />
      </div>

    </div>
  );
};

export default DashboardHome;
