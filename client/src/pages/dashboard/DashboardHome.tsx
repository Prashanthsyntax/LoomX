import CryptoList from "../../components/dashboard/CryptoList";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Market Overview</h2>
      <CryptoList />
    </div>
  );
};

export default DashboardHome;
